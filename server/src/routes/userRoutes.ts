import { Router } from 'express';
import { getUser, getUsers, patchUserDetails, removeUser } from '../controllers/userController';
import { patchValidationRules } from '../middleware/validationMiddleware';
import { handleValidationErrors } from '../middleware/handleValidationErrors';
import { authenticate } from '../middleware/authMiddleware';
import { cacheMiddleware } from '../middleware/cacheMiddleware';

const router = Router();

router.get('/', authenticate, cacheMiddleware, getUsers);
router.get('/:id', authenticate, cacheMiddleware, getUser);
router.patch('/:id', authenticate, patchValidationRules(), handleValidationErrors, patchUserDetails);
router.delete('/:id', authenticate, removeUser);

export default router;
