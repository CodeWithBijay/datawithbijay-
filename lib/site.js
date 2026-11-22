// All site behaviour: loaders, pages, Pixel, case studies, résumé, blog post, contact form.
// Runs once in the browser after the page loads (started by components/Site.tsx).
export default function init() {

/* SQL loader */
(function(){const L=document.getElementById('ldr'),Q=document.getElementById('ldrQ'),R=document.getElementById('ldrRes'),bar=document.getElementById('ldrBar'),pct=document.getElementById('ldrPct'),stat=document.getElementById('ldrStat');
document.body.style.overflow='hidden';
const lines=[[['c','-- who built this website?']],[['k','SELECT'],['p',' name, role, based_in, status']],[['k','FROM'],['p','   portfolio.engineers']],[['k','WHERE'],['p','  name = '],['s',"'Bijay Paudel'"],['p',';']]];
const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;');
let done=false,timers=[];const T=(f,ms)=>timers.push(setTimeout(f,ms));
function render(n){let left=n,out='';for(const ln of lines){for(const [c,t] of ln){if(left<=0)break;const part=t.slice(0,left);left-=part.length;out+=`<span class="${c}">${esc(part)}</span>`}if(left<=0)break;out+='\n';left-=0}return out}
const total=lines.reduce((a,l)=>a+l.reduce((b,[,t])=>b+t.length,0),0);
function finish(){if(done)return;done=true;timers.forEach(clearTimeout);L.classList.add('out');document.body.style.overflow='';setTimeout(()=>L.remove(),700)}
if(matchMedia('(prefers-reduced-motion: reduce)').matches){Q.innerHTML=render(total);R.hidden=false;bar.style.width='100%';pct.textContent='100%';T(finish,900)}
else{const flat=lines.map(l=>l.map(x=>x[1]).join('')).join('');let i=0;
 const step=()=>{if(done)return;i++;Q.innerHTML=render(i)+'<span class="cur"></span>';if(i>=total){T(run,250);return}
  const ch=flat[i-1]||'',nx=flat[i]||'';let d=11+Math.random()*13;if(i===lens[0]||i===lens[1]||i===lens[2])d+=90;if(ch===','||ch==='=')d+=18;T(step,d)};
 const lens=[];{let a=0;for(const l of lines){a+=l.reduce((b,[,t])=>b+t.length,0);lens.push(a)}}
 Q.innerHTML='<span class="cur"></span>';T(step,250);
 function run(){Q.innerHTML=render(total);document.getElementById('ldrClock').textContent='running…';T(()=>{R.hidden=false;document.getElementById('ldrClock').textContent='done';let p=0;const fill=()=>{p=Math.min(100,p+12+Math.random()*12);bar.style.width=p+'%';pct.textContent=Math.round(p)+'%';if(p<100)T(fill,70);else{stat.textContent='1 row returned · loading portfolio';T(finish,350)}};T(fill,180)},280)}}
L.addEventListener('click',finish);addEventListener('keydown',function k(){finish();removeEventListener('keydown',k)},{once:true});
window.__replayLoader=()=>{sessionStorage.removeItem('x');location.reload()};})();

/* BIJAY particles — same effect as the live site */
(function(){
    const h1=document.getElementById('nameH1'),word=document.getElementById('bj'),c=document.getElementById('bjDots');if(!c)return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return; // keep the plain heading
    const x=c.getContext('2d');let pts=[],dpr=1,PAD=70,ready=false;
    function build(){
      dpr=Math.min(devicePixelRatio||1,2);
      const hb=h1.getBoundingClientRect(),wb=word.getBoundingClientRect();
      const W=wb.width+PAD*2,H=wb.height+PAD*2;
      c.style.left=(wb.left-hb.left-PAD)+'px';c.style.top=(wb.top-hb.top-PAD)+'px';c.style.width=W+'px';c.style.height=H+'px';
      c.width=Math.round(W*dpr);c.height=Math.round(H*dpr);
      // draw the word off screen with the heading's own font and letter positions
      const cs=getComputedStyle(h1),fs=parseFloat(cs.fontSize);
      const o=document.createElement('canvas');o.width=c.width;o.height=c.height;const g=o.getContext('2d');g.scale(dpr,dpr);
      g.font=`700 ${fs}px "IBM Plex Sans Condensed", "Space Grotesk", sans-serif`;g.textBaseline='alphabetic';g.fillStyle='#fff';
      const m=g.measureText('B'),asc=m.fontBoundingBoxAscent||fs*.8,desc=m.fontBoundingBoxDescent||fs*.2;
      const t=word.firstChild;
      for(let i=0;i<t.length;i++){const r=document.createRange();r.setStart(t,i);r.setEnd(t,i+1);const b=r.getBoundingClientRect();
        g.fillText(t.data[i].toUpperCase(),b.left-wb.left+PAD,b.top-wb.top+PAD+(b.height-(asc+desc))/2+asc)}
      const img=g.getImageData(0,0,o.width,o.height).data,step=Math.max(2,Math.round((innerWidth<760?1.7:2)*dpr));
      pts=[];
      for(let y=0;y<o.height;y+=step)for(let xx=0;xx<o.width;xx+=step){
        if(img[(y*o.width+xx)*4+3]<128)continue;
        pts.push({hx:xx,hy:y,x:Math.random()*o.width,y:Math.random()*o.height,vx:0,vy:0,ph:Math.random()*6.283,sp:.6+Math.random()*1.2,a:.75+Math.random()*.25});
      }
      h1.classList.add('pt');ready=true;
    }
    const mouse={x:-1e5,y:-1e5};
    function track(cx,cy){const r=c.getBoundingClientRect();mouse.x=(cx-r.left)*dpr;mouse.y=(cy-r.top)*dpr;window.__nameHover=cx>r.left&&cx<r.right&&cy>r.top&&cy<r.bottom}
    addEventListener('mousemove',e=>track(e.clientX,e.clientY),{passive:true});
    addEventListener('touchmove',e=>{const t=e.touches[0];track(t.clientX,t.clientY)},{passive:true});
    addEventListener('touchend',()=>{mouse.x=mouse.y=-1e5});
    addEventListener('mouseout',e=>{if(!e.relatedTarget){mouse.x=mouse.y=-1e5}});
    function frame(now){
      requestAnimationFrame(frame);if(!ready)return;
      const r=c.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
      x.clearRect(0,0,c.width,c.height);
      const R=(innerWidth<760?55:80)*dpr,R2=R*R,jit=.9*dpr,sz=Math.max(1,1.15*dpr),t=now/1000;
      x.fillStyle='#e6f1fb';
      for(const p of pts){
        // restless: every particle wanders a little around its home
        const tx=p.hx+Math.cos(t*p.sp+p.ph)*jit,ty=p.hy+Math.sin(t*p.sp*1.3+p.ph)*jit;
        const dx=p.x-mouse.x,dy=p.y-mouse.y,d2=dx*dx+dy*dy;
        if(d2<R2){const d=Math.sqrt(d2)||1,f=(1-d/R)*6*dpr;p.vx+=dx/d*f+(Math.random()-.5)*dpr;p.vy+=dy/d*f+(Math.random()-.5)*dpr}
        p.vx+=(tx-p.x)*.06;p.vy+=(ty-p.y)*.06;p.vx*=.82;p.vy*=.82;p.x+=p.vx;p.y+=p.vy;
        x.globalAlpha=p.a;x.fillRect(p.x,p.y,sz,sz);
      }
      x.globalAlpha=1;
    }
    (document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{build();requestAnimationFrame(frame)});
    let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(build,200)});
  })();
