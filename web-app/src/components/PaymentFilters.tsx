import type { PaymentStatusFilter } from '../types/payment';
import { statusFilterLabels } from '../utils/payment-labels';

type PaymentFiltersProps = {
  searchTerm: string;
  statusFilter: PaymentStatusFilter;
  totalPayments: number;
  filteredCount: number;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: PaymentStatusFilter) => void;
  onClearFilters: () => void;
};

export function PaymentFilters({
  searchTerm,
  statusFilter,
  totalPayments,
  filteredCount,
  onSearchChange,
  onStatusFilterChange,
  onClearFilters
}: PaymentFiltersProps) {
  return (
    <>
      <div className="filter-bar">
        <label htmlFor="paymentSearch">
          Buscar
          <input
            id="paymentSearch"
            data-testid="payment-search-input"
            type="text"
            placeholder="ID, documento, método, status ou descrição"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <label htmlFor="statusFilter">
          Status
          <select
            id="statusFilter"
            data-testid="status-filter-select"
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as PaymentStatusFilter)
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
          onClick={onClearFilters}
        >
          Limpar filtros
        </button>
      </div>

      <div className="active-filter-info" data-testid="active-filter-info">
        Exibindo {filteredCount} de {totalPayments} pagamentos. Status:{' '}
        {statusFilterLabels[statusFilter]}.
      </div>
    </>
  );
}