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

test('GET /payments deve listar pagamentos por testRunId', async ({ request }) => {
  const testRunId = `run_list_${Date.now()}`;
  testRunIdsToCleanup.push(testRunId);

  const firstPayload = validPixPaymentPayload(testRunId);
  const secondPayload = {
    ...validPixPaymentPayload(testRunId),
    amount: 299.9,
    customerDocument: '98765432100',
    description: 'Segundo pagamento para listagem'
  };

  const firstCreateResponse = await request.post('/payments', {
    headers: authHeaders,
    data: firstPayload
  });

  const secondCreateResponse = await request.post('/payments', {
    headers: authHeaders,
    data: secondPayload
  });

  expect(firstCreateResponse.status()).toBe(201);
  expect(secondCreateResponse.status()).toBe(201);

  const listResponse = await request.get(
    `/payments?testRunId=${encodeURIComponent(testRunId)}`,
    {
      headers: authHeaders
    }
  );

  const body = await listResponse.json();

  expect(listResponse.status()).toBe(200);
  expect(body.total).toBe(2);
  expect(Array.isArray(body.items)).toBeTruthy();
  expect(body.items).toHaveLength(2);

  expect(
    body.items.every((payment: any) => payment.testRunId === testRunId)
  ).toBe(true);

  expect(body.items[0]._id).toBeUndefined();
  expect(body.items[1]._id).toBeUndefined();
});

test('GET /payments deve retornar lista vazia quando não houver registros para o testRunId', async ({
  request
}) => {
  const testRunId = `run_empty_${Date.now()}`;

  const response = await request.get(
    `/payments?testRunId=${encodeURIComponent(testRunId)}`,
    {
      headers: authHeaders
    }
  );

  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.total).toBe(0);
  expect(body.items).toEqual([]);
});

test('GET /payments deve retornar 400 quando testRunId não for informado', async ({
  request
}) => {
  const response = await request.get('/payments', {
    headers: authHeaders
  });

  const body = await response.json();

  expect(response.status()).toBe(400);
  expectErrorResponse(
    body,
    'INVALID_TEST_RUN_ID',
    'O parâmetro testRunId é obrigatório'
  );
});

test('GET /payments deve retornar 401 sem autenticação', async ({ request }) => {
  const response = await request.get('/payments?testRunId=run_sem_auth');

  const body = await response.json();

  expect(response.status()).toBe(401);
  expectErrorResponse(
    body,
    'UNAUTHORIZED',
    'Token de autenticação não informado'
  );
});