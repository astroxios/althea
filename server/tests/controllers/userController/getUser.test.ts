import request from 'supertest';
import app from '../../../src/app';
import userModel from '../../../src/models/userModel';
import redisClient from '../../../src/redisClient';
import dotenv from 'dotenv';
import path from 'path';
import { SnowflakeId } from '@akashrajpurohit/snowflake-id';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

describe('GET /api/users/:id', () => {
    let userId: number;
    let token: string;

    beforeAll(async () => {
        await userModel.deleteMany();
        await redisClient.flushall();

        // register a new user
        const user = {
            data: {
                type: 'user',
                attributes: {
                    email: 'test_user@example.com',
                    username: 'test_user',
                    password: 'password123'
                },
            }
        }

        const response = await request(app)
            .post('/api/auth/register')
            .send(user)
            .expect(201);

        // store the userId and token
        userId = response.body.data.id;
        token = response.headers.authorization.split(' ')[1];
    });

    afterAll(async () => {
        await userModel.deleteMany();
        await redisClient.quit();
    });

    it('should return 200 if the operation is successful', async () => {
        const response = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual({
            type: 'user',
            id: userId,
            attributes: {
                email: 'test_user@example.com',
                username: 'test_user',
                created: expect.any(String),
                updated: expect.any(String),
            },
        });
    });

    it('should return 400 if the request is invalid', async () => {
        const response = await request(app)
            .get(`/api/users/${undefined}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.error.message).toBe('Invalid request. The provided ID is not a valid user ID.');
    });

    it('should return 404 if the user is not found', async () => {
        // generate a random snowflake ID
        //const snowflake = SnowflakeId();
        //const randomId = snowflake.generate();

        // create a random number ID
        const randomId = userId + 1;

        const response = await request(app)
            .get(`/api/users/${randomId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.error.message).toBe('User not found');
    });

    it('should return 500 if an internal server error occurs', async () => {
        // replace Number with BigInt
        const BigInt = 514203077113282560;

        const response = await request(app)
            .get(`/api/users/${BigInt}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(500);
    });
});
