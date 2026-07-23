import { expect, test } from '@playwright/test';
import {
  cleanupE2ePayments,
  createE2eTestRunId,
  createPaymentViaApi,
  openDashboard,
  updatePaymentStatusViaApi
} from '../helpers/e2e-helpers';

test.describe('Dashboard de pagamentos - E2E', () => {
  let testRunId: string;

  test.beforeEach(async ({}, testInfo) => {
    testRunId = createE2eTestRunId(testInfo);
    });
  test.afterEach(async ({ request }) => {
    await cleanupE2ePayments(request, testRunId);
  });

  test('deve abrir dashboard vazio para um testRunId novo', async ({ page }) => {
    await test.step('Arrange - abrir dashboard com contexto isolado', async () => {
      await openDashboard(page, testRunId);
    });

    await test.step('Assert - validar estado vazio da interface', async () => {
      await expect(page.getByTestId('feedback-message')).toContainText(
        'Nenhum pagamento encontrado'
      );

      await expect(page.getByTestId('active-filter-info')).toContainText(
        'Exibindo 0 de 0 pagamentos'
      );

      await expect(page.getByTestId('empty-payments-state')).toBeVisible();
    });
  });

  test('deve criar pagamento pela interface e exibir nos detalhes', async ({
    page
  }) => {
    await test.step('Arrange - abrir dashboard com contexto isolado', async () => {
      await openDashboard(page, testRunId);
    });

    await test.step('Act - preencher formulário e criar pagamento pela UI', async () => {
      await page.getByTestId('amount-input').fill('150,75');
      await page.getByTestId('payment-method-select').selectOption('PIX');
      await page.getByTestId('customer-document-input').fill('12345678909');
      await page
        .getByTestId('description-input')
        .fill('Pagamento E2E criado pela interface');

      await page.getByTestId('create-payment-button').click();
    });

    await test.step('Assert - validar pagamento criado na tabela e nos detalhes', async () => {
      await expect(page.getByTestId('feedback-message')).toContainText(
        'criado com sucesso'
      );

      await expect(page.getByTestId('active-filter-info')).toContainText(
        'Exibindo 1 de 1 pagamentos'
      );

      await expect(page.getByTestId('payment-table')).toContainText('R$ 150,75');
      await expect(page.getByTestId('payment-table')).toContainText('Pix');
      await expect(page.getByTestId('payment-table')).toContainText('Pendente');

      await expect(page.getByTestId('selected-payment-status')).toContainText(
        'Pendente'
      );

      await expect(page.getByTestId('payment-details')).toContainText(
        'Pagamento E2E criado pela interface'
      );
    });
  });

  test('deve carregar pagamento existente após atualizar a página', async ({
    page,
    request
  }) => {
    await test.step('Arrange - criar pagamento via API para preparar cenário', async () => {
      await createPaymentViaApi(request, testRunId, {
        amount: 89.9,
        paymentMethod: 'BOLETO',
        customerDocument: '45678912300',
        description: 'Pagamento persistido para validar F5'
      });
    });

    await test.step('Act - abrir dashboard e recarregar a página', async () => {
      await openDashboard(page, testRunId);

      await expect(page.getByTestId('feedback-message')).toContainText(
        '1 pagamento carregado'
      );

      await page.reload();
    });

    await test.step('Assert - validar que o pagamento continua visível após F5', async () => {
      await expect(page.getByTestId('feedback-message')).toContainText(
        '1 pagamento carregado'
      );

      await expect(page.getByTestId('payment-table')).toContainText('R$ 89,90');
      await expect(page.getByTestId('payment-table')).toContainText('Boleto');
      await expect(page.getByTestId('payment-table')).toContainText('Pendente');

      await expect(page.getByTestId('payment-details')).toContainText(
        'Pagamento persistido para validar F5'
      );
    });
  });

  test('deve filtrar pagamentos por status', async ({ page, request }) => {
    await test.step('Arrange - criar pagamentos com status diferentes', async () => {
      const approvedPayment = await createPaymentViaApi(request, testRunId, {
        amount: 200,
        paymentMethod: 'PIX',
        customerDocument: '11122233344',
        description: 'Pagamento aprovado para filtro E2E'
      });

      await updatePaymentStatusViaApi(
        request,
        approvedPayment.id,
        'APPROVED',
        'Pagamento aprovado para preparação do filtro'
      );

      await createPaymentViaApi(request, testRunId, {
        amount: 300,
        paymentMethod: 'CREDIT_CARD',
        customerDocument: '55566677788',
        description: 'Pagamento pendente para filtro E2E'
      });
    });

    await test.step('Act - abrir dashboard e aplicar filtro de aprovados', async () => {
      await openDashboard(page, testRunId);

      await expect(page.getByTestId('active-filter-info')).toContainText(
        'Exibindo 2 de 2 pagamentos'
      );

      await page.getByTestId('status-filter-select').selectOption('APPROVED');
    });

    await test.step('Assert - validar que apenas pagamentos aprovados aparecem', async () => {
      await expect(page.getByTestId('active-filter-info')).toContainText(
        'Exibindo 1 de 2 pagamentos'
      );

      await expect(page.getByTestId('payment-table')).toContainText('Aprovado');
      await expect(page.getByTestId('payment-table')).not.toContainText(
        'Pendente'
      );
    });

    await test.step('Act e Assert - limpar filtro e validar retorno da lista completa', async () => {
      await page.getByTestId('clear-filters-button').click();

      await expect(page.getByTestId('active-filter-info')).toContainText(
        'Exibindo 2 de 2 pagamentos'
      );
    });
  });
});