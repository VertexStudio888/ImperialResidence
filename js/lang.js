/* ==========================================================
   Motor de tradução — carregado pelo main.js só quando se escolhe
   um idioma diferente de português (a bandeira selecionada).

   Os textos estão em js/lang-ui.js e js/lang-imoveis.js, em linhas:
     [ português, es, en, fr, de, it, uk, da ]
   O português (original) é a chave de procura. Para traduzir um texto novo
   basta acrescentar uma linha; o resto (números, plurais, localidades,
   "para comprar/arrendar"…) é tratado pelas regras mais abaixo.
   ========================================================== */
(() => {
  'use strict';
  const BASE = 'pt';
  const ORDER = ['es', 'en', 'fr', 'de', 'it', 'uk', 'da'];           // ordem das colunas nas linhas de dados
  const HTML_LANG = { pt: 'pt-PT', es: 'es', en: 'en', fr: 'fr', de: 'de', it: 'it', uk: 'uk', da: 'da' };
  const norm = s => s.replace(/\s+/g, ' ').trim();

  /* ---------- dicionário ---------- */
  let dict = null, paragraphs = [], built = 0;
  const build = () => {
    const rows = window.I18N_ROWS || [];
    if (dict && built === rows.length) return;
    dict = {}; ORDER.forEach(l => { dict[l] = new Map(); });
    paragraphs = [];
    rows.forEach(r => {
      const key = norm(r[0]);
      ORDER.forEach((l, i) => { if (r[i + 1] != null) dict[l].set(key, r[i + 1]); });
      if (key.length > 50 && !/[<>]/.test(key)) paragraphs.push(key);      // descrições (usadas na meta description)
    });
    built = rows.length;
  };

  /* ---------- regras (números, plurais, frases compostas) ---------- */
  const pl = (n, one, few, many) => {                                    // plurais do ucraniano
    const a = n % 10, b = n % 100;
    return a === 1 && b !== 11 ? one : (a >= 2 && a <= 4 && (b < 12 || b > 14)) ? few : many;
  };
  const ord = n => { const b = n % 100, a = n % 10; return n + (b >= 11 && b <= 13 ? 'th' : a === 1 ? 'st' : a === 2 ? 'nd' : a === 3 ? 'rd' : 'th'); };

  const W = {
    es: { bed: n => n === 1 ? 'habitación' : 'habitaciones', park: n => n === 1 ? 'plaza' : 'plazas',
      found: n => n === 1 ? '1 inmueble encontrado' : `${n} inmuebles encontrados`, upto: 'hasta', floor: n => `${n}.ª planta`,
      sale: '{T} en venta', rent: '{T} en alquiler', image: (a, b) => `Imagen ${a} de ${b}`, map: 'Mapa', country: 'Portugal',
      msg: (t, id) => `Hola, estoy interesado en «${t}» (ID ${id}). ¿Pueden ponerse en contacto conmigo?` },
    en: { bed: n => n === 1 ? 'bedroom' : 'bedrooms', park: n => n === 1 ? 'space' : 'spaces',
      found: n => n === 1 ? '1 property found' : `${n} properties found`, upto: 'up to', floor: n => `${ord(n)} floor`,
      sale: '{T} for sale', rent: '{T} for rent', image: (a, b) => `Image ${a} of ${b}`, map: 'Map', country: 'Portugal',
      msg: (t, id) => `Hello, I am interested in "${t}" (ID ${id}). Could you contact me?` },
    fr: { bed: n => n === 1 ? 'chambre' : 'chambres', park: n => n === 1 ? 'place' : 'places',
      found: n => n === 1 ? '1 bien trouvé' : `${n} biens trouvés`, upto: 'jusqu’à', floor: n => n === 1 ? '1er étage' : `${n}e étage`,
      sale: '{T} à vendre', rent: '{T} à louer', image: (a, b) => `Image ${a} sur ${b}`, map: 'Carte', country: 'Portugal',
      msg: (t, id) => `Bonjour, je suis intéressé(e) par « ${t} » (ID ${id}). Pouvez-vous me contacter ?` },
    de: { bed: () => 'Schlafzimmer', park: n => n === 1 ? 'Stellplatz' : 'Stellplätze',
      found: n => n === 1 ? '1 Immobilie gefunden' : `${n} Immobilien gefunden`, upto: 'bis', floor: n => `${n}. Etage`,
      sale: '{T} zum Kauf', rent: '{T} zur Miete', image: (a, b) => `Bild ${a} von ${b}`, map: 'Karte', country: 'Portugal',
      msg: (t, id) => `Guten Tag, ich interessiere mich für „${t}“ (ID ${id}). Können Sie mich bitte kontaktieren?` },
    it: { bed: n => n === 1 ? 'camera' : 'camere', park: n => n === 1 ? 'posto' : 'posti',
      found: n => n === 1 ? '1 immobile trovato' : `${n} immobili trovati`, upto: 'fino a', floor: n => `${n}º piano`,
      sale: '{T} in vendita', rent: '{T} in affitto', image: (a, b) => `Immagine ${a} di ${b}`, map: 'Mappa', country: 'Portogallo',
      msg: (t, id) => `Buongiorno, sono interessato a «${t}» (ID ${id}). Potete contattarmi?` },
    uk: { bed: n => pl(n, 'спальня', 'спальні', 'спалень'), park: n => pl(n, 'місце', 'місця', 'місць'),
      found: n => `Знайдено ${n} ${pl(n, 'об’єкт', 'об’єкти', 'об’єктів')}`, upto: 'до', floor: n => `${n}-й поверх`,
      sale: '{T} на продаж', rent: '{T} в оренду', image: (a, b) => `Зображення ${a} з ${b}`, map: 'Карта', country: 'Португалія',
      msg: (t, id) => `Добрий день, мене цікавить «${t}» (ID ${id}). Чи можете ви зв’язатися зі мною?` },
    da: { bed: n => n === 1 ? 'værelse' : 'værelser', park: n => n === 1 ? 'plads' : 'pladser',
      found: n => n === 1 ? '1 ejendom fundet' : `${n} ejendomme fundet`, upto: 'op til', floor: n => `${n}. sal`,
      sale: '{T} til salg', rent: '{T} til leje', image: (a, b) => `Billede ${a} af ${b}`, map: 'Kort', country: 'Portugal',
      msg: (t, id) => `Hej, jeg er interesseret i "${t}" (ID ${id}). Kan I kontakte mig?` },
  };

  const part = (s, lang) => { const r = dict[lang].get(s); return r === undefined ? s : r; };   // traduz uma palavra solta (localidade, tipo…)

  const textRule = (t, lang) => {
    const w = W[lang]; let m;
    if ((m = /^(\d+) lugares?$/.exec(t))) return `${m[1]} ${w.park(+m[1])}`;
    if ((m = /^(\d+)\.º andar$/.exec(t))) return w.floor(+m[1]);
    if ((m = /^(\d+) imóveis? encontrados?$/.exec(t))) return w.found(+m[1]);
    if ((m = /^até (.+)$/.exec(t))) return `${w.upto} ${m[1]}`;
    if ((m = /^Imagem (\d+) de (\d+)$/.exec(t))) return w.image(m[1], m[2]);
    if ((m = /^Mapa — (.+)$/.exec(t))) return `${w.map} — ${part(m[1], lang)}`;
    if ((m = /^(.+), Portugal$/.exec(t))) return `${part(m[1], lang)}, ${w.country}`;
    if ((m = /^(Moradia|Apartamento|Terreno) para (comprar|arrendar)$/.exec(t)))
      return w[m[2] === 'comprar' ? 'sale' : 'rent'].replace('{T}', part(m[1], lang));
    if ((m = /^Olá, tenho interesse em "(.+)" \(ID (.+)\)\. Podem contactar-me\?$/.exec(t))) return w.msg(m[1], m[2]);
    if (t.includes(' · ')) {                                              // "Cascais · Moradia", "Residencial · 2026"
      let changed = false;
      const out = t.split(' · ').map(p => { const r = dict[lang].get(p); if (r !== undefined) { changed = true; return r; } return p; });
      if (changed) return out.join(' · ');
    }
    return undefined;
  };
  const lookup = (t, lang) => { const r = dict[lang].get(t); return r !== undefined ? r : textRule(t, lang); };

  const mixed = (key, lang) => {                                          // elementos com HTML dentro (<em>, <b>…)
    const r = dict[lang].get(key); if (r !== undefined) return r;
    const m = /^<b>(\d+)<\/b> quartos?$/.exec(key);
    return m ? `<b>${m[1]}</b> ${W[lang].bed(+m[1])}` : undefined;
  };

  /* ---------- percorrer a página ---------- */
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'svg']);
  const NOTR = '.notranslate,[translate="no"]';
  const blocked = el => (el.classList && el.classList.contains('notranslate')) || el.getAttribute('translate') === 'no';
  const ATTRS = ['placeholder', 'alt', 'aria-label', 'title'];
  const origText = new WeakMap(), origHTML = new WeakMap(), origAttr = new WeakMap();

  const text = (n, lang) => {
    const had = origText.has(n);
    const raw = had ? origText.get(n) : n.data;
    if (lang === BASE) { if (had) { n.data = raw; origText.delete(n); } return; }
    const t = norm(raw); if (!t) return;
    const out = lookup(t, lang); if (out === undefined) return;
    if (!had) origText.set(n, raw);
    const val = /^\s*/.exec(raw)[0] + out + /\s*$/.exec(raw)[0];
    if (n.data !== val) n.data = val;
  };

  const attrs = (el, lang) => {
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      let st = origAttr.get(el);
      const cur = el.getAttribute(a), had = !!st && a in st, raw = had ? st[a] : cur;
      if (lang === BASE) { if (had) { el.setAttribute(a, raw); delete st[a]; } continue; }
      const out = lookup(norm(raw), lang); if (out === undefined) continue;
      if (!st) origAttr.set(el, st = {});
      st[a] = raw;
      if (cur !== out) el.setAttribute(a, out);
    }
  };

  const walk = (el, lang) => {
    if (SKIP.has(el.tagName) || blocked(el)) return;
    if (lang === BASE) {
      if (origHTML.has(el)) { el.innerHTML = origHTML.get(el); origHTML.delete(el); return; }
    } else if (el.childElementCount && (origHTML.has(el) || (el.childElementCount <= 6 && el.textContent.length <= 800))) {
      const html = origHTML.has(el) ? origHTML.get(el) : el.innerHTML;
      const out = mixed(norm(html), lang);
      if (out !== undefined) { if (!origHTML.has(el)) origHTML.set(el, html); if (el.innerHTML !== out) el.innerHTML = out; return; }
    }
    attrs(el, lang);
    // <option> sem value: guarda o texto original, para que os filtros continuem a funcionar noutro idioma
    if (el.tagName === 'OPTION' && !el.hasAttribute('value')) el.setAttribute('value', el.textContent);
    for (let n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3) text(n, lang);
      else if (n.nodeType === 1) walk(n, lang);
    }
  };

  /* ---------- <title> e meta description ---------- */
  let origTitle = null, origDesc = '';
  const metaDesc = (d, lang) => {
    const direct = lookup(d, lang); if (direct !== undefined) return direct;
    const m = /^(Moradia|Apartamento|Terreno) (?:em|na|no) (.+?) — (.+?) — (.+?€(?:\/mês)?)\.\s*(.+)$/.exec(d);
    if (!m) return d;
    const rest = m[5].replace(/\.$/, '');
    const full = paragraphs.find(p => p.startsWith(rest));
    const desc = full ? dict[lang].get(full) : undefined;
    const price = m[4].replace('/mês', part('/mês', lang));
    return `${part(m[1], lang)}, ${part(m[2], lang)} — ${m[3]} — ${price}. ${desc !== undefined ? desc : m[5]}`;
  };
  const head = lang => {
    const meta = document.querySelector('meta[name="description"]');
    if (origTitle === null) { origTitle = document.title; origDesc = meta ? meta.getAttribute('content') || '' : ''; }
    if (lang === BASE) { document.title = origTitle; if (meta) meta.setAttribute('content', origDesc); return; }
    const parts = origTitle.split(' | ');
    document.title = parts.map((p, i) => (parts.length > 1 && i === parts.length - 1) ? p : part(norm(p), lang)).join(' | ');
    if (meta && origDesc) meta.setAttribute('content', metaDesc(norm(origDesc), lang));
  };

  /* ---------- conteúdo que a página cria depois (filtros, cartões…) ---------- */
  let obs = null, current = BASE;
  const cfg = { childList: true, subtree: true };
  const onMut = recs => {
    if (current === BASE) return;
    const lang = current, all = recs.concat(obs.takeRecords());
    obs.disconnect();
    try {
      const seen = new Set();
      all.forEach(r => r.addedNodes.forEach(n => {
        if (!n.isConnected || seen.has(n)) return; seen.add(n);
        if (n.nodeType === 1) { if (!n.closest(NOTR)) walk(n, lang); }
        else if (n.nodeType === 3) { const p = n.parentElement; if (p && !SKIP.has(p.tagName) && !p.closest(NOTR)) text(n, lang); }
      }));
    } finally { obs.observe(document.body, cfg); }
  };

  window.I18N = {
    set(lang) {
      build();
      current = lang;
      document.documentElement.lang = HTML_LANG[lang] || lang;
      if (!obs) obs = new MutationObserver(onMut);
      obs.disconnect();
      try { walk(document.body, lang); head(lang); } finally { obs.observe(document.body, cfg); }
    },
  };
})();
