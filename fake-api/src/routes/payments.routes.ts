import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createPaymentController,
  getPaymentByIdController,
  updatePaymentStatusController,
  cancelPaymentController
} from '../controllers/payments.controller';

const router = Router();

router.post('/', authMiddleware, createPaymentController);

router.get('/:id', authMiddleware, getPaymentByIdController);

router.patch('/:id/status', authMiddleware, updatePaymentStatusController);

router.post('/:id/cancel', authMiddleware, cancelPaymentController);

export default router;