export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REFUSED' | 'CANCELLED';

export type PaymentMethod = 'PIX' | 'BOLETO' | 'CREDIT_CARD';

export type PaymentStatusHistory = {
  from: PaymentStatus | null;
  to: PaymentStatus;
  changedAt: string;
  reason: string;
};

export type Payment = {
  id: string;
  amount: number;
  currency: 'BRL';
  paymentMethod: PaymentMethod;
  customerDocument: string;
  description: string;
  status: PaymentStatus;
  statusHistory: PaymentStatusHistory[];
  createdAt: string;
  updatedAt: string;
};

export type PaymentFormData = {
  amount: string;
  paymentMethod: PaymentMethod;
  customerDocument: string;
  description: string;
};