(function(){
 const L=[['Inicio','index.html'],['Galería sonora','pages/galeria.html'],['Línea del tiempo','pages/linea-tiempo.html'],['Historias','pages/historias.html'],['Aporta un eco','pages/aporta.html'],['Acerca de','pages/acerca.html']];
 const aqui=location.pathname.split('/').pop()||'index.html';
 const items=L.map(([n,h])=>`<li><a href="${ROOT}${h}"${h.endsWith(aqui)?' aria-current="page"':''}>${n}</a></li>`).join('');
 document.getElementById('nav').innerHTML=`<header class="nav"><nav class="nav-in" aria-label="Principal"><a class="logo" href="${ROOT}index.html">Ecos <b>Perdidos</b></a><button class="burger" aria-expanded="false" aria-controls="menu">Menú</button><ul class="menu" id="menu">${items}</ul></nav></header>`;
 const b=document.querySelector('.burger'),m=document.getElementById('menu');
 b.onclick=()=>{const o=m.classList.toggle('abierto');b.setAttribute('aria-expanded',o)};
 document.getElementById('pie').innerHTML='<footer>Ecos Perdidos, archivo de sonidos en extinción de Puebla, México.</footer>';
})();
