// Ported unchanged from the single-file site. Runs once in the browser after the page mounts.
export default function init() {
  /* ---------- reveal + active nav ---------- */
  (function(){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
    const links=[...document.querySelectorAll('.g-link,.m-link')];
    const secs=links.map(a=>document.getElementById(a.dataset.s)).filter(Boolean);
    const ind=document.getElementById('gInd'),box=document.getElementById('gLinks');let cur='';
    function place(){const a=box.querySelector('.g-link.on');if(!a){ind.style.opacity=0;return}
      ind.style.opacity=1;ind.style.transform=`translateX(${a.offsetLeft+12}px)`;ind.style.width=(a.offsetWidth-24)+'px'}
    function spy(){let c='top';const line=innerHeight*.4;
      for(const s of secs){const r=s.getBoundingClientRect();if(r.top<=line)c=s.id}
      if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)c=secs[secs.length-1].id;
      if(c!==cur){cur=c;links.forEach(a=>a.classList.toggle('on',a.dataset.s===c));place()}}
    addEventListener('scroll',spy,{passive:true});addEventListener('resize',place);document.fonts&&document.fonts.ready.then(place);spy();
  })();

}
