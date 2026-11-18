import * as satellite from 'satellite.js';

// ISS and Tiangong orbit data (TLE) from CelesTrak, read Nov 17, 2026. Fresh data is fetched in the browser.
const STATION_TLE = `ISS (ZARYA)
1 25544U 98067A   26321.52804937  .00010237  00000+0  19073-3 0  9997
2 25544  51.6318 261.2656 0007379  36.1207 324.0279 15.49435330595529
CSS (TIANHE)
1 48274U 21035A   26321.57295437  .00018027  00000+0  21454-3 0  9998
2 48274  41.4687 109.8551 0004866 252.8069 107.2237 15.60681916317121`;

// Ported unchanged from the single-file site. Runs once in the browser after the page mounts.
export default function init() {
  /* ---------- two space stations over a real star field, live ----------
     Earth-fixed frame: x = longitude, y = latitude. Each station sits at the point on Earth it is directly above right now
     (SGP4 from current orbit data); the stars are placed the same way, so each star is the one overhead at that spot. */
  (function(){
    const c=document.getElementById('bg'),x=c.getContext('2d'),tip=document.getElementById('bgTip'),note=document.getElementById('bgStat');
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,D=180/Math.PI;
    const NICE={'ISS (ZARYA)':['ISS','International Space Station','NASA · Roscosmos · ESA · JAXA · CSA','94,234,212'],
                'CSS (TIANHE)':['Tiangong','Chinese space station','CMSA (China)','251,191,36']};
    let ST=[],src='built-in orbit data from Nov 17';
    function load(txt,s){const L=txt.trim().split(/\r?\n/).map(v=>v.trim()),out=[];
      for(let i=0;i+2<L.length;i+=3){const n=NICE[L[i]];if(!n)continue;try{const rec=satellite.twoline2satrec(L[i+1],L[i+2]);if(!rec.error)out.push({key:L[i],n,rec,trail:[],tAt:0})}catch(e){}}
      if(out.length===2){ST=out;src=s}}
    load(STATION_TLE,'built-in orbit data from Nov 17');
    (async()=>{ // fresh orbit data on the hosted site (CelesTrak, cached 6 h in this browser)
      try{const c0=JSON.parse(localStorage.getItem('stationTle')||'null');if(c0&&Date.now()-c0.t<216e5){load(c0.txt,'CelesTrak · fresh');return}}catch(e){}
      try{const t=(await Promise.all([25544,48274].map(id=>fetch('https://celestrak.org/NORAD/elements/gp.php?CATNR='+id+'&FORMAT=tle').then(r=>{if(!r.ok)throw 0;return r.text()})))).join('\n');
        load(t,'CelesTrak · fresh');try{localStorage.setItem('stationTle',JSON.stringify({t:Date.now(),txt:t}))}catch(e){}}catch(e){}
    })();
    let W,H,dpr,MOB,top,bot;
    function layout(){dpr=Math.min(devicePixelRatio||1,2);MOB=innerWidth<760;W=c.width=innerWidth*dpr;H=c.height=innerHeight*dpr;c.style.width=innerWidth+'px';c.style.height=innerHeight+'px';top=H*.08;bot=H*.94;ST.forEach(s=>s.tAt=0)}
    layout();addEventListener('resize',layout);
    const X=lon=>(((lon+180)%360+360)%360)/360*W,Y=lat=>top+(90-lat)/180*(bot-top);
    function gmstDeg(d){return satellite.gstime(d)*D}
    function sub(s,d){const pv=satellite.propagate(s.rec,d);if(!pv||!pv.position)return null;const gm=satellite.gstime(d),g=satellite.eciToGeodetic(pv.position,gm);
      return{lat:g.latitude*D,lon:g.longitude*D,h:g.height,v:Math.hypot(pv.velocity.x,pv.velocity.y,pv.velocity.z)}}
    function track(s,T){const P=s.rec.no?2*Math.PI/s.rec.no:92,pts=[];for(let m=-P;m<=P;m+=1){const p=sub(s,new Date(T+m*6e4));if(p)pts.push([m,p.lon,p.lat])}return pts}
    // stars: twinkling, placed for this moment
    const stars=[];
    const bvc=bv=>bv<0?'170,195,255':bv<.3?'205,220,255':bv<.6?'245,245,255':bv<.9?'255,238,205':bv<1.3?'255,214,160':'255,190,140';
    const R=Math.PI/180,aG=192.85948*R,dG=27.12825*R,lN=122.93192*R;
    function gal(l,b){l*=R;b*=R;const sd=Math.sin(b)*Math.sin(dG)+Math.cos(b)*Math.cos(dG)*Math.cos(lN-l),
      ra=aG+Math.atan2(Math.cos(b)*Math.sin(lN-l),Math.sin(b)*Math.cos(dG)-Math.cos(b)*Math.sin(dG)*Math.cos(lN-l));return[(ra/R+360)%360,Math.asin(sd)/R]}
    const MWP=[];for(let l=0;l<=360;l+=2)MWP.push(gal(l,0));const CORE=gal(0,0);
    let mwPts=[];
    function milky(gm){mwPts=[];x.lineCap='round';
      for(const [w,a] of [[150,.022],[90,.03],[44,.04],[16,.045]]){x.lineWidth=w*dpr*(MOB?.6:1);x.strokeStyle=`rgba(150,175,215,${a})`;x.beginPath();let prev=null;
        for(const [ra,dec] of MWP){const px=X(ra-gm),py=Y(dec);if(prev&&Math.abs(px-prev)<W/2)x.lineTo(px,py);else x.moveTo(px,py);prev=px;if(w===16)mwPts.push([px,py])}x.stroke()}
      const cx=X(CORE[0]-gm),cy=Y(CORE[1]),g=x.createRadialGradient(cx,cy,0,cx,cy,120*dpr);g.addColorStop(0,'rgba(251,214,160,.10)');g.addColorStop(1,'rgba(251,214,160,0)');
      x.fillStyle=g;x.beginPath();x.arc(cx,cy,120*dpr,0,6.283);x.fill()}
    const CON={And:'Andromeda',Aql:'Aquila',Aqr:'Aquarius',Ara:'Ara',Ari:'Aries',Aur:'Auriga',Boo:'Boötes',Cam:'Camelopardalis',Cap:'Capricornus',Car:'Carina',Cas:'Cassiopeia',Cen:'Centaurus',Cep:'Cepheus',Cet:'Cetus',CMa:'Canis Major',CMi:'Canis Minor',Cnc:'Cancer',Col:'Columba',CrB:'Corona Borealis',Cru:'Crux',Crv:'Corvus',Cyg:'Cygnus',Dra:'Draco',Eri:'Eridanus',Gem:'Gemini',Gru:'Grus',Her:'Hercules',Hya:'Hydra',Leo:'Leo',Lep:'Lepus',Lib:'Libra',Lup:'Lupus',Lyr:'Lyra',Oph:'Ophiuchus',Ori:'Orion',Peg:'Pegasus',Per:'Perseus',Phe:'Phoenix',Psc:'Pisces',PsA:'Piscis Austrinus',Pup:'Puppis',Sco:'Scorpius',Sgr:'Sagittarius',Tau:'Taurus',UMa:'Ursa Major',UMi:'Ursa Minor',Vel:'Vela',Vir:'Virgo'};
    const mouse={x:-1e5,y:-1e5};let hover=null,last=0;
    function frame(now){
      requestAnimationFrame(frame);if(now-last<(MOB?80:33))return;last=now;
      const T=Date.now(),d=new Date(T),gm=gmstDeg(d);
      x.clearRect(0,0,W,H);milky(gm);
      for(const s of stars){const lon=s.ra-gm,a=Math.min(1,.25+(4.8-s.m)*.2)*(reduce?1:.65+.35*Math.sin(now/1000*s.sp+s.tw)),r=Math.max(.5,(5.2-s.m)*.45)*dpr;
        s.px=X(lon);s.py=Y(s.dec);if(hover===s){x.strokeStyle='rgba(94,234,212,.8)';x.lineWidth=dpr;x.beginPath();x.arc(s.px,s.py,r+5*dpr,0,6.283);x.stroke()}x.fillStyle=`rgba(${bvc(s.bv)},${a})`;x.beginPath();x.arc(s.px,s.py,r,0,6.283);x.fill()}
      let near=null,best=24*dpr;
      for(const s of ST){
        if(T-s.tAt>30e3){s.trail=track(s,T);s.tAt=T}
        const [short,,,col]=s.n,p=sub(s,d);if(!p)continue;
        // orbit: past solid and fading, future dashed
        for(const fut of [false,true]){x.setLineDash(fut?[3*dpr,6*dpr]:[]);x.lineWidth=(fut?1:1.4)*dpr;let prev=null;
          for(const [m,lon,lat] of s.trail){const minute=m+(T-s.tAt)/6e4;if(fut?minute<0:minute>0){prev=null;continue}
            const px=X(lon),py=Y(lat),k=fut?.16:.4*(1-Math.min(1,-minute/95));
            if(prev&&Math.abs(px-prev[0])<W/2){x.strokeStyle=`rgba(${col},${k})`;x.beginPath();x.moveTo(prev[0],prev[1]);x.lineTo(px,py);x.stroke()}prev=[px,py]}}
        x.setLineDash([]);
        const px=X(p.lon),py=Y(p.lat),on=hover===s,pulse=reduce?0:(now/1600)%1;
        x.strokeStyle=`rgba(${col},${.5*(1-pulse)})`;x.lineWidth=dpr;x.beginPath();x.arc(px,py,(6+pulse*22)*dpr,0,6.283);x.stroke();
        const g=x.createRadialGradient(px,py,0,px,py,16*dpr);g.addColorStop(0,`rgba(${col},.55)`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.beginPath();x.arc(px,py,16*dpr,0,6.283);x.fill();
        x.fillStyle='#fff';x.beginPath();x.arc(px,py,(on?4:3.2)*dpr,0,6.283);x.fill();
        x.font=`${11*dpr}px "JetBrains Mono",monospace`;x.fillStyle=`rgba(${col},.95)`;x.fillText(short,px+12*dpr,py-9*dpr);
        if(!MOB){x.font=`${9.5*dpr}px "JetBrains Mono",monospace`;x.fillStyle='rgba(201,211,227,.55)';x.fillText(`${Math.round(p.h)} km · ${p.v.toFixed(2)} km/s`,px+12*dpr,py+5*dpr)}
        s.sx=px;s.sy=py;s.now=p;const dd=Math.hypot(px-mouse.x,py-mouse.y);if(dd<best){best=dd;near=s}
      }
      if(!near){let bs=10*dpr;for(const s of stars){const dd=Math.hypot(s.px-mouse.x,s.py-mouse.y);if(dd<bs){bs=dd;near=s}}}
      if(!near&&mouse.y>0){for(const [px,py] of mwPts)if(Math.hypot(px-mouse.x,py-mouse.y)<40*dpr){near='mw';break}}
      if(window.__nameHover||window.__lqHover||window.__uiHover)near=null;
      if(near!==hover){hover=near;tip.classList.toggle('on',!!near)}
      if(hover)fill();
      if(note&&ST.length===2){const a=ST[0].now,b=ST[1].now;if(a&&b){
        note.innerHTML=`<b class="live">● live</b> ISS and Tiangong, real positions now`}}
    }
    const ll=(v,p,n)=>`${Math.abs(v).toFixed(1)}° ${v>=0?p:n}`;
    function place(px,py){const w=tip.offsetWidth,h=tip.offsetHeight;tip.style.left=(px+20+w>innerWidth?px-20-w:px+20)+'px';tip.style.top=Math.min(innerHeight-h-10,Math.max(70,py-h/2))+'px'}
    function fill(){const s=hover;
      if(s==='mw'){tip.innerHTML=`<b class="am">Milky Way</b><span class="o">barred spiral galaxy</span><span class="o">~100,000 ly across · Sol sits ~26,000 ly out</span>`;place(mouse.x/dpr,mouse.y/dpr);return}
      if(s.star){const gm=gmstDeg(new Date()),lon=((s.ra-gm+540)%360)-180,col=s.bv<0?'blue-white':s.bv<.3?'white':s.bv<.6?'yellow-white':s.bv<1?'yellow-orange':s.bv<1.4?'orange':'red-orange';
        tip.innerHTML=`<span class="o">catalogue row · Hipparcos</span><b>${s.nm||((s.by?s.by+' ':'')+s.con)}</b><span class="o">${s.nm&&s.by?s.by+' '+s.con+' · ':''}${CON[s.con]||s.con}</span>
          <dl><dt>HIP</dt><dd>${s.hip}</dd><dt>magnitude</dt><dd>${s.m.toFixed(2)}</dd><dt>colour</dt><dd>${col} · B−V ${s.bv.toFixed(2)}</dd>
          <dt>RA / Dec</dt><dd>${(((s.ra%360)+360)%360/15).toFixed(2)}h · ${s.dec>=0?'+':''}${s.dec.toFixed(1)}°</dd><dt>overhead now</dt><dd>${ll(s.dec,'N','S')}, ${ll(lon,'E','W')}</dd></dl>`;
        place(s.px/dpr,s.py/dpr);return}
      const p=s.now,[short,full,op]=s.n;
      const ep=new Date(Date.UTC(2000+s.rec.epochyr,0,1)+(s.rec.epochdays-1)*864e5),age=(Date.now()-ep)/36e5;
      tip.innerHTML=`<span class="o">tracking row · ${src}</span><b>${short}</b><span>${full}</span><span class="o">${op}</span>
        <dl><dt>right above</dt><dd>${ll(p.lat,'N','S')}, ${ll(p.lon,'E','W')}</dd><dt>altitude</dt><dd>${Math.round(p.h).toLocaleString()} km</dd>
        <dt>speed</dt><dd>${p.v.toFixed(2)} km/s · ${Math.round(p.v*3600).toLocaleString()} km/h</dd><dt>one orbit</dt><dd>${(2*Math.PI/s.rec.no).toFixed(1)} min</dd>
        <dt>orbit data</dt><dd>${age<48?age.toFixed(0)+' h old':(age/24).toFixed(0)+' days old'}</dd></dl>`;
      place(s.sx/dpr,s.sy/dpr)}
    addEventListener('mousemove',e=>{mouse.x=e.clientX*dpr;mouse.y=e.clientY*dpr},{passive:true});
    addEventListener('touchstart',e=>{const t=e.touches[0];mouse.x=t.clientX*dpr;mouse.y=t.clientY*dpr},{passive:true});
    requestAnimationFrame(frame);
  })();

}
