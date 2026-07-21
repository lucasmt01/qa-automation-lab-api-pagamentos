import type { Payment, PaymentStatus } from '../types/payment';
import { formatCurrency, formatDate } from '../utils/formatters';
import { methodLabels, statusLabels } from '../utils/payment-labels';

type PaymentDetailsProps = {
  selectedPayment?: Payment;
  isActionLoading: boolean;
  onUpdateStatus: (
    paymentId: string,
    nextStatus: Exclude<PaymentStatus, 'PENDING'>,
    reason: string
  ) => void | Promise<void>;
};

export function PaymentDetails({
  selectedPayment,
  isActionLoading,
  onUpdateStatus
}: PaymentDetailsProps) {
  if (!selectedPayment) {
    return (
      <section
        className="panel empty-details-panel"
        id="payment-details-section"
        tabIndex={-1}
      >
        <strong>Nenhum pagamento selecionado</strong>
        <span>
          Crie um pagamento ou selecione um registro na tabela para visualizar os
          detalhes.
        </span>
      </section>
    );
  }

  const actionButtonsDisabled =
    selectedPayment.status !== 'PENDING' || isActionLoading;

  return (
    <section
      className="panel details-panel"
      id="payment-details-section"
      tabIndex={-1}
      data-testid="payment-details"
    >
      <div className="panel-header">
        <div>
          <span className="section-label">Detalhes do pagamento</span>
          <h2>{selectedPayment.id}</h2>
        </div>
        <span
          className={`status-badge status-${selectedPayment.status}`}
          data-testid="selected-payment-status"
        >
          {statusLabels[selectedPayment.status]}
        </span>
      </div>

      <div className="details-grid">
        <div className="detail-card">
          <span>Valor</span>
          <strong>{formatCurrency(selectedPayment.amount)}</strong>
        </div>

        <div className="detail-card">
          <span>Método</span>
          <strong>{methodLabels[selectedPayment.paymentMethod]}</strong>
        </div>

        <div className="detail-card">
          <span>Documento</span>
          <strong>{selectedPayment.customerDocument}</strong>
        </div>

        <div className="detail-card">
          <span>Atualizado em</span>
          <strong>{formatDate(selectedPayment.updatedAt)}</strong>
        </div>
      </div>

      <div className="description-box">
        <span>Descrição</span>
        <p>{selectedPayment.description || 'Sem descrição informada.'}</p>
      </div>

      <div className="actions-row">
        <button
          type="button"
          className="success-button"
          data-testid="approve-payment-button"
          disabled={actionButtonsDisabled}
          onClick={() =>
            onUpdateStatus(
              selectedPayment.id,
              'APPROVED',
              'Pagamento aprovado pela interface web'
            )
          }
        >
          Aprovar
        </button>

        <button
          type="button"
          className="danger-button"
          data-testid="refuse-payment-button"
          disabled={actionButtonsDisabled}
          onClick={() =>
            onUpdateStatus(
              selectedPayment.id,
              'REFUSED',
              'Pagamento recusado pela interface web'
            )
          }
        >
          Recusar
        </button>

        <button
          type="button"
          className="neutral-button"
          data-testid="cancel-payment-button"
          disabled={actionButtonsDisabled}
          onClick={() =>
            onUpdateStatus(
              selectedPayment.id,
              'CANCELLED',
              'Cancelamento solicitado pela interface web'
            )
          }
        >
          Cancelar
        </button>
      </div>

      <div className="history-section" id="history">
        <h3>Histórico de status</h3>

        <div className="timeline">
          {selectedPayment.statusHistory.map((historyItem, index) => (
            <div className="timeline-item" key={`${historyItem.to}-${index}`}>
              <div className="timeline-marker" />
              <div>
                <strong>
                  {historyItem.from
                    ? `${statusLabels[historyItem.from]} → ${
                        statusLabels[historyItem.to]
                      }`
                    : statusLabels[historyItem.to]}
                </strong>
                <p>{historyItem.reason || 'Alteração de status registrada.'}</p>
                <small>{formatDate(historyItem.changedAt)}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}