// Ported unchanged from the single-file site. Runs once in the browser after the page mounts.
export default function init() {
  /* ---------- glass navigation: mobile panel + glass gets stronger on scroll ---------- */
  (function(){
    const nav=document.querySelector('.gnav'),b=document.getElementById('gBurger'),c=document.getElementById('gClose'),o=document.getElementById('gOverlay');
    const open=v=>{document.body.classList.toggle('menu-open',v);b.setAttribute('aria-expanded',v)};
    b.onclick=()=>open(true);c.onclick=()=>open(false);o.onclick=()=>open(false);
    document.querySelectorAll('.m-link').forEach(a=>a.addEventListener('click',()=>open(false)));
    addEventListener('keydown',e=>{if(e.key==='Escape')open(false)});
    const prog=document.getElementById('gProg'),hdr=document.querySelector('header.site');let lastY=scrollY,ticking=false;
    function onScroll(){ticking=false;const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;
      nav.classList.toggle('scrolled',y>20);prog.style.transform=`scaleX(${max>0?Math.min(1,y/max):0})`;
      const d=y-lastY;if(Math.abs(d)>6){hdr.classList.toggle('g-hide',d>0&&y>240&&!document.body.classList.contains('menu-open')&&!document.body.classList.contains('pal-open'));lastY=y}
      if(y<240)hdr.classList.remove('g-hide')}
    addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
    nav.addEventListener('focusin',()=>hdr.classList.remove('g-hide'));
  })();

}
