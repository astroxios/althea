import request from 'supertest';
import app from '../../../src/app';
import userModel from '../../../src/models/userModel';
import redisClient from '../../../src/redisClient';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

describe('GET /api/users', () => {
    let userId1: number;
    let userId2: number;
    let token1: string;
    let token2: string;

    beforeAll(async () => {
        await userModel.deleteMany();
        await redisClient.flushall();

        // register two new users
        const user1 = {
            data: {
                type: 'user',
                attributes: {
                    email: 'test_user_1@example.com',
                    username: 'test_user_1',
                    password: 'password123'
                },
            }
        }

        const user2 = {
            data: {
                type: 'user',
                attributes: {
                    email: 'test_user_2@example.com',
                    username: 'test_user_2',
                    password: 'password345'
                }
            }
        }

        const response1 = await request(app)
            .post('/api/auth/register')
            .send(user1)
            .expect(201);

        const response2 = await request(app)
            .post('/api/auth/register')
            .send(user2)
            .expect(201)

        // store the user IDs and access tokens
        userId1 = response1.body.data.id;
        userId2 = response2.body.data.id;

        token1 = response1.headers.authorization.split(' ')[1];
        token2 = response2.headers.authorization.split(' ')[1];
    });

    afterAll(async () => {
        await userModel.deleteMany();
        await redisClient.quit();
    });

    it('should return 200 if the operation is successful', async () => {
        const response = await request(app)
            .get('/api/users')
            .query({ ids: `${userId1},${userId2}` })
            .set('Authorization', `Bearer ${token1}`);

        expect(response.status).toBe(200);
        expect(response.body.data[0]).toHaveProperty('id', userId1);
        expect(response.body.data[1]).toHaveProperty('id', userId2);
    });

    it('should return 400 if the "ids" parameter is missing', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token1}`);

        expect(response.status).toBe(400);
        expect(response.body.error.message).toBe("Invalid request. Parameter 'ids' are required.");
    });

    it('should return 400 if "ids" parameter is invalid', async () => {
        const response = await request(app)
            .get('/api/users')
            .query({ ids: 'abc' })
            .set('Authorization', `Bearer ${token1}`);

        expect(response.status).toBe(400);
        expect(response.body.error.message).toBe("Invalid request. Invalid 'ids' parameter. Must be a comma-separated list of numbers.");
    });

    it('should return 404 if no users are found', async () => {
        const response = await request(app)
            .get('/api/users')
            .query({ ids: '955,966,977' })
            .set('Authorization', `Bearer ${token1}`);

        expect(response.status).toBe(404);
        expect(response.body.error.message).toBe('No users found');
    });

    it('should return 500 if an internal server error occurs', async () => {
        const BigInt1 = 514203077113282560;
        const BigInt2 = 514203077113282561;
        const BigInt3 = 514203077113282562;

        const response = await request(app)
            .get('/api/users')
            .query({ ids: `${BigInt1},${BigInt2},${BigInt3}`})
            .set('Authorization', `Bearer ${token1}`);

        expect(response.status).toBe(500);
    })
});
