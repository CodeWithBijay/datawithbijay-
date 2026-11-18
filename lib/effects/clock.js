// Ported unchanged from the single-file site. Runs once in the browser after the page mounts.
export default function init() {
  /* ---------- clock ---------- */
  (function(){
    const el=document.getElementById('clock'),tz=document.getElementById('tz');
    function tick(){
      const d=new Date();
      el.textContent=d.toLocaleTimeString('en-US',{hour12:false});
      const o=-d.getTimezoneOffset(),h=Math.trunc(Math.abs(o)/60),m=Math.abs(o)%60;
      tz.textContent='UTC'+(o<0?'−':'+')+h+(m?':'+String(m).padStart(2,'0'):'');
    }
    tick();setInterval(tick,1000);
    document.getElementById('yr').textContent=new Date().getFullYear();
    document.getElementById('hash').textContent=Math.random().toString(16).slice(2,9);
  })();

}
