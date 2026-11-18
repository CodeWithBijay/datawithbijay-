// Timeline, read-along words, highlighter, rotating title, encrypted hover, card spotlight, language donut, wavy footer name.
export default function init() {
  /* ---------- extras: timeline, read-along words, highlighter, rotating title, encrypted hover, card spotlight, language donut, wavy footer name ---------- */
  (function(){
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,hoverable=matchMedia('(hover: hover)').matches;
    const inView=(el,fn,th=.3)=>{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);fn(e.target)}}),{threshold:th});io.observe(el)};

    // 1. Journey as a timeline: the mint line fills as you scroll, entries pop in
    const log=document.getElementById('log');
    if(log){
      log.classList.add('tl');
      const fill=document.createElement('span');fill.className='tl-fill';fill.setAttribute('aria-hidden','true');
      const stagger=()=>{if(!log.contains(fill))log.prepend(fill);[...log.querySelectorAll('.row')].forEach((r,i)=>{r.style.setProperty('--i',i);r.classList.remove('tl-in');void r.offsetWidth;r.classList.add('tl-in')})};
      new MutationObserver(m=>{if(m.some(x=>[...x.addedNodes].some(n=>n.classList&&n.classList.contains('row'))))stagger()}).observe(log,{childList:true});
      stagger();
      const place=()=>{const rows=log.querySelectorAll('.row');if(!rows.length)return;   // rail runs exactly from the first dot to the last
      const c=parseFloat(getComputedStyle(rows[0],'::before').top)+7,a=rows[0].offsetTop+c,b=rows[rows.length-1].offsetTop+c;
      log.style.setProperty('--tl-a',a+'px');log.style.setProperty('--tl-h',Math.max(0,b-a)+'px')};
    const prog=()=>{place();const r=log.getBoundingClientRect(),a=parseFloat(log.style.getPropertyValue('--tl-a'))||0,h=parseFloat(log.style.getPropertyValue('--tl-h'))||1,
      p=Math.min(1,Math.max(0,(innerHeight*.6-(r.top+a))/h));fill.style.transform=`scaleY(${reduce?1:p})`};
    new MutationObserver(()=>requestAnimationFrame(prog)).observe(log,{childList:true});
      addEventListener('scroll',prog,{passive:true});addEventListener('resize',prog);prog();
    }

    // 2. highlighter on key phrases (hero bold phrases + a few in About)
    const marks=[];
    document.querySelectorAll('.hero2 p b').forEach(b=>{b.classList.add('hl');marks.push(b)});
    const story=document.querySelector('.ab-story p');
    if(story){
      for(const phrase of ['clean, tested and easy to trust','Fraud Operations Decision Intelligence','nightly pipeline']){
        const walker=document.createTreeWalker(story,NodeFilter.SHOW_TEXT);let n;
        while((n=walker.nextNode())){const i=n.nodeValue.indexOf(phrase);if(i<0)continue;
          const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+phrase.length);const m=document.createElement('mark');m.className='hl';r.surroundContents(m);marks.push(m);break}
      }
    }
    marks.forEach(m=>reduce?m.classList.add('on'):inView(m,el=>setTimeout(()=>el.classList.add('on'),150),.9));

    // 3. About paragraph: words brighten as you read down
    if(story&&!reduce){
      const words=[];const walk=node=>{[...node.childNodes].forEach(c=>{
        if(c.nodeType===3){const frag=document.createDocumentFragment();c.nodeValue.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w))frag.appendChild(document.createTextNode(w));else{const s=document.createElement('span');s.className='rw';s.textContent=w;words.push(s);frag.appendChild(s)}});c.replaceWith(frag)}
        else if(c.nodeType===1)walk(c)})};
      walk(story);story.classList.add('readalong');
      let last=-1;const upd=()=>{const r=story.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(r.height+innerHeight*.35))),k=Math.round(p*words.length);
        if(k===last)return;last=k;words.forEach((w,i)=>w.classList.toggle('lit',i<k))};
      addEventListener('scroll',upd,{passive:true});upd();
    }

    // 4. rotating job title under the name
    const cap=document.querySelector('.role-cap');
    if(cap&&!reduce){
      const titles=['Analytics Engineer','Data Engineer','Pipeline Builder'];let i=0;
      cap.innerHTML='<span class="rot"><span class="rot-w">Analytics Engineer</span></span>';cap.setAttribute('aria-label','Analytics Engineer');
      const w=cap.querySelector('.rot-w');
      setInterval(()=>{if(document.hidden)return;w.classList.add('out');
        setTimeout(()=>{i=(i+1)%titles.length;w.textContent=titles[i];w.classList.remove('out');w.classList.add('in');requestAnimationFrame(()=>requestAnimationFrame(()=>w.classList.remove('in')))},380)},3200);
    }

    // 5. project cards: a patch of "encrypted" characters follows the cursor
    const CH='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&*+-/<>=';
    if(hoverable&&!reduce)document.querySelectorAll('.w2-card').forEach(card=>{
      const enc=document.createElement('div');enc.className='enc';enc.setAttribute('aria-hidden','true');card.appendChild(enc);
      let t=0;const fillChars=()=>{const n=Math.ceil(card.offsetWidth/6.6)*Math.ceil(card.offsetHeight/13);let s='';for(let k=0;k<n;k++)s+=CH[Math.random()*CH.length|0];enc.textContent=s};
      card.addEventListener('pointerenter',fillChars);
      card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();enc.style.setProperty('--ex',(e.clientX-r.left)+'px');enc.style.setProperty('--ey',(e.clientY-r.top)+'px');
        const now=performance.now();if(now-t>70){t=now;fillChars()}});
    });

    // 6. card borders light up near the cursor
    const spots=[...document.querySelectorAll('.gh-stats,.gh-card,.cta.card,.cf,.contacts')];
    spots.forEach(el=>el.classList.add('spot'));
    if(hoverable&&!reduce){let raf=0,mx=-9999,my=-9999;
      addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;if(raf)return;raf=requestAnimationFrame(()=>{raf=0;
        spots.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<-300||r.top>innerHeight+300)return;
          el.style.setProperty('--sx',(mx-r.left)+'px');el.style.setProperty('--sy',(my-r.top)+'px');
          const dx=Math.max(r.left-mx,0,mx-r.right),dy=Math.max(r.top-my,0,my-r.bottom);el.style.setProperty('--so',Math.max(0,1-Math.hypot(dx,dy)/220).toFixed(2))})})},{passive:true});
    }

    // 7. languages as a donut chart that draws itself
    const bar=document.getElementById('ghBar'),keys=document.getElementById('ghKeys');
    if(bar&&keys){
      const build=()=>{const parts=[...bar.children].map(s=>({k:s.title,v:parseFloat(s.style.flexGrow||s.style.flex)||0,c:s.style.backgroundColor})).filter(p=>p.v>0);if(!parts.length)return;
        const tot=parts.reduce((a,p)=>a+p.v,0),R=52,C=2*Math.PI*R;let acc=0;
        const segs=parts.map((p,i)=>{const len=p.v/tot*C,gap=parts.length>1?2:0,s=`<circle class="seg" r="${R}" cx="70" cy="70" fill="none" stroke="${p.c}" stroke-width="16" stroke-dashoffset="${-acc}" style="--d:${i*120}ms;--da:${Math.max(0,len-gap).toFixed(2)}px ${C.toFixed(2)}px"><title>${p.k} ${Math.round(p.v/tot*100)}%</title></circle>`;acc+=len;return s}).join('');
        const top=parts[0];
        const wrap=document.createElement('div');wrap.className='donut-wrap';
        wrap.innerHTML=`<svg class="donut" viewBox="0 0 140 140" role="img" aria-label="Languages by code size: ${parts.map(p=>p.k+' '+Math.round(p.v/tot*100)+'%').join(', ')}"><circle r="${R}" cx="70" cy="70" fill="none" stroke="#141c27" stroke-width="16"/><g transform="rotate(-90 70 70)">${segs}</g><text x="70" y="66" text-anchor="middle" class="d-big">${Math.round(top.v/tot*100)}%</text><text x="70" y="84" text-anchor="middle" class="d-sm">${top.k}</text></svg>`;
        bar.replaceWith(wrap);wrap.appendChild(keys);
        reduce?wrap.classList.add('drawn'):inView(wrap,w=>w.classList.add('drawn'),.4)};
      build();
    }

  })();

}
