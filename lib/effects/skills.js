// Ported unchanged from the single-file site. Runs once in the browser after the page mounts.
export default function init() {
  /* ---------- skills: rows of tag chips scrolling forever, alternate directions, faded edges ---------- */
  (function(){
    const rows=[["Python","SQL","PostgreSQL","pandas","NumPy","Data modeling","ETL / ELT","GitHub Actions","Git","Jotform API","Streamlit","Microsoft Fabric","Azure Data Factory","Azure Synapse","Azure Databricks","Power BI","Tableau","R","Jupyter","Statistics","Available for work"]];
    const speeds=[70]; // seconds per loop
    const chip=t=>`<span class="tchip${t==='Available for work'?' avail':''}">${t==='Available for work'?'● ':'<i>#</i> '}${t}</span>`;
    document.getElementById('track').innerHTML=rows.map((r,i)=>{
      const half=r.concat(r).map(chip).join(''); // doubled once, then duplicated again below for a seamless loop
      return `<div class="trow${i%2?' rev':''}" style="--d:${speeds[i]}s"><div class="tinner">${half}${half}</div></div>`}).join('');
  })();

}
