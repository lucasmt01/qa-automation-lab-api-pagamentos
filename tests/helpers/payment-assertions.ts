import { expect } from '@playwright/test';

type PaymentPayload = {
  amount: number;
  currency: string;
  paymentMethod: string;
  customerDocument: string;
  description?: string;
  testRunId: string;
};

export function expectPaymentCreatedResponse(body: any, payload: PaymentPayload) {
  expect(body.id).toBeDefined();
  expect(body.id).toMatch(/^pay_/);

  expect(body.amount).toBe(payload.amount);
  expect(body.currency).toBe(payload.currency);
  expect(body.paymentMethod).toBe(payload.paymentMethod);
  expect(body.customerDocument).toBe(payload.customerDocument);
  expect(body.description).toBe(payload.description);
  expect(body.status).toBe('PENDING');
  expect(body.testRunId).toBe(payload.testRunId);

  expect(body.createdAt).toBeDefined();
  expect(body.updatedAt).toBeDefined();

  expect(new Date(body.createdAt).toString()).not.toBe('Invalid Date');
  expect(new Date(body.updatedAt).toString()).not.toBe('Invalid Date');
}

export function expectPaymentFoundResponse(body: any, expectedPayment: any) {
  expect(body.id).toBe(expectedPayment.id);
  expect(body.amount).toBe(expectedPayment.amount);
  expect(body.currency).toBe(expectedPayment.currency);
  expect(body.paymentMethod).toBe(expectedPayment.paymentMethod);
  expect(body.customerDocument).toBe(expectedPayment.customerDocument);
  expect(body.status).toBe(expectedPayment.status);
  expect(body.testRunId).toBe(expectedPayment.testRunId);
}

export function expectErrorResponse(body: any, code: string, message: string) {
  expect(body.code).toBe(code);
  expect(body.message).toBe(message);
}