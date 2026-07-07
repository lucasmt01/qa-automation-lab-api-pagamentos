import { testRunId } from '../helpers/test-run';

export function validPixPaymentPayload() {
  return {
    amount: 150.75,
    currency: 'BRL',
    paymentMethod: 'PIX',
    customerDocument: '12345678909',
    description: 'Pagamento PIX criado pela automaÃ§Ã£o',
    testRunId
  };
}
