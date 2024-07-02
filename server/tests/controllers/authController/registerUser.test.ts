import request from 'supertest';
import app from '../../../src/app';
import userModel from '../../../src/models/userModel';
import redisClient from '../../../src/redisClient';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

describe('POST /api/auth/register', () => {
    beforeAll(async () => {
        await userModel.deleteMany();
        await redisClient.flushall();
    });

    afterAll(async () => {
        await userModel.deleteMany();
        await redisClient.quit();
    });

    it('should return 201 if the user is created', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                data: {
                    type: "user",
                    attributes: {
                        email: "test_user@example.com",
                        username: "test_user",
                        password: "password123"
                    }
                }
            });

        expect(response.status).toBe(201)
        expect(response.body.data.attributes).toHaveProperty('username', 'test_user');
        expect(response.headers.authorization).toHaveReturned;
    });

    it('should return 400 if the required request format is invalid', async () => {
        const response = await request(app)
        .post('/api/auth/register')
        .send({
            data: {
                attributes: {
                    email: "test_user@example.com",
                    username: "test_user",
                    password: "password123"
                }
            }
        });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe("Invalid request. Please ensure the JSON request body contains a data object with a type set to 'user', and includes attributes.");
    });

    it('should return 400 if the request body is invalid', async () => {
        const response = await request(app)
        .post('/api/auth/register')
        .send({
            data: {
                type: "non_existing_type",
                attributes: {
                    email: "test_user@example.com",
                    username: "test_user",
                    password: "password123"
                }
            }
        });

        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe("Invalid request. Please ensure the JSON request body contains a data object with a type set to 'user', and includes attributes.");
    });

    it('should return 409 if the email already exists', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                data: {
                    type: "user",
                    attributes: {
                        email: "test_user@example.com",
                        username: "test_user123",
                        password: "password123"
                    }
                }
            });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Email already exists");
    });

    it('should return 409 if the username already exists', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                data: {
                    type: "user",
                    attributes: {
                        email: "test_user123@example.com",
                        username: "test_user",
                        password: "password123"
                    }
                }
            });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Username already exists");
    });
});
