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

export const getUsersByIds = async (ids: number[]) => {
    return userModel.findMany({
        where: {
            id: {
                in: ids
            }
        }
    });
};
