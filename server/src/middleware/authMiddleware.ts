import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/verifyToken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
