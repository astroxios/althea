import request from 'supertest';
import app from '../../../src/app';
import userModel from '../../../src/models/userModel';
import widgetModel from '../../../src/models/widgetModel';
import redisClient from '../../../src/redisClient';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

describe('GET /api/widgets/:id', () => {
    let userId: number;
    let widgetId1: number;
    let widgetId2: number;
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

        // create the widgets
        const widget1 = {
            data: {
                type: 'widget',
                attributes: {
                    widget_type: 'Stream Schedule'
                }
            }
        }

        const widget2 = {
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
            .send(widget1)
            .expect(201);

        const response3 = await request(app)
            .post('/api/widgets')
            .set('Authorization', `Bearer ${token}`)
            .send(widget2)
            .expect(201);

        // store the widgetIds
        widgetId1 = response2.body.data.id;
        widgetId2 = response3.body.data.id;

    });

    afterAll(async () => {
        await userModel.deleteMany();
        await widgetModel.deleteMany();
        await redisClient.quit();
    });

    it('should return 200 if the operation is successful', async () => {
        const response = await request(app)
            .get('/api/widgets')
            .query({ ids: `${widgetId1},${widgetId2}` })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data[0]).toHaveProperty('id', widgetId1);
        expect(response.body.data[1]).toHaveProperty('id', widgetId2);
    });

    it('should return 400 if the "ids" parameter is missing', async () => {
        const response = await request(app)
            .get('/api/widgets')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.error.message).toBe("Invalid request. Parameter 'ids' are required.");
    });

    it('should return 400 if "ids" parameter is invalid', async () => {
        const response = await request(app)
            .get('/api/widgets')
            .query({ ids: 'abc' })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.error.message).toBe("Invalid request. Invalid 'ids' parameter. Must be a comma-separated list of numbers.");
    });

    it('should return 404 if no widgets are found', async () => {
        const response = await request(app)
            .get('/api/widgets')
            .query({ ids: '955,966,977' })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.error.message).toBe('No widgets found');
    });

    it('should return 500 if an internal server error occurs', async () => {
        const BigInt1 = 514203077113282560;
        const BigInt2 = 514203077113282561;
        const BigInt3 = 514203077113282562;

        const response = await request(app)
            .get('/api/widgets')
            .query({ ids: `${BigInt1},${BigInt2},${BigInt3}`})
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(500);
    })
});