/* liquid "Open to roles" pill — same effect as the live site */
(function(){
    const a=document.querySelector('.open-pill.liquid');if(!a)return;
    const c=a.querySelector('canvas.lq'),x=c.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    // deep ocean → teal → mint, with pale-mint highlights
    const PAL=[[3,12,26],[6,30,56],[12,62,108],[44,128,196],[125,211,252]],SPEC=[226,244,255];
    const CELL=2,off=document.createElement('canvas'),ox=off.getContext('2d');
    let gw,gh,h0,h1,img,vis=true,hov=0,hovT=0,ptr=null,lastP=null,t0=performance.now();
    function size(){const r=a.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);c.width=r.width*d;c.height=r.height*d;
      gw=Math.max(8,Math.ceil(r.width/CELL)+2);gh=Math.max(6,Math.ceil(r.height/CELL)+2);h0=new Float32Array(gw*gh);h1=new Float32Array(gw*gh);
      off.width=gw;off.height=gh;img=ox.createImageData(gw,gh)}
    size();addEventListener('resize',size);if(window.ResizeObserver)new ResizeObserver(()=>{const r=a.getBoundingClientRect();if(r.width&&Math.abs(c.width-r.width*Math.min(devicePixelRatio||1,2))>1)size()}).observe(a);
    function drop(gx,gy,r,amp){gx|=0;gy|=0;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const X=gx+i,Y=gy+j;if(X<1||Y<1||X>=gw-1||Y>=gh-1)continue;
      const d=Math.hypot(i,j)/r;if(d<1)h0[Y*gw+X]+=amp*(Math.cos(d*Math.PI)+1)*.5}}
    a.addEventListener('pointermove',e=>{const r=a.getBoundingClientRect(),p=[(e.clientX-r.left)/CELL+1,(e.clientY-r.top)/CELL+1];
      if(lastP){const n=Math.ceil(Math.hypot(p[0]-lastP[0],p[1]-lastP[1]));for(let k=1;k<=n;k++)drop(lastP[0]+(p[0]-lastP[0])*k/n,lastP[1]+(p[1]-lastP[1])*k/n,5,.32)}
      else drop(p[0],p[1],6,1.2);lastP=p});
    a.addEventListener('pointerenter',()=>{hovT=1;window.__lqHover=1});a.addEventListener('pointerleave',()=>{hovT=0;lastP=null;window.__lqHover=0});
    a.addEventListener('pointerdown',e=>{const r=a.getBoundingClientRect();drop((e.clientX-r.left)/CELL+1,(e.clientY-r.top)/CELL+1,9,2.5)});
    new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe(a);
    function step(){for(let y=1;y<gh-1;y++)for(let i=y*gw+1,e=i+gw-2;i<e;i++){h1[i]=((h0[i-1]+h0[i+1]+h0[i-gw]+h0[i+gw])*.5-h1[i])*.975}const t=h0;h0=h1;h1=t}
    function render(t){const d=img.data;
      for(let y=1;y<gh-1;y++)for(let X=1;X<gw-1;X++){const i=y*gw+X,dx=h0[i+1]-h0[i-1],dy=h0[i+gw]-h0[i-gw];
        // flowing metal pattern, displaced by the ripple slopes
        const u=X+dx*7,v=y+dy*7,f=.5+.5*Math.sin(u*.05+t*.55+Math.sin(v*.15+t*.8+u*.013)*1.8),g=.5+.5*Math.sin(u*.02-t*.35+v*.08);
        const lit=Math.max(0,-dx*.75-dy*.6),spec=Math.min(.8,Math.pow(lit*1.6,2)*.85),k=Math.min(1,(.12+.62*f*f+.22*g)*(.62+.38*hov)),
          q=k*(PAL.length-1),n=Math.min(PAL.length-2,q|0),w=q-n,A=PAL[n],B=PAL[n+1];
        const o=i*4;for(let ch=0;ch<3;ch++){const base=A[ch]+(B[ch]-A[ch])*w;d[o+ch]=base+(SPEC[ch]-base)*spec}d[o+3]=255}
      ox.putImageData(img,0,0);x.imageSmoothingEnabled=true;x.drawImage(off,1,1,gw-2,gh-2,0,0,c.width,c.height);
      // glossy top sheen
      const s=x.createLinearGradient(0,0,0,c.height);s.addColorStop(0,'rgba(210,235,255,.10)');s.addColorStop(.45,'rgba(210,235,255,0)');s.addColorStop(1,'rgba(0,8,14,.35)');x.fillStyle=s;x.fillRect(0,0,c.width,c.height)}
    let lastDrop=0;
    function frame(now){requestAnimationFrame(frame);if(!vis)return;const t=(now-t0)/1000;
      hov+=(hovT-hov)*.08;
      if(!reduce&&now-lastDrop>(hovT?260:900)){lastDrop=now;drop(1+Math.random()*(gw-2),1+Math.random()*(gh-2),3+Math.random()*3|0,.3+Math.random()*(hovT?.5:.25))}
      if(!reduce){step();step()}render(reduce?0:t)}
    requestAnimationFrame(frame);
  })();
