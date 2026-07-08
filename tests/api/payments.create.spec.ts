import { test, expect } from '@playwright/test';
import { authHeaders } from '../helpers/auth';
import { validPixPaymentPayload } from '../fixtures/payment.fixture';
import {
  expectPaymentCreatedResponse,
  expectErrorResponse
} from '../helpers/payment-assertions';

test('POST /payments deve criar pagamento PIX com sucesso', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();

  // Act
  const response = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(201);
  expectPaymentCreatedResponse(body, payload);
});

test('POST /payments deve retornar 401 quando não informar autenticação', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();

  // Act
  const response = await request.post('/payments', {
    data: payload
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(401);
  expectErrorResponse(
    body,
    'UNAUTHORIZED',
    'Token de autenticação não informado'
  );
});

test('POST /payments deve retornar 400 quando payload for inválido', async ({ request }) => {
  // Arrange
  const invalidPayload = {
    currency: 'BRL',
    paymentMethod: 'PIX'
  };

  // Act
  const response = await request.post('/payments', {
    headers: authHeaders,
    data: invalidPayload
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(400);
  expectErrorResponse(body, 'INVALID_PAYLOAD', 'Payload inválido');
  expect(body.details.length).toBeGreaterThan(0);
});