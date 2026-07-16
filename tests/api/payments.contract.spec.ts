import { test, expect } from '@playwright/test';
import { authHeaders } from '../helpers/auth';
import { validPixPaymentPayload } from '../fixtures/payment.fixture';
import { cleanupPaymentsByTestRunId } from '../helpers/cleanup';
import { validateSchema } from '../helpers/schema-validator';

let testRunIdsToCleanup: string[] = [];

test.afterEach(async ({ request }) => {
  for (const testRunId of testRunIdsToCleanup) {
    await cleanupPaymentsByTestRunId(request, testRunId);
  }

  testRunIdsToCleanup = [];
});

test('CT-019 - Deve validar contrato da criação de pagamento', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  testRunIdsToCleanup.push(payload.testRunId);

  // Act
  const response = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(201);
  validateSchema(body, 'schemas/payment-response.schema.json');
});

test('CT-020 - Deve validar contrato da consulta de pagamento', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  testRunIdsToCleanup.push(payload.testRunId);

  const createResponse = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  expect(createResponse.status()).toBe(201);

  const createdPayment = await createResponse.json();

  // Act
  const getResponse = await request.get(`/payments/${createdPayment.id}`, {
    headers: authHeaders
  });

  const body = await getResponse.json();

  // Assert
  expect(getResponse.status()).toBe(200);
  validateSchema(body, 'schemas/payment-response.schema.json');
});

test('CT-021 - Deve validar contrato da atualização de status', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  testRunIdsToCleanup.push(payload.testRunId);

  const createResponse = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  expect(createResponse.status()).toBe(201);

  const createdPayment = await createResponse.json();

  // Act
  const updateResponse = await request.patch(`/payments/${createdPayment.id}/status`, {
    headers: authHeaders,
    data: {
      status: 'APPROVED',
      reason: 'Pagamento aprovado pela simulacao'
    }
  });

  const body = await updateResponse.json();

  // Assert
  expect(updateResponse.status()).toBe(200);
  validateSchema(body, 'schemas/payment-response.schema.json');
});

test('CT-022 - Deve validar contrato do cancelamento de pagamento', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  testRunIdsToCleanup.push(payload.testRunId);

  const createResponse = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  expect(createResponse.status()).toBe(201);

  const createdPayment = await createResponse.json();

  // Act
  const cancelResponse = await request.post(`/payments/${createdPayment.id}/cancel`, {
    headers: authHeaders,
    data: {
      reason: 'Cancelamento solicitado pela simulacao'
    }
  });

  const body = await cancelResponse.json();

  // Assert
  expect(cancelResponse.status()).toBe(200);
  validateSchema(body, 'schemas/payment-response.schema.json');
});

test('CT-023 - Deve validar contrato de erro 400', async ({ request }) => {
  // Arrange
  const invalidPayload = {
    amount: 'valor-invalido',
    currency: 'BRL',
    paymentMethod: 'PIX',
    customerDocument: '12345678909',
    testRunId: 'run_contract_invalid_payload'
  };

  // Act
  const response = await request.post('/payments', {
    headers: authHeaders,
    data: invalidPayload
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(400);
  validateSchema(body, 'schemas/error-response.schema.json');
});

test('CT-024 - Deve validar contrato de erro 404', async ({ request }) => {
  // Arrange
  const nonExistentPaymentId = 'pay_contract_not_found_123';

  // Act
  const response = await request.get(`/payments/${nonExistentPaymentId}`, {
    headers: authHeaders
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(404);
  validateSchema(body, 'schemas/error-response.schema.json');
});

test('CT-025 - Deve validar contrato de erro 409', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  testRunIdsToCleanup.push(payload.testRunId);

  const createResponse = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  expect(createResponse.status()).toBe(201);

  const createdPayment = await createResponse.json();

  const updateResponse = await request.patch(`/payments/${createdPayment.id}/status`, {
    headers: authHeaders,
    data: {
      status: 'APPROVED',
      reason: 'Pagamento aprovado pela simulacao'
    }
  });

  expect(updateResponse.status()).toBe(200);

  // Act
  const cancelResponse = await request.post(`/payments/${createdPayment.id}/cancel`, {
    headers: authHeaders,
    data: {
      reason: 'Tentativa de cancelar pagamento aprovado'
    }
  });

  const body = await cancelResponse.json();

  // Assert
  expect(cancelResponse.status()).toBe(409);
  validateSchema(body, 'schemas/error-response.schema.json');
});