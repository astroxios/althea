import { Request, Response } from 'express';
import { createUser } from '../services/userService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'if_you_see_this_we_know'

export const registerUser = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    try {
        const user = await createUser(email, username, password);
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ ...user, access_token: token });
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
