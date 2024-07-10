import { Router } from 'express';
import * as widgetController from '../controllers/widgetController';
import { authenticate } from '../middleware/authMiddleware';
import { cacheMiddleware } from '../middleware/cacheMiddleware';

const router = Router();

router.get('/widgets', authenticate, cacheMiddleware, widgetController.getWidgets);
router.post('/widgets', authenticate, widgetController.createWidget);
router.get('/widgets/:id', authenticate, cacheMiddleware, widgetController.getWidget);
router.patch('/widgets/:id', authenticate, cacheMiddleware, widgetController.updateWidget);
router.delete('/widgets/:id', authenticate, widgetController.deleteWidget);

export default router;
