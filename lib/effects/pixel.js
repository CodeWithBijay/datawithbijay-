// Ported unchanged from the single-file site. Runs once in the browser after the page mounts.
export default function init() {
  /* ---------- Pixel: chat assistant ----------
     Answers through /api/chat (Gemini, key kept on the server); falls back to the built-in answers below. */
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
      [/contact|email|reach|linkedin|github|resume|résumé|cv/,'Use the contact form at the bottom of the page, message him on LinkedIn (linkedin.com/in/b-paudel), see his code on GitHub (github.com/CodeWithBijay), or download his résumé from the Résumé link at the top.'],
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
    // contact form → Pageclip
    const st=$('cfStatus');
    cform.addEventListener('input',e=>{e.target.classList.remove('bad');st.textContent='';st.className='cf-status'});
    cform.addEventListener('submit',async e=>{e.preventDefault();
      const f=cform.elements,bad=[];if(!f.name.value.trim())bad.push(f.name);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim()))bad.push(f.email);if(!f.message.value.trim())bad.push(f.message);
      bad.forEach(x=>x.classList.add('bad'));if(bad.length){st.className='cf-status err';st.textContent=bad[0]===f.email&&f.email.value?'Please enter a valid email.':'Please fill in every field.';bad[0].focus();return}
      const btn=cform.querySelector('.cf-send');btn.disabled=true;st.className='cf-status';st.textContent='sending…';
      try{const fd=new FormData(cform);fd.append('source','website form');await fetch(cform.action,{method:'POST',body:fd,mode:'no-cors'});
        st.className='cf-status ok';st.textContent=`Sent! ✅ Thanks, ${f.name.value.trim().split(' ')[0]}. Bijay will reply soon.`;cform.reset()}
      catch(err){st.className='cf-status err';st.innerHTML='Couldn’t send just now. Please message Bijay on <a href="https://www.linkedin.com/in/b-paudel/" target="_blank" rel="noopener">LinkedIn</a>.'}
      btn.disabled=false});
    root.addEventListener('pointerenter',()=>{window.__uiHover=1});root.addEventListener('pointerleave',()=>{window.__uiHover=0});
  })();

}
