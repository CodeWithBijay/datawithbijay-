// Ported unchanged from the single-file site. Runs once in the browser after the page mounts.
export default function init() {
  /* ---------- ⌘K command palette ---------- */
  (function(){
    const pal=document.getElementById('pal'),inp=document.getElementById('palIn'),list=document.getElementById('palList');
    const go=id=>()=>document.getElementById(id).scrollIntoView({behavior:'smooth'});
    const cmds=[
      ["cd ~/index","go to top",go('top')],
      ["cd ~/about","about me",go('about')],
      ["cd ~/work","selected projects",go('work')],
      ["cd ~/journey","experience log",go('journey')],
      ["cat education","degrees",()=>{go('journey')();window.__showTab('edu')}],
      ["ls ~/stack","tools I use",go('stack')],
      ["./contact.sh","get in touch",go('contact')],
      ["open github","CodeWithBijay ↗",()=>open('https://github.com/CodeWithBijay','_blank')],
      ["open linkedin","in/b-paudel ↗",()=>open('https://www.linkedin.com/in/b-paudel/','_blank')],
      ["open resume","resume.pdf",()=>open('resume.pdf','_blank')]
    ];
    let sel=0,shown=cmds;
    function render(){
      const q=inp.value.toLowerCase();shown=cmds.filter(c=>(c[0]+' '+c[1]).toLowerCase().includes(q));
      sel=Math.min(sel,Math.max(shown.length-1,0));
      list.innerHTML=shown.map((c,i)=>`<div class="pal-item${i===sel?' sel':''}" data-i="${i}"><span>${c[0]}</span><small>${c[1]}</small></div>`).join('')||'<div class="pal-item"><small>command not found</small></div>';
    }
    function openP(){pal.classList.add('open');inp.value='';sel=0;render();setTimeout(()=>inp.focus(),10)}
    function close(){pal.classList.remove('open')}
    function run(i){const c=shown[i];if(c){close();c[2]()}}
    document.getElementById('openPal').onclick=openP;
    addEventListener('keydown',e=>{
      if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();pal.classList.contains('open')?close():openP()}
      else if(e.key==='/'&&!pal.classList.contains('open')&&document.activeElement.tagName!=='INPUT'){e.preventDefault();openP()}
      else if(pal.classList.contains('open')){
        if(e.key==='Escape')close();
        else if(e.key==='ArrowDown'){sel=(sel+1)%Math.max(shown.length,1);render();e.preventDefault()}
        else if(e.key==='ArrowUp'){sel=(sel-1+shown.length)%Math.max(shown.length,1);render();e.preventDefault()}
        else if(e.key==='Enter')run(sel);
      }
    });
    inp.addEventListener('input',()=>{sel=0;render()});
    list.addEventListener('click',e=>{const it=e.target.closest('[data-i]');if(it)run(+it.dataset.i)});
    pal.addEventListener('click',e=>{if(e.target===pal)close()});
  })();
}