/* Pixel — same behaviour as the live site (answers fall back to the built-in ones here) */
(function(){
    const $=id=>document.getElementById(id),root=$('pixel'),bot=$('pxBot'),chat=$('pxChat'),log=$('pxLog'),form=$('pxForm'),inp=$('pxIn'),greet=$('pxGreet'),mode=$('pxMode');
    const history=[];let busy=false;
    // answers come from /api/chat (Gemini, server-side key); if that is unavailable Pixel uses the built-in answers below
    const sample=async(question,history)=>{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,history}),signal:AbortSignal.timeout(30000)});
      if(!r.ok)throw new Error('chat '+r.status);const j=await r.json();if(!j.text)throw new Error('empty');return{text:j.text}};

    // offline answers
    const A=[
      [/fraud|alert|logistic|streamlit|research/,'His master’s research project, Fraud Operations Decision Intelligence, ranks fraud alerts so a review team works the riskiest ones first. Alerts are scored with a logistic regression model on PostgreSQL and served through Streamlit. Code is on github.com/CodeWithBijay.'],
      [/help|nonprofit|volunteer|dashboard|donor|jotform|medical/,'He’s the volunteer data engineer at St. Louis HELP, a nonprofit that lends donated medical equipment for free. He built a nightly pipeline: form data through an API with Python → PostgreSQL raw, cleaned and reporting layers → GitHub Actions on a schedule → an impact dashboard and automatic donor reports.'],
      [/stack|skill|tool|tech|sql|python|azure|fabric|power ?bi|know/,'SQL, Python and PostgreSQL are his core, plus pandas, data modeling, ETL/ELT, GitHub Actions, Microsoft Fabric, Azure Data Factory, Azure Synapse, Power BI and Streamlit.'],
      [/educat|degree|school|universit|study|master|m\.?s|graduat|slu|pokhara/,'He’s finishing an M.S. in Informatics (Analytics) at Saint Louis University, graduating December 2026. Before that: a B.S. in Computer Information Systems from Pokhara University, Dean’s List 2023.'],
      [/visa|sponsor|authori[sz]|work permit|opt\b|stem|citizen|green card|h-?1b|f-?1|legally work|right to work|eligible to work/,'Yes — Bijay is authorized to work in the U.S. As an F-1 student, after graduating in December 2026 he works on OPT (12 months) plus the STEM OPT extension (24 months): up to 3 years, and no visa sponsorship is needed to start. For the STEM OPT years the employer just needs to use E-Verify and sign the standard I-983 training plan. For longer-term questions, message him on LinkedIn: linkedin.com/in/b-paudel'],
      [/hire|role|job|open|availab|work with|recruit|position/,'Yes! Bijay is open to analytics engineering and data engineering roles, graduating December 2026, and is authorized to work in the U.S. on OPT + STEM OPT (up to 3 years, no sponsorship needed to start). The best way to reach him is LinkedIn: linkedin.com/in/b-paudel 🙂'],
      [/contact|email|reach|linkedin|github|resume|résumé|cv/,'Use the contact form at the bottom of the page, message him on LinkedIn (linkedin.com/in/b-paudel), see his code on GitHub (github.com/CodeWithBijay), or view and download his résumé from the Résumé button at the top.'],
      [/experience|work|job|intern|gsa|marketing/,'Volunteer Data Engineer at St. Louis HELP, GSA Representative at SLU’s School for Professional Studies, PR & Marketing Coordinator at Global Student Connect, and a Digital Strategy internship with Excelerate.'],
      [/cert/,'Two Codecademy certificates: Advanced SQL Data Analysis and the Computer Science Career Path.'],
      [/where|locat|based|live/,'He’s based in the United States, on Central Time.'],
      [/what.*(do|does)|who|about|analytics engineer/,'Bijay is an analytics engineer: he builds reliable data pipelines and clean, tested data models that teams can trust for analytics — currently a grad student at Saint Louis University and volunteer data engineer at St. Louis HELP.'],
      [/^(hi|hey|hello|yo|sup)\b/,'Hi there! 👋 Ask me about Bijay’s projects, skills, education, or how to reach him.'],
      [/thank/,'Anytime! 🤖']];
    const offline=q=>{q=q.toLowerCase();for(const [r,a] of A)if(r.test(q))return a;
      return 'I don’t know that one yet. Try asking about his projects, skills or education — or message Bijay on LinkedIn: linkedin.com/in/b-paudel'};

    function add(who,text){const d=document.createElement('div');d.className='px-msg '+who;d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;return d}
    async function ask(q){q=q.trim();if(!q||busy)return;busy=true;add('me',q);inp.value='';$('pxQuick').hidden=true;
      const d=add('bot','');d.classList.add('typing');d.innerHTML='<i></i><i></i><i></i>';let ans='';
      {try{
          const r=await sample(q,history.slice(-8).map(m=>({role:m.r==='u'?'visitor':'pixel',text:m.t})));
          ans=(r.text||'').trim();
        }catch(e){ans=''}}
      if(!ans){await new Promise(r=>setTimeout(r,450+Math.random()*400));ans=offline(q)}
      d.classList.remove('typing');d.textContent=ans;log.scrollTop=log.scrollHeight;
      history.push({r:'u',t:q},{r:'b',t:ans});busy=false;inp.focus()}

    function open(on){chat.hidden=!on;bot.setAttribute('aria-expanded',on);root.classList.toggle('open',on);
      if(on){greet.hidden=true;if(!log.children.length)add('bot','Hi! I’m Pixel 🤖 I know all about Bijay — his projects, skills and how to reach him. What would you like to know?');setTimeout(()=>inp.focus(),50)}}
    bot.onclick=()=>open(chat.hidden);$('pxClose').onclick=()=>open(false);$('pxCloud').onclick=()=>open(true);$('pxFormBot').onclick=()=>open(true);
    addEventListener('keydown',e=>{if(e.key==='Escape'&&!chat.hidden)open(false)});
    form.onsubmit=e=>{e.preventDefault();ask(inp.value)};
    $('pxQuick').addEventListener('click',e=>{if(e.target.tagName==='BUTTON')ask(e.target.textContent)});
    // eyes of every Pixel follow the cursor
    let lastMove=0;
    let eyeRaf=0,ex=0,ey=0;   // one update per frame, only for the Pixels on screen
      addEventListener('pointermove',e=>{lastMove=Date.now();ex=e.clientX;ey=e.clientY;if(eyeRaf)return;eyeRaf=requestAnimationFrame(()=>{eyeRaf=0;
        document.querySelectorAll('.px-look,.px-look-fly').forEach(l=>{const r=l.ownerSVGElement.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)return;
        const dx=ex-(r.left+r.width/2),dy=ey-(r.top+r.height*.4),d=Math.hypot(dx,dy)||1,k=Math.min(1,d/300);
        l.style.transform=`translate(${(dx/d*4*k).toFixed(2)}px,${(dy/d*3*k).toFixed(2)}px)`})})},{passive:true});
    // peek loop: fly up from below the corner, say Hi, look around, fly back down
    const reduceM=matchMedia('(prefers-reduced-motion: reduce)').matches,wait=ms=>new Promise(r=>setTimeout(r,ms));
    let hovering=false,inContact=false;
    bot.addEventListener('pointerenter',()=>hovering=true);bot.addEventListener('pointerleave',()=>hovering=false);
    const stay=()=>hovering||!chat.hidden;
    function glance(x){if(Date.now()-lastMove<1500)return;root.querySelector('.px-look').style.transform=`translate(${x}px,0)`}
    (async function peek(){await wait(1200);
      while(true){
        while(inContact)await wait(400);
        root.classList.add('px-up');await wait(650);if(!inContact)root.classList.add('px-hi');
        await wait(1800);glance(-4);await wait(1300);glance(4);await wait(1300);glance(0);
        await wait(reduceM?60000:5200);
        while(stay()&&!inContact)await wait(500);
        root.classList.remove('px-hi');await wait(450);
        if(!stay()&&!reduceM)root.classList.remove('px-up');
        await wait(2600);
      }})();
    // at the contact form the corner Pixel leaves and one appears beside the form
    const cform=$('contact-form'),fbot=$('pxFormBot');
    // one continuous flight between the corner and the top of the form (and back)
    const flyer=$('pxFlyer'),fsvg=flyer.querySelector('svg');let trip=null,tripId=0;
    function cornerRect(){const r=bot.getBoundingClientRect(),m=new DOMMatrixReadOnly(getComputedStyle(bot).transform);
      const ty=root.classList.contains('open')?0:m.m42;return{x:r.left,y:r.top-ty,w:r.width,h:r.height}}
    function formRect(){const sv=fbot.querySelector('svg'),r=fbot.getBoundingClientRect();return{x:r.left,y:r.top,w:sv.getBoundingClientRect().width||92,h:sv.getBoundingClientRect().height||86}}
    async function flyTo(from,to,tilt){if(trip)trip.cancel();
      flyer.style.left=from.x+'px';flyer.style.top=from.y+'px';fsvg.style.width=from.w+'px';fsvg.style.height=from.h+'px';
      const dx=to.x-from.x,dy=to.y-from.y,k=to.w/from.w,lift=Math.min(160,Math.abs(dx)*.25+60);
      trip=flyer.animate([
        {transform:'translate(0,0) rotate(0deg) scale(1)'},
        {transform:`translate(${dx*.15}px,${dy*.15-lift*.6}px) rotate(${tilt}deg) scale(${1+(k-1)*.15})`,offset:.2},
        {transform:`translate(${dx*.55}px,${dy*.55-lift}px) rotate(${tilt*.6}deg) scale(${1+(k-1)*.55})`,offset:.55},
        {transform:`translate(${dx}px,${dy}px) rotate(${to.r||0}deg) scale(${k})`}],
        {duration:1300,easing:'cubic-bezier(.45,0,.25,1)',fill:'forwards'});
      const me=trip;try{await me.finished}catch(e){return false}
      return true}
    // exactly one Pixel is ever visible: corner, flyer (mid-trip) or form. Each scroll change starts a new trip
    // from wherever Pixel is right now; an older trip that gets overtaken simply stops.
    let gen=0;
    function show(state){root.classList.toggle('px-away',state!=='corner');fbot.classList.toggle('in',state==='form');flyer.classList.toggle('on',state==='fly');
      if(state!=='fly'&&trip){trip.cancel();trip=null}}
    async function go(toForm){const g=++gen;
      let from;
      if(flyer.classList.contains('on')){const r=fsvg.getBoundingClientRect();from={x:r.left,y:r.top,w:r.width,h:r.height}}
      else if(fbot.classList.contains('in'))from=formRect();
      else if(root.classList.contains('px-up')||root.classList.contains('open'))from=cornerRect();
      else{const c=cornerRect();from={...c,y:innerHeight+10}}
      if(trip){trip.cancel();trip=null}
      root.classList.remove('px-hi');
      if(reduceM){if(!toForm)root.classList.add('px-up');show(toForm?'form':'corner');return}
      flyer.style.left=from.x+'px';flyer.style.top=from.y+'px';fsvg.style.width=from.w+'px';fsvg.style.height=from.h+'px';show('fly');
      if(toForm){let last='',same=0,t0=performance.now();   // let the scroll settle so the landing spot is right
        while(same<4&&performance.now()-t0<900){await new Promise(r=>requestAnimationFrame(r));if(g!==gen)return;const fr=formRect(),k=Math.round(fr.x)+','+Math.round(fr.y);same=k===last?same+1:0;last=k}}
      else root.classList.add('px-up');
      const to=toForm?{...formRect(),r:-8}:cornerRect();
      const ok=await flyTo(from,to,toForm?-14:12);
      if(g!==gen||!ok)return;
      show(toForm?'form':'corner')}
    new IntersectionObserver(([e])=>{const now=e.isIntersecting;if(now===inContact)return;inContact=now;fbot.tabIndex=now?0:-1;go(now)},{threshold:.3}).observe(cform);
    root.addEventListener('pointerenter',()=>{window.__uiHover=1});root.addEventListener('pointerleave',()=>{window.__uiHover=0});
  })();
