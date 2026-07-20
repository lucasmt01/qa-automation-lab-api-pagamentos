import type { KeyboardEvent } from 'react';
import type { Payment } from '../types/payment';
import { formatCurrency, formatDate } from '../utils/formatters';
import { methodLabels, statusLabels } from '../utils/payment-labels';

type PaymentTableProps = {
  payments: Payment[];
  selectedPaymentId: string;
  onSelectPayment: (paymentId: string) => void;
};

export function PaymentTable({
  payments,
  selectedPaymentId,
  onSelectPayment
}: PaymentTableProps) {
  function handleRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    paymentId: string
  ) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelectPayment(paymentId);
    }
  }

  return (
    <div className="table-wrapper" data-testid="payment-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Valor</th>
            <th>Método</th>
            <th>Status</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan={5}>
                <div className="empty-state" data-testid="empty-payments-state">
                  <strong>Nenhum pagamento encontrado</strong>
                  <span>
                    Ajuste a busca ou remova os filtros para visualizar os
                    pagamentos.
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            payments.map((payment) => {
              const isSelected = payment.id === selectedPaymentId;

              return (
                <tr
                  key={payment.id}
                  className={isSelected ? 'selected-row' : ''}
                  onClick={() => onSelectPayment(payment.id)}
                  onKeyDown={(event) => handleRowKeyDown(event, payment.id)}
                  tabIndex={0}
                  role="button"
                  aria-selected={isSelected}
                  aria-label={`Ver detalhes do pagamento ${payment.id}`}
                  data-testid={`payment-row-${payment.id}`}
                >
                  <td>{payment.id}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>{methodLabels[payment.paymentMethod]}</td>
                  <td>
                    <span
                      className={`status-badge status-${payment.status}`}
                      data-testid={`payment-status-${payment.id}`}
                    >
                      {statusLabels[payment.status]}
                    </span>
                  </td>
                  <td>{formatDate(payment.createdAt)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}