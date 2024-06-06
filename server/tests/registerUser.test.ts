import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../src/app';

const prisma = new PrismaClient();

describe('POST /api/users/register', () => {

    beforeAll(async () => {
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should register a new user', async () => {
        const newUser = {
            email: 'test_user_1@example.com',
            username: 'test_user_1',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(newUser)
            .expect(201);

        expect(response.body.data[0]).toHaveProperty('id');
        expect(response.body.data[0].username).toBe(newUser.username);
        expect(response.body.data[0]).toHaveProperty('access_token');
    });

    it('should return 400 if the request body is invalid', async () => {
        const invalidUser = {
            email: 'invalid_email',
            username: '',
            password: 'short'
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(invalidUser)
            .expect(400);

        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ msg: 'Email must be valid' }),
                expect.objectContaining({ msg: 'Username must be between 3 and 20 characters long' }),
                expect.objectContaining({ msg: 'Password must be between 8 and 64 characters long' })
            ])
        );
    });

    it('should return 409 if the email already exists', async () => {
        const existingUser = {
          email: 'test_user_2@example.com',
          username: 'test_user_2',
          password: 'password123'
        };

        // Register the user first
        await request(app).post('/api/users/register').send(existingUser);

        // Attempt to register another user with the same email
        const newUserWithSameEmail = {
          email: 'test_user_2@example.com',
          username: 'test_user_3',
          password: 'password123'
        };

        const response = await request(app)
          .post('/api/users/register')
          .send(newUserWithSameEmail)
          .expect(409);

        expect(response.body).toHaveProperty('error', 'Email already exists');
    });

    it('should return 409 if the username already exists', async () => {
        const existingUser = {
          email: 'test_user_3@example.com',
          username: 'test_user_3',
          password: 'password123'
        };

        // Register the user first
        await request(app).post('/api/users/register').send(existingUser);

        // Attempt to register another user with the same username
        const newUserWithSameUsername = {
          email: 'test_user_4@example.com',
          username: 'test_user_3',
          password: 'password123'
        };

        const response = await request(app)
          .post('/api/users/register')
          .send(newUserWithSameUsername)
          .expect(409);

        expect(response.body).toHaveProperty('error', 'Username already exists');
      });
});
