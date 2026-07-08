import { APIRequestContext, expect } from '@playwright/test';
import { authHeaders } from './auth';

export async function cleanupPaymentsByTestRunId(
  request: APIRequestContext,
  testRunId: string
) {
  const response = await request.delete(
    `/test-data/payments?testRunId=${encodeURIComponent(testRunId)}`,
    {
      headers: authHeaders
    }
  );

  expect(response.status()).toBe(200);

  return response.json();
}