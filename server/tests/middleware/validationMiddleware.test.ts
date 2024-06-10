import request from 'supertest';
import mockApp from '../mockApp';

describe('Validation Middleware', () => {
    describe('POST /register', () => {
        it('should fail if email is invalid', async () => {
            const response = await request(mockApp)
                .post('/register')
                .send({ email: 'invalid-email', username: 'testuser', password: 'password123' });

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ msg: 'Email must be valid' })
                ])
            );
        });

        it('should fail if username is too short', async () => {
            const response = await request(mockApp)
                .post('/register')
                .send({ email: 'test@example.com', username: 'tu', password: 'password123' });

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ msg: 'Username must be between 3 and 20 characters long' })
                ])
            );
        });

        it('should fail if password is too short', async () => {
            const response = await request(mockApp)
                .post('/register')
                .send({ email: 'test@example.com', username: 'testuser', password: 'pass' });

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ msg: 'Password must be between 8 and 64 characters long' })
                ])
            );
        });

        it('should succeed with valid data', async () => {
            const response = await request(mockApp)
                .post('/register')
                .send({ email: 'test@example.com', username: 'testuser', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Registration successful');
        });
    });

    describe('PATCH /update', () => {
        it('should fail if email is invalid', async () => {
            const response = await request(mockApp)
                .patch('/update')
                .send({ email: 'invalid-email' });

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ msg: 'Email must be valid' })
                ])
            );
        });

        it('should fail if username is too short', async () => {
            const response = await request(mockApp)
                .patch('/update')
                .send({ username: 'tu' });

            expect(response.status).toBe(400);
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ msg: 'Username must be between 3 and 20 characters long' })
                ])
            );
        });

        it('should succeed with valid data', async () => {
            const response = await request(mockApp)
                .patch('/update')
                .send({ email: 'test@example.com', username: 'testuser' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Update successful');
        });

        it('should succeed with no data (optional fields)', async () => {
            const response = await request(mockApp)
                .patch('/update')
                .send({});

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Update successful');
        });
    });
});
