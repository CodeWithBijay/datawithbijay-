// Pixel — markup only; behaviour lives in lib/effects (wired up by components/Effects.tsx)
export default function Pixel() {
  return (
    <>
<div id="pixel">
  <div id="pxGreet" hidden></div>
  <div className="px-chat" id="pxChat" role="dialog" aria-label="Chat with Pixel" hidden>
    <div className="px-head">
      <svg viewBox="2 22 116 62" width="40" height="22" aria-hidden="true"><ellipse cx="60" cy="66" rx="55" ry="14" fill="#1f2d3d" stroke="#5eead4" strokeWidth="3" /><path d="M27 60 A33 33 0 0 1 93 60 Z" fill="#06201c" stroke="#5eead4" strokeWidth="3" /><rect x="46" y="38" width="10" height="13" rx="4.5" fill="#5eead4" /><rect x="64" y="38" width="10" height="13" rx="4.5" fill="#5eead4" /></svg>
      <div><b>Pixel</b><span id="pxMode">Bijay’s assistant · online</span></div>
      <button className="px-close" id="pxClose" aria-label="Close chat">×</button>
    </div>
    <div className="px-log" id="pxLog" aria-live="polite"></div>
    <div className="px-quick" id="pxQuick">
      <button>What does Bijay do?</button><button>Tell me about the fraud project</button><button>What is his tech stack?</button><button>Is he open to roles?</button>
    </div>
    <form className="px-form" id="pxForm"><input id="pxIn" autoComplete="off" maxLength={400} placeholder="Ask about Bijay…" aria-label="Your question" /><button aria-label="Send">➤</button></form>
  </div>
  <button className="px-bot" id="pxBot" aria-label="Chat with Pixel" aria-expanded="false">
    <svg viewBox="0 0 120 112" width="84" height="78" aria-hidden="true">
      <ellipse className="px-sh" cx="60" cy="106" rx="26" ry="3.5" fill="#000" opacity=".35" />
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
    </svg>
    <span className="px-cloud" id="pxCloud" aria-hidden="true">Hi<b>!</b></span>
  </button>
</div>
<div className="px-flyer" id="pxFlyer" aria-hidden="true"><svg viewBox="0 0 120 112" width="84" height="78" aria-hidden="true">
      
      <g>
        <line x1="60" y1="26" x2="60" y2="15" stroke="#2b3d52" strokeWidth="3" strokeLinecap="round" /><circle className="px-ant" cx="60" cy="12" r="4" fill="#fbbf24" />
        <ellipse cx="60" cy="78" rx="22" ry="6" fill="#2b3d52" />
        <ellipse cx="60" cy="66" rx="55" ry="14" fill="#1f2d3d" stroke="#5eead4" strokeWidth="2.2" />
        <ellipse cx="60" cy="60" rx="40" ry="7" fill="#2b3d52" />
        <path d="M27 60 A33 33 0 0 1 93 60 Z" fill="#06201c" stroke="#5eead4" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M37 44 A24 24 0 0 1 50 33" fill="none" stroke="#eafffb" strokeOpacity=".35" strokeWidth="2.5" strokeLinecap="round" />
        <g className="px-look-fly">
          <g className="px-eyes px-open"><rect x="46" y="38" width="10" height="13" rx="4.5" fill="#5eead4" /><rect x="64" y="38" width="10" height="13" rx="4.5" fill="#5eead4" /></g>
          <g className="px-open"><rect x="48" y="40" width="3.5" height="3.5" rx="1.2" fill="#eafffb" /><rect x="66" y="40" width="3.5" height="3.5" rx="1.2" fill="#eafffb" /></g>
          <g className="px-happy" fill="none" stroke="#5eead4" strokeWidth="3.5" strokeLinecap="round"><path d="M46 47 Q51 39 56 47" /><path d="M64 47 Q69 39 74 47" /></g>
          <path d="M55 54 Q60 58 65 54" fill="none" stroke="#5eead4" strokeWidth="2.6" strokeLinecap="round" />
          <ellipse cx="41" cy="52" rx="3.5" ry="2" fill="#fbbf24" opacity=".5" /><ellipse cx="79" cy="52" rx="3.5" ry="2" fill="#fbbf24" opacity=".5" />
        </g>
        <circle className="px-led a" cx="18" cy="68" r="3.4" fill="#5eead4" /><circle className="px-led b" cx="38" cy="72" r="3.4" fill="#fbbf24" /><circle className="px-led c" cx="60" cy="74" r="3.4" fill="#5eead4" /><circle className="px-led a" cx="82" cy="72" r="3.4" fill="#fbbf24" /><circle className="px-led b" cx="102" cy="68" r="3.4" fill="#5eead4" />
      </g>
    </svg></div>
    </>
  );
}
