import { test, expect } from '@playwright/test';
import { authHeaders } from '../helpers/auth';
import { validPixPaymentPayload } from '../fixtures/payment.fixture';
import { cleanupPaymentsByTestRunId } from '../helpers/cleanup';
import { expectErrorResponse } from '../helpers/payment-assertions';

let testRunIdsToCleanup: string[] = [];

test.afterEach(async ({ request }) => {
  for (const testRunId of testRunIdsToCleanup) {
    await cleanupPaymentsByTestRunId(request, testRunId);
  }

  testRunIdsToCleanup = [];
});

test('CT-035 - POST /payments deve retornar 400 quando amount não for informado', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  const { amount, ...payloadWithoutAmount } = payload;

  // Act
  const response = await request.post('/payments', {
    headers: authHeaders,
    data: payloadWithoutAmount
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(400);
  expectErrorResponse(body, 'INVALID_PAYLOAD', 'Payload inválido');
  expect(body.details.length).toBeGreaterThan(0);
});

test('CT-036 - POST /payments deve retornar 400 quando amount for negativo', async ({ request }) => {
  // Arrange
  const payload = {
    ...validPixPaymentPayload(),
    amount: -10
  };

  // Act
  const response = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(400);
  expectErrorResponse(body, 'INVALID_PAYLOAD', 'Payload inválido');
  expect(body.details.length).toBeGreaterThan(0);
});

test('CT-037 - POST /payments deve retornar 400 quando amount for zero', async ({ request }) => {
  // Arrange
  const payload = {
    ...validPixPaymentPayload(),
    amount: 0
  };

  // Act
  const response = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(400);
  expectErrorResponse(body, 'INVALID_PAYLOAD', 'Payload inválido');
  expect(body.details.length).toBeGreaterThan(0);
});

test('CT-038 - POST /payments deve retornar 400 quando currency for inválida', async ({ request }) => {
  // Arrange
  const payload = {
    ...validPixPaymentPayload(),
    currency: 'USD'
  };

  // Act
  const response = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(400);
  expectErrorResponse(body, 'INVALID_PAYLOAD', 'Payload inválido');
  expect(body.details.length).toBeGreaterThan(0);
});

test('CT-039 - POST /payments deve retornar 400 quando paymentMethod for inválido', async ({ request }) => {
  // Arrange
  const payload = {
    ...validPixPaymentPayload(),
    paymentMethod: 'TED'
  };

  // Act
  const response = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(400);
  expectErrorResponse(body, 'INVALID_PAYLOAD', 'Payload inválido');
  expect(body.details.length).toBeGreaterThan(0);
});

test('CT-040 - POST /payments deve retornar 400 quando customerDocument não for informado', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  const { customerDocument, ...payloadWithoutCustomerDocument } = payload;

  // Act
  const response = await request.post('/payments', {
    headers: authHeaders,
    data: payloadWithoutCustomerDocument
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(400);
  expectErrorResponse(body, 'INVALID_PAYLOAD', 'Payload inválido');
  expect(body.details.length).toBeGreaterThan(0);
});

test('CT-041 - PATCH /payments/:id/status deve retornar 400 quando status não for informado', async ({ request }) => {
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
  const response = await request.patch(`/payments/${createdPayment.id}/status`, {
    headers: authHeaders,
    data: {
      reason: 'Tentativa de atualizar status sem informar o status'
    }
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(400);
  expectErrorResponse(body, 'INVALID_PAYLOAD', 'Payload inválido');
  expect(body.details.length).toBeGreaterThan(0);
});