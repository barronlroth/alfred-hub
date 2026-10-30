/* Reinoso + Delboy family storybook v2: chronological timeline, inline "who + how related". */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const UI = {
    en: {skip:'Skip to story',chapters:'All stories',illustration:'Illustration',begin:'Begin',sources:'Sources & how sure we are',
      previous:'Previous',next:'Next',close:'Close',timeline:'Timeline',story:'Story',of:'of',who:'Who is this?',path:'How they connect to you',
      explain:'Quick definitions',context:'Good to know',certainty:'How sure are we?',sourceList:'Sources',method:'About this site',
      artTitle:'This is a painting, not a photo',artText:'The scenes on this site are AI-generated illustrations of places and periods. They are not photographs and do not show what any real family member looked like. Real family photographs are labeled “Family photograph”.',
      arrivals:'Family lines: arrivals and earliest records in Peru',photo:'Family photograph',enlarge:'Enlarge photograph',viewSource:'View family source',
      photoRights:'Family photograph shared by Lbrei. Identifications follow the family’s own captions.',
      albumEmpty:'No photographs loaded.',albumHint:'Tap a photo to enlarge it.',loadError:'The stories could not be loaded. Please reload.',
      start:'Start',restart:'Back to start',lifespan:'Life'},
    es: {skip:'Ir a la historia',chapters:'Todas las historias',illustration:'Ilustración',begin:'Empezar',sources:'Fuentes y qué tan seguros estamos',
      previous:'Anterior',next:'Siguiente',close:'Cerrar',timeline:'Línea de tiempo',story:'Historia',of:'de',who:'¿Quién es?',path:'Cómo se conecta contigo',
      explain:'Definiciones rápidas',context:'Para saber más',certainty:'¿Qué tan seguros estamos?',sourceList:'Fuentes',method:'Sobre este sitio',
      artTitle:'Es una pintura, no una foto',artText:'Las escenas de este sitio son ilustraciones generadas con IA de lugares y épocas. No son fotografías y no muestran cómo era ningún familiar real. Las fotos familiares reales llevan la etiqueta “Fotografía familiar”.',
      arrivals:'Líneas familiares: llegadas y primeros registros en el Perú',photo:'Fotografía familiar',enlarge:'Ampliar fotografía',viewSource:'Ver la fuente familiar',
      photoRights:'Fotografía familiar compartida por Lbrei. Las identificaciones siguen las leyendas de la propia familia.',
      albumEmpty:'No se cargaron fotografías.',albumHint:'Toca una foto para ampliarla.',loadError:'No se pudieron cargar las historias. Vuelve a cargar la página.',
      start:'Inicio',restart:'Volver al inicio',lifespan:'Vida'}
  };
  let data, index = 0, lang = 'en', photos = [], restoreFocus = null, modal = null;
  const t = (k) => UI[lang][k] || k;
  const L = (v) => v == null ? '' : typeof v === 'string' ? v : (v[lang] ?? v.en ?? '');
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
  const safe = (u) => { try { const x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch { return null; } };
  const link = (text, url) => { const a = el('a', 'ext', text); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; };
  const paras = (box, text) => { box.replaceChildren(); L(text).split(/\n\n+/).forEach(p => box.append(el('p', '', p))); };

  function readURL() {
    const u = new URL(location.href); lang = u.searchParams.get('lang') === 'es' ? 'es' : 'en';
    let id = 'home'; try { id = decodeURIComponent(u.hash.slice(1)) || 'home'; } catch {}
    const i = data.slides.findIndex(s => s.id === id); index = i < 0 ? 0 : i;
  }
  function url(i = index, l = lang) { const u = new URL(location.href); u.searchParams.set('lang', l); u.hash = data.slides[i].id; return u.pathname + u.search + u.hash; }
  function go(i, {language = lang, replace = false, focus = false} = {}) {
    i = Math.max(0, Math.min(data.slides.length - 1, i));
    const moved = i !== index; index = i; lang = language;
    const next = url(); if (location.pathname + location.search + location.hash !== next) history[replace ? 'replaceState' : 'pushState']({}, '', next);
    render();
    if (moved) { window.scrollTo({top: 0, behavior: 'instant'}); $('#reading-panel').scrollTop = 0; if (focus) $('#story-title').focus({preventScroll: true}); }
  }

  function render() {
    const s = data.slides[index], spread = $('.spread');
    document.documentElement.lang = lang; document.title = L(s.title) + ' | Reinoso + Delboy';
    document.querySelectorAll('[data-ui]').forEach(e => e.textContent = t(e.dataset.ui));
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $('.wordmark').href = url(0); $('#previous').setAttribute('aria-label', t('previous'));
    $('#next').setAttribute('aria-label', index === data.slides.length - 1 ? t('restart') : t('next'));
    $('#dialog-close').setAttribute('aria-label', t('close')); $('#timeline').setAttribute('aria-label', t('timeline'));
    spread.dataset.kind = s.kind; spread.dataset.slide = s.id;
    spread.classList.remove('changed'); void spread.offsetWidth; spread.classList.add('changed');

    $('#chapter-label').textContent = s.number ? `${t('story')} ${s.number} ${t('of')} ${data.storyCount}` : L(s.branch);
    $('#branch').textContent = s.number ? L(s.branch) : '';
    $('.meta-line').hidden = !s.number;
    $('#big-year').textContent = s.kind === 'story' ? L(s.year) : '';
    $('#big-year').hidden = s.kind !== 'story';
    $('#story-title').textContent = L(s.title);
    paras($('#story-body'), s.body);

    const img = $('#scene-image'); if (img.getAttribute('src') !== s.image) img.src = s.image; img.alt = '';
    renderWho(s); renderPath(s); renderExplain(s);
    const ctx = $('#context'); ctx.replaceChildren(); ctx.hidden = !s.context;
    if (s.context) { ctx.append(el('h2', 'label', t('context'))); paras(ctx.appendChild(el('div')), s.context); }

    const extra = $('#story-extra'), visual = $('#visual-extra'); extra.replaceChildren(); visual.replaceChildren();
    if (s.stat) { const st = el('div', 'stat'); st.append(el('span', 'stat-value', s.stat.value), el('span', 'stat-label', L(s.stat.label))); extra.append(st); }
    if (s.arrivals) renderArrivals(s, extra);
    if (s.kind === 'archive') renderAlbum(visual);
    const insets = (s.archiveIds || []).map(id => photos.find(p => p.id === id)).filter(Boolean).slice(0, 1);
    insets.forEach(p => visual.append(photoFigure(p, 'archive-inset')));
    spread.dataset.hasArchive = String(insets.length > 0);

    $('#story-actions').hidden = s.kind !== 'cover';
    $('#begin').querySelector('[data-ui]').textContent = t('begin');
    $('.detail-actions').hidden = !(s.sourceIds && s.sourceIds.length);
    $('#previous').disabled = index === 0;
    renderTimeline();
    const n = data.slides[index + 1]; if (n) { const pre = new Image(); pre.src = n.image; }
    if (modal) fillDialog(modal);
  }

  function renderWho(s) {
    const box = $('#who'); box.replaceChildren(); box.hidden = !s.who; if (!s.who) return;
    box.append(el('h2', 'label', t('who')));
    const card = el('div', 'who-card');
    const name = el('p', 'who-name', s.who.name);
    const life = el('p', 'who-life', s.who.life);
    const rel = el('p', 'who-relation', L(s.who.relation));
    const role = el('p', 'who-role', L(s.who.role));
    card.append(rel, name, life, role); box.append(card);
  }
  function renderPath(s) {
    const box = $('#path'); box.replaceChildren(); box.hidden = !(s.path && s.path.length); if (box.hidden) return;
    box.append(el('h2', 'label', t('path')));
    if (s.pathLead) box.append(el('p', 'path-lead', L(s.pathLead)));
    const ol = el('ol', 'chain'); const last = s.path.length - 1, long = s.path.length > 7;
    const hiddenCount = s.path.length - 5;
    const draw = (collapsed) => {
      ol.replaceChildren();
      s.path.forEach((p, i) => {
        if (collapsed && i >= 2 && i < last - 2) {
          if (i === 2) ol.append(el('li', 'gap', lang === 'es' ? `… ${hiddenCount} generaciones más …` : `… ${hiddenCount} more generations …`));
          return;
        }
        ol.append(el('li', i === 0 ? 'first' : i === last ? 'you' : '', L(p)));
      });
    };
    draw(long); box.append(ol);
    if (long) {
      const tog = el('button', 'chain-toggle'); tog.type = 'button'; let collapsed = true;
      const setLabel = () => tog.textContent = collapsed
        ? (lang === 'es' ? `Ver las ${s.path.length} generaciones` : `Show all ${s.path.length} generations`)
        : (lang === 'es' ? 'Mostrar menos' : 'Show fewer');
      setLabel(); tog.addEventListener('click', () => { collapsed = !collapsed; draw(collapsed); setLabel(); });
      box.append(tog);
    }
    if (data.youNote) box.append(el('p', 'you-note', L(data.youNote)));
  }
  function renderExplain(s) {
    const box = $('#explain'); box.replaceChildren(); box.hidden = !(s.explain && s.explain.length); if (box.hidden) return;
    box.append(el('h2', 'label', t('explain')));
    const dl = el('dl'); s.explain.forEach(e => { dl.append(el('dt', '', L(e.term)), el('dd', '', L(e.def))); }); box.append(dl);
  }
  function renderArrivals(s, host) {
    const box = el('section', 'arrivals'); box.append(el('h2', 'label', t('arrivals')));
    const ol = el('ol'); s.arrivals.forEach(a => { const li = el('li'); li.append(el('span', 'a-year', L(a.year)), el('span', 'a-line', L(a.line)), el('span', 'a-how', L(a.how))); ol.append(li); });
    box.append(ol, el('p', 'you-note', lang === 'es' ? '“Ya en” significa que la familia ya aparece en el Perú en esa fecha; no sabemos cuándo llegó.' : '“By” means the family is already on record in Peru by that date; we don’t know when it arrived.')); host.append(box);
  }
  function photoFigure(p, cls) {
    const fig = el('figure', cls), b = el('button'); b.type = 'button'; b.setAttribute('aria-label', t('enlarge') + ': ' + L(p.title));
    const im = el('img'); im.src = p.src; im.alt = L(p.alt) || L(p.title); im.decoding = 'async'; b.append(im);
    b.addEventListener('click', () => openDialog('photo:' + p.id, b));
    const cap = el('figcaption'); cap.append(el('span', 'badge', t('photo')), el('strong', '', L(p.title)));
    fig.append(b, cap); return fig;
  }
  function renderAlbum(host) {
    if (!photos.length) { host.append(el('p', 'note', t('albumEmpty'))); return; }
    host.append(el('p', 'album-hint', t('albumHint')));
    const grid = el('div', 'album'); photos.forEach(p => grid.append(photoFigure(p, 'album-item'))); host.append(grid);
  }

  function renderTimeline() {
    const nav = $('#timeline'); nav.replaceChildren();
    data.slides.forEach((s, i) => {
      const a = el('a', 'tick' + (i < index ? ' past' : '') + (s.kind !== 'story' ? ' aside' : ''));
      a.href = url(i); a.dataset.go = i; a.append(el('span', 'dot'), el('span', 'tick-label', L(s.tick)));
      a.setAttribute('aria-label', `${L(s.tick)} · ${L(s.title)}`); a.title = L(s.title);
      if (i === index) a.setAttribute('aria-current', 'step');
      nav.append(a);
    });
    const cur = nav.querySelector('[aria-current]');
    if (cur && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = cur.offsetLeft - nav.clientWidth / 2 + cur.offsetWidth / 2;
  }

  function openDialog(type, trigger = document.activeElement) { restoreFocus = trigger; modal = type; fillDialog(type); if (!$('#story-dialog').open) $('#story-dialog').showModal(); $('#dialog-close').focus(); }
  function fillDialog(type) {
    const s = data.slides[index], box = $('#dialog-content'); box.replaceChildren(); let title = '';
    if (type === 'chapters') {
      title = t('chapters'); const ol = el('ol', 'chapter-list');
      data.slides.forEach((sl, i) => { const li = el('li'), a = el('a'); a.href = url(i); a.dataset.go = i; if (i === index) a.setAttribute('aria-current', 'true');
        a.append(el('span', 'c-year', L(sl.tick)), el('span', 'c-title', L(sl.title))); li.append(a); ol.append(li); });
      box.append(ol);
    } else if (type === 'sources') {
      title = t('sources');
      if (s.certainty) box.append(el('h3', '', t('certainty')), el('p', 'note', L(s.certainty)));
      box.append(el('h3', '', t('sourceList')));
      const ol = el('ol', 'sources'); (s.sourceIds || []).forEach(id => { const src = data.sources[id]; if (!src) return; const li = el('li'); const u = safe(src.url);
        li.append(u ? link(L(src.title), u) : document.createTextNode(L(src.title))); if (src.accessNote) li.append(el('span', 'access', L(src.accessNote))); ol.append(li); });
      box.append(ol, el('h3', '', t('method')), el('p', '', L(data.methodology)));
    } else if (type === 'art') {
      title = t('artTitle'); box.append(el('p', '', t('artText')));
    } else if (type.startsWith('photo:')) {
      const p = photos.find(x => x.id === type.slice(6)); if (!p) return; title = L(p.title);
      const im = el('img', 'full-photo'); im.src = p.src; im.alt = L(p.alt); box.append(im);
      if (L(p.basis)) box.append(el('p', 'note', L(p.basis)));
      box.append(el('p', 'note', t('photoRights')));
      const u = safe(p.sourceURL); if (u) box.append(link(t('viewSource'), u));
    }
    $('#dialog-title').textContent = title;
  }
  const closeDialog = () => { if ($('#story-dialog').open) $('#story-dialog').close(); };
  $('#story-dialog').addEventListener('close', () => { modal = null; if (restoreFocus?.isConnected) restoreFocus.focus({preventScroll: true}); });
  $('#story-dialog').addEventListener('click', e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(); } });
  $('#dialog-close').addEventListener('click', closeDialog);
  $('#chapters-button').addEventListener('click', () => openDialog('chapters'));
  $('#sources-button').addEventListener('click', () => openDialog('sources'));
  $('#art-credit').addEventListener('click', () => openDialog('art'));
  $('#begin').addEventListener('click', () => go(1, {focus: true}));
  $('#previous').addEventListener('click', () => go(index - 1));
  $('#next').addEventListener('click', () => go(index === data.slides.length - 1 ? 0 : index + 1));
  document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => go(index, {language: b.dataset.lang})));
  document.addEventListener('click', e => { const a = e.target.closest('a[data-go], a.wordmark'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); closeDialog(); go(a.matches('.wordmark') ? 0 : Number(a.dataset.go), {focus: true}); });
  window.addEventListener('popstate', () => { if (!data) return; closeDialog(); readURL(); render(); window.scrollTo({top: 0, behavior: 'instant'}); });
  document.addEventListener('keydown', e => {
    if (!data || $('#story-dialog').open || e.altKey || e.ctrlKey || e.metaKey) return;
    let n; if (e.key === 'ArrowRight') n = index + 1; if (e.key === 'ArrowLeft') n = index - 1; if (e.key === 'Home') n = 0; if (e.key === 'End') n = data.slides.length - 1;
    if (n !== undefined) { e.preventDefault(); go(n, {focus: true}); }
  });
  let touch = null;
  $('#main').addEventListener('touchstart', e => { if (e.touches.length !== 1 || e.target.closest('button,a,.album')) { touch = null; return; } touch = {x: e.touches[0].clientX, y: e.touches[0].clientY}; }, {passive: true});
  $('#main').addEventListener('touchend', e => { if (!touch || !data) return; const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y; touch = null; if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 2) go(index + (dx < 0 ? 1 : -1)); }, {passive: true});

  async function loadPhotos() {
    try {
      const r = await fetch('assets/archive/archive-manifest.json'); if (!r.ok) return;
      const m = await r.json();
      photos = (m.photos || []).filter(p => typeof p.src === 'string' && p.src.startsWith('assets/archive/') && !p.src.includes('..')).map(p => ({
        id: p.id, src: p.src, sourceURL: p.sourceURL,
        title: {en: p.title_en, es: p.title_es}, alt: {en: p.alt_en, es: p.alt_es}, basis: {en: p.basis_en, es: p.basis_es}}));
      const s = data && data.slides[index]; if (s && (s.kind === 'archive' || (s.archiveIds || []).length)) render();
    } catch {}
  }
  async function init() {
    try {
      const r = await fetch('content.json'); if (!r.ok) throw new Error('HTTP ' + r.status); data = await r.json();
      readURL(); go(index, {replace: true}); document.documentElement.dataset.ready = 'true'; loadPhotos();
    } catch (err) { console.error(err); $('#story-body').textContent = t('loadError'); }
  }
  init();
})();
