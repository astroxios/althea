import jwt from 'jsonwebtoken';
import { getUserByEmail } from './userService';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'if_you_see_this_we_know'

export const loginUser = async (email: string, password: string) => {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return { ...user, access_token: token }
};
