(() => {
  'use strict';
  document.querySelectorAll('a.project[href]').forEach(link=>{
    if(link.dataset.demoPath && ['localhost','127.0.0.1'].includes(location.hostname)) link.href=link.dataset.demoPath;
    if(new URL(link.href,location.href).origin!==location.origin){link.target='_blank';link.rel='noopener noreferrer'}
  });
  const cards=[...document.querySelectorAll('.project')];
  const filters=[...document.querySelectorAll('[data-filter]')];
  const nav=document.getElementById('topNav');
  const menu=document.getElementById('menuToggle');
  document.getElementById('filterStatus').textContent=`全部 ${cards.length} 个作品`;
  function applyFilter(category){
    filters.forEach(button=>{const active=button.dataset.filter===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
    cards.forEach(card=>card.hidden=category!=='全部'&&card.dataset.category!==category);
    document.getElementById('filterStatus').textContent=`${category}，${cards.filter(card=>!card.hidden).length} 个作品`;
  }
  function closeMenu(restore=false){const wasOpen=menu.getAttribute('aria-expanded')==='true';nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','展开导航');if(wasOpen&&restore)menu.focus()}
  filters.forEach(button=>button.addEventListener('click',()=>applyFilter(button.dataset.filter)));
  document.querySelectorAll('[data-nav]').forEach(link=>link.addEventListener('click',()=>{
    if(link.dataset.nav==='works')applyFilter('全部');
    nav.querySelectorAll('a').forEach(a=>{const active=a.dataset.nav===link.dataset.nav;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
    closeMenu();
  }));
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'收起导航':'展开导航')});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu(true)});
  document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu()});
  matchMedia('(min-width:701px)').addEventListener('change',()=>closeMenu());
})();
