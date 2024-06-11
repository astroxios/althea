import express from 'express';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes);

export default app;
