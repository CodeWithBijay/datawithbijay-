// Boot — markup only; behaviour lives in lib/effects (wired up by components/Effects.tsx)
export default function Boot() {
  return (
    <>
<div id="boot" aria-hidden="true">
  <div className="boot-box" id="bootText"></div>
  <div className="boot-skip">press any key to skip</div>
</div>
    </>
  );
}
