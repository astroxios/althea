import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Registration
app.post('/api/users/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Validation
  if (!(username && email && password)) {
    return res.status(400).send('All fields are required');
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username } || { email }
    });

    if (existingUser) {
      return res.status(409).send('User already exists');
    }

    // Pasword Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h'});

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Login
app.post('/api/users/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation
  if (!(email && password)) {
    return res.status(400).send('All fields are required');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// GET User by ID
app.get('/api/users/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// PATCH User by ID
app.put('/api/users/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingUser) {
      return res.status(404).send('User not found');
    }

    // Check if the new username already exists
    if (username && username !== existingUser.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUsername) {
        return res.status(400).send('Username already exists');
      }
    }

    // Check if the new email already exists
    if (email && email !== existingUser.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email }
      });

      if (existingEmail) {
        return res.status(400).send('Email already exists');
      }
    }

    // Hash new password if provided
    let hashedPassword = existingUser.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user
    const updateUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        username: username || existingUser.username,
        email: email || existingUser.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res.json(updateUser);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

export { app };

