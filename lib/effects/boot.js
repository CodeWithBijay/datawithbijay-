// Loading screen: a short run of the portfolio pipeline, once per visit.
export default function init() {
  /* ---------- boot screen: a short run of the "portfolio pipeline" (once per visit, any key / click / tap skips) ---------- */
  (function(){
    const boot=document.getElementById('boot'),out=document.getElementById('bootText');
    let seen=false;try{seen=sessionStorage.getItem('booted')}catch(e){}
    if(seen||matchMedia('(prefers-reduced-motion: reduce)').matches){boot.classList.add('gone');return}
    const P='<span class="p">~/</span> $ ',Q='<span class="p">bijay=#</span> ',ok='<span class="ok">✓</span>',ar='<span class="ok">→</span>';
    // c = typed command, o = output line (t = timing), b = blank, s = spinner then result, x = sql result block
    const L=[
      {c:P,s:'./build_portfolio.sh --date today'},
      {o:`  ${ok} extract   projects, experience, skills`},
      {o:`  ${ok} test      12 passed · 0 failed`},
      {o:`  ${ok} model     analytics_engineer.bijay`},
      {c:P,s:'open bijay-paudel.com.np'}
    ];
    const TYPE=22,LINE=160;   // ms per typed character, ms between output lines → about 3 s in total
    let html='',done=false;
    const row=(h,t)=>`<div class="bl">${h}${t?`<span class="bt">${t}</span>`:''}</div>`;
    const paint=(extra='')=>{out.innerHTML=html+extra;out.scrollTop=out.scrollHeight};
    function finish(){if(done)return;done=true;boot.classList.add('gone');try{sessionStorage.setItem('booted','1')}catch(e){}}
    let i=0;
    function next(){
      if(done)return;
      if(i>=L.length){setTimeout(finish,600);return}
      const l=L[i++];
      if(l.b){html+='<div class="bl bl-gap"></div>';paint('<span class="caret"></span>');return setTimeout(next,40)}
      if(l.o){html+=row(l.o,l.t);paint('<span class="caret"></span>');return setTimeout(next,LINE)}
      if(l.x){let k=0;(function r(){if(done)return;html+=`<div class="bl bl-sql">${l.x[k++]}</div>`;paint();k<l.x.length?setTimeout(r,70):setTimeout(next,LINE)})();return}
      if(l.spin){const F='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';let f=0,t0=performance.now();
        (function s(now){if(done)return;if(now-t0<420){paint(row(`${l.spin} <span class="ok">${F[f++%F.length]}</span>`));return requestAnimationFrame(s)}
          html+=row(l.spin);paint();setTimeout(next,40)})(t0);return}
      // typed command
      let k=0;(function step(){if(done)return;
        if(k<=l.s.length){paint(`<div class="bl">${l.c}${l.s.slice(0,k)}<span class="caret"></span></div>`);k+=1;setTimeout(step,TYPE)}
        else{html+=`<div class="bl">${l.c}${l.s}</div>`;setTimeout(next,120)}})();
    }
    next();
    ['keydown','click','touchstart'].forEach(ev=>addEventListener(ev,finish,{once:true}));
  })();

}
