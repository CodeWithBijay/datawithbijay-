// Ported unchanged from the single-file site. Runs once in the browser after the page mounts.
export default function init() {
  /* ---------- GitHub activity ----------
     Contribution calendar read from github.com/CodeWithBijay on Nov 17, 2026 (GitHub has no public browser API for it).
     Repositories, languages order and "last pushed" refresh live from the GitHub API when the page can reach it. */
  (function(){
    const $=id=>document.getElementById(id);
    const CAL={2020:"05-12:1 08-24:3 08-25:34 08-26:23 08-27:1 08-28:2 08-29:1 09-02:2 09-05:3 09-06:5 09-08:1 09-10:11 09-11:2 09-12:1 09-18:2 10-20:1 10-21:1 10-25:1 11-02:1 11-03:1 11-06:1 11-14:2 11-15:2 11-16:1 11-17:1 11-19:1 11-23:2 11-25:2 11-28:3 11-29:4 12-01:1 12-06:3 12-07:1",
      2021:"02-06:1 02-09:1 02-20:1 04-10:5 04-18:4 04-20:4 04-26:2 04-28:2 04-30:1",2022:"01-13:2 01-24:1 01-25:2",2023:"01-04:2 01-09:1 10-02:3 10-08:2 12-08:3",
      2024:"03-05:2 04-23:2",2025:"02-23:2",2026:"10-07:1 10-08:1 10-15:1 10-16:1 10-21:1 11-04:1"};
    const LANG={Python:644385,JavaScript:407721,HTML:232559,CSS:229992,SCSS:60502,'C++':17383,CMake:8158,Dart:6577,Sass:2877,PHP:1241,C:750,'Objective-C':642,Java:516,Shell:503,Swift:417,Kotlin:138};
    let RECENT=[["fraud-operations-decision-intelligence","Python","2026-11-17"],["fraud-mrp-v1",null,"2026-10-21"],["Excel-Skills-by-Forage",null,"2026-10-16"],["Data-Analysis-Road-Map",null,"2026-10-08"],["internsphere","CSS","2025-02-23"]];
    const COL={Python:'#5eead4',JavaScript:'#fbbf24',HTML:'#f97316',CSS:'#60a5fa',SCSS:'#c084fc',other:'#64748b'};
    const day={};for(const y in CAL)CAL[y].split(' ').forEach(p=>{const [md,c]=p.split(':');day[y+'-'+md]=+c});
    const years=Object.keys(CAL).map(Number).sort((a,b)=>b-a);
    // headline numbers
    const total=Object.values(day).reduce((a,b)=>a+b,0);
    let best=0,run=0,prev=null;Object.keys(day).sort().forEach(d=>{const t=Date.parse(d);run=prev!==null&&t-prev===864e5?run+1:1;best=Math.max(best,run);prev=t});
    $('ghTotal').textContent=total.toLocaleString();$('ghTotalL').textContent='contributions since 2020';$('ghStreak').textContent=best+(best===1?' day':' days');
    $('ghYears').textContent=Math.floor((Date.now()-Date.parse('2020-05-12'))/31557600000);
    // languages
    function langs(L){const tot=Object.values(L).reduce((a,b)=>a+b,0),top=Object.entries(L).sort((a,b)=>b[1]-a[1]),main=top.slice(0,5),rest=top.slice(5).reduce((a,x)=>a+x[1],0);
      const rows=main.map(([k,v])=>[k,v,COL[k]||'#94a3b8']);if(rest)rows.push(['Other',rest,COL.other]);
      $('ghBar').innerHTML=rows.map(([k,v,c])=>`<span style="flex:${v};background:${c}" title="${k}"></span>`).join('');
      $('ghKeys').innerHTML=rows.map(([k,v,c])=>`<span><i style="background:${c}"></i>${k}<em>${Math.max(1,Math.round(v/tot*100))}%</em></span>`).join('')}
    langs(LANG);
    // last pushed
    const fmt=d=>new Date(d+'T12:00:00Z').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'});
    function recent(R){$('ghRecent').innerHTML=R.slice(0,5).map(([n,l,d])=>`<li><a href="https://github.com/CodeWithBijay/${n}" target="_blank" rel="noopener">${n}</a><span>${l||'—'} · ${fmt(d)}</span></li>`).join('')}
    recent(RECENT);
    // live refresh of repos and pushes (60 requests/hour per visitor; cached 1 h)
    (async()=>{try{let c=null;try{c=JSON.parse(localStorage.getItem('ghLive')||'null')}catch(e){}
        if(!c||Date.now()-c.t>36e5){const [u,r]=await Promise.all(['users/CodeWithBijay','users/CodeWithBijay/repos?per_page=100&sort=pushed'].map(p=>fetch('https://api.github.com/'+p).then(x=>{if(!x.ok)throw 0;return x.json()})));
          c={t:Date.now(),repos:u.public_repos,orig:r.filter(x=>!x.fork).length,stars:r.reduce((a,x)=>a+x.stargazers_count,0),recent:r.filter(x=>!x.fork).slice(0,5).map(x=>[x.name,x.language,x.pushed_at.slice(0,10)])};
          try{localStorage.setItem('ghLive',JSON.stringify(c))}catch(e){}}
        $('ghRepos').textContent=c.repos;$('ghNote').textContent=`across ${c.orig} original public repositories · ${c.stars} stars`;recent(c.recent)}catch(e){}})();
  })();

}
