import { expect, type Locator, type Page } from '@playwright/test';

type PaymentMethod = 'PIX' | 'BOLETO' | 'CREDIT_CARD';

type CreatePaymentData = {
  amount: string;
  method: PaymentMethod;
  document: string;
  description: string;
};

export class PaymentsDashboardPage {
  readonly page: Page;

  readonly feedbackMessage: Locator;
  readonly activeFilterInfo: Locator;
  readonly emptyPaymentsState: Locator;

  readonly amountInput: Locator;
  readonly paymentMethodSelect: Locator;
  readonly customerDocumentInput: Locator;
  readonly descriptionInput: Locator;
  readonly createPaymentButton: Locator;

  readonly paymentTable: Locator;
  readonly paymentDetails: Locator;
  readonly selectedPaymentStatus: Locator;

  readonly approvePaymentButton: Locator;
  readonly refusePaymentButton: Locator;
  readonly cancelPaymentButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.feedbackMessage = page.getByTestId('feedback-message');
    this.activeFilterInfo = page.getByTestId('active-filter-info');
    this.emptyPaymentsState = page.getByTestId('empty-payments-state');

    this.amountInput = page.getByLabel(/valor/i);
    this.paymentMethodSelect = page.getByLabel(/método/i);
    this.customerDocumentInput = page.getByLabel(/documento/i);
    this.descriptionInput = page.getByLabel(/descrição/i);
    this.createPaymentButton = page.getByRole('button', {
      name: /criar pagamento/i
    });

    this.paymentTable = page.getByTestId('payment-table');
    this.paymentDetails = page.getByTestId('payment-details');
    this.selectedPaymentStatus = page.getByTestId('selected-payment-status');

    this.approvePaymentButton = page.getByRole('button', { name: /aprovar/i });
    this.refusePaymentButton = page.getByRole('button', { name: /recusar/i });
    this.cancelPaymentButton = page.getByRole('button', { name: /cancelar/i });
  }

  async createPayment(data: CreatePaymentData) {
    await this.amountInput.fill(data.amount);
    await this.paymentMethodSelect.selectOption(data.method);
    await this.customerDocumentInput.fill(data.document);
    await this.descriptionInput.fill(data.description);
    await this.createPaymentButton.click();
  }

  async approveSelectedPayment() {
    await this.approvePaymentButton.click();
  }

  async refuseSelectedPayment() {
    await this.refusePaymentButton.click();
  }

  async cancelSelectedPayment() {
    await this.cancelPaymentButton.click();
  }

  async assertFeedbackContains(text: string) {
    await expect(this.feedbackMessage).toContainText(text);
  }

  async assertActiveFilterInfoContains(text: string) {
    await expect(this.activeFilterInfo).toContainText(text);
  }

  async assertEmptyStateVisible() {
    await expect(this.emptyPaymentsState).toBeVisible();
  }

  async assertPaymentTableContains(text: string) {
    await expect(this.paymentTable).toContainText(text);
  }

  async assertPaymentDetailsContains(text: string) {
    await expect(this.paymentDetails).toContainText(text);
  }

  async assertSelectedPaymentStatus(status: string) {
    await expect(this.selectedPaymentStatus).toContainText(status);
  }

  async assertPaymentActionsDisabled() {
    await expect(this.approvePaymentButton).toBeDisabled();
    await expect(this.refusePaymentButton).toBeDisabled();
    await expect(this.cancelPaymentButton).toBeDisabled();
  }
}

export default PaymentsDashboardPage;