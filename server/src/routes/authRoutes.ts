import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { registerValidationRules } from '../middleware/validationMiddleware';
import { handleValidationErrors } from '../middleware/handleValidationErrors';

const router = Router();

router.post('/register', registerValidationRules(), handleValidationErrors, register);
router.post('/login', login);

export default router;
