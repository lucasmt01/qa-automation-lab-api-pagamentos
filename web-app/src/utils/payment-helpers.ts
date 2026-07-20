import type {
  PaymentFormData,
  PaymentFormErrors,
  PaymentStatus,
  PaymentStatusHistory
} from '../types/payment';

export function generatePaymentId() {
  const randomPart = Math.random().toString(16).slice(2, 8).toUpperCase();

  return `pay_${randomPart}`;
}

export function createHistoryItem(
  from: PaymentStatus | null,
  to: PaymentStatus,
  reason: string
): PaymentStatusHistory {
  return {
    from,
    to,
    reason,
    changedAt: new Date().toISOString()
  };
}

export function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

export function getOnlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function validatePaymentForm(formData: PaymentFormData): PaymentFormErrors {
  const errors: PaymentFormErrors = {};
  const parsedAmount = Number(formData.amount.replace(',', '.'));
  const documentDigits = getOnlyDigits(formData.customerDocument);

  if (!formData.amount.trim()) {
    errors.amount = 'Informe o valor do pagamento.';
  } else if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    errors.amount = 'O valor deve ser maior que zero.';
  }

  if (!formData.customerDocument.trim()) {
    errors.customerDocument = 'Informe o documento do cliente.';
  } else if (documentDigits.length !== 11) {
    errors.customerDocument = 'O documento deve conter 11 dígitos.';
  }

  return errors;
}