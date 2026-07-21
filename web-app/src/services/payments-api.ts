import type { Payment, PaymentMethod, PaymentStatus } from '../types/payment';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000';

const API_TOKEN = import.meta.env.VITE_API_TOKEN || 'qa-lab-token';

export const DEFAULT_WEB_TEST_RUN_ID =
  import.meta.env.VITE_TEST_RUN_ID || 'run_web_local';

type ApiErrorBody = {
  code?: string;
  message?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
};

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(status: number, body: ApiErrorBody | null) {
    super(body?.message || 'Erro ao comunicar com a API');

    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

type ListPaymentsResponse = {
  items: Payment[];
  total: number;
};

type CreatePaymentRequest = {
  amount: number;
  paymentMethod: PaymentMethod;
  customerDocument: string;
  description?: string;
};

type UpdatePaymentStatusRequest = {
  status: Extract<PaymentStatus, 'APPROVED' | 'REFUSED'>;
  reason?: string;
};

type CancelPaymentRequest = {
  reason?: string;
};

function buildUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

function getDefaultHeaders(hasBody: boolean) {
  return {
    Authorization: `Bearer ${API_TOKEN}`,
    ...(hasBody ? { 'Content-Type': 'application/json' } : {})
  };
}

async function parseResponseBody(response: Response) {
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return null;
}

async function requestApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      ...getDefaultHeaders(Boolean(options.body)),
      ...options.headers
    }
  });

  const body = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(response.status, body);
  }

  return body as T;
}

export function getCurrentTestRunId() {
  const testRunIdFromUrl = new URLSearchParams(window.location.search).get(
    'testRunId'
  );

  return testRunIdFromUrl || DEFAULT_WEB_TEST_RUN_ID;
}

export async function listPayments(testRunId = getCurrentTestRunId()) {
  const query = new URLSearchParams({
    testRunId
  });

  return requestApi<ListPaymentsResponse>(`/payments?${query.toString()}`);
}

export async function createPayment(
  data: CreatePaymentRequest,
  testRunId = getCurrentTestRunId()
) {
  return requestApi<Payment>('/payments', {
    method: 'POST',
    body: JSON.stringify({
      amount: data.amount,
      currency: 'BRL',
      paymentMethod: data.paymentMethod,
      customerDocument: data.customerDocument,
      description: data.description,
      testRunId
    })
  });
}

export async function updatePaymentStatus(
  paymentId: string,
  data: UpdatePaymentStatusRequest
) {
  return requestApi<Payment>(`/payments/${paymentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function cancelPayment(
  paymentId: string,
  data: CancelPaymentRequest
) {
  return requestApi<Payment>(`/payments/${paymentId}/cancel`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}