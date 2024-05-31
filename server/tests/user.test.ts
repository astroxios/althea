import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { app } from '../src/app';
import dotenv from 'dotenv';
import { password } from 'bun';

dotenv.config();

const prisma = new PrismaClient();

beforeAll(async () => {
    // Connect to the database
    await prisma.$connect();
    // Clean up the database before tests
    await prisma.user.deleteMany();
});

afterAll(async () => {
    // Clean up the database after tests
    await prisma.user.deleteMany();
    // Disconnect the database
    await prisma.$disconnect();
});

describe('POST /api/users/register', () => {
    let token: string;

    it('should register a user successfully', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                username: 'test_user',
                email: 'test_user@example.com',
                password: 'password123',
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should not register a user with existing username or email', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                username: 'test_user',
                email: 'test_user@example.com',
                password: 'password123',
            });
        expect(res.status).toBe(409);
        expect(res.text).toBe('User already exists');
    });
});

describe('POST /api/users/login', () => {
    let token: string;

    it('should login a user sucessfully', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test_user@example.com',
                password: 'password123',
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should not login a user with invalid credentials', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'invalid_user@example.com',
                password: 'invalid_password',
            });

        expect(res.status).toBe(401);
        expect(res.text).toBe('Invalid credentials');
    });
});

describe('GET /api/users/:id', () => {
    let token: string;
    let userId: number;

    // TODO: modify lookup 'user.id' for existing 'test_user'

    beforeAll(async () => {
        // Register a user to get a valid token and user ID
        const res = await request(app)
            .post('/api/users/register')
            .send({
                username: 'test_user_2',
                email: 'test_user_2@example.com',
                password: 'password123',
            });
        token = res.body.token;

        const user = await prisma.user.findUnique({
            where: { email: 'test_user_2@example.com' },
        });
        userId = user?.id!;
    });

    it('should get a user by ID with a valid token', async () => {
        const res = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', userId);
        expect(res.body).toHaveProperty('username', 'test_user_2');
        expect(res.body).toHaveProperty('email', 'test_user_2@example.com');
    });

    it('should deny access with an invalid token', async () => {
        const res = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', 'Bearer invalid_token');

        expect(res.status).toBe(400);
        expect(res.text).toBe('Invalid token');
    });

    it('should deny access without a token', async () => {
        const res = await request(app)
            .get(`/api/users/${userId}`);

        expect(res.status).toBe(401);
        expect(res.text).toBe('Access denied');
    });

    it('should return 404 error for a non-existent user', async () => {
        const res = await request(app)
            .get('/api/users/9999')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.text).toBe('User not found')
    })
})

describe('PATCH /api/users/:id', () => {
    let token: string;
    let userId: number;

    beforeAll(async () => {
      // Register a user to get a valid token and user ID
      const res = await request(app)
        .post('/api/users/register')
        .send({
          username: 'test_user_3',
          email: 'test_user_3@example.com',
          password: 'password123',
        });
      token = res.body.token;

      const user = await prisma.user.findUnique({
        where: { email: 'test_user_3@example.com' },
      });
      userId = user?.id!;
    });

    it('should partially update a user by ID with a valid token', async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'updated_user_3',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', userId);
      expect(res.body).toHaveProperty('username', 'updated_user_3');
      expect(res.body).toHaveProperty('email', 'test_user_3@example.com');
    });

    it('should return 404 error for a non-existent user', async () => {
      const res = await request(app)
        .patch('/api/users/9999')
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'non_existent_user',
          email: 'non_existent_user@example.com',
        });

      expect(res.status).toBe(404);
      expect(res.text).toBe('User not found');
    });

    it('should deny access with an invalid token', async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .set('Authorization', 'Bearer invalid_token')
        .send({
          username: 'updated_user_3',
        });

      expect(res.status).toBe(400);
      expect(res.text).toBe('Invalid token');
    });

    it('should deny access without a token', async () => {
      const res = await request(app)
        .patch(`/api/users/${userId}`)
        .send({
          username: 'updated_user_3',
        });

      expect(res.status).toBe(401);
      expect(res.text).toBe('Access denied');
    });
  });

describe('DELETE /api/users/:id', () => {
    let token: string;
    let userId: number;

    beforeAll(async () => {
        // Register a user to get a valid token and user ID
        const res = await request(app)
            .post('/api/users/register')
            .send({
                username: 'test_user_4',
                email: 'test_user_4@example.com',
                password: 'password123',
            });
        token = res.body.token;

        const user = await prisma.user.findUnique({
            where: { email: 'test_user_4@example.com' },
        });
        userId = user?.id!;
    });

    it('should delete a user by ID with a valid token', async () => {
        const res = await request(app)
            .delete(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200);
        expect(res.text).toBe('User deleted successfully');
    });

    it('should return 404 error for a non-existent user', async () => {
        const res = await request(app)
            .delete('/api/users/9999')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(404);
        expect(res.text).toBe('User not found');
    });

    it('should deny access with an invalid token', async () => {
        const res = await request(app)
            .delete(`/api/users/${userId}`)
            .set('Authorization', 'Bearer invalid_token');

        expect(res.status).toBe(400);
        expect(res.text).toBe('Invalid token');
    });

    it('should deny access without a token', async () => {
        const res = await request(app)
            .delete(`/api/users/${userId}`);

        expect(res.status).toBe(401);
        expect(res.text).toBe('Access denied');
    });
});

describe('GET /api/users', () => {
    let token: string;
    let userId1: number;
    let userId2: number;

    beforeAll(async () => {
        // Register two users to get valid tokens and user IDs
        const res1 = await request(app)
            .post('/api/users/register')
            .send({
                username: 'test_user_5',
                email: 'test_user_5@example.com',
                password: 'password123',
            });
        token = res1.body.token;

        const res2 = await request(app)
            .post('/api/users/register')
            .send({
                username: 'test_user_6',
                email: 'test_user_6@example.com',
                password: 'password123',
            });
        // FIXME: a single token is used between 'test_user_5' and 'test_user_6'

        const user1 = await prisma.user.findUnique({
            where: { email: 'test_user_5@example.com' },
        });
        userId1 = user1?.id!;

        const user2 = await prisma.user.findUnique({
            where: { email: 'test_user_6@example.com' },
        });
        userId2 = user2?.id!;
    });

    it('should get users by IDs with a valid token', async () => {
        const res = await request(app)
            .get(`/api/users?ids=${userId1},${userId2}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toHaveProperty('id', userId1);
        expect(res.body[1]).toHaveProperty('id', userId2);
    });

    it('should return an empty array for non-existen user IDs', async () => {
        const res = await request(app)
            .get('/api/users?ids=9999,8888')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
    });

    it('should return users by IDs with an invalid token', async () => {
        const res = await request(app)
            .get(`/api/users?ids=${userId1},${userId2}`)
            .set('Authorization', 'Bearer invalid_token');

        expect(res.status).toBe(400);
        expect(res.text).toBe('Invalid token');
    });

    it('should deny access without a token', async () => {
        const res = await request(app)
            .get(`/api/users?ids=${userId1},${userId2}`);

        expect(res.status).toBe(401);
        expect(res.text).toBe('Access denied');
    });

    it('should return an error if no IDs are specified', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.text).toBe('Query parameter "ids" is required');
    });
});
