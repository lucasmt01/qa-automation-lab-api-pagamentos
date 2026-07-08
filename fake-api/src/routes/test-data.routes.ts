import { Router } from 'express';

const router = Router();

router.delete('/payments', (_req, res) => {
  return res.status(501).json({
    message: 'DELETE /test-data/payments ainda será implementado'
  });
});

export default router;
