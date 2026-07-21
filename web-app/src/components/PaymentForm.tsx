import type { FormEvent } from 'react';
import type {
  PaymentFormData,
  PaymentFormErrors,
  PaymentMethod
} from '../types/payment';

type PaymentFormProps = {
  formData: PaymentFormData;
  formErrors: PaymentFormErrors;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onInputChange: (field: keyof PaymentFormData, value: string) => void;
};

export function PaymentForm({
  formData,
  formErrors,
  isSubmitting,
  onSubmit,
  onInputChange
}: PaymentFormProps) {
  return (
    <article className="panel create-payment-panel" id="create-payment">
      <div className="panel-header">
        <div>
          <span className="section-label">Novo pagamento</span>
          <h2>Criar transação</h2>
        </div>
        <span className="chip">POST /payments</span>
      </div>

      <form className="payment-form" onSubmit={onSubmit} noValidate>
        <label htmlFor="amount">
          Valor
          <input
            id="amount"
            data-testid="amount-input"
            className={formErrors.amount ? 'field-error' : ''}
            type="text"
            placeholder="150,75"
            value={formData.amount}
            disabled={isSubmitting}
            onChange={(event) => onInputChange('amount', event.target.value)}
          />
          {formErrors.amount && (
            <small className="error-message" data-testid="amount-error">
              {formErrors.amount}
            </small>
          )}
        </label>

        <label htmlFor="paymentMethod">
          Método
          <select
            id="paymentMethod"
            data-testid="payment-method-select"
            value={formData.paymentMethod}
            disabled={isSubmitting}
            onChange={(event) =>
              onInputChange('paymentMethod', event.target.value as PaymentMethod)
            }
          >
            <option value="PIX">Pix</option>
            <option value="BOLETO">Boleto</option>
            <option value="CREDIT_CARD">Cartão</option>
          </select>
        </label>

        <label htmlFor="customerDocument">
          Documento do cliente
          <input
            id="customerDocument"
            data-testid="customer-document-input"
            className={formErrors.customerDocument ? 'field-error' : ''}
            type="text"
            placeholder="12345678909"
            value={formData.customerDocument}
            disabled={isSubmitting}
            onChange={(event) =>
              onInputChange('customerDocument', event.target.value)
            }
          />
          {formErrors.customerDocument && (
            <small
              className="error-message"
              data-testid="customer-document-error"
            >
              {formErrors.customerDocument}
            </small>
          )}
        </label>

        <label htmlFor="description">
          Descrição
          <textarea
            id="description"
            data-testid="description-input"
            placeholder="Descrição do pagamento"
            value={formData.description}
            disabled={isSubmitting}
            onChange={(event) => onInputChange('description', event.target.value)}
          />
        </label>

        <button
          type="submit"
          className="primary-button"
          data-testid="create-payment-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Criando...' : 'Criar pagamento'}
        </button>

        <p className="form-hint">
          Campos obrigatórios: valor maior que zero e documento com 11 dígitos.
        </p>
      </form>
    </article>
  );
}