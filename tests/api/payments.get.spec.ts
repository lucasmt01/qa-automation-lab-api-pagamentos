import { test, expect } from '@playwright/test';
import { authHeaders } from '../helpers/auth';
import { validPixPaymentPayload } from '../fixtures/payment.fixture';
import {
  expectPaymentFoundResponse,
  expectErrorResponse
} from '../helpers/payment-assertions';

test('GET /payments/:id deve consultar pagamento existente', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();

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

  const foundPayment = await getResponse.json();

  // Assert
  expect(getResponse.status()).toBe(200);
  expectPaymentFoundResponse(foundPayment, createdPayment);
});

test('GET /payments/:id deve retornar 404 para pagamento inexistente', async ({ request }) => {
  // Arrange
  const nonExistentPaymentId = 'pay_inexistente_123';

  // Act
  const response = await request.get(`/payments/${nonExistentPaymentId}`, {
    headers: authHeaders
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(404);
  expectErrorResponse(body, 'PAYMENT_NOT_FOUND', 'Pagamento não encontrado');
});