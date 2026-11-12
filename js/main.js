/* ===== Menu / header ===== */
const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu');
const burger = document.querySelector('.burger');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
const setMenu = open => {
  if (!menu) return;
  menu.classList.toggle('open', open);
  burger?.setAttribute('aria-expanded', String(open));
  document.documentElement.classList.toggle('menu-open', open);
};
setMenu(false);
burger?.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
// ao rodar o telemóvel / passar a desktop, garante que o menu não fica preso aberto
window.matchMedia('(min-width:861px)').addEventListener?.('change', e => { if (e.matches) setMenu(false); });

/* ===== Reveal on scroll ===== */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
const observeReveal = () => document.querySelectorAll('.rv:not(.in)').forEach(el => io.observe(el));
observeReveal();

/* ===== Counters ===== */
const counters = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, suffix = el.dataset.suffix || '';
  const t0 = performance.now(), dur = 1600;
  const tick = t => {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  counters.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => counters.observe(el));

/* ===== Formulário (demonstração) ===== */
document.querySelectorAll('form[data-demo]').forEach(f => f.addEventListener('submit', ev => {
  ev.preventDefault();
  f.querySelector('.form-ok').style.display = 'block';
  f.reset();
}));

/* ===== Imobiliário: dados de exemplo + filtros ===== */
const U = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const SRCSET = id => [500, 800, 1200].map(w => `${U(id, w)} ${w}w`).join(', ');
const IMOVEIS = [
  { t: 'Villa Horizonte', z: 'Cascais', tipo: 'Moradia', neg: 'comprar', p: 2450000, q: 5, a: 480, img: 'photo-1600596542815-ffad4c1539a9', tag: 'Destaque' },
  { t: 'Penthouse Atlântico', z: 'Lisboa', tipo: 'Apartamento', neg: 'comprar', p: 1280000, q: 3, a: 190, img: 'photo-1512917774080-9991f1c4c750', tag: 'Novo' },
  { t: 'Casa do Pátio', z: 'Comporta', tipo: 'Moradia', neg: 'comprar', p: 1890000, q: 4, a: 320, img: 'photo-1600585154340-be6161a56a0c', tag: 'Exclusivo' },
  { t: 'Loft Ribeira', z: 'Porto', tipo: 'Apartamento', neg: 'comprar', p: 465000, q: 2, a: 110, img: 'photo-1560448204-e02f11c3d0e2', tag: 'Novo' },
  { t: 'Residência Serra', z: 'Sintra', tipo: 'Moradia', neg: 'comprar', p: 980000, q: 4, a: 290, img: 'photo-1564013799919-ab600027ffc6', tag: 'Venda' },
  { t: 'Terraço do Chiado', z: 'Lisboa', tipo: 'Apartamento', neg: 'arrendar', p: 3200, q: 2, a: 140, img: 'photo-1522708323590-d24dbb6b0267', tag: 'Arrendamento' },
  { t: 'Quinta Alvorada', z: 'Setúbal', tipo: 'Moradia', neg: 'comprar', p: 1350000, q: 6, a: 560, img: 'photo-1613490493576-7fde63acd811', tag: 'Destaque' },
  { t: 'Studio Marina', z: 'Cascais', tipo: 'Apartamento', neg: 'arrendar', p: 1850, q: 1, a: 62, img: 'photo-1505691938895-1758d7feb511', tag: 'Arrendamento' },
  { t: 'Lote Vista Rio', z: 'Setúbal', tipo: 'Terreno', neg: 'comprar', p: 390000, q: 0, a: 1200, img: 'photo-1600607687939-ce8a6c25118c', tag: 'Terreno' },
];
const grid = document.getElementById('grid');
if (grid) {
  const state = { neg: 'comprar', tipo: '', zona: '', quartos: '', preco: '' };
  const eur = n => n.toLocaleString('pt-PT') + ' €';
  const favs = new Set(JSON.parse(localStorage.getItem('favs') || '[]'));

  // preencher zonas
  const zonaSel = document.getElementById('f-zona');
  [...new Set(IMOVEIS.map(i => i.z))].sort().forEach(z => zonaSel.add(new Option(z, z)));

  const render = () => {
    const list = IMOVEIS.filter(i =>
      i.neg === state.neg &&
      (!state.tipo || i.tipo === state.tipo) &&
      (!state.zona || i.z === state.zona) &&
      (!state.quartos || i.q >= +state.quartos) &&
      (!state.preco || i.p <= +state.preco));
    document.getElementById('count').textContent = `${list.length} ${list.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}`;
    grid.innerHTML = list.length ? list.map((i, n) => `
      <article class="card rv d${n % 3}">
        <div class="ph">
          <img loading="lazy" src="${U(i.img, 800)}" srcset="${SRCSET(i.img)}" sizes="(max-width:640px) 100vw,(max-width:1000px) 50vw,33vw" alt="${i.t}" />
          <span class="tag">${i.tag}</span>
          <button class="fav ${favs.has(i.t) ? 'on' : ''}" data-id="${i.t}" aria-label="Guardar">♥</button>
        </div>
        <div class="body">
          <span class="loc">${i.z} · ${i.tipo}</span>
          <h3>${i.t}</h3>
          <div class="price">${eur(i.p)}${i.neg === 'arrendar' ? ' <small style="font-size:.5em">/mês</small>' : ''}</div>
          <div class="specs">
            ${i.q ? `<span><b>${i.q}</b> quartos</span>` : ''}
            <span><b>${i.a}</b> m²</span>
          </div>
        </div>
      </article>`).join('') : '<div class="empty">Sem resultados para estes filtros. Tente alargar a pesquisa.</div>';
    observeReveal();
  };

  document.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.seg button').forEach(x => x.classList.remove('on'));
    b.classList.add('on'); state.neg = b.dataset.neg; updatePrices(); render();
  }));
  const map = { 'f-tipo': 'tipo', 'f-zona': 'zona', 'f-quartos': 'quartos', 'f-preco': 'preco' };
  Object.entries(map).forEach(([id, key]) => document.getElementById(id).addEventListener('change', e => { state[key] = e.target.value; render(); }));

  const precoSel = document.getElementById('f-preco');
  function updatePrices() {
    const opts = state.neg === 'comprar'
      ? [['', 'Sem limite'], [500000, 'até 500 000 €'], [1000000, 'até 1 000 000 €'], [2000000, 'até 2 000 000 €']]
      : [['', 'Sem limite'], [1500, 'até 1 500 €'], [2500, 'até 2 500 €'], [4000, 'até 4 000 €']];
    precoSel.innerHTML = ''; state.preco = '';
    opts.forEach(([v, l]) => precoSel.add(new Option(l, v)));
  }
  updatePrices();

  grid.addEventListener('click', e => {
    const b = e.target.closest('.fav'); if (!b) return;
    const id = b.dataset.id;
    favs.has(id) ? favs.delete(id) : favs.add(id);
    b.classList.toggle('on');
    try { localStorage.setItem('favs', JSON.stringify([...favs])); } catch (_) {}
  });
  document.getElementById('search-btn')?.addEventListener('click', () => document.getElementById('listings').scrollIntoView({ behavior: 'smooth' }));
  render();
}

/* ===== Projetos: filtros ===== */
document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
  document.querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
  c.classList.add('on');
  const f = c.dataset.f;
  document.querySelectorAll('.work').forEach(w => w.classList.toggle('hide', f !== 'all' && w.dataset.c !== f));
}));
