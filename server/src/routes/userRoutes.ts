import { Router } from 'express';
import { getUser, registerUser, updateUserDetails } from '../controllers/userController';
import { registerValidationRules } from '../middleware/validation';
import { handleValidationErrors } from '../middleware/handleValidationErrors';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidationRules(), handleValidationErrors, registerUser);
router.get('/:id', authenticateToken, getUser);
router.put('/:id', authenticateToken, updateUserDetails);

export default router;
