const ROOT=document.body.dataset.root||'';
let ctx=null,actual=null;
function detener(){if(actual)actual()}
function sintetizar(s,fin){
 ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();
 let t=ctx.currentTime+.05;
 s.pat.forEach(([a,b,d])=>{const o=ctx.createOscillator(),g=ctx.createGain();
  o.type=s.wave;o.frequency.setValueAtTime(a,t);o.frequency.linearRampToValueAtTime(b,t+d);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.2,t+.03);g.gain.linearRampToValueAtTime(0,t+d);
  o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+d+.02);t+=d+.05});
 setTimeout(fin,(t-ctx.currentTime)*1000);
}
function reproducir(s,btn){
 const seguia=btn.classList.contains('sonando');
 detener();if(seguia)return;
 btn.classList.add('sonando');btn.setAttribute('aria-pressed','true');document.body.classList.add('escuchando');
 let listo=false;
 const fin=()=>{btn.classList.remove('sonando');btn.setAttribute('aria-pressed','false');document.body.classList.remove('escuchando');actual=null};
 const a=new Audio(`${ROOT}assets/audio/${s.id}.mp3`);
 const plan_b=()=>{if(listo)return;listo=true;actual=fin;sintetizar(s,fin)};
 a.onended=fin;a.onerror=plan_b;
 a.play().then(()=>{if(!listo){listo=true;actual=()=>{a.pause();fin()}}}).catch(plan_b);
}
