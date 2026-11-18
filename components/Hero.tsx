// Hero — markup only; behaviour lives in lib/effects (wired up by components/Effects.tsx)
export default function Hero() {
  return (
    <>
<div className="hero2">
    <div className="h-left reveal">
      <div className="prompt"><span className="p">~/bijay</span> <span className="p">$</span> whoami <span className="blockcur"></span></div>
      <h1 id="nameH1"><span className="bj" id="bj">Bijay</span><canvas id="bjDots" aria-hidden="true"></canvas><span className="outline">Paudel<span className="dot">.</span></span></h1>
      <div className="role-cap">Analytics Engineer</div>
      <p className="bio">I build <strong>reliable data pipelines</strong> and <strong>clean, tested data models</strong> that teams can trust for analytics. Grad student at Saint Louis University and volunteer data engineer at St. Louis HELP.</p>
      <div className="pills">
        <span className="pill hot">Production pipelines</span>
        <span className="pill">ETL / ELT</span>
        <span className="pill">Data modeling</span>
        <span className="pill">PostgreSQL</span>
        <span className="pill">Microsoft Fabric</span>
        <span className="pill">Power BI</span>
      </div>
      <a className="open-pill liquid" href="#contact"><canvas className="lq" aria-hidden="true"></canvas><i></i><span>Open to analytics &amp; data engineering roles</span></a>
    </div>

    <div className="h-right reveal" id="pipelines" aria-label="St. Louis HELP nightly pipeline">
      <div className="cmd"><span className="p">~/pipelines $</span> gh workflow run stl_help_nightly.yml</div>
      <div className="runlog" id="runlog"></div>
      <div className="run-done" id="runDone">&nbsp;</div>
      <div className="dag mini" id="dag"></div>
      <p className="dag-cap">illustrative timings · the stages and their order are the real ones</p>
      <div className="geo">
        <div className="coord">38.6270° N · 90.1994° W</div>
        <div><b id="clock">--:--:--</b> <span id="tz">UTC−6</span></div>
      </div>
    </div>
  </div>
    </>
  );
}
