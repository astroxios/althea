import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../src/app';

const prisma = new PrismaClient();

describe('POST /api/users/register', () => {

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

    it('should register a new user', async () => {
        const newUser = {
            email: 'test_user_1@example.com',
            username: 'test_user_1',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(newUser)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe(newUser.username);
    });

    it('should return 400 if the request body is invalid', async () => {
        const invalidUser = {
            email: 'invalid_email',
            username: '',
            password: 'short'
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(invalidUser)
            .expect(400);

        expect(response.body).toHaveProperty('error');
    });

    it('should return 409 if the user already exists', async () => {
        const existingUser = {
            email: 'test_user_2@example.com',
            username: 'test_user_2',
            password: 'password123'
        };

        // Register the user first
        await request(app).post('/api/users/register').send(existingUser);

        // Attempt to register the same user again
        const response = await request(app)
            .post('/api/users/register')
            .send(existingUser)
            .expect(409);

        expect(response.body).toHaveProperty('error');
    });
});
