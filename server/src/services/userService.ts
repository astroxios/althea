import userModel from "../models/userModel";
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/authMiddleware';
import redisClient from "../redisClient";

export const createUser = async (email: string, username: string, password: string) => {
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

export const getUserByEmail = async (email: string) => {
    return userModel.findUnique({
        where: {
            email,
        },
    });
};

export const getUserById = async (id: number) => {
    return userModel.findUnique({
        where: {
            id,
        },
    });
};

export const updateUser = async (id: number, data: any) => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    const updatedUser = await userModel.update({
        where: { id },
        data,
    });

    // Clear the old cache
    await redisClient.del(id.toString());

    return updatedUser;
};

export const deleteUser = async (id: number) => {
    return userModel.delete({
        where: { id },
    });
};
