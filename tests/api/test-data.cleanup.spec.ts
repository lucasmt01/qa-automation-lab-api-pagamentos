import { test, expect } from '@playwright/test';
import { authHeaders } from '../helpers/auth';
import { validPixPaymentPayload } from '../fixtures/payment.fixture';
import { cleanupPaymentsByTestRunId } from '../helpers/cleanup';
import {
  expectCleanupResponse,
  expectErrorResponse
} from '../helpers/payment-assertions';

let testRunIdsToCleanup: string[] = [];

test.afterEach(async ({ request }) => {
  for (const testRunId of testRunIdsToCleanup) {
    await cleanupPaymentsByTestRunId(request, testRunId);
  }

  testRunIdsToCleanup = [];
});

test('DELETE /test-data/payments deve expurgar pagamentos por testRunId', async ({ request }) => {
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
  const cleanupResponse = await request.delete(
    `/test-data/payments?testRunId=${encodeURIComponent(payload.testRunId)}`,
    {
      headers: authHeaders
    }
  );

  const cleanupBody = await cleanupResponse.json();

  // Assert
  expect(cleanupResponse.status()).toBe(200);
  expectCleanupResponse(cleanupBody, payload.testRunId, 1);

  const getResponse = await request.get(`/payments/${createdPayment.id}`, {
    headers: authHeaders
  });

  const getBody = await getResponse.json();

  expect(getResponse.status()).toBe(404);
  expectErrorResponse(getBody, 'PAYMENT_NOT_FOUND', 'Pagamento não encontrado');
});

test('DELETE /test-data/payments deve retornar 400 quando testRunId não for informado', async ({ request }) => {
  // Arrange
  // Não há massa para preparar.

  // Act
  const response = await request.delete('/test-data/payments', {
    headers: authHeaders
  });

  const body = await response.json();

  // Assert
  expect(response.status()).toBe(400);
  expectErrorResponse(
    body,
    'INVALID_TEST_RUN_ID',
    'O parâmetro testRunId é obrigatório'
  );
});