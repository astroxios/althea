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
      // FIXME: assign a 'role' during user registration
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

// User by ID
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

export { app };

