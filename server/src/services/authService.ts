import userModel from '../models/userModel';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken';
import { getUserByEmail } from './userService';

export const registerUser = async (email: string, username: string, password: string) => {
    // Check if the email or username already exists
    const existingUserByEmail = await userModel.findUnique({ where: { email }});
    if (existingUserByEmail) {
        throw new Error('Email already exists');
    }

    const existingUserByUsername = await userModel.findUnique({ where: { username }});
    if (existingUserByUsername) {
        throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
        data: {
            email,
            username,
            password: hashedPassword,
        },
    });

    const token = generateToken({ id: user.id, email: user.email });
    return { ...user, access_token: token };
};

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
