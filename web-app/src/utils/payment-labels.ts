import type {
  PaymentMethod,
  PaymentStatus,
  PaymentStatusFilter
} from '../types/payment';

export const statusLabels: Record<PaymentStatus, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovado',
  REFUSED: 'Recusado',
  CANCELLED: 'Cancelado'
};

export const methodLabels: Record<PaymentMethod, string> = {
  PIX: 'Pix',
  BOLETO: 'Boleto',
  CREDIT_CARD: 'Cartão'
};

export const statusFilterLabels: Record<PaymentStatusFilter, string> = {
  ALL: 'Todos os status',
  PENDING: 'Pendentes',
  APPROVED: 'Aprovados',
  REFUSED: 'Recusados',
  CANCELLED: 'Cancelados'
};