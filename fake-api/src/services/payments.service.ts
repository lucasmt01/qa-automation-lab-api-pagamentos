import { randomUUID } from 'crypto';
import { Payment } from '../models/payment.model';
import { CreatePaymentInput } from '../validators/payment.validator';
import {
  createPayment as createPaymentRepository,
  findPaymentById
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
    testRunId: input.testRunId,
    createdAt: now,
    updatedAt: now
  };

  return createPaymentRepository(payment);
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  return findPaymentById(id);
}