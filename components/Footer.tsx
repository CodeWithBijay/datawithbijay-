// Footer — markup only; behaviour lives in lib/effects (wired up by components/Effects.tsx)
export default function Footer() {
  return (
    <>
<footer>
    <span>build <span id="hash">—</span></span>
    <span>static html · no trackers</span>
    <span className="r">© <span id="yr"></span> Bijay Paudel · DataWithBijay</span>
  </footer>
    </>
  );
}
