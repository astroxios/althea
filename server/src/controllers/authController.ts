import { Request, Response } from 'express';
import { loginUser } from '../services/authService';

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