/* tool logos (single-colour, blueprint style) */
(function(){const I={"Python": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M11.858 0c-.978.005-1.913.088-2.736.234C6.7.662 6.26 1.558 6.26 3.21v2.182h5.725v.727H4.111c-1.664 0-3.121 1-3.577 2.903-.526 2.181-.549 3.542 0 5.82.407 1.694 1.379 2.902 3.043 2.902h1.969v-2.616c0-1.89 1.635-3.557 3.576-3.557h5.72c1.591 0 2.862-1.31 2.862-2.91v-5.45c0-1.553-1.309-2.718-2.863-2.977A18 18 0 0 0 11.858 0M8.762 1.755c.591 0 1.074.491 1.074 1.095 0 .601-.483 1.087-1.074 1.087A1.08 1.08 0 0 1 7.688 2.85c0-.604.48-1.095 1.074-1.095m9.656 4.364v2.543c0 1.971-1.671 3.63-3.577 3.63H9.122c-1.566 0-2.862 1.34-2.862 2.91v5.452c0 1.551 1.349 2.464 2.862 2.91 1.813.532 3.55.628 5.72 0 1.44-.418 2.862-1.258 2.862-2.91V18.47h-5.719v-.727h8.582c1.664 0 2.284-1.16 2.862-2.903.598-1.793.573-3.518 0-5.819-.41-1.656-1.196-2.903-2.862-2.903zm-3.216 13.807a1.08 1.08 0 0 1 1.074 1.088c0 .604-.48 1.094-1.074 1.094-.592 0-1.075-.49-1.075-1.094 0-.601.483-1.088 1.075-1.088\"/></svg>", "PostgreSQL": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3411-2.2935.1312-2.5256-.0191 1.342-2.0482 2.445-4.522 3.0411-6.8297.2714-1.0507.7982-3.5237.1222-4.7316a1.5641 1.5641 0 0 0-.1509-.235C21.6931.9086 19.8007.0248 17.5099.0005c-1.4947-.0158-2.7705.3461-3.1161.4794a9.449 9.449 0 0 0-.5159-.0816 8.044 8.044 0 0 0-1.3114-.1278c-1.1822-.0184-2.2038.2642-3.0498.8406-.8573-.3211-4.7888-1.645-7.2219.0788C.9359 2.1526.3086 3.8733.4302 6.3043c.0409.818.5069 3.334 1.2423 5.7436.4598 1.5065.9387 2.7019 1.4334 3.582.553.9942 1.1259 1.5933 1.7143 1.7895.4474.1491 1.1327.1441 1.8581-.7279.8012-.9635 1.5903-1.8258 1.9446-2.2069.4351.2355.9064.3625 1.39.3772a.0569.0569 0 0 0 .0004.0041 11.0312 11.0312 0 0 0-.2472.3054c-.3389.4302-.4094.5197-1.5002.7443-.3102.064-1.1344.2339-1.1464.8115-.0025.1224.0329.2309.0919.3268.2269.4231.9216.6097 1.015.6331 1.3345.3335 2.5044.092 3.3714-.6787-.017 2.231.0775 4.4174.3454 5.0874.2212.5529.7618 1.9045 2.4692 1.9043.2505 0 .5263-.0291.8296-.0941 1.7819-.3821 2.5557-1.1696 2.855-2.9059.1503-.8707.4016-2.8753.5388-4.1012.0169-.0703.0357-.1207.057-.1362.0007-.0005.0697-.0471.4272.0307a.3673.3673 0 0 0 .0443.0068l.2539.0223.0149.001c.8468.0384 1.9114-.1426 2.5312-.4308.6438-.2988 1.8057-1.0323 1.5951-1.6698zM2.371 11.8765c-.7435-2.4358-1.1779-4.8851-1.2123-5.5719-.1086-2.1714.4171-3.6829 1.5623-4.4927 1.8367-1.2986 4.8398-.5408 6.108-.13-.0032.0032-.0066.0061-.0098.0094-2.0238 2.044-1.9758 5.536-1.9708 5.7495-.0002.0823.0066.1989.0162.3593.0348.5873.0996 1.6804-.0735 2.9184-.1609 1.1504.1937 2.2764.9728 3.0892.0806.0841.1648.1631.2518.2374-.3468.3714-1.1004 1.1926-1.9025 2.1576-.5677.6825-.9597.5517-1.0886.5087-.3919-.1307-.813-.5871-1.2381-1.3223-.4796-.839-.9635-2.0317-1.4155-3.5126zm6.0072 5.0871c-.1711-.0428-.3271-.1132-.4322-.1772.0889-.0394.2374-.0902.4833-.1409 1.2833-.2641 1.4815-.4506 1.9143-1.0002.0992-.126.2116-.2687.3673-.4426a.3549.3549 0 0 0 .0737-.1298c.1708-.1513.2724-.1099.4369-.0417.156.0646.3078.26.3695.4752.0291.1016.0619.2945-.0452.4444-.9043 1.2658-2.2216 1.2494-3.1676 1.0128zm2.094-3.988-.0525.141c-.133.3566-.2567.6881-.3334 1.003-.6674-.0021-1.3168-.2872-1.8105-.8024-.6279-.6551-.9131-1.5664-.7825-2.5004.1828-1.3079.1153-2.4468.079-3.0586-.005-.0857-.0095-.1607-.0122-.2199.2957-.2621 1.6659-.9962 2.6429-.7724.4459.1022.7176.4057.8305.928.5846 2.7038.0774 3.8307-.3302 4.7363-.084.1866-.1633.3629-.2311.5454zm7.3637 4.5725c-.0169.1768-.0358.376-.0618.5959l-.146.4383a.3547.3547 0 0 0-.0182.1077c-.0059.4747-.054.6489-.115.8693-.0634.2292-.1353.4891-.1794 1.0575-.11 1.4143-.8782 2.2267-2.4172 2.5565-1.5155.3251-1.7843-.4968-2.0212-1.2217a6.5824 6.5824 0 0 0-.0769-.2266c-.2154-.5858-.1911-1.4119-.1574-2.5551.0165-.5612-.0249-1.9013-.3302-2.6462.0044-.2932.0106-.5909.019-.8918a.3529.3529 0 0 0-.0153-.1126 1.4927 1.4927 0 0 0-.0439-.208c-.1226-.4283-.4213-.7866-.7797-.9351-.1424-.059-.4038-.1672-.7178-.0869.067-.276.1831-.5875.309-.9249l.0529-.142c.0595-.16.134-.3257.213-.5012.4265-.9476 1.0106-2.2453.3766-5.1772-.2374-1.0981-1.0304-1.6343-2.2324-1.5098-.7207.0746-1.3799.3654-1.7088.5321a5.6716 5.6716 0 0 0-.1958.1041c.0918-1.1064.4386-3.1741 1.7357-4.4823a4.0306 4.0306 0 0 1 .3033-.276.3532.3532 0 0 0 .1447-.0644c.7524-.5706 1.6945-.8506 2.802-.8325.4091.0067.8017.0339 1.1742.081 1.939.3544 3.2439 1.4468 4.0359 2.3827.8143.9623 1.2552 1.9315 1.4312 2.4543-1.3232-.1346-2.2234.1268-2.6797.779-.9926 1.4189.543 4.1729 1.2811 5.4964.1353.2426.2522.4522.2889.5413.2403.5825.5515.9713.7787 1.2552.0696.087.1372.1714.1885.245-.4008.1155-1.1208.3825-1.0552 1.717-.0123.1563-.0423.4469-.0834.8148-.0461.2077-.0702.4603-.0994.7662zm.8905-1.6211c-.0405-.8316.2691-.9185.5967-1.0105a2.8566 2.8566 0 0 0 .135-.0406 1.202 1.202 0 0 0 .1342.103c.5703.3765 1.5823.4213 3.0068.1344-.2016.1769-.5189.3994-.9533.6011-.4098.1903-1.0957.333-1.7473.3636-.7197.0336-1.0859-.0807-1.1721-.151zm.5695-9.2712c-.0059.3508-.0542.6692-.1054 1.0017-.055.3576-.112.7274-.1264 1.1762-.0142.4368.0404.8909.0932 1.3301.1066.887.216 1.8003-.2075 2.7014a3.5272 3.5272 0 0 1-.1876-.3856c-.0527-.1276-.1669-.3326-.3251-.6162-.6156-1.1041-2.0574-3.6896-1.3193-4.7446.3795-.5427 1.3408-.5661 2.1781-.463zm.2284 7.0137a12.3762 12.3762 0 0 0-.0853-.1074l-.0355-.0444c.7262-1.1995.5842-2.3862.4578-3.4385-.0519-.4318-.1009-.8396-.0885-1.2226.0129-.4061.0666-.7543.1185-1.0911.0639-.415.1288-.8443.1109-1.3505.0134-.0531.0188-.1158.0118-.1902-.0457-.4855-.5999-1.938-1.7294-3.253-.6076-.7073-1.4896-1.4972-2.6889-2.0395.5251-.1066 1.2328-.2035 2.0244-.1859 2.0515.0456 3.6746.8135 4.8242 2.2824a.908.908 0 0 1 .0667.1002c.7231 1.3556-.2762 6.2751-2.9867 10.5405zm-8.8166-6.1162c-.025.1794-.3089.4225-.6211.4225a.5821.5821 0 0 1-.0809-.0056c-.1873-.026-.3765-.144-.5059-.3156-.0458-.0605-.1203-.178-.1055-.2844.0055-.0401.0261-.0985.0925-.1488.1182-.0894.3518-.1226.6096-.0867.3163.0441.6426.1938.6113.4186zm7.9305-.4114c.0111.0792-.049.201-.1531.3102-.0683.0717-.212.1961-.4079.2232a.5456.5456 0 0 1-.075.0052c-.2935 0-.5414-.2344-.5607-.3717-.024-.1765.2641-.3106.5611-.352.297-.0414.6111.0088.6356.1851z\"/></svg>", "pandas": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M16.922 0h2.623v18.104h-2.623zm-4.126 12.94h2.623v2.57h-2.623zm0-7.037h2.623v5.446h-2.623zm0 11.197h2.623v5.446h-2.623zM4.456 5.896h2.622V24H4.455zm4.213 2.559h2.623v2.57H8.67zm0 4.151h2.623v5.447H8.67zm0-11.187h2.623v5.446H8.67Z\"/></svg>", "NumPy": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M10.315 4.876L6.3048 2.8517l-4.401 2.1965 4.1186 2.0683zm1.8381.9277l4.2045 2.1223-4.3622 2.1906-4.125-2.0718zm5.6153-2.9213l4.3193 2.1658-3.863 1.9402-4.2131-2.1252zm-1.859-.9329L12.021 0 8.1742 1.9193l4.0068 2.0208zm-3.0401 16.7443V24l4.7107-2.3507-.0053-5.3085zm4.7037-4.2057l-.0052-5.2528-4.6985 2.3356v5.2546zm5.6553-.9845v5.327l-4.0178 2.0052-.0029-5.3028zm0-1.8626V6.4214l-4.0253 2.001.0034 5.2633zM11.2062 11.571L8.0333 9.9756v6.895s-3.8804-8.2564-4.2399-8.998c-.0463-.0957-.2371-.2007-.2858-.2262C2.8118 7.2812.773 6.2485.773 6.2485V18.43l2.8204 1.5076v-6.3674s3.8392 7.3775 3.878 7.458c.0389.0807.4245.8582.8362 1.1314.5485.363 2.8992 1.7766 2.8992 1.7766z\"/></svg>", "GitHub Actions": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M10.984 13.836a.5.5 0 0 1-.353-.146l-.745-.743a.5.5 0 1 1 .706-.708l.392.391 1.181-1.18a.5.5 0 0 1 .708.707l-1.535 1.533a.504.504 0 0 1-.354.146zm9.353-.147l1.534-1.532a.5.5 0 0 0-.707-.707l-1.181 1.18-.392-.391a.5.5 0 1 0-.706.708l.746.743a.497.497 0 0 0 .706-.001zM4.527 7.452l2.557-1.585A1 1 0 0 0 7.09 4.17L4.533 2.56A1 1 0 0 0 3 3.406v3.196a1.001 1.001 0 0 0 1.527.85zm2.03-2.436L4 6.602V3.406l2.557 1.61zM24 12.5c0 1.93-1.57 3.5-3.5 3.5a3.503 3.503 0 0 1-3.46-3h-2.08a3.503 3.503 0 0 1-3.46 3 3.502 3.502 0 0 1-3.46-3h-.558c-.972 0-1.85-.399-2.482-1.042V17c0 1.654 1.346 3 3 3h.04c.244-1.693 1.7-3 3.46-3 1.93 0 3.5 1.57 3.5 3.5S13.43 24 11.5 24a3.502 3.502 0 0 1-3.46-3H8c-2.206 0-4-1.794-4-4V9.899A5.008 5.008 0 0 1 0 5c0-2.757 2.243-5 5-5s5 2.243 5 5a5.005 5.005 0 0 1-4.952 4.998A2.482 2.482 0 0 0 7.482 12h.558c.244-1.693 1.7-3 3.46-3a3.502 3.502 0 0 1 3.46 3h2.08a3.503 3.503 0 0 1 3.46-3c1.93 0 3.5 1.57 3.5 3.5zm-15 8c0 1.378 1.122 2.5 2.5 2.5s2.5-1.122 2.5-2.5-1.122-2.5-2.5-2.5S9 19.122 9 20.5zM5 9c2.206 0 4-1.794 4-4S7.206 1 5 1 1 2.794 1 5s1.794 4 4 4zm9 3.5c0-1.378-1.122-2.5-2.5-2.5S9 11.122 9 12.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5zm9 0c0-1.378-1.122-2.5-2.5-2.5S18 11.122 18 12.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5zm-13 8a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0zm2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0zm12 0c0 1.93-1.57 3.5-3.5 3.5a3.503 3.503 0 0 1-3.46-3.002c-.007.001-.013.005-.021.005l-.506.017h-.017a.5.5 0 0 1-.016-.999l.506-.017c.018-.002.035.006.052.007A3.503 3.503 0 0 1 20.5 17c1.93 0 3.5 1.57 3.5 3.5zm-1 0c0-1.378-1.122-2.5-2.5-2.5S18 19.122 18 20.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5z\"/></svg>", "Git": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M13.09 23.549a1.54 1.54 0 0 1-2.18 0L.451 13.089a1.54 1.54 0 0 1 0-2.179l7.191-7.19 2.733 2.733a1.85 1.85 0 0 0 .964 2.326v6.66a1.849 1.849 0 1 0 1.54 0V8.957l2.508 2.508a1.85 1.85 0 1 0 1.09-1.09l-2.634-2.634a1.85 1.85 0 0 0-2.378-2.377L8.73 2.63 10.91.451a1.54 1.54 0 0 1 2.179 0l10.459 10.46a1.54 1.54 0 0 1 0 2.179z\"/></svg>", "Streamlit": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M16.673 11.32l6.862-3.618c.233-.136.554.12.442.387L20.463 17.1zm-8.556-.229l3.473-5.187c.203-.328.578-.316.793-.028l7.886 11.75zm-3.375 7.25c-.28 0-.835-.284-.993-.716l-3.72-9.46c-.118-.331.139-.614.48-.464l19.474 10.306c-.149.147-.453.337-.72.334z\"/></svg>", "Azure Databricks": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M.95 14.184L12 20.403l9.919-5.55v2.21L12 22.662l-10.484-5.96-.565.308v.77L12 24l11.05-6.218v-4.317l-.515-.309L12 19.118l-9.867-5.653v-2.21L12 16.805l11.05-6.218V6.32l-.515-.308L12 11.974 2.647 6.681 12 1.388l7.76 4.368.668-.411v-.566L12 0 .95 6.27v.72L12 13.207l9.919-5.55v2.26L12 15.52 1.516 9.56l-.565.308Z\"/></svg>", "Jupyter": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M7.157 22.201A1.784 1.799 0 0 1 5.374 24a1.784 1.799 0 0 1-1.784-1.799 1.784 1.799 0 0 1 1.784-1.799 1.784 1.799 0 0 1 1.783 1.799zM20.582 1.427a1.415 1.427 0 0 1-1.415 1.428 1.415 1.427 0 0 1-1.416-1.428A1.415 1.427 0 0 1 19.167 0a1.415 1.427 0 0 1 1.415 1.427zM4.992 3.336A1.047 1.056 0 0 1 3.946 4.39a1.047 1.056 0 0 1-1.047-1.055A1.047 1.056 0 0 1 3.946 2.28a1.047 1.056 0 0 1 1.046 1.056zm7.336 1.517c3.769 0 7.06 1.38 8.768 3.424a9.363 9.363 0 0 0-3.393-4.547 9.238 9.238 0 0 0-5.377-1.728A9.238 9.238 0 0 0 6.95 3.73a9.363 9.363 0 0 0-3.394 4.547c1.713-2.04 5.004-3.424 8.772-3.424zm.001 13.295c-3.768 0-7.06-1.381-8.768-3.425a9.363 9.363 0 0 0 3.394 4.547A9.238 9.238 0 0 0 12.33 21a9.238 9.238 0 0 0 5.377-1.729 9.363 9.363 0 0 0 3.393-4.547c-1.712 2.044-5.003 3.425-8.772 3.425Z\"/></svg>", "R": "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M12 2.746c-6.627 0-12 3.599-12 8.037 0 3.897 4.144 7.144 9.64 7.88V16.26c-2.924-.915-4.925-2.755-4.925-4.877 0-3.035 4.084-5.494 9.12-5.494 5.038 0 8.757 1.683 8.757 5.494 0 1.976-.999 3.379-2.662 4.272.09.066.174.128.258.216.169.149.25.363.372.544 2.128-1.45 3.44-3.437 3.44-5.631 0-4.44-5.373-8.038-12-8.038zm-2.111 4.99v13.516l4.093-.002-.002-5.291h1.1c.225 0 .321.066.549.25.272.22.715.982.715.982l2.164 4.063 4.627-.002-2.864-4.826s-.086-.193-.265-.383a2.22 2.22 0 00-.582-.416c-.422-.214-1.149-.434-1.149-.434s3.578-.264 3.578-3.826c0-3.562-3.744-3.63-3.744-3.63zm4.127 2.93l2.478.002s1.149-.062 1.149 1.127c0 1.165-1.149 1.17-1.149 1.17h-2.478zm1.754 6.119c-.494.049-1.012.079-1.54.088v1.807a16.622 16.622 0 002.37-.473l-.471-.891s-.108-.183-.248-.394c-.039-.054-.08-.098-.111-.137z\"/></svg>", "Azure Data Factory": "<svg viewBox=\"0 0 128 128\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M32.004 0C14.306 0 .01 4.594.01 11.29v112.419c-.036 2.332 1.816 4.255 4.13 4.291H64v-.018h59.7c2.332.036 4.255-1.816 4.29-4.13V45.687a1.03 1.03 0 0 0-1.031-1.068c-.285 0-.57.107-.766.32L95.996 75.12V45.688a1.031 1.031 0 0 0-1.033-1.069c-.285 0-.57.107-.766.32L64.07 75.05l-.07.07V11.29C64 5.182 49.702 0 32.004 0zm0 3.313c13.176 0 24.465 3.221 24.465 7.298 0 4.149-10.986 7.532-24.535 7.532-13.55 0-24.553-3.24-24.553-7.532 0-4.29 11.447-7.299 24.623-7.299zM63.57 13.18c-2.407 5.755-15.594 10.002-31.566 10.002-13.809 0-25.512-3.172-30.004-7.743 4.516 4.473 16.228 7.44 30.004 7.44 15.914 0 29.074-4.204 31.566-9.7zM36.225 93.867h12.873c1.157 0 2.1.944 2.1 2.102v12.873a2.104 2.104 0 0 1-2.1 2.101H36.225a2.106 2.106 0 0 1-2.102-2.101V95.969c-.018-1.158.926-2.102 2.102-2.102zm29.662 0H78.76c1.157 0 2.101.944 2.101 2.102v12.873a2.106 2.106 0 0 1-2.101 2.101H65.887A2.096 2.096 0 0 1 64 109.744v-14.7a2.092 2.092 0 0 1 1.887-1.177zm29.664 0h12.873c1.157 0 2.101.944 2.101 2.102v12.873a2.106 2.106 0 0 1-2.101 2.101H95.55a2.106 2.106 0 0 1-2.102-2.101V95.969c-.018-1.158.927-2.102 2.102-2.102z\"/></svg> ", "Azure Synapse": "<svg viewBox=\"0 0 128 128\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M43.983 4.653a5.911 5.911 0 015.6 4.022l35.91 106.396a5.911 5.911 0 01-5.603 7.802h41.38a5.917 5.917 0 004.8-2.465 5.909 5.909 0 00.798-5.34L90.961 8.672a5.91 5.91 0 00-5.602-4.022zm-1.336.478a5.92 5.92 0 00-5.61 4.029L1.132 115.55a5.91 5.91 0 005.6 7.8h28.893c1.239 0 2.446-.41 3.452-1.113a5.923 5.923 0 002.157-2.916l7.019-20.71-13.411-12.857c-.246-.273-1.353-2.274-.369-4.002 1.108-1.659 2.955-1.659 2.955-1.659h17.285l9.074-26.145L48.274 8.321c-.042-.205-.914-1.365-2.281-2.28-1.37-.915-3.345-.909-3.345-.909zm-4.88 75.74a2.724 2.724 0 00-1.86 4.718l37.83 35.31c1.101 1.03 2.502 1.631 4.007 1.631 0 0 1.282.068 2.055-.033 1.817-.273 3.525-1.768 4.09-2.39 1.457-1.939.794-4.95.794-4.95l-11.45-34.28z\" /></svg> ", "Jotform API": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M7 3h7l4 4v14H7z\"/><path d=\"M14 3v4h4M10 12h5M10 16h5\"/></svg>", "Microsoft Fabric": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3 3 8l9 5 9-5z\"/><path d=\"m3 13 9 5 9-5\"/><path d=\"m3 17.5 9 4.5 9-4.5\" opacity=\".6\"/></svg>", "SQL": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><ellipse cx=\"12\" cy=\"6\" rx=\"7\" ry=\"3\"/><path d=\"M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3\"/></svg>", "Data modeling": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"6\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"6\"/><rect x=\"8.5\" y=\"15\" width=\"7\" height=\"6\"/><path d=\"M6.5 9v3h11V9M12 12v3\"/></svg>", "ETL / ELT": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 7h13M13 4l3 3-3 3M21 17H8M11 14l-3 3 3 3\"/></svg>", "Power BI": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 21V13M10 21V8M16 21V4M3 21h18\"/></svg>", "Tableau": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3v8M8 7h8M5 13v6M2 16h6M19 13v6M16 16h6M12 15v6M9 18h6\"/></svg>", "Statistics": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 20c3-1 4-14 9-14s6 13 9 14\"/><path d=\"M3 20h18\"/></svg>", "Logistic regression": "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 19c6 0 6-14 12-14h6\"/><path d=\"M3 21h18M3 3v18\"/></svg>"};
document.querySelectorAll(".stage li,.also span").forEach(el=>{const k=el.textContent.trim();if(I[k])el.insertAdjacentHTML("afterbegin",`<i class="lgo">${I[k]}</i>`)})})();
/* pages + per-page SQL loader (Nischal-style) */
(function(){
const K=t=>['k',t],P=t=>['p',t],S=t=>['s',t];
const Q={
 home:{n:'01',t:'Home',q:[K('SELECT'),P(' * '),K('FROM'),P(' bijay.portfolio;')],r:'8 sections'},
 about:{n:'02',t:'About',q:[K('SELECT'),P(' story, focus '),K('FROM'),P(' bijay.about;')],r:'1 row'},
 stack:{n:'03',t:'Stack',q:[K('SELECT'),P(' stage, tool '),K('FROM'),P(' bijay.stack;')],r:'17 rows'},
 work:{n:'04',t:'Work',q:[K('SELECT'),P(' title, status '),K('FROM'),P(' bijay.projects;')],r:'2 rows'},
 activity:{n:'05',t:'Activity',q:[K('SELECT'),P(' repo, language '),K('FROM'),P(' github.repos;')],r:'40 rows'},
 journey:{n:'06',t:'Journey',q:[K('SELECT'),P(' role, org, period '),K('FROM'),P(' bijay.journey;')],r:'8 rows'},
 blog:{n:'07',t:'Blog',q:[K('SELECT'),P(' title '),K('FROM'),P(' blog.posts '),K('WHERE'),P(' published;')],r:'1 row'},
 contact:{n:'08',t:'Contact',q:[K('INSERT INTO'),P(' bijay.inbox '),K('VALUES'),P(' ('),S("'hello'"),P(');')],r:'ready'},
 resume:{q:[K('SELECT'),P(' * '),K('FROM'),P(' bijay.resume;')],r:'1 document'},
 cs_fraud:{q:[K('SELECT'),P(' * '),K('FROM'),P(' bijay.projects '),K('WHERE'),P(' slug = '),S("'fraud'"),P(';')],r:'1 row'},
 cs_help:{q:[K('SELECT'),P(' * '),K('FROM'),P(' bijay.projects '),K('WHERE'),P(' slug = '),S("'st-louis-help'"),P(';')],r:'1 row'},
 post:{q:[K('SELECT'),P(' body '),K('FROM'),P(' blog.posts '),K('WHERE'),P(' id = 1;')],r:'1 row'}};
const pages=[...document.querySelectorAll('.pg')],links=[...document.querySelectorAll('#dock [data-p]')],pill=document.getElementById('dkPill'),dock=document.getElementById('dock'),cur=document.getElementById('dkCur');
const L=document.getElementById('pldr'),L1=document.getElementById('plL1'),L2=document.getElementById('plL2');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const render=(parts,n)=>{let left=n,out='';for(const [c,t] of parts){if(left<=0)break;const part=[...t].slice(0,left).join('');left-=[...part].length;out+=`<span class="${c}">${esc(part)}</span>`}return out};
const len=parts=>parts.reduce((a,[,t])=>a+[...t].length,0);
let now=null,timers=[],pending=null;const T=(f,ms)=>timers.push(setTimeout(f,ms));
function movePill(){const a=document.querySelector('.dk-links a.on');if(!a){pill.classList.remove('on');return}pill.style.width=a.offsetWidth+'px';pill.style.transform=`translateX(${a.offsetLeft}px)`;pill.classList.add('on')}
function show(id){if(!Q[id]||!Q[id].n)id='home';now=id;document.body.dataset.page=id;
 pages.forEach(p=>p.classList.toggle('on',id==='home'||p.id===id));links.forEach(a=>a.classList.toggle('on',a.dataset.p===id));
 cur.textContent=Q[id].t;document.title=(id==='home'?'':Q[id].t+' · ')+'Bijay Paudel · Analytics Engineer';
 const sh=document.querySelector('.tb div:last-child');if(sh)sh.innerHTML=`<small>SHEET</small>${Q[id].n} of 08`;
 const pg=document.getElementById(id);if(pg&&id!=='home'){const c=pg.querySelector('.pq-c'),r=pg.querySelector('.pq-r');if(c){c.innerHTML=render(Q[id].q,1e4);r.textContent='→ '+Q[id].r;r.classList.add('on')}}
 scrollTo(0,0);movePill()}
function finish(){timers.forEach(clearTimeout);timers=[];const cb=pending;pending=null;if(cb)cb();L.classList.add('out');setTimeout(()=>{L.hidden=true;L.classList.remove('out')},260)}
function sqlLoad(key,cb){const q=Q[key];if(!q||reduce){cb();return}timers.forEach(clearTimeout);timers=[];pending=cb;
 const pre=[['g','portfolio_db › ']],full=pre.concat(q.q),n=len(full);L1.innerHTML='';L2.innerHTML='';L.hidden=false;L.classList.remove('out');
 let i=len(pre);const step=()=>{i=Math.min(n,i+2);L1.innerHTML=render(full,i)+(i<n?'<span class="cur"></span>':'');if(i<n)T(step,14);else T(()=>{L2.innerHTML=`<span class="m">→ ${esc(q.r)}</span> <span class="g">· 0.0${2+Math.floor(Math.random()*7)} s</span><span class="cur"></span>`;T(finish,300)},110)};
 L1.innerHTML=render(full,i)+'<span class="cur"></span>';T(step,90)}
window.sqlLoad=sqlLoad;
function goPage(id,o={}){if(!Q[id]||!Q[id].n)id='home';const m=document.getElementById('mpanel');m.hidden=true;document.getElementById('mb').setAttribute('aria-expanded',false);
 if(o.push!==false){const h=id==='home'?'#/':'#/'+id;if(location.hash!==h)history.pushState(null,'',h)}
 if(o.instant||id===now)show(id);else sqlLoad(id,()=>show(id))}
window.goPage=goPage;
L.addEventListener('click',()=>{if(pending)finish()});addEventListener('keydown',()=>{if(pending)finish()});
document.addEventListener('click',e=>{if(e.defaultPrevented)return;const a=e.target.closest('a[href^="#"]');if(!a)return;let h=a.getAttribute('href').slice(1).replace(/^\//,'');if(h==='top')h='';const id=h||'home';if(!Q[id]||!Q[id].n)return;e.preventDefault();goPage(id)});
document.getElementById('mb').onclick=()=>{const m=document.getElementById('mpanel'),o=m.hidden;m.hidden=!o;document.getElementById('mb').setAttribute('aria-expanded',o)};
function fromHash(){const h=location.hash;if(h.startsWith('#work/'))return'work';if(h.startsWith('#blog/'))return'blog';if(h==='#resume')return now||'home';const id=h.replace(/^#\/?/,'');return Q[id]&&Q[id].n?id:'home'}
addEventListener('popstate',()=>{const h=location.hash;if(h.startsWith('#work/')||h.startsWith('#blog/')||h==='#resume')return;const id=fromHash();if(id!==now)goPage(id,{push:false,instant:true})});
addEventListener('scroll',()=>dock.classList.toggle('sc',scrollY>30),{passive:true});addEventListener('resize',movePill);
show(fromHash());document.fonts&&document.fonts.ready.then(movePill);})();
/* blog post open/close */
(function(){const a=document.getElementById('article'),card=document.getElementById('pLLM');
function open(){a.hidden=false;a.scrollTop=0;document.body.style.overflow='hidden';if(location.hash!=='#blog/llm-layers')history.pushState(null,'','#blog/llm-layers')}
function close(go){a.hidden=true;document.body.style.overflow='';if(location.hash==='#blog/llm-layers')history.replaceState(null,'','#/'+(go||'blog'));window.goPage&&goPage(go||'blog',{instant:true})}
const go=()=>window.sqlLoad?sqlLoad('post',open):open();card.addEventListener('click',go);card.addEventListener('keydown',e=>{if(e.key==='Enter')go()});
document.getElementById('aClose').onclick=()=>close('blog');document.getElementById('aClose2').onclick=()=>close('blog');
document.getElementById('aContact').onclick=e=>{e.preventDefault();close('contact')};
addEventListener('keydown',e=>{if(e.key==='Escape'&&!a.hidden)close('blog')});
addEventListener('popstate',()=>{if(location.hash==='#blog/llm-layers')open();else if(!a.hidden)close()});
if(location.hash==='#blog/llm-layers')open();})();
/* project case-study pages */
(function(){const P={fraud:document.getElementById('cs-fraud'),help:document.getElementById('cs-help')};
function open(k,push){const a=P[k];if(!a)return;Object.values(P).forEach(x=>{x.hidden=true;x.classList.remove('shown')});a.hidden=false;a.scrollTop=0;document.body.style.overflow='hidden';requestAnimationFrame(()=>requestAnimationFrame(()=>a.classList.add('shown')));if(push!==false&&location.hash!=='#work/'+k)history.pushState(null,'','#work/'+k)}
function close(go){Object.values(P).forEach(x=>{x.hidden=true;x.classList.remove('shown')});document.body.style.overflow='';if(location.hash.startsWith('#work/'))history.replaceState(null,'','#/'+(go||'work'));window.goPage&&goPage(go||'work',{instant:true})}
document.querySelectorAll('.cs').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const k=b.dataset.cs;window.sqlLoad?sqlLoad('cs_'+k,()=>open(k)):open(k)}));
document.querySelectorAll('.csx').forEach(b=>b.onclick=()=>close('work'));
document.querySelectorAll('.cspage [data-go]').forEach(b=>b.onclick=e=>{e.preventDefault();close(b.dataset.go)});
addEventListener('keydown',e=>{if(e.key==='Escape'&&Object.values(P).some(x=>!x.hidden))close('work')});
addEventListener('popstate',()=>{const m=location.hash.match(/^#work\/(\w+)/);if(m)open(m[1],false);else if(Object.values(P).some(x=>!x.hidden)){Object.values(P).forEach(x=>x.hidden=true);document.body.style.overflow=''}});
const m=location.hash.match(/^#work\/(\w+)/);if(m)open(m[1],false);})();
/* résumé page */
(function(){const R=document.getElementById('rs');
const mon=d=>{const [y,m]=d.split('-').map(Number);return y*12+m-1};
R.querySelectorAll('.rd').forEach(el=>{const s=el.dataset.s,e=el.dataset.e;if(!s)return;const now=new Date(),em=e==='now'?now.getFullYear()*12+now.getMonth():mon(e);const n=em-mon(s)+1,y=Math.floor(n/12),m=n%12;
 el.insertAdjacentHTML('afterend',`<span class="dur">${[y?y+(y>1?' yrs':' yr'):'',m?m+(m>1?' mos':' mo'):''].filter(Boolean).join(' ')}</span>`)});
function open(push){document.querySelectorAll('.article').forEach(a=>{if(a!==R)a.hidden=true});R.hidden=false;R.scrollTop=0;document.body.style.overflow='hidden';if(push!==false&&location.hash!=='#resume')history.pushState(null,'','#resume')}
function close(go){R.hidden=true;document.body.style.overflow='';if(location.hash==='#resume')history.back();if(go)setTimeout(()=>window.goPage&&goPage(go),60)}
document.querySelectorAll('.rsopen').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();window.sqlLoad?sqlLoad('resume',()=>open()):open()}));
R.querySelector('.rsx').onclick=()=>close();
R.querySelector('[data-go]').onclick=e=>{e.preventDefault();close('contact')};
R.querySelectorAll('.rproj.cs').forEach(a=>a.addEventListener('click',()=>{R.hidden=true}));
document.getElementById('rsPost').addEventListener('click',e=>{e.preventDefault();R.hidden=true;document.getElementById('pLLM').click()});
document.getElementById('rsPrint').onclick=()=>print();
addEventListener('keydown',e=>{if(e.key==='Escape'&&!R.hidden)close()});
addEventListener('popstate',()=>{if(location.hash==='#resume')open(false);else if(!R.hidden){R.hidden=true;document.body.style.overflow=''}});
if(location.hash==='#resume')open(false);})();
/* typing effect: hero role */
(function(){const el=document.querySelector('.role .tw');if(!el)return;const W=['Analytics Engineer','Data Engineer'];
if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=W[0];return}
let w=0,i=0,del=false;function tick(){const t=W[w];if(!del){i++;el.textContent=t.slice(0,i);if(i===t.length){del=true;return setTimeout(tick,w===0?4200:2200)}return setTimeout(tick,70+Math.random()*60)}
 i--;el.textContent=t.slice(0,i);if(i===0){del=false;w=(w+1)%W.length;return setTimeout(tick,350)}setTimeout(tick,35)}
(function start(){const L=document.getElementById('ldr');if(L&&!L.classList.contains('out'))return setTimeout(start,150);setTimeout(tick,500)})()})();
/* share buttons on the blog post */
(function(){const URL_='https://www.bijay-paudel.com.np/blog/llm-layers',TITLE="1 API call → 8 layers: how a company's AI feature grows up";
const e=encodeURIComponent;document.querySelectorAll('#article .share').forEach(bar=>{
 bar.querySelector('[data-sh=li]').href='https://www.linkedin.com/sharing/share-offsite/?url='+e(URL_);
 bar.querySelector('[data-sh=x]').href='https://twitter.com/intent/tweet?url='+e(URL_)+'&text='+e(TITLE);
 const cp=bar.querySelector('[data-sh=copy]'),lab=cp.querySelector('span');
 cp.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(URL_)}catch(err){const t=document.createElement('textarea');t.value=URL_;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(_){}t.remove()}
  cp.classList.add('done');lab.textContent='Link copied ✓';setTimeout(()=>{cp.classList.remove('done');lab.textContent='Copy link'},2000)});
 const nat=bar.querySelector('[data-sh=native]');if(navigator.share&&matchMedia('(pointer:coarse)').matches){nat.hidden=false;nat.addEventListener('click',()=>navigator.share({title:TITLE,url:URL_}).catch(()=>{}))}})})();
/* clock */
(function(){const el=document.getElementById('clk');const f=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});const t=()=>el.textContent=f.format(new Date());t();setInterval(t,1000)})();
/* diagram tooltips */
(function(){const tip=document.getElementById('tip'),d=tip.textContent;document.querySelectorAll('#arch .node').forEach(n=>{n.addEventListener('mouseenter',()=>{tip.textContent='▸ '+n.dataset.tip;n.classList.add('lit')});n.addEventListener('mouseleave',()=>{tip.textContent=d;n.classList.remove('lit')})})})();
/* languages + repos */
(function(){const L=[['Python',644385,'#5eead4'],['JavaScript',407721,'#fbbf24'],['HTML',232559,'#f97316'],['CSS',229992,'#60a5fa'],['SCSS',60502,'#a78bfa'],['Other',38902,'#5f84a3']];
const tot=L.reduce((a,l)=>a+l[1],0);document.getElementById('bar').innerHTML=L.map(([k,v,c])=>`<i style="background:${c};flex:${v/tot}" title="${k}"></i>`).join('');
document.getElementById('keys').innerHTML=L.map(([k,v,c])=>`<span><em style="background:${c}"></em>${k} <b>${Math.max(1,Math.round(v/tot*100))}%</b></span>`).join('');
const R=[["fraud-operations-decision-intelligence","Python","Nov 17, 2026"],["fraud-mrp-v1","—","Oct 21, 2026"],["Excel-Skills-by-Forage","—","Oct 16, 2026"],["Data-Analysis-Road-Map","—","Oct 8, 2026"],["internsphere","CSS","Feb 23, 2025"]];
document.getElementById('repos').innerHTML=R.map(([n,l,d])=>`<a class="repo" href="https://github.com/CodeWithBijay/${n}"><b>${n}</b><span>${l} · ${d}</span></a>`).join('')})();
/* journey */
(function(){const D={exp:[["2026 — present","Volunteer Data Engineer","St. Louis HELP","Building the nonprofit's impact dashboard: a nightly pipeline from form data through Python into PostgreSQL raw, cleaned and reporting layers, scheduled with GitHub Actions, feeding a dashboard and automatic donor reports."],
["present","GSA Representative","School for Professional Studies, SLU","Represent graduate students, help plan programs and events, and review and vote on budgets for student organizations."],
["Apr 2025 — present","PR & Marketing Coordinator","Global Student Connect, SLU","Plan digital campaigns and manage social channels, using Google Analytics and Hootsuite engagement data to refine content strategy."],
["Feb — Mar 2025","Digital Strategy Intern","Excelerate (SLU partnership)","Analyzed digital marketing practices, proposed social media and SEO improvements, and presented a campaign strategy to faculty and peers."]],
edu:[["expected Dec 2026","M.S. in Informatics, Analytics","Saint Louis University","Coursework in data analytics, statistical methods and technology applications with Python, R, SQL, pandas and the tidyverse."],
["Aug 2023","B.S. in Computer Information Systems","Pokhara University","Database management, data analysis and modeling, business statistics, systems analysis and IT project management, with a major project and an internship.","★ Dean's List 2023"]],
cert:[["certificate","Advanced SQL Data Analysis","Codecademy","Professional certification in advanced SQL for data analysis."],["certificate","Computer Science Career Path","Codecademy","Programming, data structures and algorithms."]]};
const log=document.getElementById('log'),bs=[...document.querySelectorAll('.tabs button')];
function show(k){bs.forEach(b=>b.classList.toggle('on',b.dataset.t===k));const n=D[k].length;
log.innerHTML=D[k].map(([t,h,o,p,s],i)=>`<div class="ent"><div class="rev">REV ${String.fromCharCode(64+n-i)}</div><div class="when">${t}</div><div><h4>${h} <span>· ${o}</span></h4><p>${p}</p>${s?`<span class="star">${s}</span>`:''}</div></div>`).join('')}
bs.forEach(b=>b.onclick=()=>show(b.dataset.t));show('exp')})();
/* reveal + count-up + nav highlight */
(function(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');e.target.querySelectorAll('[data-n]').forEach(el=>{const n=+el.dataset.n,t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1100);el.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(t0)});io.unobserve(e.target)}),{threshold:.15});
document.querySelectorAll('.rv').forEach(s=>io.observe(s));
})();

