import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { getErrorResponse } from '../utils/errorHandler';
import { serializeObject } from '../utils/objectSerializer';

export const registerUserController = async (req: Request, res: Response) => {
    try {
        const { data } = req.body;

        const { username, email, password } = data.attributes;
        const requiredAttributes = ['username', 'email', 'password'];

        if (!requiredAttributes.every(attr => data.attributes.hasOwnProperty(attr))) {
            return res.status(400).json({
                error: {
                    message: 'Invalid request. Attributes such as username, email, and password must be provided.'
                }
            });
        }

        const user = await registerUser(email, username, password);

        // Set the Authorization header to Bearer <access_token>
        res.setHeader('Authorization', `Bearer ${user.access_token}`);

        const excludeProperties = ['password', 'updated', 'access_token'];

        const response = serializeObject('user', user, excludeProperties);

        res.status(201).json(response);
    } catch (error: any) {
        const statusCode = error.message === 'Email already exists' || error.message === 'Username already exists' ? 409 : 500;

        let errorResponse;
        if (statusCode === 409) {
            errorResponse = {
                status: statusCode,
                message: error.message,
            };
        } else {
            errorResponse = getErrorResponse(statusCode);
        }

        res.status(statusCode).json(errorResponse);
    }
};

export const loginUserController = async (req: Request, res: Response) => {
    try {
        const { data } = req.body;

        if (!data || data.type !== 'user' || !data.attributes) {
            return res.status(400).json({
                error: {
                    message: "Invalid request. Please ensure the JSON request body contains a data object with a type set to 'user', and includes attributes."
                }
            });
        }

        const { email, password } = data.attributes;
        const requiredAttributes = ['email', 'password'];

        if (!requiredAttributes.every(attr => data.attributes.hasOwnProperty(attr))) {
            return res.status(400).json({
                error: {
                    detail: 'Invalid request. Attributes such as email and password must be provided.'
                }
            });
        }

        const user = await loginUser(email, password);

        // Set the Authorization header to Bearer <access_token>
        res.setHeader('Authorization', `Bearer ${user.access_token}`);

        const excludeProperties = ['password', 'updated', 'access_token'];

        const response = serializeObject('user', user, excludeProperties);

        res.status(200).json(response);
    } catch (error: any) {
        const statusCode = error.message === 'Invalid credentials' ? 400 : 500;

        let errorResponse;
        if (statusCode === 400) {
            errorResponse = {
                status: statusCode,
                message: 'Invalid credentials',
                detail: 'The client has provided incorrect email or password. Please check credentials and try again.'
            };
        } else {
            errorResponse = getErrorResponse(statusCode);
        }

        res.status(statusCode).json(errorResponse);
    }
};
