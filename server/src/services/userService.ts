import userModel from "../models/userModel";
import bcrypt from 'bcryptjs';
import redisClient from "../redisClient";

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

export const getUsersByIds = async (ids: number[]) => {
    return userModel.findMany({
        where: {
            id: {
                in: ids
            }
        }
    });
};

export const updateUser = async (id: number, data: any) => {
    const user = await userModel.findUnique({ where: { id } });

    if (!user) {
        throw new Error('User not found');
    }

    if (data.email && data.email !== user.email) {
        const existingUserByEmail = await userModel.findUnique({ where: { email: data.email } });
        if (existingUserByEmail && existingUserByEmail.id !== id) {
            throw new Error('Email already exists');
        }
    }

    if (data.username && data.username !== user.username) {
        const existingUserByUsername = await userModel.findUnique({ where: { username: data.username } });
        if (existingUserByUsername && existingUserByUsername.id !== id) {
            throw new Error('Username already exists');
        }
    }

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
