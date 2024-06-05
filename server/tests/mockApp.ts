import express from 'express';
import { authenticateToken } from '../src/middleware/auth';

const mockApp = express();

mockApp.use(express.json());

mockApp.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ id: req.user.id, email: req.user.email });
});

export default mockApp;
