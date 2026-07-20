export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <span className="eyebrow">QA Automation Lab</span>

        <h1 className="hero-title">
          Dashboard de <span>Pagamentos</span>
        </h1>

        <p>
          Interface web para simular operações de uma API de pagamentos e
          preparar fluxos de testes E2E com Playwright.
        </p>
      </div>

      <div className="environment-pill" data-testid="environment-pill">
        <span className="environment-dot" />
        <div>
          <small>Ambiente</small>
          <strong>Modo simulado</strong>
        </div>
      </div>
    </section>
  );
}