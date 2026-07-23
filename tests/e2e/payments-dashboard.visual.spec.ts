import { expect, test } from '@playwright/test';
import {
  cleanupE2ePayments,
  createE2eTestRunId,
  openDashboard
} from '../helpers/e2e-helpers';
import { PaymentsDashboardPage } from '../pages/payments-dashboard.page';

test.describe('Dashboard de pagamentos - Visual', () => {
  let testRunId: string;
  let dashboardPage: PaymentsDashboardPage;

  test.beforeEach(async ({ page }, testInfo) => {
    testRunId = createE2eTestRunId(testInfo);
    dashboardPage = new PaymentsDashboardPage(page);
  });

  test.afterEach(async ({ request }) => {
    await cleanupE2ePayments(request, testRunId);
  });

  test('deve manter o layout do dashboard vazio @visual', async ({ page }) => {
    await test.step('Arrange - abrir dashboard vazio com contexto isolado', async () => {
      await openDashboard(page, testRunId);
      await dashboardPage.assertFeedbackContains('Nenhum pagamento encontrado');
      await dashboardPage.assertEmptyStateVisible();
    });

    await test.step('Assert - comparar screenshot do dashboard vazio', async () => {
      await expect(page).toHaveScreenshot('dashboard-empty.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });
});