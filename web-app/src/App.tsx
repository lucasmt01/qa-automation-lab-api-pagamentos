import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import './App.css';
import { mockPayments } from './data/mock-payments';
import type {
  Payment,
  PaymentFormData,
  PaymentMethod,
  PaymentStatus,
  PaymentStatusHistory
} from './types/payment';

type StatusFilter = PaymentStatus | 'ALL';

type FormErrors = Partial<Record<keyof PaymentFormData, string>>;

type FeedbackVariant = 'info' | 'success' | 'error';

const statusLabels: Record<PaymentStatus, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovado',
  REFUSED: 'Recusado',
  CANCELLED: 'Cancelado'
};

const methodLabels: Record<PaymentMethod, string> = {
  PIX: 'Pix',
  BOLETO: 'Boleto',
  CREDIT_CARD: 'Cartão'
};

const statusFilterLabels: Record<StatusFilter, string> = {
  ALL: 'Todos os status',
  PENDING: 'Pendentes',
  APPROVED: 'Aprovados',
  REFUSED: 'Recusados',
  CANCELLED: 'Cancelados'
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}

function generatePaymentId() {
  const randomPart = Math.random().toString(16).slice(2, 8).toUpperCase();

  return `pay_${randomPart}`;
}

function createHistoryItem(
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

function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}

function getOnlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function validateForm(formData: PaymentFormData): FormErrors {
  const errors: FormErrors = {};
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

function App() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    mockPayments[0]?.id ?? ''
  );

  const [feedbackMessage, setFeedbackMessage] = useState(
    'Dashboard carregado em modo simulado.'
  );
  const [feedbackVariant, setFeedbackVariant] =
    useState<FeedbackVariant>('info');

  const [formData, setFormData] = useState<PaymentFormData>({
    amount: '',
    paymentMethod: 'PIX',
    customerDocument: '',
    description: ''
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const filteredPayments = useMemo(() => {
    const normalizedSearch = normalizeSearch(searchTerm);

    return payments.filter((payment) => {
      const matchesStatus =
        statusFilter === 'ALL' || payment.status === statusFilter;

      const matchesSearch =
        !normalizedSearch ||
        payment.id.toLowerCase().includes(normalizedSearch) ||
        payment.customerDocument.toLowerCase().includes(normalizedSearch) ||
        payment.description.toLowerCase().includes(normalizedSearch) ||
        methodLabels[payment.paymentMethod]
          .toLowerCase()
          .includes(normalizedSearch) ||
        statusLabels[payment.status]
          .toLowerCase()
          .includes(normalizedSearch) ||
        payment.status.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [payments, searchTerm, statusFilter]);

  const selectedPayment = payments.find(
    (payment) => payment.id === selectedPaymentId
  );

  const summary = useMemo(() => {
    const totalAmount = payments.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    return {
      total: payments.length,
      pending: payments.filter((payment) => payment.status === 'PENDING').length,
      approved: payments.filter((payment) => payment.status === 'APPROVED')
        .length,
      totalAmount
    };
  }, [payments]);

  useEffect(() => {
    if (filteredPayments.length === 0) {
      setSelectedPaymentId('');
      return;
    }

    const selectedPaymentIsVisible = filteredPayments.some(
      (payment) => payment.id === selectedPaymentId
    );

    if (!selectedPaymentIsVisible) {
      setSelectedPaymentId(filteredPayments[0].id);
    }
  }, [filteredPayments, selectedPaymentId]);

  function showFeedback(message: string, variant: FeedbackVariant = 'info') {
    setFeedbackMessage(message);
    setFeedbackVariant(variant);
  }

  function handleInputChange(field: keyof PaymentFormData, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value
    }));

    if (formErrors[field]) {
      setFormErrors((current) => ({
        ...current,
        [field]: undefined
      }));
    }
  }

  function handleCreatePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showFeedback(
        'Não foi possível criar o pagamento. Revise os campos destacados.',
        'error'
      );
      return;
    }

    const parsedAmount = Number(formData.amount.replace(',', '.'));
    const now = new Date().toISOString();

    const newPayment: Payment = {
      id: generatePaymentId(),
      amount: parsedAmount,
      currency: 'BRL',
      paymentMethod: formData.paymentMethod,
      customerDocument: getOnlyDigits(formData.customerDocument),
      description: formData.description || 'Pagamento criado pela interface web',
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        createHistoryItem(null, 'PENDING', 'Pagamento criado pela interface web')
      ]
    };

    setPayments((current) => [newPayment, ...current]);
    setSelectedPaymentId(newPayment.id);
    setSearchTerm('');
    setStatusFilter('ALL');
    setFormData({
      amount: '',
      paymentMethod: 'PIX',
      customerDocument: '',
      description: ''
    });
    setFormErrors({});
    showFeedback(`Pagamento ${newPayment.id} criado com sucesso.`, 'success');
  }

  function updatePaymentStatus(
    paymentId: string,
    nextStatus: Exclude<PaymentStatus, 'PENDING'>,
    reason: string
  ) {
    let updatedPaymentId = '';

    setPayments((currentPayments) =>
      currentPayments.map((payment) => {
        if (payment.id !== paymentId || payment.status !== 'PENDING') {
          return payment;
        }

        const now = new Date().toISOString();
        updatedPaymentId = payment.id;

        return {
          ...payment,
          status: nextStatus,
          updatedAt: now,
          statusHistory: [
            ...payment.statusHistory,
            createHistoryItem(payment.status, nextStatus, reason)
          ]
        };
      })
    );

    if (updatedPaymentId) {
      showFeedback(
        `Pagamento ${updatedPaymentId} atualizado para ${statusLabels[nextStatus]}.`,
        'success'
      );
    }
  }

  function handleClearFilters() {
    setSearchTerm('');
    setStatusFilter('ALL');
    showFeedback('Filtros removidos.', 'info');
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">QA</div>
          <div>
            <strong>QA Payments</strong>
            <span>Automation Lab</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <a className="active" href="#dashboard">
            <span>⌂</span>
            Dashboard
          </a>
          <a href="#payments">
            <span>▤</span>
            Pagamentos
          </a>
          <a href="#create-payment">
            <span>＋</span>
            Novo pagamento
          </a>
          <a href="#payment-details-section">
            <span>◇</span>
            Detalhes
          </a>
          <a href="#history">
            <span>◷</span>
            Histórico
          </a>
        </nav>

        <div className="sidebar-footer">
          <span>Modo atual</span>
          <strong>Interface mockada</strong>
        </div>
      </aside>

      <main className="app-shell" id="dashboard">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">QA Automation Lab</span>

            <h1 className="hero-title">
              Dashboard de <span>Pagamentos</span>
            </h1>

            <p>
              Interface web para simular operações de uma API de pagamentos e
              preparar fluxos de testes E2E com Playwright.
            </p>
          </div>

          <div className="environment-pill" data-testid="environment-pill">
            <span className="environment-dot" />
            <div>
              <small>Ambiente</small>
              <strong>Modo simulado</strong>
            </div>
          </div>
        </section>

        <section className="summary-grid" aria-label="Resumo dos pagamentos">
          <article className="summary-card summary-total">
            <span>Total de pagamentos</span>
            <strong>{summary.total}</strong>
            <small>Registros carregados na sessão</small>
          </article>

          <article className="summary-card summary-pending">
            <span>Pendentes</span>
            <strong>{summary.pending}</strong>
            <small>Aguardando decisão</small>
          </article>

          <article className="summary-card summary-approved">
            <span>Aprovados</span>
            <strong>{summary.approved}</strong>
            <small>Fluxos concluídos com sucesso</small>
          </article>

          <article className="summary-card summary-volume">
            <span>Total movimentado</span>
            <strong>{formatCurrency(summary.totalAmount)}</strong>
            <small>Soma dos pagamentos exibidos</small>
          </article>
        </section>

        <div
          className={`feedback-bar feedback-${feedbackVariant}`}
          role={feedbackVariant === 'error' ? 'alert' : 'status'}
          aria-live={feedbackVariant === 'error' ? 'assertive' : 'polite'}
          data-testid="feedback-message"
        >
          <span className="feedback-icon">
            {feedbackVariant === 'success' && '✓'}
            {feedbackVariant === 'error' && '!'}
            {feedbackVariant === 'info' && 'i'}
          </span>
          <span>{feedbackMessage}</span>
        </div>

        <section className="content-grid">
          <article className="panel create-payment-panel" id="create-payment">
            <div className="panel-header">
              <div>
                <span className="section-label">Novo pagamento</span>
                <h2>Criar transação</h2>
              </div>
              <span className="chip">POST /payments</span>
            </div>

            <form
              className="payment-form"
              onSubmit={handleCreatePayment}
              noValidate
            >
              <label htmlFor="amount">
                Valor
                <input
                  id="amount"
                  data-testid="amount-input"
                  className={formErrors.amount ? 'field-error' : ''}
                  type="text"
                  placeholder="150,75"
                  value={formData.amount}
                  onChange={(event) =>
                    handleInputChange('amount', event.target.value)
                  }
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
                  onChange={(event) =>
                    handleInputChange(
                      'paymentMethod',
                      event.target.value as PaymentMethod
                    )
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
                  onChange={(event) =>
                    handleInputChange('customerDocument', event.target.value)
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
                  onChange={(event) =>
                    handleInputChange('description', event.target.value)
                  }
                />
              </label>

              <button
                type="submit"
                className="primary-button"
                data-testid="create-payment-button"
              >
                Criar pagamento
              </button>

              <p className="form-hint">
                Campos obrigatórios: valor maior que zero e documento com 11
                dígitos.
              </p>
            </form>
          </article>

          <article className="panel payments-panel" id="payments">
            <div className="panel-header">
              <div>
                <span className="section-label">Pagamentos recentes</span>
                <h2>Operações</h2>
              </div>
              <span className="chip">{filteredPayments.length} registros</span>
            </div>

            <div className="filter-bar">
              <label htmlFor="paymentSearch">
                Buscar
                <input
                  id="paymentSearch"
                  data-testid="payment-search-input"
                  type="text"
                  placeholder="ID, documento, método, status ou descrição"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </label>

              <label htmlFor="statusFilter">
                Status
                <select
                  id="statusFilter"
                  data-testid="status-filter-select"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as StatusFilter)
                  }
                >
                  <option value="ALL">Todos os status</option>
                  <option value="PENDING">Pendentes</option>
                  <option value="APPROVED">Aprovados</option>
                  <option value="REFUSED">Recusados</option>
                  <option value="CANCELLED">Cancelados</option>
                </select>
              </label>

              <button
                type="button"
                className="secondary-button"
                data-testid="clear-filters-button"
                onClick={handleClearFilters}
              >
                Limpar filtros
              </button>
            </div>

            <div className="active-filter-info" data-testid="active-filter-info">
              Exibindo {filteredPayments.length} de {payments.length}{' '}
              pagamentos. Status: {statusFilterLabels[statusFilter]}.
            </div>

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
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div
                          className="empty-state"
                          data-testid="empty-payments-state"
                        >
                          <strong>Nenhum pagamento encontrado</strong>
                          <span>
                            Ajuste a busca ou remova os filtros para visualizar
                            os pagamentos.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className={
                          payment.id === selectedPaymentId ? 'selected-row' : ''
                        }
                        onClick={() => setSelectedPaymentId(payment.id)}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        {selectedPayment ? (
          <section className="panel details-panel" id="payment-details-section" data-testid="payment-details">
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
              <p>{selectedPayment.description}</p>
            </div>

            <div className="actions-row">
              <button
                type="button"
                className="success-button"
                data-testid="approve-payment-button"
                disabled={selectedPayment.status !== 'PENDING'}
                onClick={() =>
                  updatePaymentStatus(
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
                disabled={selectedPayment.status !== 'PENDING'}
                onClick={() =>
                  updatePaymentStatus(
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
                disabled={selectedPayment.status !== 'PENDING'}
                onClick={() =>
                  updatePaymentStatus(
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
                  <div
                    className="timeline-item"
                    key={`${historyItem.to}-${index}`}
                  >
                    <div className="timeline-marker" />
                    <div>
                      <strong>
                        {historyItem.from
                          ? `${statusLabels[historyItem.from]} → ${
                              statusLabels[historyItem.to]
                            }`
                          : statusLabels[historyItem.to]}
                      </strong>
                      <p>{historyItem.reason}</p>
                      <small>{formatDate(historyItem.changedAt)}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="panel empty-details-panel">
            <strong>Nenhum pagamento selecionado</strong>
            <span>
              Selecione um pagamento na tabela ou remova os filtros aplicados.
            </span>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;