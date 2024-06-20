import { Router } from 'express';
import { registerUserController, login } from '../controllers/authController';
import { registerValidationRules } from '../middleware/validationMiddleware';
import { handleValidationErrors } from '../middleware/handleValidationErrors';

const router = Router();

router.post('/auth/register', registerValidationRules(), handleValidationErrors, registerUserController);
router.post('/auth/login', login);

export default router;
