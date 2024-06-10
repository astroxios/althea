import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../src/app';
import redisClient from '../src/redisClient';

const prisma = new PrismaClient();

describe('GET /api/users/:id', () => {
    let userId: number;
    let token: string;

    beforeAll(async () => {
        await prisma.user.deleteMany();
        await redisClient.flushall();

        // Register a new user
        const user = {
            email: 'get_user_1@example.com',
            username: 'get_user_1',
            password: 'password123'
        }

        const response = await request(app)
            .post('/api/users/register')
            .send(user)
            .expect(201)

        // Store the user ID and access token
        userId = response.body.data[0].id;
        token = response.body.data[0].access_token;
    });

    afterAll(async () => {
        await prisma.user.deleteMany();
        await redisClient.flushall();
        await prisma.$disconnect();
        await redisClient.quit();
    });

    it('should retrieve user successfully', async () => {
        const response = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User retrieval successful');
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0]).toHaveProperty('id', userId);
        expect(response.body.data[0]).not.toHaveProperty('password');
    });

    it('should return 404 if user not found', async () => {
        const response = await request(app)
            .get('/api/users/9999')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });
});
