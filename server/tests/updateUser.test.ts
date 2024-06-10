import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../src/app';
import redisClient from '../src/redisClient';

const prisma = new PrismaClient();

describe('PATCH /api/users/:id', () => {
    let userId: number;
    let token: string;

    beforeAll(async () => {
        await prisma.user.deleteMany();
        await redisClient.flushall();

        const user = {
            email: 'update_user_1@example.com',
            username: 'update_user_1',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(user)
            .expect(201);

        userId = response.body.data[0].id;
        token = response.body.data[0].access_token;
    });

    afterAll(async () => {
        await prisma.user.deleteMany();
        await redisClient.flushall();
        await prisma.$disconnect();
        await redisClient.quit();
    });

    it('should update user successfully', async () => {
        const response = await request(app)
            .patch(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'updated_user' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User update successful');
        expect(response.body.data[0]).toHaveProperty('username', 'updated_user');
    });

    it('should not show updated password in the response', async () => {
        const response = await request(app)
            .patch(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ password: 'newpassword123' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User update successful');
        expect(response.body.data[0]).not.toHaveProperty('password');
    });

    it('should return 404 if user not found', async () => {
        const response = await request(app)
            .patch('/api/users/99999')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'updated_user' });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });
});
