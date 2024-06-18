import { Router } from 'express';
import * as widgetController from '../controllers/widgetController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/widgets', authenticate, widgetController.getWidgets);
router.post('/widgets', authenticate, widgetController.createWidget);
router.get('/widgets/:id', authenticate, widgetController.getWidget);
router.patch('/widgets/:id', authenticate, widgetController.updateWidget);
router.delete('/widgets/:id', authenticate, widgetController.deleteWidget);

export default router;
