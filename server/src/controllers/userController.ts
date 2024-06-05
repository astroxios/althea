import { Request, Response } from 'express';
import { createUser, getUserById } from '../services/userService';

export const registerUser = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    try {
        const user = await createUser(email, username, password);
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Email already exists' || error.message === 'Username already exists') {
                return res.status(409).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'An unexpected error occurred' });
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
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving user' });
    }
};
