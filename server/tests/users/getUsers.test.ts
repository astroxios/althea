import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../../src/app';
import redisClient from '../../src/redisClient';
import userModel from '../../src/models/userModel';

const prisma = new PrismaClient();

describe('GET /api/users', () => {
    let userId1: number;
    let userId2: number;
    let token1: string;
    let token2: string;

    beforeAll(async () => {
        await prisma.user.deleteMany();
        await redisClient.flushall();

        // Register two new users
        const user1 = {
            email: 'get_users_1@example.com',
            username: 'get_users_1',
            password: 'password123'
        }

        const user2 = {
            email: 'get_users_2@example.com',
            username: 'get_users_2',
            password: 'password123'
        }

        const response1 = await request(app)
            .post('/api/auth/register')
            .send(user1)
            .expect(201);

        const response2 = await request(app)
            .post('/api/auth/register')
            .send(user2)
            .expect(201)

        // Store the user IDs and access tokens
        userId1 = response1.body.data[0].id;
        userId2 = response2.body.data[0].id;

        token1 = response1.body.data[0].access_token;
        token2 = response2.body.data[0].access_token;
    });

    afterAll(async () => {
        await prisma.user.deleteMany();
        await redisClient.flushall();
        await prisma.$disconnect();
        await redisClient.quit();
    });

    it('should return 400 if "ids" parameter is missing', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token1}`);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Parameter 'ids' are required");
    });

    it('should return 400 if "ids" parameter is invalid', async () => {
        const response = await request(app)
            .get('/api/users')
            .query({ ids: 'abc' })
            .set('Authorization', `Bearer ${token1}`);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid 'ids' parameter. Must be a comma-separated list of numbers.");
    });

    it('should return 404 if no users are found', async () => {
        const response = await request(app)
            .get('/api/users')
            .query({ ids: '955,966,977' })
            .set('Authorization', `Bearer ${token1}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('No users found');
    });

    it('should return 200 and the list of users', async () => {
        const response = await request(app)
            .get('/api/users')
            .query({ ids: `${userId1},${userId2}` })
            .set('Authorization', `Bearer ${token1}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Users retrieval successful');
        expect(response.body.data[0]).toHaveProperty('id', userId1);
        expect(response.body.data[1]).toHaveProperty('id', userId2);
    });
});
