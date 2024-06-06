import { Router } from 'express';
import { getUser, patchUserDetails, registerUser } from '../controllers/userController';
import { patchValidationRules, registerValidationRules } from '../middleware/validation';
import { handleValidationErrors } from '../middleware/handleValidationErrors';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidationRules(), handleValidationErrors, registerUser);
router.get('/:id', authenticateToken, getUser);
router.patch('/:id', authenticateToken, patchValidationRules(), handleValidationErrors, patchUserDetails);

export default router;
