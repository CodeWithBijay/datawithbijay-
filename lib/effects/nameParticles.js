// Ported unchanged from the single-file site. Runs once in the browser after the page mounts.
export default function init() {
  /* ---------- BIJAY as an interactive particle logo: restless white particles that scatter from the mouse and settle back ---------- */
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
      x.fillStyle='#fff';
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

}
