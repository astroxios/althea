import { Router } from 'express';
import { getUser, getUsers, patchUserDetails, registerUser, removeUser } from '../controllers/userController';
import { patchValidationRules, registerValidationRules } from '../middleware/validationMiddleware';
import { handleValidationErrors } from '../middleware/handleValidationErrors';
import { authenticateToken } from '../middleware/authMiddleware';
import { cacheMiddleware } from '../middleware/cacheMiddleware';

const router = Router();

router.post('/register', registerValidationRules(), handleValidationErrors, registerUser);
router.get('/', authenticateToken, cacheMiddleware, getUsers);
router.get('/:id', authenticateToken, cacheMiddleware, getUser);
router.patch('/:id', authenticateToken, patchValidationRules(), handleValidationErrors, patchUserDetails);
router.delete('/:id', authenticateToken, removeUser);

export default router;
