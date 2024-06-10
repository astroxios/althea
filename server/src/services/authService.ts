import { getUserByEmail } from './userService';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/authMiddleware';

export const loginUser = async (email: string, password: string) => {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const token = generateToken({ id: user.id, email: user.email });
    return { ...user, access_token: token }
};
