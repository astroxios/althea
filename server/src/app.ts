import express from 'express';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import widgetRoutes from './routes/widgetRoutes';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

app.use(cors());

app.use(express.json());
app.use('/api', authRoutes)
app.use('/api', userRoutes);
app.use('/api', widgetRoutes);

export default app;
