import { Router } from 'express';
import { getUserController, getUsersController, updateUserController, deleteUserController } from '../controllers/userController';
import { patchValidationRules } from '../middleware/validationMiddleware';
import { handleValidationErrors } from '../middleware/handleValidationErrors';
import { authenticate } from '../middleware/authMiddleware';
import { cacheMiddleware } from '../middleware/cacheMiddleware';

const router = Router();

router.get('/users', authenticate, cacheMiddleware, getUsersController);
router.get('/users/:id', authenticate, cacheMiddleware, getUserController);
router.patch('/users/:id', authenticate, patchValidationRules(), handleValidationErrors, updateUserController);
router.delete('/users/:id', authenticate, deleteUserController);

export default router;
