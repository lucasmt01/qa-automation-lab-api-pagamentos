import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { deletePaymentsByTestRunIdController } from '../controllers/test-data.controller';

const router = Router();

router.delete('/payments', authMiddleware, deletePaymentsByTestRunIdController);

export default router;