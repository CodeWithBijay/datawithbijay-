// Nav — markup only; behaviour lives in lib/effects (wired up by components/Effects.tsx)
export default function Nav() {
  return (
    <>
<header className="site">
  <nav className="gnav" aria-label="Main">
    <a href="#top" className="g-brand"><span className="g-name">Data<b>With</b>Bijay</span></a>
    <div className="g-links" id="gLinks"><a href="#top" data-s="top" className="g-link">Home</a><a href="#about" data-s="about" className="g-link">About</a><a href="#work" data-s="work" className="g-link">Work</a><a href="#github" data-s="github" className="g-link">Activity</a><a href="#journey" data-s="journey" className="g-link">Journey</a><a href="#contact" data-s="contact" className="g-link">Contact</a><span className="g-ind" id="gInd" aria-hidden="true"></span></div>
    <a className="g-res" href="resume.pdf" download="Bijay-Paudel-Resume.pdf">Résumé <span aria-hidden="true">↓</span></a>
    <button className="g-k" id="openPal" aria-label="Open command menu"><kbd>⌘K</kbd></button>
    <button className="g-burger" id="gBurger" aria-label="Open menu" aria-expanded="false" aria-controls="gPanel"><i></i><i></i><i></i></button>
  <span className="g-prog" id="gProg" aria-hidden="true"></span>
  </nav>
  <div className="g-overlay" id="gOverlay"></div>
  <div className="g-panel" id="gPanel" aria-label="Menu">
    <div className="g-panel-top"><span className="g-name">Data<b>With</b>Bijay</span><button className="g-close" id="gClose" aria-label="Close menu">×</button></div>
    <a href="#top" data-s="top" className="m-link"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg><span>Home</span></a><a href="#about" data-s="about" className="m-link"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0z" /></svg><span>About</span></a><a href="#work" data-s="work" className="m-link"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6V4h6v2h5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm2 0h2V5h-2z" /></svg><span>Work</span></a><a href="#github" data-s="github" className="m-link"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20h18v-2H3zm2-4h3V9H5zm5 0h3V4h-3zm5 0h3v-5h-3z" /></svg><span>Activity</span></a><a href="#journey" data-s="journey" className="m-link"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19 9 8l4 7 3-5 4 9z" /></svg><span>Journey</span></a><a href="resume.pdf" download="Bijay-Paudel-Resume.pdf" className="m-link"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l5 5v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm8 1v5h5" /></svg><span>Résumé</span></a><a href="#contact" data-s="contact" className="m-link"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 2 9 6 9-6" /></svg><span>Contact</span></a>
  </div>
</header>
    </>
  );
}
