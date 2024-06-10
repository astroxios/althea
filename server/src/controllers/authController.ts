import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';

export const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    try {
        const user = await registerUser(email, username, password);
        res.status(201).json({
            message: 'User registration successful',
            data: [
                {
                    id: user.id,
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
