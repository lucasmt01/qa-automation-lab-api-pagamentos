import { Request, Response } from 'express';
import { createPaymentSchema } from '../validators/payment.validator';
import {
  createPayment,
  getPaymentById
} from '../services/payments.service';

export async function createPaymentController(req: Request, res: Response) {
  const validation = createPaymentSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      code: 'INVALID_PAYLOAD',
      message: 'Payload inválido',
      details: validation.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    });
  }

  const payment = await createPayment(validation.data);

  return res.status(201).json(payment);
}

export async function getPaymentByIdController(req: Request, res: Response) {
  const { id } = req.params;

  const payment = await getPaymentById(id);

  if (!payment) {
    return res.status(404).json({
      code: 'PAYMENT_NOT_FOUND',
      message: 'Pagamento não encontrado'
    });
  }

  return res.status(200).json(payment);
}