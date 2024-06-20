import { Router } from 'express';
import { registerUserController, loginUserController } from '../controllers/authController';
import { registerValidationRules } from '../middleware/validationMiddleware';
import { handleValidationErrors } from '../middleware/handleValidationErrors';

const router = Router();

router.post('/auth/register', registerValidationRules(), handleValidationErrors, registerUserController);
router.post('/auth/login', loginUserController);

export default router;
