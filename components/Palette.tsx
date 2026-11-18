// Palette — markup only; behaviour lives in lib/effects (wired up by components/Effects.tsx)
export default function Palette() {
  return (
    <>
<div id="pal" role="dialog" aria-modal="true" aria-label="Command menu">
  <div className="pal-box">
    <input id="palIn" placeholder="type a command…" autoComplete="off" />
    <div className="pal-list" id="palList"></div>
  </div>
</div>
    </>
  );
}
