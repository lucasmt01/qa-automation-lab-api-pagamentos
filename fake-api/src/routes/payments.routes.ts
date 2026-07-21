import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  cancelPaymentController,
  createPaymentController,
  getPaymentByIdController,
  listPaymentsController,
  updatePaymentStatusController
} from '../controllers/payments.controller';

const router = Router();

router.post('/', authMiddleware, createPaymentController);

router.get('/', authMiddleware, listPaymentsController);

router.get('/:id', authMiddleware, getPaymentByIdController);

router.patch('/:id/status', authMiddleware, updatePaymentStatusController);

router.post('/:id/cancel', authMiddleware, cancelPaymentController);

export default router;