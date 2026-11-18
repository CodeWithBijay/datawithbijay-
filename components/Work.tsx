// Work — markup only; behaviour lives in lib/effects (wired up by components/Effects.tsx)
export default function Work() {
  return (
    <>
<section id="work" className="work2">
    <div className="w2-head"><span>Selected work</span><a href="https://github.com/CodeWithBijay" target="_blank" rel="noopener">All on GitHub →</a><i></i></div>
    <div className="w2-grid">
      <article className="w2-card reveal">
        <header><div className="w2-logo">FO</div><div className="w2-org"><b>Saint Louis University</b><small>Master’s research project · 2026</small></div><span className="w2-badge ok">shipped</span></header>
        <div className="w2-body">
          <h3>Fraud Operations Decision Intelligence</h3>
          <p>An app that helps a fraud team decide which alerts to review first. Alerts are scored with a logistic regression model on a PostgreSQL store and served through Streamlit, so analysts spend their time on the cases most likely to matter.</p>
          <div className="w2-tags"><span>PostgreSQL</span><span>Python</span><span>logistic regression</span><span>Streamlit</span></div>
          <a className="w2-link" href="https://github.com/CodeWithBijay/fraud-operations-decision-intelligence" target="_blank" rel="noopener">view code ↗</a>
        </div>
      </article>
      <article className="w2-card reveal">
        <header><div className="w2-logo alt">SH</div><div className="w2-org"><b>St. Louis HELP</b><small>2026 to present</small></div><span className="w2-badge wip">in progress</span></header>
        <div className="w2-body">
          <h3>Impact dashboard for a medical-equipment nonprofit</h3>
          <p>The nonprofit’s data stack, end to end: a nightly pipeline pulls form data through an API with Python, loads PostgreSQL in raw, cleaned and reporting layers, runs on GitHub Actions, and feeds a dashboard plus automatic donor reports.</p>
          <div className="w2-tags"><span>Python</span><span>PostgreSQL</span><span>GitHub Actions</span><span>Jotform API</span><span>ETL</span></div>
        </div>
      </article>
    </div>
  </section>
    </>
  );
}
