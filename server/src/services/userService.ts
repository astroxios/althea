import userModel from "../models/userModel";
import bcrypt from 'bcryptjs';

export const createUser = async (email: string, username: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return userModel.create({
        data: {
            email,
            username,
            password: hashedPassword,
        },
    });
};

