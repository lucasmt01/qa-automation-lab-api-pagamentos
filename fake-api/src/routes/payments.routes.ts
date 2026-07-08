import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createPaymentController,
  getPaymentByIdController
} from '../controllers/payments.controller';

const router = Router();

router.post('/', authMiddleware, createPaymentController);

router.get('/:id', authMiddleware, getPaymentByIdController);

router.patch('/:id/status', authMiddleware, (_req, res) => {
  return res.status(501).json({
    message: 'PATCH /payments/:id/status ainda será implementado'
  });
});

router.post('/:id/cancel', authMiddleware, (_req, res) => {
  return res.status(501).json({
    message: 'POST /payments/:id/cancel ainda será implementado'
  });
});

export default router;