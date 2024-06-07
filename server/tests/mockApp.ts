import express from 'express';
import { authenticateToken } from '../src/middleware/auth';
import { registerValidationRules, patchValidationRules } from '../src/middleware/validation';
import { handleValidationErrors } from '../src/middleware/handleValidationErrors';

const mockApp = express();

mockApp.use(express.json());

mockApp.post('/register', registerValidationRules(), handleValidationErrors, (req: express.Request, res: express.Response) => {
    res.status(200).json({ message: 'Registration successful' });
});

mockApp.patch('/update', patchValidationRules(), handleValidationErrors, (req: express.Request, res: express.Response) => {
    res.status(200).json({ message: 'Update successful' });
});

mockApp.get('/protected', authenticateToken, (req: express.Request, res: express.Response) => {
    res.status(200).json({ id: req.user.id, email: req.user.email });
});

export default mockApp;
