import { test } from '@playwright/test';
import {
  cleanupE2ePayments,
  createE2eTestRunId,
  openDashboard
} from '../helpers/e2e-helpers';
import { PaymentsDashboardPage } from '../pages/payments-dashboard.page';

test.describe('Fluxo crítico de pagamentos - E2E', () => {
  let testRunId: string;
  let dashboardPage: PaymentsDashboardPage;

  test.beforeEach(async ({ page }, testInfo) => {
    testRunId = createE2eTestRunId(testInfo);
    dashboardPage = new PaymentsDashboardPage(page);
  });

  test.afterEach(async ({ request }) => {
    await cleanupE2ePayments(request, testRunId);
  });

  test('deve criar e aprovar pagamento em um fluxo completo pela interface @smoke', async ({
    page
  }) => {
    const paymentDescription ='Pagamento E2E fluxo crítico criado pela interface';

    await test.step('Arrange - abrir dashboard com contexto isolado', async () => {
      await openDashboard(page, testRunId);

      await dashboardPage.assertFeedbackContains('Nenhum pagamento encontrado');
    });

    await test.step('Act - criar pagamento pela interface', async () => {
      await dashboardPage.createPayment({
        amount: '180,50',
        method: 'PIX',
        document: '12345678909',
        description: paymentDescription
      });
    });

    await test.step('Assert - validar pagamento criado como pendente', async () => {
      await dashboardPage.assertFeedbackContains('criado com sucesso');

      await dashboardPage.assertActiveFilterInfoContains(
        'Exibindo 1 de 1 pagamentos'
      );

      await dashboardPage.assertPaymentTableContains('R$ 180,50');
      await dashboardPage.assertPaymentTableContains('Pix');
      await dashboardPage.assertSelectedPaymentStatus('Pendente');
      await dashboardPage.assertPaymentDetailsContains(paymentDescription);
    });

    await test.step('Act - aprovar pagamento pela interface', async () => {
      await dashboardPage.approveSelectedPayment();
    });

    await test.step('Assert - validar status aprovado e histórico', async () => {
      await dashboardPage.assertFeedbackContains('atualizado para Aprovado');
      await dashboardPage.assertSelectedPaymentStatus('Aprovado');
      await dashboardPage.assertPaymentDetailsContains('Pendente → Aprovado');
      await dashboardPage.assertPaymentActionsDisabled();
    });

    await test.step('Act - recarregar página para validar persistência', async () => {
      await page.reload();
    });

    await test.step('Assert - validar que o pagamento aprovado continua visível após F5', async () => {
      await dashboardPage.assertFeedbackContains('1 pagamento carregado');
      await dashboardPage.assertPaymentDetailsContains(paymentDescription);
      await dashboardPage.assertSelectedPaymentStatus('Aprovado');
    });
  });
});