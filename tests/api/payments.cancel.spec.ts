import { test, expect } from '@playwright/test';
import { authHeaders } from '../helpers/auth';
import { validPixPaymentPayload } from '../fixtures/payment.fixture';
import { cleanupPaymentsByTestRunId } from '../helpers/cleanup';
import {
  expectErrorResponse,
  expectPaymentCancelledResponse
} from '../helpers/payment-assertions';

let testRunIdsToCleanup: string[] = [];

test.afterEach(async ({ request }) => {
  for (const testRunId of testRunIdsToCleanup) {
    await cleanupPaymentsByTestRunId(request, testRunId);
  }

  testRunIdsToCleanup = [];
});

test('POST /payments/:id/cancel deve cancelar pagamento PENDING com sucesso', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  testRunIdsToCleanup.push(payload.testRunId);

  const createResponse = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  expect(createResponse.status()).toBe(201);

  const createdPayment = await createResponse.json();

  const reason = 'Cancelamento solicitado pela simulação';

  // Act
  const cancelResponse = await request.post(`/payments/${createdPayment.id}/cancel`, {
    headers: authHeaders,
    data: {
      reason
    }
  });

  const cancelledPayment = await cancelResponse.json();

  // Assert
  expect(cancelResponse.status()).toBe(200);
  expectPaymentCancelledResponse(
    cancelledPayment,
    createdPayment.updatedAt,
    reason
  );

  const getResponse = await request.get(`/payments/${createdPayment.id}`, {
    headers: authHeaders
  });

  const foundPayment = await getResponse.json();

  expect(getResponse.status()).toBe(200);
  expect(foundPayment.status).toBe('CANCELLED');
});

test('POST /payments/:id/cancel deve retornar 404 para pagamento inexistente', async ({ request }) => {
  // Arrange
  const nonExistentPaymentId = 'pay_inexistente_cancel_123';

  // Act
  const response = await request.post(`/payments/${nonExistentPaymentId}/cancel`, {
    headers: authHeaders,
    data: {
      reason: 'Tentativa de cancelar pagamento inexistente'
    }
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(404);
  expectErrorResponse(body, 'PAYMENT_NOT_FOUND', 'Pagamento não encontrado');
});

test('POST /payments/:id/cancel deve retornar 409 ao tentar cancelar pagamento APPROVED', async ({ request }) => {
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
      reason: 'Pagamento aprovado pela simulação'
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
  expectErrorResponse(
    body,
    'PAYMENT_CANNOT_BE_CANCELLED',
    'Pagamento não pode ser cancelado no status atual'
  );
});

test('POST /payments/:id/cancel deve retornar 409 ao tentar cancelar pagamento REFUSED', async ({ request }) => {
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
      status: 'REFUSED',
      reason: 'Pagamento recusado pela simulação'
    }
  });

  expect(updateResponse.status()).toBe(200);

  // Act
  const cancelResponse = await request.post(`/payments/${createdPayment.id}/cancel`, {
    headers: authHeaders,
    data: {
      reason: 'Tentativa de cancelar pagamento recusado'
    }
  });

  const body = await cancelResponse.json();

  // Assert
  expect(cancelResponse.status()).toBe(409);
  expectErrorResponse(
    body,
    'PAYMENT_CANNOT_BE_CANCELLED',
    'Pagamento não pode ser cancelado no status atual'
  );
});

test('POST /payments/:id/cancel deve retornar 409 ao tentar cancelar pagamento já CANCELLED', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  testRunIdsToCleanup.push(payload.testRunId);

  const createResponse = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  expect(createResponse.status()).toBe(201);

  const createdPayment = await createResponse.json();

  const firstCancelResponse = await request.post(`/payments/${createdPayment.id}/cancel`, {
    headers: authHeaders,
    data: {
      reason: 'Cancelamento solicitado pela simulação'
    }
  });

  expect(firstCancelResponse.status()).toBe(200);

  // Act
  const secondCancelResponse = await request.post(`/payments/${createdPayment.id}/cancel`, {
    headers: authHeaders,
    data: {
      reason: 'Tentativa de cancelar pagamento já cancelado'
    }
  });

  const body = await secondCancelResponse.json();

  // Assert
  expect(secondCancelResponse.status()).toBe(409);
  expectErrorResponse(
    body,
    'PAYMENT_CANNOT_BE_CANCELLED',
    'Pagamento não pode ser cancelado no status atual'
  );
});