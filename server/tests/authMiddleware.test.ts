import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../src/middleware/auth';

const prisma = new PrismaClient();

describe('authenticateToken Middleware', () => {
    let access_token: string;
    let userId: number;

    beforeAll(async () => {
        await prisma.user.deleteMany();
        const user = await prisma.user.create({
            data: {
                email: 'test_user@example.com',
                username: 'test_user',
                password: await bcrypt.hash('password123', 10),
            },
        });

        userId = user.id;
        access_token = generateToken({ id: userId, email: 'test_user@example.com' });
    });

    afterAll(async () => {
        // Clean up the test user from the database
        await prisma.user.deleteMany({
            where: {
                email: 'test_user@example.com',
            },
        });
        await prisma.$disconnect();
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .get(`/api/users/${userId}`)
            .expect(401);

        expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should return 401 if an invalid token is provided', async () => {
        const response = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', 'Bearer invalid_token')
            .expect(401);

        expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should call next() if a valid token is provided', async () => {
        const response = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${access_token}`)
            .expect(200);

        expect(response.body).toHaveProperty('id', userId);
    });
});