/* contact form -> Pageclip */
(function(){const f=document.getElementById('contact-form'),st=document.getElementById('cfStatus');if(!f)return;const def=st.textContent;
f.addEventListener('input',e=>{const fl=e.target.closest('.fld');if(fl)fl.classList.remove('bad');st.className='';st.textContent=def});
f.addEventListener('submit',async e=>{e.preventDefault();const el=f.elements,bad=[];
 if(!el.name.value.trim())bad.push(el.name);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.email.value.trim()))bad.push(el.email);if(!el.message.value.trim())bad.push(el.message);
 bad.forEach(x=>x.closest('.fld').classList.add('bad'));if(bad.length){st.className='err';st.textContent=bad[0]===el.email&&el.email.value?'Please enter a valid email.':'Please fill in every field.';bad[0].focus();return}
 const btn=f.querySelector('button[type=submit]');btn.disabled=true;st.className='';st.textContent='Sending…';
 try{const fd=new FormData(f);fd.append('source','website form');await fetch(f.action,{method:'POST',body:fd,mode:'no-cors'});st.className='ok';st.textContent='Sent ✓ Thanks, '+el.name.value.trim().split(' ')[0]+'. I will reply soon.';f.reset()}
 catch(err){st.className='err';st.textContent='Could not send just now. Please message me on LinkedIn.'}
 btn.disabled=false})})();


