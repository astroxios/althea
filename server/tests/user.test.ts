import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { app } from '../src/app';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

beforeAll(async () => {
    // Connect to the database
    await prisma.$connect();
    // Clean up the database before tests
    await prisma.user.deleteMany();
});

afterAll(async () => {
    // Clean up the database after tests
    await prisma.user.deleteMany();
    // Disconnect the database
    await prisma.$disconnect();
});

describe('User (Registration)', () => {
    let token: string;

    it('should register a user successfully', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                username: 'test_user',
                email: 'test_user@example.com',
                password: 'password123',
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should not register a user with existing username or email', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                username: 'test_user',
                email: 'test_user@example.com',
                password: 'password123',
            });
        expect(res.status).toBe(409);
        expect(res.text).toBe('User already exists');
    });
});

describe('User (Login)', () => {
    let token: string;

    it('should login a user sucessfully', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test_user@example.com',
                password: 'password123',
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should not login a user with invalid credentials', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'invalid_user@example.com',
                password: 'invalid_password',
            });

        expect(res.status).toBe(401);
        expect(res.text).toBe('Invalid credentials');
    });
});

describe('GET /api/users', () => {
    let token: string;
    let userId: number;

    // TODO: modify lookup 'user.id' for existing 'test_user'

    beforeAll(async () => {
        // Register a user to get a valid token and user ID
        const res = await request(app)
            .post('/api/users/register')
            .send({
                username: 'test_user_2',
                email: 'test_user_2@example.com',
                password: 'password123',
            });
        token = res.body.token;

        const user = await prisma.user.findUnique({
            where: { email: 'test_user_2@example.com' },
        });
        userId = user?.id!;
    });

    it('should get a user by ID with a valid token', async () => {
        const res = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', userId);
        expect(res.body).toHaveProperty('username', 'test_user_2');
        expect(res.body).toHaveProperty('email', 'test_user_2@example.com');
    });

    it('should deny access with an invalid token', async () => {
        const res = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', 'Bearer invalid_token');

        expect(res.status).toBe(400);
        expect(res.text).toBe('Invalid token');
    });

    it('should deny access without a token', async () => {
        const res = await request(app)
            .get(`/api/users/${userId}`);

        expect(res.status).toBe(401);
        expect(res.text).toBe('Access denied');
    });

    it('should return 404 error for a non-existent user', async () => {
        const res = await request(app)
            .get('/api/users/9999')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.text).toBe('User not found')
    })
})
