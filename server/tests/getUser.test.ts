import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../src/app';
import { createUser } from '../src/services/userService';

const prisma = new PrismaClient();

describe('GET /users/:id', () => {
    let userId: number;
    let token: string;

    beforeEach(async () => {
        await prisma.user.deleteMany();
        const user = await createUser('test@example.com', 'testuser', 'password123');
        userId = user.id;
        token = user.access_token;

        console.log('Created user:', user);
        console.log('Generated token:', token);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should retrieve user successfully', async () => {
        const response = await request(app)
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        console.log('Response:', response.body);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User retrieval successful');
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0]).toHaveProperty('id', userId);
        expect(response.body.data[0]).not.toHaveProperty('password');
    });

    it('should return 404 if user not found', async () => {
        const response = await request(app)
            .get('/users/9999')
            .set('Authorization', `Bearer ${token}`);

        console.log('Response for 404:', response.body);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });
});
