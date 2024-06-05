import { Request, Response } from 'express';
import { createUser } from '../services/userService';

export const registerUser = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    try {
        const user = await createUser(email, username, password);
        res.status(201).json(user);
    } catch (error) {
        // NOTE: error of 'unknown' type before instanceof was implemented
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};
