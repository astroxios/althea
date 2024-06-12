import { Router } from 'express';
import * as widgetController from '../controllers/widgetController';

const router = Router();

router.get('/widgets', widgetController.getWidgets);
router.post('/widgets', widgetController.createWidget);
router.put('/widgets/:id', widgetController.updateWidget);
router.delete('/widgets/:id', widgetController.deleteWidget);

export default router;
