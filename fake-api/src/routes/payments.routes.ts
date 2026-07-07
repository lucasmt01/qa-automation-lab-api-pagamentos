import { Router } from 'express';

const router = Router();

router.post('/', (_req, res) => {
  return res.status(501).json({
    message: 'POST /payments ainda serÃ¡ implementado'
  });
});

router.get('/:id', (_req, res) => {
  return res.status(501).json({
    message: 'GET /payments/:id ainda serÃ¡ implementado'
  });
});

router.patch('/:id/status', (_req, res) => {
  return res.status(501).json({
    message: 'PATCH /payments/:id/status ainda serÃ¡ implementado'
  });
});

router.post('/:id/cancel', (_req, res) => {
  return res.status(501).json({
    message: 'POST /payments/:id/cancel ainda serÃ¡ implementado'
  });
});

export default router;
