// Background — markup only; behaviour lives in lib/effects (wired up by components/Effects.tsx)
export default function Background() {
  return (
    <>
<canvas id="bg" aria-hidden="true"></canvas>
<div id="bgTip" role="tooltip"></div>


    </>
  );
}
