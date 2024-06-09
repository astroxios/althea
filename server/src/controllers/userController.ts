import { Request, Response } from 'express';
import { createUser, getUserById, updateUser, deleteUser } from '../services/userService';
import { filterProperties, redactSensitiveProperties } from '../utils/filterProperties';
import { generateETag } from '../middleware/cacheMiddleware';
import redisClient from '../redisClient';

export const registerUser = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    try {
        const user = await createUser(email, username, password);
        res.status(201).json({
            message: 'User registration successful',
            data: [
                {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    access_token: user.access_token
                }
            ]
        })
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Email already exists' || error.message === 'Username already exists') {
                return res.status(409).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
      }
};

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await getUserById(Number(id));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Exclude specific properties from the response
        const filteredResponse = filterProperties(user, [
            'email',
            'password',
        ]);
        res.status(200).json({
            message: 'User retrieval successful',
            data: [filteredResponse]
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const patchUserDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const user = await getUserById(Number(id));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updated_user = await updateUser(Number(id), data);

        // Exclude sensitive properties from the response
        const redactedResponse = redactSensitiveProperties(updated_user, ['password']);
        const etag = generateETag(redactedResponse);

        // Cache the updated user data (set for 1 hour)
        const cachedResponse = { response: redactedResponse, etag };
        redisClient.setex(id, 3600, JSON.stringify(cachedResponse));

        res.setHeader('ETag', etag);
        res.status(200).json({
            message: 'User update successful',
            data: [redactedResponse]
        });

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export const removeUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await deleteUser(Number(id));
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
};
