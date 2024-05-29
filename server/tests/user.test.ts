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
                username: 'testuser',
                email: 'testuser@example.com',
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
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
            });
        expect(res.status).toBe(409);
        expect(res.text).toBe('User already exists.');
    });
});
