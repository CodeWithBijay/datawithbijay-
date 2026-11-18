// Journey — markup only; behaviour lives in lib/effects (wired up by components/Effects.tsx)
export default function Journey() {
  return (
    <>
<section id="journey">
    <div className="sec-head"><h2>Journey</h2><span className="path">~/journey --log</span><span className="rule"></span></div>
    <div className="tabs" role="tablist">
      <button className="tab" role="tab" aria-selected="true" data-t="exp">experience</button>
      <button className="tab" role="tab" aria-selected="false" data-t="edu">education</button>
      <button className="tab" role="tab" aria-selected="false" data-t="cert">certifications</button>
    </div>
    <div className="card log" id="log"></div>
  </section>
    </>
  );
}
