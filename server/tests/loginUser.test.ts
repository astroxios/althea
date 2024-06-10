import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../src/app';
import bcrypt from 'bcryptjs';
import redisClient from '../src/redisClient';

const prisma = new PrismaClient();

describe('POST /api/auth/login', () => {
  beforeAll(async () => {

    await prisma.user.deleteMany();
    await redisClient.flushall();

    // Register a test user
    const password = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        email: 'login_user_1@example.com',
        username: 'login_user_1',
        password,
      },
    });

  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await redisClient.flushall();
    await prisma.$disconnect();
    await redisClient.quit();
  });

  it('should login successfully and return an access token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login_user_1@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(response.body.data[0]).toHaveProperty('access_token');
  });

  it('should return 401 for incorrect email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong_email@example.com',
        password: 'password123',
      })
      .expect(401);

    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('should return 401 for incorrect password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login_user_1@example.com',
        password: 'wrongpassword',
      })
      .expect(401);

    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });
});
