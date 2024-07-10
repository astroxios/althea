import request from 'supertest';
import app from '../../../src/app';
import userModel from '../../../src/models/userModel';
import widgetModel from '../../../src/models/widgetModel';
import redisClient from '../../../src/redisClient';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

describe('DELETE /api/widgets/:id', () => {
    let userId: number;
    let widgetId: number;
    let token: string;

    beforeAll(async () => {
        await userModel.deleteMany();
        await widgetModel.deleteMany();
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

        // create a widget
        const widget = {
            data: {
                type: 'widget',
                attributes: {
                    widget_type: 'Stream Schedule'
                }
            }
        }

        const response1 = await request(app)
            .post('/api/auth/register')
            .send(user)
            .expect(201);

        // store the userId and token
        userId = response1.body.data.id;
        token = response1.headers.authorization.split(' ')[1];

        const response2 = await request(app)
            .post('/api/widgets')
            .set('Authorization', `Bearer ${token}`)
            .send(widget)
            .expect(201);

        // store the widgetId
        widgetId = response2.body.data.id;
    });

    afterAll(async () => {
        await userModel.deleteMany();
        await widgetModel.deleteMany();
        await redisClient.quit();
    });

    it('should return 204 if the operation is successful', async () => {
        const response = await request(app)
            .delete(`/api/widgets/${widgetId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
    });


    it('should return 400 if the request is invalid', async () => {
        const response = await request(app)
            .delete(`/api/widgets/${undefined}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.error.message).toBe('Invalid request. The provided ID is not a valid widget ID.');
    });

    it('should return 404 if the widget not found', async () => {
        const randomId = widgetId + 1;

        const response = await request(app)
            .delete(`/api/widgets/${randomId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.error.message).toBe('Widget not found');
    });

    it('should return 500 if an internal server error occurs', async () => {
        const BigInt = 514203077113282560;

        const response = await request(app)
            .delete(`/api/widgets/${BigInt}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(500);
    });
});
