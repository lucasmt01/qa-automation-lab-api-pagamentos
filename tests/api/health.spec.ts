import { test, expect } from '@playwright/test';

test('GET /health deve retornar status UP', async ({ request }) => {
  const response = await request.get('/health');

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.status).toBe('UP');
  expect(body.service).toBe('qa-lab-payments-api');
});
