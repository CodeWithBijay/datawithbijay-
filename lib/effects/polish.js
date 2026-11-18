// Decoding headings, holographic project cards, rolling numbers, sliding tab pill, bounding-box hover.
export default function init() {
  /* ---------- polish: decoding headings, holographic project cards, rolling numbers, sliding tab pill, bounding-box hover ---------- */
  (function(){
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const once=(els,fn,th=.35)=>{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);fn(e.target)}}),{threshold:th});els.forEach(el=>io.observe(el))};


    // background hover cards stay quiet while the pointer is over page content
    addEventListener('pointerover',e=>{window.__overUI=!!(e.target.closest&&e.target.closest('.w2-card,.gh-stats,.gh-card,.card,.cf,.contacts,.ab-facts,.tabs,.j-list,.chip,.tchip,header.site,#pixel,.open-pill'))},{passive:true});
    // 1. section titles decode from random characters, left to right, when they scroll into view
    const GLYPHS='01#$%&*+<>/\\{}[]=_?';
    function decode(el){
      const nodes=[];const walk=n=>{n.childNodes.forEach(c=>{if(c.nodeType===3&&c.nodeValue.trim())nodes.push(c);else if(c.nodeType===1)walk(c)})};walk(el);
      const finals=nodes.map(n=>n.nodeValue),total=finals.reduce((a,s)=>a+s.length,0);
      el.style.minWidth=el.getBoundingClientRect().width+'px';
      const t0=performance.now(),dur=Math.min(1400,500+total*45);
      (function step(now){const p=Math.min(1,(now-t0)/dur);let seen=0;
        nodes.forEach((n,i)=>{const f=finals[i];let out='';
          for(let k=0;k<f.length;k++){const ch=f[k],at=(seen+k)/total;out+=ch===' '||at<p?ch:GLYPHS[Math.random()*GLYPHS.length|0]}
          seen+=f.length;n.nodeValue=out});
        if(p<1)requestAnimationFrame(step);else{nodes.forEach((n,i)=>n.nodeValue=finals[i]);el.style.minWidth=''}})(t0);
    }
    if(!reduce)once([...document.querySelectorAll('.sec-head h2,.cta h2')],decode,.6);

    // 2. project cards tilt toward the cursor with a moving holographic sheen
    document.querySelectorAll('.w2-card').forEach(card=>{
      card.classList.add('holo');
      if(reduce||matchMedia('(hover: none)').matches)return;
      card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
        card.style.setProperty('--mx',(x*100).toFixed(1)+'%');card.style.setProperty('--my',(y*100).toFixed(1)+'%');
        card.style.transform=`perspective(900px) rotateX(${((.5-y)*7).toFixed(2)}deg) rotateY(${((x-.5)*9).toFixed(2)}deg) translateY(-3px)`});
      card.addEventListener('pointerleave',()=>{card.style.transform=''});
    });

    // 3. Activity numbers roll up like an odometer
    function roll(el){
    // count up from 0 to the real number (plain text, so copying or screen readers always get the real value)
    const text=el.textContent.trim(),m=text.match(/^(\D*)([\d,]+)(.*)$/);if(!m)return;
    const target=+m[2].replace(/,/g,''),t0=performance.now(),dur=1200;
    (function step(now){const p=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-p,3);
      el.textContent=m[1]+Math.round(target*e).toLocaleString()+m[3];if(p<1)requestAnimationFrame(step);else el.textContent=text})(t0);
  }
    if(!reduce)once([...document.querySelectorAll('.gh-stats b')],roll,.5);

    // 4. Journey tabs: one highlight pill slides to the selected tab
    const tabs=document.querySelector('#journey .tabs');
    if(tabs){
      const pill=document.createElement('span');pill.className='tab-pill';pill.setAttribute('aria-hidden','true');tabs.appendChild(pill);tabs.classList.add('has-pill');
      const place=()=>{const t=tabs.querySelector('.tab[aria-selected="true"]');if(!t)return;
        pill.style.width=t.offsetWidth+'px';pill.style.height=t.offsetHeight+'px';pill.style.transform=`translate(${t.offsetLeft}px,${t.offsetTop}px)`};
      new MutationObserver(place).observe(tabs,{subtree:true,attributes:true,attributeFilter:['aria-selected']});
      addEventListener('resize',place);document.fonts&&document.fonts.ready.then(place);place();
    }

    // 5. bounding-box corners on skill chips, contact links and project tags are pure CSS (see .bbox styles);
    // mark the elements that get them
    const mark=()=>document.querySelectorAll('.tchip:not(.avail),.contacts a,.w2-tags > *,.px-quick button').forEach(el=>el.classList.add('bbox'));
    mark();setTimeout(mark,1500);
  })();

}
