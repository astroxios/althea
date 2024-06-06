import { Router } from 'express';
import { getUser, patchUserDetails, registerUser, removeUser } from '../controllers/userController';
import { patchValidationRules, registerValidationRules } from '../middleware/validation';
import { handleValidationErrors } from '../middleware/handleValidationErrors';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidationRules(), handleValidationErrors, registerUser);
router.get('/:id', authenticateToken, getUser);
router.patch('/:id', authenticateToken, patchValidationRules(), handleValidationErrors, patchUserDetails);
router.delete('/:id', authenticateToken, removeUser);

export default router;
