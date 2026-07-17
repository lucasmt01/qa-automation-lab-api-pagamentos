import type { Payment } from '../types/payment';

export const mockPayments: Payment[] = [
  {
    id: 'pay_8F41A2',
    amount: 150.75,
    currency: 'BRL',
    paymentMethod: 'PIX',
    customerDocument: '12345678909',
    description: 'Pagamento PIX criado pela automação',
    status: 'PENDING',
    createdAt: '2026-07-17T12:00:00.000Z',
    updatedAt: '2026-07-17T12:00:00.000Z',
    statusHistory: [
      {
        from: null,
        to: 'PENDING',
        changedAt: '2026-07-17T12:00:00.000Z',
        reason: 'Pagamento criado'
      }
    ]
  },
  {
    id: 'pay_2D91BC',
    amount: 420,
    currency: 'BRL',
    paymentMethod: 'CREDIT_CARD',
    customerDocument: '98765432100',
    description: 'Compra aprovada via cartão',
    status: 'APPROVED',
    createdAt: '2026-07-17T10:35:00.000Z',
    updatedAt: '2026-07-17T10:36:10.000Z',
    statusHistory: [
      {
        from: null,
        to: 'PENDING',
        changedAt: '2026-07-17T10:35:00.000Z',
        reason: 'Pagamento criado'
      },
      {
        from: 'PENDING',
        to: 'APPROVED',
        changedAt: '2026-07-17T10:36:10.000Z',
        reason: 'Pagamento aprovado'
      }
    ]
  },
  {
    id: 'pay_7AC923',
    amount: 89.9,
    currency: 'BRL',
    paymentMethod: 'BOLETO',
    customerDocument: '45678912300',
    description: 'Pagamento cancelado pelo usuário',
    status: 'CANCELLED',
    createdAt: '2026-07-16T19:22:00.000Z',
    updatedAt: '2026-07-16T19:30:00.000Z',
    statusHistory: [
      {
        from: null,
        to: 'PENDING',
        changedAt: '2026-07-16T19:22:00.000Z',
        reason: 'Pagamento criado'
      },
      {
        from: 'PENDING',
        to: 'CANCELLED',
        changedAt: '2026-07-16T19:30:00.000Z',
        reason: 'Cancelamento solicitado'
      }
    ]
  },
  {
    id: 'pay_3C88FF',
    amount: 99.99,
    currency: 'BRL',
    paymentMethod: 'CREDIT_CARD',
    customerDocument: '74185296300',
    description: 'Pagamento recusado por regra de negócio',
    status: 'REFUSED',
    createdAt: '2026-07-15T18:45:00.000Z',
    updatedAt: '2026-07-15T18:46:00.000Z',
    statusHistory: [
      {
        from: null,
        to: 'PENDING',
        changedAt: '2026-07-15T18:45:00.000Z',
        reason: 'Pagamento criado'
      },
      {
        from: 'PENDING',
        to: 'REFUSED',
        changedAt: '2026-07-15T18:46:00.000Z',
        reason: 'Pagamento recusado'
      }
    ]
  }
];