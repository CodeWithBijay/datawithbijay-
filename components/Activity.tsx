// Activity — markup only; behaviour lives in lib/effects (wired up by components/Effects.tsx)
export default function Activity() {
  return (
    <>
<section id="github" className="gh reveal" aria-label="GitHub activity">
    <div className="sec-head"><h2>Activity</h2><a className="path" href="https://github.com/CodeWithBijay" target="_blank" rel="noopener">~/github/CodeWithBijay ↗</a><span className="rule"></span></div>
    <div className="gh-stats">
      <div><b id="ghTotal">—</b><span id="ghTotalL">contributions</span></div>
      <div><b id="ghRepos">39</b><span>public repositories</span></div>
      <div><b id="ghYears">—</b><span>years on GitHub</span></div>
      <div><b id="ghStreak">—</b><span>longest daily streak</span></div>
    </div>
    <div className="gh-two">
      <div className="gh-card"><div className="gh-lbl">languages · by code size</div><div className="gh-bar" id="ghBar"></div><div className="gh-keys" id="ghKeys"></div><div className="gh-note" id="ghNote">across 36 original public repositories</div></div>
      <div className="gh-card"><div className="gh-lbl">last pushed</div><ul className="gh-recent" id="ghRecent"></ul></div>
    </div>
  </section>
    </>
  );
}
