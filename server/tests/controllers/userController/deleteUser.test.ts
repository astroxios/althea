import request from 'supertest';
import app from '../../../src/app';
import userModel from '../../../src/models/userModel';
import redisClient from '../../../src/redisClient';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

describe('DELETE /api/users/:id', () => {
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
            .expect(201)

        // store the userId and token
        userId = response.body.data.id;
        token = response.headers.authorization.split(' ')[1];
    });

    afterAll(async () => {
        await userModel.deleteMany();
        await redisClient.quit();
    });

    it('should return 204 if the operation is successful', async () => {
        const response = await request(app)
            .delete(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
    });

    it('should return 400 if the request is invalid', async () => {
        const response = await request(app)
            .delete(`/api/users/${undefined}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.error.message).toBe('Invalid request. The provided ID is not a valid user ID.');
    });

    it('should return 404 if the user not found', async () => {
        const randomId = userId + 1;

        const response = await request(app)
            .delete(`/api/users/${randomId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.error.message).toBe('User not found');
    });

    it('should return 500 if an internal server error occurs', async () => {
        const BigInt = 514203077113282560;

        const response = await request(app)
            .delete(`/api/users/${BigInt}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(500);
    });
})
