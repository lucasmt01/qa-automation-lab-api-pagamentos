import { expect, type APIRequestContext, type Page, type TestInfo } from '@playwright/test';
import { authHeaders } from './auth';
import { cleanupPaymentsByTestRunId } from './cleanup';

export const WEB_APP_BASE_URL =
  process.env.WEB_APP_BASE_URL || 'http://localhost:5173';

type CreatePaymentViaApiData = {
  amount?: number;
  paymentMethod?: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
  customerDocument?: string;
  description?: string;
};

type CreatedPayment = {
  id: string;
  amount: number;
  currency: 'BRL';
  paymentMethod: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
  customerDocument: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REFUSED' | 'CANCELLED';
  testRunId: string;
  createdAt: string;
  updatedAt: string;
};

export function createE2eTestRunId(testInfo: TestInfo) {
  const normalizedTitle = testInfo.title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40);

  return `run_e2e_${normalizedTitle}_${Date.now()}_${testInfo.retry}`;
}

export function buildDashboardUrl(testRunId: string) {
  return `${WEB_APP_BASE_URL}/?testRunId=${encodeURIComponent(testRunId)}`;
}

export async function openDashboard(page: Page, testRunId: string) {
  await page.goto(buildDashboardUrl(testRunId));

  await expect(page).toHaveURL(new RegExp(`testRunId=${testRunId}`));

  await expect(page.getByTestId('feedback-message')).toBeVisible();
}

export async function createPaymentViaApi(
  request: APIRequestContext,
  testRunId: string,
  data: CreatePaymentViaApiData = {}
): Promise<CreatedPayment> {
  const response = await request.post('/payments', {
    headers: authHeaders,
    data: {
      amount: data.amount ?? 150.75,
      currency: 'BRL',
      paymentMethod: data.paymentMethod ?? 'PIX',
      customerDocument: data.customerDocument ?? '12345678909',
      description: data.description ?? 'Pagamento criado para teste E2E',
      testRunId
    }
  });

  expect(response.status()).toBe(201);

  return response.json();
}

export async function updatePaymentStatusViaApi(
  request: APIRequestContext,
  paymentId: string,
  status: 'APPROVED' | 'REFUSED',
  reason = 'Status atualizado durante preparação do teste E2E'
) {
  const response = await request.patch(`/payments/${paymentId}/status`, {
    headers: authHeaders,
    data: {
      status,
      reason
    }
  });

  expect(response.status()).toBe(200);

  return response.json();
}

export async function cleanupE2ePayments(
  request: APIRequestContext,
  testRunId: string
) {
  await cleanupPaymentsByTestRunId(request, testRunId);
}