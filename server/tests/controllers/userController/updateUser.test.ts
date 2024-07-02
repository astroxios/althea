import request from 'supertest';
import app from '../../../src/app';
import userModel from '../../../src/models/userModel';
import redisClient from '../../../src/redisClient';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

describe('PATCH /api/users/:id', () => {
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

    it('should return 200 if the operation is successful', async () => {
        const response = await request(app)
            .patch(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                data: {
                    type: "user",
                    attributes: {
                        email: "new_username@example.com",
                        username: "new_username",
                        password: "newpassword123"
                    }
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('id', userId);
    });

    it('should return 400 if the request is invalid', async () => {
        const response = await request(app)
            .patch(`/api/users/${undefined}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.error.message).toBe('Invalid request. The provided ID is not a valid user ID.');
    });

    it('should return 400 if the request body is invalid', async () => {
        const response = await request(app)
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            data: {
                type: "non_existing_type",
                attributes: {
                    email: "new_username@example.com",
                    username: "new_username",
                    password: "newpassword123"
                }
            }
        });

        expect(response.status).toBe(400);
        expect(response.body.error.message).toBe("Invalid request. Please ensure the JSON request body contains a data object with a type set to 'user', and includes attributes.");
    });

    it('should return 404 if the user not found', async () => {
        const randomId = userId + 1;

        const response = await request(app)
            .patch(`/api/users/${randomId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                data: {
                    type: "user",
                    attributes: {
                        email: "new_username@example.com",
                        username: "new_username",
                        password: "newpassword123"
                    }
                }
            });

        expect(response.status).toBe(404);
        expect(response.body.error.message).toBe('User not found');
    });

    it('should return 500 if an internal server error occurs', async () => {
        const BigInt = 514203077113282560;

        const response = await request(app)
            .patch(`/api/users/${BigInt}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                data: {
                    type: "user",
                    attributes: {
                        email: "new_username@example.com",
                        username: "new_username",
                        password: "newpassword123"
                    }
                }
            });

        expect(response.status).toBe(500);
    });
});
