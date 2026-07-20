export function Sidebar() {
  return (
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
  );
}