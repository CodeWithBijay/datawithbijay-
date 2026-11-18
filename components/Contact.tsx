// Contact — markup only; behaviour lives in lib/effects (wired up by components/Effects.tsx)
export default function Contact() {
  return (
    <>
<div className="card cta reveal" id="contact">
    <div className="cta-grid"><div className="cta-text">
    <div className="prompt" style={{marginBottom:"10px"}}><span className="p">~/</span> $ ./contact.sh</div>
    <h2>Let’s talk <b>data</b>.</h2>
    <p>Have a role, a messy dataset or a pipeline that keeps breaking? I’d like to hear about it.</p>
    <div className="btns">
      <a className="btn solid" href="https://www.linkedin.com/in/b-paudel/" target="_blank" rel="noopener">message on LinkedIn ↗</a>
      <a className="btn ghost" href="/resume.pdf" target="_blank" rel="noopener">download résumé</a>
    </div>
    </div>
    <div className="cf-wrap">
      <button type="button" className="px-form-bot" id="pxFormBot" aria-label="Chat with Pixel" tabIndex={-1}><svg viewBox="0 0 120 112" width="92" height="86" aria-hidden="true">
      
      <g className="px-float">
        <line x1="60" y1="26" x2="60" y2="15" stroke="#2b3d52" strokeWidth="3" strokeLinecap="round" /><circle className="px-ant" cx="60" cy="12" r="4" fill="#fbbf24" />
        <ellipse cx="60" cy="78" rx="22" ry="6" fill="#2b3d52" />
        <ellipse cx="60" cy="66" rx="55" ry="14" fill="#1f2d3d" stroke="#5eead4" strokeWidth="2.2" />
        <ellipse cx="60" cy="60" rx="40" ry="7" fill="#2b3d52" />
        <path d="M27 60 A33 33 0 0 1 93 60 Z" fill="#06201c" stroke="#5eead4" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M37 44 A24 24 0 0 1 50 33" fill="none" stroke="#eafffb" strokeOpacity=".35" strokeWidth="2.5" strokeLinecap="round" />
        <g className="px-look">
          <g className="px-eyes px-open"><rect x="46" y="38" width="10" height="13" rx="4.5" fill="#5eead4" /><rect x="64" y="38" width="10" height="13" rx="4.5" fill="#5eead4" /></g>
          <g className="px-open"><rect x="48" y="40" width="3.5" height="3.5" rx="1.2" fill="#eafffb" /><rect x="66" y="40" width="3.5" height="3.5" rx="1.2" fill="#eafffb" /></g>
          <g className="px-happy" fill="none" stroke="#5eead4" strokeWidth="3.5" strokeLinecap="round"><path d="M46 47 Q51 39 56 47" /><path d="M64 47 Q69 39 74 47" /></g>
          <path d="M55 54 Q60 58 65 54" fill="none" stroke="#5eead4" strokeWidth="2.6" strokeLinecap="round" />
          <ellipse cx="41" cy="52" rx="3.5" ry="2" fill="#fbbf24" opacity=".5" /><ellipse cx="79" cy="52" rx="3.5" ry="2" fill="#fbbf24" opacity=".5" />
        </g>
        <circle className="px-led a" cx="18" cy="68" r="3.4" fill="#5eead4" /><circle className="px-led b" cx="38" cy="72" r="3.4" fill="#fbbf24" /><circle className="px-led c" cx="60" cy="74" r="3.4" fill="#5eead4" /><circle className="px-led a" cx="82" cy="72" r="3.4" fill="#fbbf24" /><circle className="px-led b" cx="102" cy="68" r="3.4" fill="#5eead4" />
      </g>
    </svg><span className="px-cloud">INSERT <b>message</b></span></button>
      <form className="cf" id="contact-form" action="https://send.pageclip.co/erXlzO7LvagURkUnJRPSrXImT39x7mvy/contact" method="post" noValidate>
        <div className="cf-row">
          <label>Name<input name="name" type="text" autoComplete="name" placeholder="Jane Doe" required /></label>
          <label>Email<input name="email" type="email" autoComplete="email" placeholder="jane@company.com" required /></label>
        </div>
        <label>Message<textarea name="message" rows={5} placeholder="Tell me about your project or role" required></textarea></label>
        <div className="cf-foot"><button type="submit" className="cf-send">Send message <span aria-hidden="true">→</span></button><span className="cf-status" id="cfStatus" role="status"></span></div>
      </form>
    </div>
    </div>
  </div>

  <div className="contacts reveal">
    <a href="https://github.com/CodeWithBijay" target="_blank" rel="noopener"><div className="k">GitHub</div><div className="v">CodeWithBijay</div></a>
    <a href="https://www.linkedin.com/in/b-paudel/" target="_blank" rel="noopener"><div className="k">LinkedIn</div><div className="v">in/b-paudel</div></a>
    <a href="/resume.pdf" target="_blank" rel="noopener"><div className="k">Résumé</div><div className="v">resume.pdf</div></a>
    <div><div className="k">Location</div><div className="v">United States</div></div>
  </div>
    </>
  );
}
