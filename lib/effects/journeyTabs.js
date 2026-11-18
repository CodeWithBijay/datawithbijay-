// Ported unchanged from the single-file site. Runs once in the browser after the page mounts.
export default function init() {
  /* ---------- journey tabs ---------- */
  (function(){
    const data={
      exp:[
        ["2026 — present","Volunteer Data Engineer","St. Louis HELP","Building the nonprofit’s impact dashboard: a nightly pipeline from form data through Python into PostgreSQL raw, cleaned and reporting layers, scheduled with GitHub Actions, feeding a dashboard and automatic donor reports."],
        ["present","GSA Representative","School for Professional Studies, SLU","Represent graduate students, help plan programs and events, and review and vote on budgets for student organizations."],
        ["Apr 2025 — present","PR & Marketing Coordinator","Global Student Connect, SLU","Plan digital campaigns and manage social channels, using Google Analytics and Hootsuite engagement data to refine content strategy."],
        ["Feb — Mar 2025","Digital Strategy Intern","Excelerate (SLU partnership)","Analyzed digital marketing practices, proposed social media and SEO improvements, and presented a campaign strategy to faculty and peers."]
      ],
      edu:[
        ["expected Dec 2026","M.S. in Informatics, Analytics","Saint Louis University","Coursework in data analytics, statistical methods and technology applications with Python, R, SQL, pandas and the tidyverse."],
        ["Aug 2023","B.S. in Computer Information Systems","Pokhara University","Database management, data analysis and modeling, business statistics, systems analysis and IT project management, with a major project and an internship.","★ Dean’s List 2023"]
      ],
      cert:[
        ["certificate","Advanced SQL Data Analysis","Codecademy","Professional certification in advanced SQL for data analysis."],
        ["certificate","Computer Science Career Path","Codecademy","Programming, data structures and algorithms."]
      ]
    };
    const log=document.getElementById('log'),tabs=[...document.querySelectorAll('.tab')];
    const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
    function show(k){
      tabs.forEach(b=>b.setAttribute('aria-selected',b.dataset.t===k));
      log.innerHTML=data[k].map(([t,h,o,p,b])=>`<div class="row"><div class="t">${esc(t)}</div><div><h4>${esc(h)} <span>· ${esc(o)}</span></h4><p>${esc(p)}</p>${b?`<span class="star">${b}</span>`:''}</div></div>`).join('');
    }
    tabs.forEach(b=>b.onclick=()=>show(b.dataset.t));show('exp');
    window.__showTab=show;
  })();

}
