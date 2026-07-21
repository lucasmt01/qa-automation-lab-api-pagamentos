import { randomUUID } from 'crypto';
import { Payment } from '../models/payment.model';
import { CreatePaymentInput, UpdatePaymentStatusInput } from '../validators/payment.validator';
import {
  createPayment as createPaymentRepository,
  findPaymentById,
  findPaymentsByTestRunId,
  deletePaymentsByTestRunId as deletePaymentsByTestRunIdRepository,
  updatePaymentStatusById
} from '../repositories/payments.repository';

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  const now = new Date().toISOString();

  const payment: Payment = {
    id: `pay_${randomUUID()}`,
    amount: input.amount,
    currency: input.currency,
    paymentMethod: input.paymentMethod,
    customerDocument: input.customerDocument,
    description: input.description,
    status: 'PENDING',
    statusHistory: [
      {
        from: null,
        to: 'PENDING',
        changedAt: now,
        reason: 'Pagamento criado'
      }
    ],
    testRunId: input.testRunId,
    createdAt: now,
    updatedAt: now
  };

  return createPaymentRepository(payment);
}

export async function listPaymentsByTestRunId(testRunId: string) {
  const payments = await findPaymentsByTestRunId(testRunId);

  return {
    items: payments,
    total: payments.length
  };
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  return findPaymentById(id);
}

export async function updatePaymentStatus(id: string, input: UpdatePaymentStatusInput): Promise<Payment | null> {
  const payment = await findPaymentById(id);

  if (!payment) {
    return null;
  }

  if (payment.status !== 'PENDING') {
    throw new Error('PAYMENT_STATUS_ALREADY_FINALIZED');
  }

  const now = new Date().toISOString();

  return updatePaymentStatusById(
    id,
    input.status,
    {
      from: payment.status,
      to: input.status,
      changedAt: now,
      reason: input.reason
    },
    now
  );
}

export async function cleanupPaymentsByTestRunId(testRunId: string) {
  const deletedCount = await deletePaymentsByTestRunIdRepository(testRunId);

  return {
    testRunId,
    deletedCount
  };
}

export async function cancelPayment(
  id: string,
  reason?: string
): Promise<Payment | null> {
  const payment = await findPaymentById(id);

  if (!payment) {
    return null;
  }

  if (payment.status !== 'PENDING') {
    throw new Error('PAYMENT_CANNOT_BE_CANCELLED');
  }

  const now = new Date().toISOString();

  return updatePaymentStatusById(
    id,
    'CANCELLED',
    {
      from: payment.status,
      to: 'CANCELLED',
      changedAt: now,
      reason: reason ?? 'Cancelamento solicitado'
    },
    now
  );
}