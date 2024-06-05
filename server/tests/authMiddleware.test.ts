import request from 'supertest';
import mockApp from './mockApp';
import { generateToken } from '../src/middleware/auth';

describe('authenticateToken Middleware', () => {
    let access_token: string;

    beforeAll(() => {
        access_token = generateToken({ id: 1, email: 'test_user@example.com' });
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request(mockApp)
            .get('/protected')
            .expect(401);

        expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should return 401 if an invalid token is provided', async () => {
        const response = await request(mockApp)
            .get('/protected')
            .set('Authorization', 'Bearer invalid_token')
            .expect(401);

        expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should call next() if a valid token is provided', async () => {
        const response = await request(mockApp)
            .get('/protected')
            .set('Authorization', `Bearer ${access_token}`)
            .expect(200);

        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('email', 'test_user@example.com');
    });
});
