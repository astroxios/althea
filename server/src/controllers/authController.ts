import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { getErrorResponse } from '../utils/errorHandler';

export const registerUserController = async (req: Request, res: Response) => {
    try {
        const { data } = req.body;
        if (!data || data.type !== 'user' || !data.attributes) {
            return res.status(400).json({
                error: {
                    detail: 'Invalid request. Type must be "user" and attributes must be provided.'
                }
            });
        }
        
        const { username, email, password } = data.attributes;
const requiredAttributes = ['username', 'email', 'password'];

        if (!requiredAttributes.every(attr => data.attributes.hasOwnProperty(attr))) {
            return res.status(400).json({
                error: {
                    detail: 'Invalid request. Attributes such as username, email, and password must be provided.'
                }
            });
        }

        const user = await registerUser(email, username, password);

        // Set the Authorization header to Bearer <access_token>
        res.setHeader('Authorization', `Bearer ${user.access_token}`);

        res.status(201).json({
            data: {
                type: 'user',
                id: user.id,
                attributes: {
                    username: user.username,
                    email: user.email,
                    created: user.created
                }
            }
        });
    } catch (error: any) {
        const statusCode = error.message === 'Email already exists' || error.message === 'Username already exists' ? 409 : 500;

        const errorResponse = getErrorResponse(statusCode);
        res.status(statusCode).json(errorResponse);
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const { access_token } = await loginUser(email, password);
        res.status(200).json({
            message: 'User login successful',
            data: [
                { access_token: access_token }
            ]
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
