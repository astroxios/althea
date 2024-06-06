import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../src/app';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    // Clear existing users
    await prisma.user.deleteMany();

    // Create a test user
    const password = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        email: 'test_user@example.com',
        username: 'test_user',
        password,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should login successfully and return an access token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test_user@example.com',
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
        email: 'test_user@example.com',
        password: 'wrongpassword',
      })
      .expect(401);

    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });
});
