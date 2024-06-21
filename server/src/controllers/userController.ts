import { Request, Response } from 'express';
import { getUserById, updateUser, deleteUser, getUsersByIds } from '../services/userService';
import { generateETag } from '../middleware/cacheMiddleware';
import redisClient from '../redisClient';
import { serializeObject } from '../utils/objectSerializer';
import { getErrorResponse } from '../utils/errorHandler';
import { validationResult } from 'express-validator';

export const getUserController = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user  = req.user;

        // Check if the provided id is a number
        if (isNaN(Number(userId))) {
            return res.status(400).json({
                error: {
                    message: 'Invalid request. The provided ID is not a valid user ID.'
                }
            });
        }

        const targetUser = await getUserById(Number(userId));
        if (!targetUser) {
            return res.status(404).json({
                error: {
                    message: 'User not found'
                }
            });
        }

        const excludeProperties = ['password'];
        if (user.id !== targetUser.id) {
            excludeProperties.push('email');
            excludeProperties.push('updated')
        }

        const response = serializeObject('user', targetUser, excludeProperties);

        res.status(200).json(response);
    } catch (error) {
        const errorResponse = getErrorResponse(500);
        res.status(500).json(errorResponse);
    }
};

export const getUsersController = async (req: Request, res: Response) => {
    try {
        const idsParam = req.query.ids as string;
        if (!idsParam) {
            return res.status(400).json({
                error: {
                    message: "Invalid request. Parameter 'ids' are required."
                }
            });
        }

        const userIds = idsParam.split(',').map(id => parseInt(id.trim(), 10));

        if (userIds.some(isNaN)) {
            return res.status(400).json({
                error: {
                    message: "Invalid request. Invalid 'ids' parameter. Must be a comma-separated list of numbers."
                }
            });
        }

        const users = await getUsersByIds(userIds);
        if (users.length === 0) {
            return res.status(404).json({
                error: {
                    message: 'No users found'
                }
            });
        }

        const excludeProperties = ['email', 'password', 'updated'];

        const response = users.map(users => serializeObject('user', users, excludeProperties));

        res.status(200).json(response)
    } catch (error) {
        const errorResponse = getErrorResponse(500);
        res.status(500).json(errorResponse);
    }
};

export const updateUserController = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string;
        // NOTE: Must check validationResult library usage (in this case)
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const data = req.body;

        if (!data || data.type !== 'user' || !data.attributes) {
            return res.status(400).json({
                error: {
                    message: "Invalid request. Please ensure the JSON request body contains a data object with a type set to 'user', and includes attributes."
                }
            });
        }

        const user = await getUserById(Number(userId));
        if (!user) {
            return res.status(404).json({
                error: {
                    message: 'User not found'
                }
            });
        }

        // NOTE: Update attributes as `user` object scales
        // Specify attributes allowed to be changed
        const attributes = data.attributes;
        const allowedAttributes = ['username', 'email', 'password', 'updated'];

        // Filter and validate the attributes
        const updatedAttributes: Record<string, any> = {};
        for (const key of allowedAttributes) {
            if (attributes[key] !== undefined) {
                updatedAttributes[key] = attributes[key];
            }
        }

        if (Object.keys(updatedAttributes).length === 0) {
            return res.status(400).json({
                error: {
                    message: 'Invalid request. No valid attributes provided for update.'
                }
            });
        }

        const updatedUser = await updateUser(Number(userId), updatedAttributes);

        const response = serializeObject('user', updatedUser, ['password']);
        const etag = generateETag(response);

        // Cache the updated user data (set for 1 hour)
        const cachedResponse = {
            response: { response },
            etag
        };
        redisClient.setex(`user:${userId}`, 3600, JSON.stringify(cachedResponse));
        res.setHeader('ETag', etag);

        res.status(200).json(response);
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

export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string;

        // Check if the provided id is a number
        if (isNaN(Number(userId))) {
            return res.status(400).json({
                error: {
                    message: 'Invalid request. The provided ID is not a valid user ID.'
                }
            });
        }

        const user = await getUserById(Number(userId));
        if (!user) {
            return res.status(404).json({
                error: {
                    message: 'User not found'
                }
            })
        }

        await deleteUser(Number(userId));
        res.status(204).send();
    } catch (error) {
        const errorResponse = getErrorResponse(500);
        res.status(500).json(errorResponse);
    }
};
