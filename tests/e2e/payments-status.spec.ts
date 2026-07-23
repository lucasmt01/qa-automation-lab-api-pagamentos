import { expect, test } from '@playwright/test';
import {
  cleanupE2ePayments,
  createE2eTestRunId,
  createPaymentViaApi,
  openDashboard
} from '../helpers/e2e-helpers';

test.describe('Status de pagamentos - E2E', () => {
  let testRunId: string;

  test.beforeEach(async ({}, testInfo) => {
    testRunId = createE2eTestRunId(testInfo);
    });

  test.afterEach(async ({ request }) => {
    await cleanupE2ePayments(request, testRunId);
  });

  test('deve aprovar pagamento pendente pela interface @smoke', async ({
    page,
    request
  }) => {
    await test.step('Arrange - criar pagamento pendente via API', async () => {
      await createPaymentViaApi(request, testRunId, {
        amount: 120,
        paymentMethod: 'PIX',
        customerDocument: '12312312399',
        description: 'Pagamento para aprovação E2E'
      });
    });

    await test.step('Act - abrir dashboard e aprovar pagamento pela UI', async () => {
      await openDashboard(page, testRunId);

      await expect(page.getByTestId('selected-payment-status')).toContainText(
        'Pendente'
      );

      await page.getByTestId('approve-payment-button').click();
    });

    await test.step('Assert - validar status aprovado, histórico e botões desabilitados', async () => {
      await expect(page.getByTestId('feedback-message')).toContainText(
        'atualizado para Aprovado'
      );

      await expect(page.getByTestId('selected-payment-status')).toContainText(
        'Aprovado'
      );

      await expect(page.getByTestId('approve-payment-button')).toBeDisabled();
      await expect(page.getByTestId('refuse-payment-button')).toBeDisabled();
      await expect(page.getByTestId('cancel-payment-button')).toBeDisabled();

      await expect(page.getByTestId('payment-details')).toContainText(
        'Pendente → Aprovado'
      );
    });
  });

  test('deve recusar pagamento pendente pela interface', async ({
    page,
    request
  }) => {
    await test.step('Arrange - criar pagamento pendente via API', async () => {
      await createPaymentViaApi(request, testRunId, {
        amount: 220,
        paymentMethod: 'CREDIT_CARD',
        customerDocument: '32132132100',
        description: 'Pagamento para recusa E2E'
      });
    });

    await test.step('Act - abrir dashboard e recusar pagamento pela UI', async () => {
      await openDashboard(page, testRunId);

      await expect(page.getByTestId('selected-payment-status')).toContainText(
        'Pendente'
      );

      await page.getByTestId('refuse-payment-button').click();
    });

    await test.step('Assert - validar status recusado, histórico e botões desabilitados', async () => {
      await expect(page.getByTestId('feedback-message')).toContainText(
        'atualizado para Recusado'
      );

      await expect(page.getByTestId('selected-payment-status')).toContainText(
        'Recusado'
      );

      await expect(page.getByTestId('approve-payment-button')).toBeDisabled();
      await expect(page.getByTestId('refuse-payment-button')).toBeDisabled();
      await expect(page.getByTestId('cancel-payment-button')).toBeDisabled();

      await expect(page.getByTestId('payment-details')).toContainText(
        'Pendente → Recusado'
      );
    });
  });

  test('deve cancelar pagamento pendente pela interface', async ({
    page,
    request
  }) => {
    await test.step('Arrange - criar pagamento pendente via API', async () => {
      await createPaymentViaApi(request, testRunId, {
        amount: 320,
        paymentMethod: 'BOLETO',
        customerDocument: '78978978911',
        description: 'Pagamento para cancelamento E2E'
      });
    });

    await test.step('Act - abrir dashboard e cancelar pagamento pela UI', async () => {
      await openDashboard(page, testRunId);

      await expect(page.getByTestId('selected-payment-status')).toContainText(
        'Pendente'
      );

      await page.getByTestId('cancel-payment-button').click();
    });

    await test.step('Assert - validar status cancelado, histórico e botões desabilitados', async () => {
      await expect(page.getByTestId('feedback-message')).toContainText(
        'atualizado para Cancelado'
      );

      await expect(page.getByTestId('selected-payment-status')).toContainText(
        'Cancelado'
      );

      await expect(page.getByTestId('approve-payment-button')).toBeDisabled();
      await expect(page.getByTestId('refuse-payment-button')).toBeDisabled();
      await expect(page.getByTestId('cancel-payment-button')).toBeDisabled();

      await expect(page.getByTestId('payment-details')).toContainText(
        'Pendente → Cancelado'
      );
    });
  });
});