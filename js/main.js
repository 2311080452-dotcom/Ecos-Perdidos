const $=q=>document.querySelector(q);
const tarjeta=s=>`<article class="card" data-cat="${s.cat}"><div class="media" style="--c:${s.color}"><span aria-hidden="true">${s.emoji}</span><img src="${ROOT}assets/img/${s.id}.jpg" alt="${s.nombre}" loading="lazy" onerror="this.remove()"></div><div class="body"><h3>${s.nombre}</h3><p class="meta">${s.cat}, ${s.zona}</p><p>${s.texto}</p><button class="play" data-id="${s.id}" aria-pressed="false"><span class="ico"></span>Escuchar</button></div></article>`;
if($('#destacados'))$('#destacados').innerHTML=SONIDOS.slice(0,3).map(tarjeta).join('');
if($('#grid'))$('#grid').innerHTML=SONIDOS.map(tarjeta).join('');
if($('#linea'))$('#linea').innerHTML=[...SONIDOS].sort((a,b)=>a.anio-b.anio).map(s=>`<li><time>${s.declive}</time><h3>${s.emoji} ${s.nombre}</h3><p>${s.porque}</p></li>`).join('');
if($('#onda'))$('#onda').innerHTML=Array.from({length:56},(_,i)=>`<span style="--h:${18+80*Math.abs(Math.sin(i*.7)*Math.cos(i*.23))}%;--d:${(i%9)*.07}s"></span>`).join('');
document.addEventListener('click',e=>{const b=e.target.closest('.play,[data-play]');if(!b)return;
 reproducir(SONIDOS.find(s=>s.id===(b.dataset.id||b.dataset.play)),b)});
iniciarFiltros();
const f=$('#form-eco');
if(f)f.addEventListener('submit',e=>{e.preventDefault();f.hidden=true;$('#gracias').hidden=false;$('#gracias').focus()});

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('Service Worker registrado con éxito:', reg.scope))
    .catch(e => console.warn('No se pudo registrar el service worker:', e));
}

// Lógica para la Instalación Local (PWA)
let diferirPrompt;
const btnInstalar = $('#btn-instalar');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  diferirPrompt = e;
  if (btnInstalar) btnInstalar.hidden = false;
});

if (btnInstalar) {
  btnInstalar.addEventListener('click', async () => {
    if (!diferirPrompt) return;
    diferirPrompt.prompt();
    const { outcome } = await diferirPrompt.userChoice;
    console.log(`Instalación: ${outcome}`);
    diferirPrompt = null;
    btnInstalar.hidden = true;
  });
}

window.addEventListener('appinstalled', () => {
  if (btnInstalar) btnInstalar.hidden = true;
  console.log('Ecos Perdidos instalada con éxito.');
});