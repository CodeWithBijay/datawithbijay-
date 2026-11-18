// Ported unchanged from the single-file site. Runs once in the browser after the page mounts.
export default function init() {
  /* ---------- liquid button: ripple height-field, shaded like liquid metal; the cursor stirs it ---------- */
  (function(){
    const a=document.querySelector('.open-pill.liquid');if(!a)return;
    const c=a.querySelector('canvas.lq'),x=c.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    // deep ocean → teal → mint, with pale-mint highlights
    const PAL=[[2,13,22],[3,38,48],[6,88,92],[22,160,150],[94,234,212]],SPEC=[214,255,247];
    const CELL=2,off=document.createElement('canvas'),ox=off.getContext('2d');
    let gw,gh,h0,h1,img,vis=true,hov=0,hovT=0,ptr=null,lastP=null,t0=performance.now();
    function size(){const r=a.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);c.width=r.width*d;c.height=r.height*d;
      gw=Math.max(8,Math.ceil(r.width/CELL)+2);gh=Math.max(6,Math.ceil(r.height/CELL)+2);h0=new Float32Array(gw*gh);h1=new Float32Array(gw*gh);
      off.width=gw;off.height=gh;img=ox.createImageData(gw,gh)}
    size();addEventListener('resize',size);
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
      const s=x.createLinearGradient(0,0,0,c.height);s.addColorStop(0,'rgba(200,255,245,.10)');s.addColorStop(.45,'rgba(200,255,245,0)');s.addColorStop(1,'rgba(0,8,14,.35)');x.fillStyle=s;x.fillRect(0,0,c.width,c.height)}
    let lastDrop=0;
    function frame(now){requestAnimationFrame(frame);if(!vis)return;const t=(now-t0)/1000;
      hov+=(hovT-hov)*.08;
      if(!reduce&&now-lastDrop>(hovT?260:900)){lastDrop=now;drop(1+Math.random()*(gw-2),1+Math.random()*(gh-2),3+Math.random()*3|0,.3+Math.random()*(hovT?.5:.25))}
      if(!reduce){step();step()}render(reduce?0:t)}
    requestAnimationFrame(frame);
  })();

}
