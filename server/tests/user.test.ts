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
        expect(res.text).toBe('User already exists.');
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
        expect(res.text).toBe('Invalid credentials.');
    });
});
