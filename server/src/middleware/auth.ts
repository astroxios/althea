import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'if_you_see_this_we_know'

export const generateToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h'});
};
