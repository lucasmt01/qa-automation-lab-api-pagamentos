import { test, expect } from '@playwright/test';
import { authHeaders } from '../helpers/auth';
import { validPixPaymentPayload } from '../fixtures/payment.fixture';
import { cleanupPaymentsByTestRunId } from '../helpers/cleanup';
import {
  closeMongoConnection,
  countPaymentDocumentsByTestRunId,
  findPaymentDocumentById,
  findPaymentDocumentsByTestRunId
} from '../helpers/mongo-client';

let testRunIdsToCleanup: string[] = [];

test.afterEach(async ({ request }) => {
  for (const testRunId of testRunIdsToCleanup) {
    await cleanupPaymentsByTestRunId(request, testRunId);
  }

  testRunIdsToCleanup = [];
});

test.afterAll(async () => {
  await closeMongoConnection();
});

test('CT-026 - Deve validar persistência do pagamento criado no MongoDB', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  testRunIdsToCleanup.push(payload.testRunId);

  // Act
  const createResponse = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  const createdPayment = await createResponse.json();

  // Assert API
  expect(createResponse.status()).toBe(201);

  // Assert Mongo
  const mongoDocument = await findPaymentDocumentById(createdPayment.id);

  expect(mongoDocument).toBeTruthy();

  if (!mongoDocument) {
    throw new Error('Pagamento não encontrado no MongoDB');
  }

  expect(mongoDocument._id).toBeDefined();
  expect(mongoDocument.id).toBe(createdPayment.id);
  expect(mongoDocument.amount).toBe(payload.amount);
  expect(mongoDocument.currency).toBe(payload.currency);
  expect(mongoDocument.paymentMethod).toBe(payload.paymentMethod);
  expect(mongoDocument.customerDocument).toBe(payload.customerDocument);
  expect(mongoDocument.description).toBe(payload.description);
  expect(mongoDocument.status).toBe('PENDING');
  expect(mongoDocument.testRunId).toBe(payload.testRunId);

  expect(Array.isArray(mongoDocument.statusHistory)).toBeTruthy();
  expect(mongoDocument.statusHistory).toHaveLength(1);
  expect(mongoDocument.statusHistory[0].from).toBeNull();
  expect(mongoDocument.statusHistory[0].to).toBe('PENDING');
});

test('CT-027 - Deve validar atualização de status no MongoDB', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  testRunIdsToCleanup.push(payload.testRunId);

  const createResponse = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  expect(createResponse.status()).toBe(201);

  const createdPayment = await createResponse.json();

  const reason = 'Pagamento aprovado pela auditoria Mongo';

  // Act
  const updateResponse = await request.patch(`/payments/${createdPayment.id}/status`, {
    headers: authHeaders,
    data: {
      status: 'APPROVED',
      reason
    }
  });

  const updatedPayment = await updateResponse.json();

  // Assert API
  expect(updateResponse.status()).toBe(200);
  expect(updatedPayment.status).toBe('APPROVED');

  // Assert Mongo
  const mongoDocument = await findPaymentDocumentById(createdPayment.id);

  expect(mongoDocument).toBeTruthy();

  if (!mongoDocument) {
    throw new Error('Pagamento atualizado não encontrado no MongoDB');
  }

  expect(mongoDocument.status).toBe('APPROVED');
  expect(mongoDocument.updatedAt).toBe(updatedPayment.updatedAt);

  expect(Array.isArray(mongoDocument.statusHistory)).toBeTruthy();
  expect(mongoDocument.statusHistory).toHaveLength(2);

  const lastHistory = mongoDocument.statusHistory[mongoDocument.statusHistory.length - 1];

  expect(lastHistory.from).toBe('PENDING');
  expect(lastHistory.to).toBe('APPROVED');
  expect(lastHistory.reason).toBe(reason);
  expect(lastHistory.changedAt).toBeDefined();

  expect(new Date(lastHistory.changedAt).toString()).not.toBe('Invalid Date');
});

test('CT-028 - Deve validar cancelamento de pagamento no MongoDB', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  testRunIdsToCleanup.push(payload.testRunId);

  const createResponse = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  expect(createResponse.status()).toBe(201);

  const createdPayment = await createResponse.json();

  const reason = 'Cancelamento validado pela auditoria Mongo';

  // Act
  const cancelResponse = await request.post(`/payments/${createdPayment.id}/cancel`, {
    headers: authHeaders,
    data: {
      reason
    }
  });

  const cancelledPayment = await cancelResponse.json();

  // Assert API
  expect(cancelResponse.status()).toBe(200);
  expect(cancelledPayment.status).toBe('CANCELLED');

  // Assert Mongo
  const mongoDocument = await findPaymentDocumentById(createdPayment.id);

  expect(mongoDocument).toBeTruthy();

  if (!mongoDocument) {
    throw new Error('Pagamento cancelado não encontrado no MongoDB');
  }

  expect(mongoDocument.status).toBe('CANCELLED');
  expect(mongoDocument.updatedAt).toBe(cancelledPayment.updatedAt);

  expect(Array.isArray(mongoDocument.statusHistory)).toBeTruthy();
  expect(mongoDocument.statusHistory).toHaveLength(2);

  const lastHistory = mongoDocument.statusHistory[mongoDocument.statusHistory.length - 1];

  expect(lastHistory.from).toBe('PENDING');
  expect(lastHistory.to).toBe('CANCELLED');
  expect(lastHistory.reason).toBe(reason);
  expect(lastHistory.changedAt).toBeDefined();

  expect(new Date(lastHistory.changedAt).toString()).not.toBe('Invalid Date');
});

test('CT-029 - Deve validar expurgo de massa de teste no MongoDB', async ({ request }) => {
  // Arrange
  const firstPayload = validPixPaymentPayload();
  const testRunId = firstPayload.testRunId;

  const secondPayload = validPixPaymentPayload(testRunId);

  testRunIdsToCleanup.push(testRunId);

  const firstCreateResponse = await request.post('/payments', {
    headers: authHeaders,
    data: firstPayload
  });

  const secondCreateResponse = await request.post('/payments', {
    headers: authHeaders,
    data: {
      ...secondPayload,
      description: 'Segundo pagamento para auditoria de expurgo'
    }
  });

  expect(firstCreateResponse.status()).toBe(201);
  expect(secondCreateResponse.status()).toBe(201);

  const countBeforeCleanup = await countPaymentDocumentsByTestRunId(testRunId);

  expect(countBeforeCleanup).toBe(2);

  // Act
  const cleanupResponse = await cleanupPaymentsByTestRunId(request, testRunId);
  const documentsAfterCleanup = await findPaymentDocumentsByTestRunId(testRunId);

  // Assert
  expect(cleanupResponse.deletedCount).toBe(2);
  expect(documentsAfterCleanup).toHaveLength(0);
});