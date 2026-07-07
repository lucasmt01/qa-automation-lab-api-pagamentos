export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REFUSED' | 'CANCELLED';

export type PaymentMethod = 'PIX' | 'BOLETO' | 'CREDIT_CARD';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  customerDocument: string;
  description?: string;
  status: PaymentStatus;
  testRunId: string;
  createdAt: string;
  updatedAt: string;
}
