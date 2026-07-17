import { test, expect } from '@playwright/test';
import { validPixPaymentPayload } from '../fixtures/payment.fixture';
import { expectErrorResponse } from '../helpers/payment-assertions';

test('CT-031 - POST /payments deve retornar 401 quando token não for informado', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();

  // Act
  const response = await request.post('/payments', {
    data: payload
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(401);
  expectErrorResponse(body, 'UNAUTHORIZED', 'Token de autenticação não informado');
});

test('CT-032 - POST /payments deve retornar 403 quando token for inválido', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();

  // Act
  const response = await request.post('/payments', {
    headers: {
      Authorization: 'Bearer token-invalido'
    },
    data: payload
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(403);
  expectErrorResponse(body, 'FORBIDDEN', 'Token de autenticação inválido');
});

test('CT-033 - GET /payments/:id deve retornar 401 quando token não for informado', async ({ request }) => {
  // Arrange
  const paymentId = 'pay_auth_test_123';

  // Act
  const response = await request.get(`/payments/${paymentId}`);

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(401);
  expectErrorResponse(body, 'UNAUTHORIZED', 'Token de autenticação não informado');
});

test('CT-034 - DELETE /test-data/payments deve retornar 401 quando token não for informado', async ({ request }) => {
  // Arrange
  const testRunId = 'run_auth_test_001';

  // Act
  const response = await request.delete(`/test-data/payments?testRunId=${testRunId}`);

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(401);
  expectErrorResponse(body, 'UNAUTHORIZED', 'Token de autenticação não informado');
});