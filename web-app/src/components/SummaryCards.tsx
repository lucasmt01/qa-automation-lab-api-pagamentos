import { formatCurrency } from '../utils/formatters';

type Summary = {
  total: number;
  pending: number;
  approved: number;
  totalAmount: number;
};

type SummaryCardsProps = {
  summary: Summary;
};

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
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
  );
}