/* photo: liquid reveal of a blueprint version around the cursor (WebGL, no libraries) */
(function(){const fig=document.getElementById('ph');if(!fig)return;const box=fig.querySelector('.phbox'),img=box.querySelector('img'),cv=box.querySelector('canvas');
const gl=cv.getContext('webgl',{premultipliedAlpha:false,antialias:false});if(!gl)return;
const VS='attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0.,1.);}';
const FS=`precision mediump float;varying vec2 v;uniform sampler2D t;uniform vec2 m;uniform float h;uniform float time;uniform vec2 sc;uniform float ar;
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}
float snoise(vec3 v3){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);vec3 i=floor(v3+dot(v3,C.yyy));vec3 x0=v3-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
 vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
 float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 hh=1.-abs(x)-abs(y);
 vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(hh,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
 vec3 p0=vec3(a0.xy,hh.x);vec3 p1=vec3(a0.zw,hh.y);vec3 p2=vec3(a1.xy,hh.z);vec3 p3=vec3(a1.zw,hh.w);vec4 norm=inversesqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
 vec4 mm=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);mm=mm*mm;return 42.*dot(mm*mm,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
vec2 cover(vec2 u){return u*sc+(1.-sc)*vec2(.5,.5);}
void main(){vec3 col=texture2D(t,cover(v)).rgb;
 float lum=dot(col,vec3(.299,.587,.114));vec3 bp=mix(vec3(.027,.10,.17),vec3(.37,.92,.83),smoothstep(.12,.95,lum));
 vec2 g=fract(v*vec2(36.,45.));float grid=max(step(.94,g.x),step(.94,g.y));bp=mix(bp,vec3(.49,.83,.99),grid*.22);
 vec2 q=vec2(v.x*ar,v.y),mq=vec2(m.x*ar,m.y);float d=distance(q,mq);
 float n=snoise(vec3(v*4.2,time*.35))*.55+snoise(vec3(v*11.,time*.6))*.25;
 float mask=smoothstep(.48,.52,h*(1.05-d*2.1)+n*.42*h);
 gl_FragColor=vec4(mix(bp,col,mask),1.);}`;
function sh(type,src){const o=gl.createShader(type);gl.shaderSource(o,src);gl.compileShader(o);return o}
const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return;gl.useProgram(pr);
const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
const U=n=>gl.getUniformLocation(pr,n),uM=U('m'),uH=U('h'),uT=U('time'),uS=U('sc'),uA=U('ar');
const tex=gl.createTexture();let ready=false,iw=1,ih=1;
function load(){gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 iw=img.naturalWidth;ih=img.naturalHeight;ready=true;size();fig.classList.add('gl');draw()}
img.loading='eager';if(img.complete&&img.naturalWidth)load();else img.addEventListener('load',load,{once:true});
let W=1,H=1;function size(){const r=box.getBoundingClientRect(),dp=Math.min(devicePixelRatio||1,2);W=Math.max(1,r.width*dp|0);H=Math.max(1,r.height*dp|0);if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}gl.viewport(0,0,W,H);
 const ca=W/H,ia=iw/ih;gl.uniform2f(uS,ca>ia?1:ca/ia,ca>ia?ia/ca:1);gl.uniform1f(uA,ca)}
if(window.ResizeObserver)new ResizeObserver(()=>{if(ready){size();draw()}}).observe(box);
let mx=.5,my=.4,tx=.5,ty=.4,h=0,th=0,raf=null,t0=performance.now(),rx=0,ry=0,trx=0,tryy=0;const TILT=24;fig.style.perspective='900px';box.style.transformStyle='preserve-3d';box.style.willChange='transform';
function tilt(){trx=th?-(ty-.5)*2*TILT:0;tryy=th?(tx-.5)*2*TILT:0}
box.addEventListener('pointermove',e=>{const r=box.getBoundingClientRect();tx=(e.clientX-r.left)/r.width;ty=(e.clientY-r.top)/r.height;th=1;tilt();fig.classList.add('on');kick()});
box.addEventListener('pointerleave',()=>{th=0;tilt();fig.classList.remove('on');kick()});
box.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'){th=th?0:1;const r=box.getBoundingClientRect();tx=(e.clientX-r.left)/r.width;ty=(e.clientY-r.top)/r.height;fig.classList.toggle('on',!!th);tilt();kick()}});
function kick(){if(!raf)raf=requestAnimationFrame(step)}
function step(){raf=null;mx+=(tx-mx)*.1;my+=(ty-my)*.1;h+=(th-h)*.06;rx+=(trx-rx)*.09;ry+=(tryy-ry)*.09;
 const k=Math.hypot(rx,ry)/TILT;box.style.transform=`rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${(1+.04*h).toFixed(3)})`;box.style.boxShadow=`${(-ry*.9).toFixed(1)}px ${(rx*.9+14*h).toFixed(1)}px ${(30*h+10).toFixed(0)}px rgba(0,0,0,${(.25+.3*k).toFixed(2)}), 0 0 0 1px rgba(94,234,212,${(.15+.35*h).toFixed(2)})`;
 draw();if(h>.002||Math.abs(th-h)>.002||Math.abs(rx)>.05||Math.abs(ry)>.05)kick()}
function draw(){if(!ready)return;gl.uniform2f(uM,mx,my);gl.uniform1f(uH,h);gl.uniform1f(uT,(performance.now()-t0)/1000);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
})();

}
