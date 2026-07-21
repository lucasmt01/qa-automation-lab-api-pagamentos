export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <span className="eyebrow">QA Automation Lab</span>

        <h1 className="hero-title">
          Dashboard de <span>Pagamentos</span>
        </h1>

        <p>
          Interface web integrada à API de pagamentos para executar fluxos reais
          de criação, consulta, atualização e cancelamento.
        </p>
      </div>

      <div className="environment-pill" data-testid="environment-pill">
        <span className="environment-dot" />
        <div>
          <small>Ambiente</small>
          <strong>API local</strong>
        </div>
      </div>
    </section>
  );
}