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
import { mockPayments } from './data/mock-payments';
import type {
  Payment,
  PaymentFormData,
  PaymentFormErrors,
  PaymentStatus,
  PaymentStatusFilter
} from './types/payment';
import type { FeedbackVariant } from './types/ui';
import {
  createHistoryItem,
  generatePaymentId,
  getOnlyDigits,
  normalizeSearch,
  validatePaymentForm
} from './utils/payment-helpers';
import { methodLabels, statusLabels } from './utils/payment-labels';

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

    const errors = validatePaymentForm(formData);

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

    scrollToPaymentDetails();
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
      <Sidebar />

      <main className="app-shell" id="dashboard">
        <HeroSection />

        <SummaryCards summary={summary} />

        <FeedbackMessage message={feedbackMessage} variant={feedbackVariant} />

        <section className="content-grid">
          <PaymentForm
            formData={formData}
            formErrors={formErrors}
            onSubmit={handleCreatePayment}
            onInputChange={handleInputChange}
          />

          <article className="panel payments-panel" id="payments">
            <div className="panel-header">
              <div>
                <span className="section-label">Pagamentos recentes</span>
                <h2>Operações</h2>
              </div>
              <span className="chip">{filteredPayments.length} registros</span>
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
          onUpdateStatus={updatePaymentStatus}
        />
      </main>
    </div>
  );
}

export default App;