import { Request, Response } from 'express';
import {
  cancelPaymentSchema,
  createPaymentSchema,
  updatePaymentStatusSchema
} from '../validators/payment.validator';
import {
  cancelPayment,
  createPayment,
  getPaymentById,
  listPaymentsByTestRunId,
  updatePaymentStatus
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

export async function listPaymentsController(req: Request, res: Response) {
  const { testRunId } = req.query;

  if (!testRunId || typeof testRunId !== 'string') {
    return res.status(400).json({
      code: 'INVALID_TEST_RUN_ID',
      message: 'O parâmetro testRunId é obrigatório'
    });
  }

  const result = await listPaymentsByTestRunId(testRunId);

  return res.status(200).json(result);
}

export async function getPaymentByIdController(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      code: 'INVALID_PAYMENT_ID',
      message: 'O id do pagamento é obrigatório'
    });
  }

  const payment = await getPaymentById(id);

  if (!payment) {
    return res.status(404).json({
      code: 'PAYMENT_NOT_FOUND',
      message: 'Pagamento não encontrado'
    });
  }

  return res.status(200).json(payment);
}

export async function updatePaymentStatusController(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      code: 'INVALID_PAYMENT_ID',
      message: 'O id do pagamento é obrigatório'
    });
  }

  const validation = updatePaymentStatusSchema.safeParse(req.body);

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

  try {
    const payment = await updatePaymentStatus(id, validation.data);

    if (!payment) {
      return res.status(404).json({
        code: 'PAYMENT_NOT_FOUND',
        message: 'Pagamento não encontrado'
      });
    }

    return res.status(200).json(payment);
  } catch (error) {
    if (error instanceof Error && error.message === 'PAYMENT_STATUS_ALREADY_FINALIZED') {
      return res.status(409).json({
        code: 'PAYMENT_STATUS_ALREADY_FINALIZED',
        message: 'Pagamento já possui status final e não pode ser atualizado'
      });
    }

    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Erro interno ao atualizar status do pagamento'
    });
  }
}

export async function cancelPaymentController(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      code: 'INVALID_PAYMENT_ID',
      message: 'O id do pagamento é obrigatório'
    });
  }

  const validation = cancelPaymentSchema.safeParse(req.body ?? {});

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

  try {
    const payment = await cancelPayment(id, validation.data.reason);

    if (!payment) {
      return res.status(404).json({
        code: 'PAYMENT_NOT_FOUND',
        message: 'Pagamento não encontrado'
      });
    }

    return res.status(200).json(payment);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'PAYMENT_CANNOT_BE_CANCELLED'
    ) {
      return res.status(409).json({
        code: 'PAYMENT_CANNOT_BE_CANCELLED',
        message: 'Pagamento não pode ser cancelado no status atual'
      });
    }

    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Erro interno ao cancelar pagamento'
    });
  }
}