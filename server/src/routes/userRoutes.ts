import { Router } from 'express';
import { getUser, getUsers, patchUserDetails, removeUser } from '../controllers/userController';
import { patchValidationRules } from '../middleware/validationMiddleware';
import { handleValidationErrors } from '../middleware/handleValidationErrors';
import { authenticate } from '../middleware/authMiddleware';
import { cacheMiddleware } from '../middleware/cacheMiddleware';

const router = Router();

router.get('/users', authenticate, cacheMiddleware, getUsers);
router.get('/users/:id', authenticate, cacheMiddleware, getUser);
router.patch('/users/:id', authenticate, patchValidationRules(), handleValidationErrors, patchUserDetails);
router.delete('/users/:id', authenticate, removeUser);

export default router;
