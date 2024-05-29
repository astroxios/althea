import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: { userId: number };
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied.');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number};
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};

export { authenticateToken, AuthenticatedRequest };
