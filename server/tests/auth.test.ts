import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import dotenv from 'dotenv';
import { authenticateToken, AuthenticatedRequest } from '../src/middleware/auth';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/protected', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    res.status(200).send('Access granted');
});

describe('Auth (middleware)', () => {
    let server: any;

    beforeAll((done) => {
        server = app.listen(4000, done);
    });

    afterAll((done) => {
        server.close(done);
    });

    it('should allow access with a valid token', async () => {
        const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Access granted');
    });

    it('should deny access with an invalid token', async () => {
        const invalidToken = 'invalid.token.here';
        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${invalidToken}`);

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid token');
    });

    it('should deny access when token is missing', async () => {
        const response = await request(app)
            .get('/protected');

        expect(response.status).toBe(401);
        expect(response.text).toBe('Access denied');
    });
});
