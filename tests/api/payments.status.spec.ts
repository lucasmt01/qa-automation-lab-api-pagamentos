import { test, expect } from '@playwright/test';
import { authHeaders } from '../helpers/auth';
import { validPixPaymentPayload } from '../fixtures/payment.fixture';
import { cleanupPaymentsByTestRunId } from '../helpers/cleanup';
import {
  expectErrorResponse,
  expectPaymentStatusUpdatedResponse
} from '../helpers/payment-assertions';

let testRunIdsToCleanup: string[] = [];

test.afterEach(async ({ request }) => {
  for (const testRunId of testRunIdsToCleanup) {
    await cleanupPaymentsByTestRunId(request, testRunId);
  }

  testRunIdsToCleanup = [];
});

test('PATCH /payments/:id/status deve atualizar pagamento para APPROVED', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  testRunIdsToCleanup.push(payload.testRunId);

  const createResponse = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  expect(createResponse.status()).toBe(201);

  const createdPayment = await createResponse.json();

  const reason = 'Pagamento aprovado pela simulação';

  // Act
  const updateResponse = await request.patch(`/payments/${createdPayment.id}/status`, {
    headers: authHeaders,
    data: {
      status: 'APPROVED',
      reason
    }
  });

  const updatedPayment = await updateResponse.json();

  // Assert
  expect(updateResponse.status()).toBe(200);
  expectPaymentStatusUpdatedResponse(
    updatedPayment,
    'APPROVED',
    createdPayment.updatedAt,
    reason
  );

  const getResponse = await request.get(`/payments/${createdPayment.id}`, {
    headers: authHeaders
  });

  const foundPayment = await getResponse.json();

  expect(getResponse.status()).toBe(200);
  expect(foundPayment.status).toBe('APPROVED');
});

test('PATCH /payments/:id/status deve atualizar pagamento para REFUSED', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  testRunIdsToCleanup.push(payload.testRunId);

  const createResponse = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  expect(createResponse.status()).toBe(201);

  const createdPayment = await createResponse.json();

  const reason = 'Pagamento recusado pela simulação';

  // Act
  const updateResponse = await request.patch(`/payments/${createdPayment.id}/status`, {
    headers: authHeaders,
    data: {
      status: 'REFUSED',
      reason
    }
  });

  const updatedPayment = await updateResponse.json();

  // Assert
  expect(updateResponse.status()).toBe(200);
  expectPaymentStatusUpdatedResponse(
    updatedPayment,
    'REFUSED',
    createdPayment.updatedAt,
    reason
  );

  const getResponse = await request.get(`/payments/${createdPayment.id}`, {
    headers: authHeaders
  });

  const foundPayment = await getResponse.json();

  expect(getResponse.status()).toBe(200);
  expect(foundPayment.status).toBe('REFUSED');
});

test('PATCH /payments/:id/status deve retornar 404 para pagamento inexistente', async ({ request }) => {
  // Arrange
  const nonExistentPaymentId = 'pay_inexistente_status_123';

  // Act
  const response = await request.patch(`/payments/${nonExistentPaymentId}/status`, {
    headers: authHeaders,
    data: {
      status: 'APPROVED',
      reason: 'Tentativa de atualizar pagamento inexistente'
    }
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(404);
  expectErrorResponse(body, 'PAYMENT_NOT_FOUND', 'Pagamento não encontrado');
});

test('PATCH /payments/:id/status deve retornar 400 para status inválido', async ({ request }) => {
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
      status: 'CANCELLED',
      reason: 'Status inválido para este endpoint'
    }
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(400);
  expectErrorResponse(body, 'INVALID_PAYLOAD', 'Payload inválido');
  expect(body.details.length).toBeGreaterThan(0);
});

test('PATCH /payments/:id/status deve retornar 409 ao tentar atualizar pagamento já finalizado', async ({ request }) => {
  // Arrange
  const payload = validPixPaymentPayload();
  testRunIdsToCleanup.push(payload.testRunId);

  const createResponse = await request.post('/payments', {
    headers: authHeaders,
    data: payload
  });

  expect(createResponse.status()).toBe(201);

  const createdPayment = await createResponse.json();

  const firstUpdateResponse = await request.patch(`/payments/${createdPayment.id}/status`, {
    headers: authHeaders,
    data: {
      status: 'APPROVED',
      reason: 'Pagamento aprovado pela simulação'
    }
  });

  expect(firstUpdateResponse.status()).toBe(200);

  // Act
  const secondUpdateResponse = await request.patch(`/payments/${createdPayment.id}/status`, {
    headers: authHeaders,
    data: {
      status: 'REFUSED',
      reason: 'Tentativa de alterar pagamento já finalizado'
    }
  });

  const body = await secondUpdateResponse.json();

  // Assert
  expect(secondUpdateResponse.status()).toBe(409);
  expectErrorResponse(
    body,
    'PAYMENT_STATUS_ALREADY_FINALIZED',
    'Pagamento já possui status final e não pode ser atualizado'
  );
});