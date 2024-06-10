import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'if_you_see_this_we_know';

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};
