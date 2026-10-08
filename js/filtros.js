function iniciarFiltros(){
 const bar=document.getElementById('filtros'),grid=document.getElementById('grid');
 if(!bar||!grid)return;
 const cats=['Todos',...new Set(SONIDOS.map(s=>s.cat))];
 bar.innerHTML=cats.map((c,i)=>`<button class="chip" aria-pressed="${i===0}" data-c="${c}">${c}</button>`).join('');
 bar.onclick=e=>{const b=e.target.closest('.chip');if(!b)return;
  bar.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));
  grid.querySelectorAll('.card').forEach(c=>c.hidden=!(b.dataset.c==='Todos'||c.dataset.cat===b.dataset.c));};
}
