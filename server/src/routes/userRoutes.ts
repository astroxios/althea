import { Router } from 'express';
import { registerUser } from '../controllers/userController';
import { registerValidationRules } from '../middleware/validation';
import { handleValidationErrors } from '../middleware/handleValidationErrors';

const router = Router();

router.post('/register', registerValidationRules(), handleValidationErrors, registerUser);

export default router;
