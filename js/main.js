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

/* ===== Imobiliário: filtros (os dados estão em js/imoveis.js) ===== */
const grid = document.getElementById('grid');
if (grid) {
  const state = { neg: 'comprar', tipo: '', zona: '', quartos: '', preco: '' };

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
    grid.innerHTML = list.length ? list.map((i, n) => cardHTML(i, n)).join('') : '<div class="empty">Sem resultados para estes filtros. Tente alargar a pesquisa.</div>';
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

/* ===== Seletor de idioma (bandeiras) + tradução do site =====
   O seletor é inserido no cabeçalho de todas as páginas. Ao escolher uma bandeira, o site é traduzido para
   esse idioma com o motor próprio (js/lang.js + js/lang-ui.js + js/lang-imoveis.js), que só é descarregado
   quando se escolhe um idioma diferente de português. A escolha fica guardada e é aplicada nas outras páginas.
   O conteúdo criado depois (filtros, cartões de imóveis) é traduzido automaticamente. */
(() => {
  const BASE = 'pt';
  const LANGS = [                       // [código, nome, país da bandeira]
    ['es', 'Español', 'es'], ['en', 'English', 'gb'], ['fr', 'Français', 'fr'], ['de', 'Deutsch', 'de'],
    ['it', 'Italiano', 'it'], ['pt', 'Português', 'pt'], ['uk', 'Українська', 'ua'], ['da', 'Dansk', 'dk'],
  ];
  const flagUrl = cc => `https://flagcdn.com/w80/${cc}.png`;
  const bar = document.querySelector('.nav .wrap');
  if (!bar) return;
  const dir = document.currentScript ? document.currentScript.src.replace(/[^/]*$/, '') : 'js/';   // pasta deste ficheiro

  let current = BASE;
  try { current = localStorage.getItem('lang') || BASE; } catch (_) {}
  if (!LANGS.some(l => l[0] === current)) current = BASE;

  const box = document.createElement('div');
  box.className = 'lang notranslate';
  box.setAttribute('translate', 'no');
  box.innerHTML = `
    <button type="button" class="lang-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="Idioma / Language">
      <img class="lang-flag" alt="" width="28" height="20"><span class="lang-caret" aria-hidden="true"></span>
    </button>
    <ul class="lang-list" role="listbox" aria-label="Idioma">
      ${LANGS.map(([c, n, cc]) => `<li role="option" tabindex="0" data-lang="${c}"><img src="${flagUrl(cc)}" alt="" width="36" height="24" loading="lazy"><span>${n}</span><svg class="tick" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6"/></svg></li>`).join('')}
    </ul>`;
  bar.insertBefore(box, bar.querySelector('.burger'));

  const btn = box.querySelector('.lang-btn');
  const flagImg = box.querySelector('.lang-flag');
  const items = [...box.querySelectorAll('li')];

  const paint = () => {
    const [, name, cc] = LANGS.find(l => l[0] === current);
    flagImg.src = flagUrl(cc);
    flagImg.alt = name;
    items.forEach(li => li.setAttribute('aria-selected', String(li.dataset.lang === current)));
  };
  const setOpen = open => {
    box.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };

  // --- tradução ---
  const loadScript = src => new Promise(done => {
    const s = document.createElement('script');
    s.src = src; s.async = true; s.onload = s.onerror = () => done();
    document.head.appendChild(s);
  });
  let engine = null;
  const getEngine = () => engine || (engine = Promise
    .all(['lang.js', 'lang-ui.js', 'lang-imoveis.js'].map(f => loadScript(dir + f)))
    .then(() => window.I18N));
  const apply = lang => getEngine().then(e => { if (e && current === lang) e.set(lang); });

  // limpa o cookie do antigo widget do Google Tradutor, se existir
  try { document.cookie = 'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT'; } catch (_) {}

  const choose = lang => {
    current = lang;
    paint();
    setOpen(false);
    try { if (lang === BASE) localStorage.removeItem('lang'); else localStorage.setItem('lang', lang); } catch (_) {}
    if (lang === BASE && !engine) return;          // a página ainda está em português: nada a repor
    apply(lang);
  };

  btn.addEventListener('click', () => setOpen(!box.classList.contains('open')));
  items.forEach(li => {
    li.addEventListener('click', () => choose(li.dataset.lang));
    li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(li.dataset.lang); } });
  });
  document.addEventListener('click', e => { if (!box.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  paint();
  if (current !== BASE) apply(current);            // mantém o idioma ao mudar de página
})();
