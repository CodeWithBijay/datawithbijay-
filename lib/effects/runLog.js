// Ported unchanged from the single-file site. Runs once in the browser after the page mounts.
export default function init() {
  /* ---------- run log + compact DAG: real stages of the St. Louis HELP nightly run, illustrative timings ---------- */
  (function(){
    const box=document.getElementById('dag'),log=document.getElementById('runlog'),done=document.getElementById('runDone');if(!box)return;
    const NS='http://www.w3.org/2000/svg';
    const STEPS=[ // [log name, output, DAG nodes]
      ['extract_jotform_api','form submissions',['src','ext']],
      ['load_raw','→ postgres.raw',['raw']],
      ['clean','→ postgres.cleaned',['cln']],
      ['model_reporting','→ postgres.reporting',['rep']],
      ['refresh_dashboard','impact dashboard',['dash']],
      ['send_donor_reports','donor reports',['don']]];
    const NODES={src:'jotform_api',ext:'extract',raw:'load_raw',cln:'clean',rep:'model',dash:'dashboard',don:'donor_reports'};
    const EDGES=[['src','ext'],['ext','raw'],['raw','cln'],['cln','rep'],['rep','dash'],['rep','don']];
    const P={src:[0,38],ext:[92,38],raw:[184,38],cln:[276,38],rep:[368,38],dash:[478,8],don:[478,68]},NW=80,NH=26;
    const mk=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e};
    const svg=mk('svg',{viewBox:'-2 0 566 100'}),els={},edges={};
    EDGES.forEach(([a,b])=>{const[x1,y1]=[P[a][0]+(a==='rep'?NW:NW),P[a][1]+NH/2],[x2,y2]=[P[b][0],P[b][1]+NH/2],mx=(x1+x2)/2;
      edges[a+'>'+b]=svg.appendChild(mk('path',{d:`M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`,class:'edge'}))});
    for(const id in NODES){const g=mk('g',{class:'node'}),w=id==='dash'||id==='don'?86:NW;
      g.appendChild(mk('rect',{x:P[id][0],y:P[id][1],width:w,height:NH,rx:4}));
      const t=mk('text',{x:P[id][0]+8,y:P[id][1]+17});t.textContent=NODES[id];g.appendChild(t);els[id]=svg.appendChild(g)}
    const pulse=svg.appendChild(mk('circle',{r:3,class:'pulse',style:'opacity:0'}));
    box.appendChild(svg);
    const sleep=ms=>new Promise(r=>setTimeout(r,ms));
    const setC=(id,c)=>els[id].setAttribute('class','node'+(c?' '+c:''));
    function travel(path,ms){return new Promise(res=>{const L=path.getTotalLength(),t0=performance.now();
      (function f(now){const k=Math.min(1,(now-t0)/ms),p=path.getPointAtLength(L*k);pulse.setAttribute('cx',p.x);pulse.setAttribute('cy',p.y);pulse.style.opacity=1;
        if(k<1)requestAnimationFrame(f);else{pulse.style.opacity=0;res()}})(t0)})}
    const spin='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
    async function loop(){
      while(true){
        log.innerHTML='';done.innerHTML='&nbsp;';Object.keys(els).forEach(id=>setC(id,''));Object.values(edges).forEach(e=>e.setAttribute('class','edge'));
        let total=0,prev=null;
        for(const [name,out,nodes] of STEPS){
          const row=document.createElement('div');row.className='rl run';
          row.innerHTML=`<span class="ck">${spin[0]}</span><span>${name}</span><span class="tm"></span><span class="out">${out}</span>`;
          log.appendChild(row);requestAnimationFrame(()=>row.classList.add('show'));
          for(const id of nodes){
            if(prev){const e=edges[prev+'>'+id];if(e){e.setAttribute('class','edge on');await travel(e,350)}}
            setC(id,'run');if(nodes.length>1&&id!==nodes[nodes.length-1]){await sleep(300);setC(id,'done');prev=id}
          }
          const ms=500+Math.random()*1900,t0=performance.now();
          while(performance.now()-t0<ms){row.querySelector('.ck').textContent=spin[Math.floor(performance.now()/80)%spin.length];await sleep(80)}
          total+=ms;row.classList.remove('run');row.querySelector('.ck').textContent='✓';row.querySelector('.tm').textContent=(ms/1000).toFixed(1)+'s';
          nodes.forEach(id=>setC(id,'done'));
          prev=nodes[nodes.length-1]==='dash'?'rep':nodes[nodes.length-1];
        }
        done.innerHTML=`stl_help_nightly <span class="ok">succeeded in ${(total/1000).toFixed(1)}s</span>`;
        await sleep(5000);
      }
    }
    loop();
  })();

}
