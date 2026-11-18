// About — markup only; behaviour lives in lib/effects (wired up by components/Effects.tsx)
export default function About() {
  return (
    <>
<section className="about2 reveal" id="about" aria-label="About">
    <div className="ab-story">
      <div className="ab-big" aria-hidden="true">M.S.<sup>’26</sup></div>
      <div className="ab-k">Graduating December 2026</div>
      <p>I build the pipelines that carry data from where it is created to where decisions get made, and I care about the tables at the end being clean, tested and easy to trust. Right now that means a nightly pipeline for St. Louis HELP, a nonprofit that lends donated medical equipment free of charge: form submissions pulled through an API with Python, landed in PostgreSQL as raw, cleaned and reporting layers, run on a schedule by GitHub Actions, and turned into an impact dashboard and automatic donor reports. For my master’s research project I built Fraud Operations Decision Intelligence, a tool that ranks fraud alerts so a review team works the riskiest ones first. Before that came a B.S. in Computer Information Systems from Pokhara University, with Dean’s List honours in 2023. Today I am finishing an M.S. in Informatics with a concentration in Analytics at Saint Louis University.</p>
    </div>
    <dl className="ab-facts">
      <div><dt>Now</dt><dd>M.S. Informatics, Analytics · Saint Louis University</dd></div>
      <div><dt>Building</dt><dd>A nightly data pipeline for a medical-equipment nonprofit</dd></div>
      <div><dt>Depth</dt><dd>SQL · Python · PostgreSQL · Microsoft Fabric</dd></div>
      <div><dt>Based</dt><dd>United States <span className="ab-note">· Central Time</span></dd></div>
    </dl>
  </section>
    </>
  );
}
