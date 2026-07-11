import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createPaymentController,
  getPaymentByIdController,
  updatePaymentStatusController
} from '../controllers/payments.controller';

const router = Router();

router.post('/', authMiddleware, createPaymentController);

router.get('/:id', authMiddleware, getPaymentByIdController);

router.patch('/:id/status', authMiddleware, updatePaymentStatusController);

router.post('/:id/cancel', authMiddleware, (_req, res) => {
  return res.status(501).json({
    message: 'POST /payments/:id/cancel ainda será implementado'
  });
});

export default router;