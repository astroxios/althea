import userModel from "../models/userModel";
import bcrypt from 'bcryptjs';

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
    return userModel.create({
        data: {
            email,
            username,
            password: hashedPassword,
        },
    });
};

