(() => {
  'use strict';
  const cards=[...document.querySelectorAll('.project')];
  const filters=[...document.querySelectorAll('[data-filter]')];
  const nav=document.getElementById('topNav');
  const menu=document.getElementById('menuToggle');
  const modal=document.getElementById('detailModal');
  let opener=null;
  function applyFilter(category){
    filters.forEach(button=>{const active=button.dataset.filter===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
    cards.forEach(card=>card.hidden=category!=='全部'&&card.dataset.category!==category);
    document.getElementById('filterStatus').textContent=`${category}，${cards.filter(card=>!card.hidden).length} 个作品`;
  }
  function closeMenu(restore=false){const wasOpen=menu.getAttribute('aria-expanded')==='true';nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','展开导航');if(wasOpen&&restore)menu.focus()}
  filters.forEach(button=>button.addEventListener('click',()=>applyFilter(button.dataset.filter)));
  document.querySelectorAll('[data-nav]').forEach(link=>link.addEventListener('click',()=>{
    if(link.dataset.nav==='works')applyFilter('全部');
    if(link.dataset.nav==='tools')applyFilter('工具集');
    nav.querySelectorAll('a').forEach(a=>{const active=a.dataset.nav===link.dataset.nav;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
    closeMenu();
  }));
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'收起导航':'展开导航')});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu(true)});
  document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu()});
  matchMedia('(min-width:701px)').addEventListener('change',()=>closeMenu());
  cards.forEach(card=>card.addEventListener('click',()=>{
    if(card.matches('a[href]'))return;
    opener=card;
    const image=card.querySelector('img');
    document.getElementById('modalImage').src=image.getAttribute('src');
    document.getElementById('modalImage').alt=image.alt;
    document.getElementById('modalTitle').textContent=card.querySelector('.project-title').textContent;
    document.getElementById('modalCategory').textContent=card.dataset.category+' / '+card.dataset.status;
    document.getElementById('modalText').textContent=card.querySelector('.project-description').textContent+' '+card.dataset.detail;
    document.getElementById('modalNotice').textContent=card.dataset.kind==='concept'?'Concept / 概念作品。仅为创作设想，无已上线产品或客户交付。封面为原创 AI 艺术创作，非产品截图。':'真实自主探索项目。目前仅提供公开项目介绍，不链接私有源码。封面为原创 AI 艺术创作，非产品截图。';
    document.body.classList.add('dialog-open');modal.showModal();
  }));
  document.getElementById('modalClose').addEventListener('click',()=>modal.close());
  modal.addEventListener('click',event=>{if(event.target===modal){const r=modal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)modal.close()}});
  modal.addEventListener('close',()=>{document.body.classList.remove('dialog-open');opener?.focus({preventScroll:true})});
})();
