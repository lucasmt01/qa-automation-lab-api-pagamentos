import { generateTestRunId } from '../helpers/test-run';

export function validPixPaymentPayload(testRunId = generateTestRunId()) {
  return {
    amount: 150.75,
    currency: 'BRL',
    paymentMethod: 'PIX',
    customerDocument: '12345678909',
    description: 'Pagamento PIX criado pela automação',
    testRunId
  };
}