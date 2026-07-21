import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import './App.css';

import { FeedbackMessage } from './components/FeedbackMessage';
import { HeroSection } from './components/HeroSection';
import { PaymentDetails } from './components/PaymentDetails';
import { PaymentFilters } from './components/PaymentFilters';
import { PaymentForm } from './components/PaymentForm';
import { PaymentTable } from './components/PaymentTable';
import { Sidebar } from './components/Sidebar';
import { SummaryCards } from './components/SummaryCards';
import {
  ApiError,
  cancelPayment,
  createPayment,
  listPayments,
  updatePaymentStatus
} from './services/payments-api';
import type {
  Payment,
  PaymentFormData,
  PaymentFormErrors,
  PaymentStatus,
  PaymentStatusFilter
} from './types/payment';
import type { FeedbackVariant } from './types/ui';
import {
  getOnlyDigits,
  normalizeSearch,
  validatePaymentForm
} from './utils/payment-helpers';
import { methodLabels, statusLabels } from './utils/payment-labels';

function getFriendlyApiErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    const code = error.body?.code;
    const message = error.body?.message || error.message;

    return code ? `${message} (${code})` : `Erro ${error.status}: ${message}`;
  }

  if (error instanceof TypeError) {
    return 'Não foi possível conectar com a API. Verifique se a API está rodando e se o endereço está correto.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Erro inesperado ao comunicar com a API.';
}

function App() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState('');

  const [feedbackMessage, setFeedbackMessage] = useState(
    'Carregando pagamentos da API local...'
  );
  const [feedbackVariant, setFeedbackVariant] =
    useState<FeedbackVariant>('info');

  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  const [formData, setFormData] = useState<PaymentFormData>({
    amount: '',
    paymentMethod: 'PIX',
    customerDocument: '',
    description: ''
  });

  const [formErrors, setFormErrors] = useState<PaymentFormErrors>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('ALL');

  const filteredPayments = useMemo(() => {
    const normalizedSearch = normalizeSearch(searchTerm);

    return payments.filter((payment) => {
      const matchesStatus =
        statusFilter === 'ALL' || payment.status === statusFilter;

      const matchesSearch =
        !normalizedSearch ||
        payment.id.toLowerCase().includes(normalizedSearch) ||
        payment.customerDocument.toLowerCase().includes(normalizedSearch) ||
        (payment.description || '').toLowerCase().includes(normalizedSearch) ||
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
    void loadPaymentsFromApi();
  }, []);

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

  function scrollToPaymentDetails() {
    window.setTimeout(() => {
      const detailsSection = document.getElementById('payment-details-section');

      detailsSection?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      detailsSection?.focus({
        preventScroll: true
      });
    }, 0);
  }

  function handleSelectPayment(paymentId: string) {
    setSelectedPaymentId(paymentId);
    scrollToPaymentDetails();
  }

async function loadPaymentsFromApi() {
  setIsLoadingPayments(true);

  try {
    const response = await listPayments();

    setPayments(response.items);
    setSelectedPaymentId(response.items[0]?.id ?? '');

    if (response.total === 0) {
      showFeedback(
        'Nenhum pagamento encontrado para este contexto. Crie um novo pagamento para começar.',
        'info'
      );
    } else {
      showFeedback(
        `${response.total} ${
          response.total === 1 ? 'pagamento carregado' : 'pagamentos carregados'
        } da API local.`,
        'success'
      );
    }
  } catch (error) {
    showFeedback(getFriendlyApiErrorMessage(error), 'error');
  } finally {
    setIsLoadingPayments(false);
  }
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

  async function handleCreatePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validatePaymentForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showFeedback(
        'Não foi possível criar o pagamento. Revise os campos destacados.',
        'error'
      );
      return;
    }

    setIsCreatingPayment(true);

    try {
      const parsedAmount = Number(formData.amount.replace(',', '.'));

      const createdPayment = await createPayment({
        amount: parsedAmount,
        paymentMethod: formData.paymentMethod,
        customerDocument: getOnlyDigits(formData.customerDocument),
        description:
          formData.description.trim() || 'Pagamento criado pela interface web'
      });

      setPayments((current) => [createdPayment, ...current]);
      setSelectedPaymentId(createdPayment.id);
      setSearchTerm('');
      setStatusFilter('ALL');
      setFormData({
        amount: '',
        paymentMethod: 'PIX',
        customerDocument: '',
        description: ''
      });
      setFormErrors({});

      showFeedback(
        `Pagamento ${createdPayment.id} criado com sucesso na API.`,
        'success'
      );

      scrollToPaymentDetails();
    } catch (error) {
      showFeedback(getFriendlyApiErrorMessage(error), 'error');
    } finally {
      setIsCreatingPayment(false);
    }
  }

  async function handleUpdatePaymentStatus(
    paymentId: string,
    nextStatus: Exclude<PaymentStatus, 'PENDING'>,
    reason: string
  ) {
    setIsUpdatingPayment(true);

    try {
      const updatedPayment =
        nextStatus === 'CANCELLED'
          ? await cancelPayment(paymentId, { reason })
          : await updatePaymentStatus(paymentId, {
              status: nextStatus,
              reason
            });

      setPayments((currentPayments) =>
        currentPayments.map((payment) =>
          payment.id === updatedPayment.id ? updatedPayment : payment
        )
      );

      setSelectedPaymentId(updatedPayment.id);

      showFeedback(
        `Pagamento ${updatedPayment.id} atualizado para ${statusLabels[updatedPayment.status]}.`,
        'success'
      );

      scrollToPaymentDetails();
    } catch (error) {
      showFeedback(getFriendlyApiErrorMessage(error), 'error');
    } finally {
      setIsUpdatingPayment(false);
    }
  }

  function handleClearFilters() {
    setSearchTerm('');
    setStatusFilter('ALL');
    showFeedback('Filtros removidos.', 'info');
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="app-shell" id="dashboard">
        <HeroSection />

        <SummaryCards summary={summary} />

        <FeedbackMessage message={feedbackMessage} variant={feedbackVariant} />

        <section className="content-grid">
          <PaymentForm
            formData={formData}
            formErrors={formErrors}
            isSubmitting={isCreatingPayment}
            onSubmit={handleCreatePayment}
            onInputChange={handleInputChange}
          />

          <article className="panel payments-panel" id="payments">
            <div className="panel-header">
              <div>
                <span className="section-label">Pagamentos recentes</span>
                <h2>Operações</h2>
              </div>
              <span className="chip">
                {isLoadingPayments
                  ? 'Carregando...'
                  : `${filteredPayments.length} registros`}
              </span>
            </div>

            <PaymentFilters
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              totalPayments={payments.length}
              filteredCount={filteredPayments.length}
              onSearchChange={setSearchTerm}
              onStatusFilterChange={setStatusFilter}
              onClearFilters={handleClearFilters}
            />

            <PaymentTable
              payments={filteredPayments}
              selectedPaymentId={selectedPaymentId}
              onSelectPayment={handleSelectPayment}
            />
          </article>
        </section>

        <PaymentDetails
          selectedPayment={selectedPayment}
          isActionLoading={isUpdatingPayment}
          onUpdateStatus={handleUpdatePaymentStatus}
        />
      </main>
    </div>
  );
}

export default App;