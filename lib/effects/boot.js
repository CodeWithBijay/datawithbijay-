// Ported unchanged from the single-file site. Runs once in the browser after the page mounts.
export default function init() {
  /* ---------- boot screen ---------- */
  (function(){
    const boot=document.getElementById('boot'), out=document.getElementById('bootText');
    let seen=false; try{seen=sessionStorage.getItem('booted')}catch(e){}
    if(seen||matchMedia('(prefers-reduced-motion: reduce)').matches){boot.classList.add('gone');return}
    const lines=[
      ['<span class="p">~/</span> $ ',"ssh bijay@stl"],
      ['',"<span class='ok'>✓</span> connected · USA"],
      ['<span class="p">~/</span> $ ',"run pipeline --profile portfolio"],
      ['',"<span class='ok'>✓</span> extract · load · transform · model"],
      ['<span class="p">~/</span> $ ',"whoami"]
    ];
    let html='',i=0,done=false;
    function finish(){if(done)return;done=true;boot.classList.add('gone');try{sessionStorage.setItem('booted','1')}catch(e){}}
    function typeLine(){
      if(done)return;
      if(i>=lines.length){setTimeout(finish,500);return}
      const [pre,txt]=lines[i++];
      if(!pre){html+=txt+'<br>';out.innerHTML=html+'<span class="caret"></span>';setTimeout(typeLine,260);return}
      let k=0;html+=pre;
      (function step(){
        if(done)return;
        if(k<=txt.length){out.innerHTML=html+txt.slice(0,k)+'<span class="caret"></span>';k++;setTimeout(step,28)}
        else{html+=txt+'<br>';setTimeout(typeLine,220)}
      })();
    }
    typeLine();
    ['keydown','click','touchstart'].forEach(ev=>addEventListener(ev,finish,{once:true}));
  })();

}
