const instances = new WeakMap();

const INTERACTIVE_SELECTOR = [
  'button',
  'a[href]',
  'input',
  'textarea',
  'select',
  '[contenteditable="true"]',
  '[data-deck-scroll]'
].join(',');

function validSlide(value, count) {
  if (!/^\d+$/.test(value ?? '')) return 1;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= count ? parsed : 1;
}

function slideUrl(index) {
  const url = new URL(window.location.href);
  url.searchParams.set('slide', String(index));
  return `${url.pathname}${url.search}${url.hash}`;
}

function headingLabel(slide, index) {
  const heading = slide.querySelector('h1, h2, h3');
  const text = heading?.textContent?.replace(/\s+/g, ' ').trim();
  return text || `Slide ${index}`;
}

function createShell(slides) {
  const progress = document.createElement('div');
  progress.className = 'deck-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span class="deck-progress__fill"></span>';

  const dots = document.createElement('nav');
  dots.className = 'deck-dots';
  dots.setAttribute('aria-label', 'Slide navigation');
  slides.forEach((slide, position) => {
    const index = position + 1;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'deck-dot';
    button.dataset.slideTarget = String(index);
    button.setAttribute('aria-label', `Go to slide ${index}: ${headingLabel(slide, index)}`);
    dots.append(button);
  });

  const controls = document.createElement('nav');
  controls.className = 'deck-controls';
  controls.setAttribute('aria-label', 'Previous and next slide');
  controls.innerHTML = [
    '<button class="deck-control deck-control--previous" type="button" aria-label="Previous slide">←</button>',
    '<button class="deck-control deck-control--next" type="button" aria-label="Next slide">→</button>'
  ].join('');

  const counter = document.createElement('p');
  counter.className = 'deck-counter';
  counter.setAttribute('aria-live', 'polite');
  counter.setAttribute('aria-atomic', 'true');

  const presenter = document.createElement('aside');
  presenter.className = 'presenter-panel';
  presenter.setAttribute('aria-label', 'Presenter notes');
  presenter.setAttribute('data-deck-scroll', '');
  presenter.hidden = true;
  presenter.innerHTML = '<span class="presenter-panel__label">PRESENTER NOTES</span><p></p>';

  document.body.append(progress, dots, controls, counter, presenter);
  return { progress, dots, controls, counter, presenter };
}

export function initDeck(root) {
  if (!(root instanceof HTMLElement)) {
    throw new TypeError('initDeck(root) requires an HTMLElement root.');
  }

  const existing = instances.get(root);
  if (existing) return existing;

  const slides = [...root.children].filter((element) => element.matches('section.slide'));
  if (!slides.length) throw new Error('Deck requires at least one section.slide.');

  const count = slides.length;
  const shell = createShell(slides);
  const progressFill = shell.progress.querySelector('.deck-progress__fill');
  const dotButtons = [...shell.dots.querySelectorAll('.deck-dot')];
  const previousButton = shell.controls.querySelector('.deck-control--previous');
  const nextButton = shell.controls.querySelector('.deck-control--next');
  const notesCopy = shell.presenter.querySelector('p');
  const mobileQuery = window.matchMedia('(max-width: 680px)');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const initialUrl = new URL(window.location.href);

  let current = validSlide(initialUrl.searchParams.get('slide'), count);
  let presenterVisible = initialUrl.searchParams.get('presenter') === '1';
  let pointerStart = null;
  let buildFrames = [];
  let destroyed = false;

  function clearBuildFrames() {
    buildFrames.forEach((frame) => cancelAnimationFrame(frame));
    buildFrames = [];
  }

  function buildSlide(slide) {
    clearBuildFrames();
    slide.classList.remove('is-built');
    if (motionQuery.matches || mobileQuery.matches) {
      slide.classList.add('is-built');
      return;
    }
    const firstFrame = requestAnimationFrame(() => {
      const secondFrame = requestAnimationFrame(() => slide.classList.add('is-built'));
      buildFrames.push(secondFrame);
    });
    buildFrames.push(firstFrame);
  }

  function updatePresenter() {
    const notes = slides[current - 1].querySelector('.speaker-notes');
    notesCopy.textContent = notes?.textContent?.trim() || 'No notes for this slide.';
    shell.presenter.hidden = !presenterVisible;
  }

  function updateShell() {
    progressFill.style.width = `${(current / count) * 100}%`;
    shell.counter.textContent = `${String(current).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
    previousButton.disabled = current === 1;
    nextButton.disabled = current === count;
    dotButtons.forEach((button, position) => {
      const active = position + 1 === current;
      button.setAttribute('aria-current', active ? 'true' : 'false');
    });
    const dark = slides[current - 1].classList.contains('slide--navy');
    document.body.classList.toggle('deck-theme-dark', dark);
    updatePresenter();
  }

  function applyDesktopState() {
    slides.forEach((slide, position) => {
      const active = position + 1 === current;
      slide.hidden = !active;
      slide.inert = !active;
      slide.setAttribute('aria-hidden', String(!active));
      slide.classList.toggle('is-active', active);
      if (!active) slide.classList.remove('is-built');
    });
    buildSlide(slides[current - 1]);
  }

  function applyMobileState({ scroll = false } = {}) {
    clearBuildFrames();
    slides.forEach((slide) => {
      slide.hidden = false;
      slide.inert = false;
      slide.setAttribute('aria-hidden', 'false');
      slide.classList.add('is-active', 'is-built');
    });
    if (scroll) {
      const scrollToCurrent = () => slides[current - 1].scrollIntoView({ block: 'start', behavior: 'auto' });
      requestAnimationFrame(() => requestAnimationFrame(scrollToCurrent));
      if (document.fonts?.ready) document.fonts.ready.then(scrollToCurrent);
      if (document.readyState !== 'complete') window.addEventListener('load', scrollToCurrent, { once: true });
    }
  }

  function activate(index, { history = 'none', scroll = true } = {}) {
    if (destroyed) return current;
    const next = Number(index);
    if (!Number.isInteger(next) || next < 1 || next > count) return current;
    current = next;

    if (history === 'push') window.history.pushState({ slide: current }, '', slideUrl(current));
    if (history === 'replace') window.history.replaceState({ slide: current }, '', slideUrl(current));

    if (mobileQuery.matches) applyMobileState({ scroll });
    else applyDesktopState();
    updateShell();
    root.dispatchEvent(new CustomEvent('deck:slidechange', { detail: { index: current } }));
    return current;
  }

  function navigateBy(delta) {
    return activate(Math.min(count, Math.max(1, current + delta)), { history: 'push' });
  }

  function eventIsInteractive(event) {
    return event.target instanceof Element && Boolean(event.target.closest(INTERACTIVE_SELECTOR));
  }

  function onKeydown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || eventIsInteractive(event)) return;
    let target = null;
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') target = Math.min(count, current + 1);
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') target = Math.max(1, current - 1);
    if (event.key === 'Home') target = 1;
    if (event.key === 'End') target = count;
    if (event.key.toLowerCase() === 'p') {
      presenterVisible = !presenterVisible;
      updatePresenter();
      event.preventDefault();
      return;
    }
    if (target !== null) {
      event.preventDefault();
      activate(target, { history: 'push' });
    }
  }

  function onPopstate() {
    const url = new URL(window.location.href);
    activate(validSlide(url.searchParams.get('slide'), count), { history: 'none' });
  }

  function onPointerDown(event) {
    if (eventIsInteractive(event) || event.button !== 0) return;
    pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event) {
    if (!pointerStart || pointerStart.id !== event.pointerId) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(deltaX) <= 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    if (deltaX < 0) navigateBy(1);
    else navigateBy(-1);
  }

  function onPointerCancel() {
    pointerStart = null;
  }

  function onShellClick(event) {
    const dot = event.target.closest('.deck-dot');
    if (dot) {
      activate(Number(dot.dataset.slideTarget), { history: 'push' });
      return;
    }
    if (event.target.closest('.deck-control--previous')) navigateBy(-1);
    if (event.target.closest('.deck-control--next')) navigateBy(1);
  }

  function onOutcomeClick(event) {
    const button = event.target.closest('[data-outcome-state]');
    if (!button || !root.contains(button)) return;
    const state = button.dataset.outcomeState;
    root.querySelectorAll('[data-outcome-state]').forEach((candidate) => {
      candidate.setAttribute('aria-selected', String(candidate === button));
      candidate.tabIndex = candidate === button ? 0 : -1;
    });
    root.querySelectorAll('[data-outcome-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.outcomePanel !== state;
    });
  }

  function onModeChange() {
    if (mobileQuery.matches) applyMobileState({ scroll: false });
    else applyDesktopState();
    updateShell();
  }

  function onMotionChange() {
    clearBuildFrames();
    if (motionQuery.matches) {
      slides.forEach((slide) => slide.classList.add('is-built'));
    } else if (!mobileQuery.matches) {
      buildSlide(slides[current - 1]);
    }
  }

  previousButton.addEventListener('click', onShellClick);
  nextButton.addEventListener('click', onShellClick);
  shell.dots.addEventListener('click', onShellClick);
  root.addEventListener('click', onOutcomeClick);
  root.addEventListener('pointerdown', onPointerDown);
  root.addEventListener('pointerup', onPointerUp);
  root.addEventListener('pointercancel', onPointerCancel);
  document.addEventListener('keydown', onKeydown);
  window.addEventListener('popstate', onPopstate);
  mobileQuery.addEventListener('change', onModeChange);
  motionQuery.addEventListener('change', onMotionChange);

  const controller = {
    activate,
    get current() { return current; },
    get count() { return count; },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      clearBuildFrames();
      previousButton.removeEventListener('click', onShellClick);
      nextButton.removeEventListener('click', onShellClick);
      shell.dots.removeEventListener('click', onShellClick);
      root.removeEventListener('click', onOutcomeClick);
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointerup', onPointerUp);
      root.removeEventListener('pointercancel', onPointerCancel);
      document.removeEventListener('keydown', onKeydown);
      window.removeEventListener('popstate', onPopstate);
      mobileQuery.removeEventListener('change', onModeChange);
      motionQuery.removeEventListener('change', onMotionChange);
      Object.values(shell).forEach((element) => element.remove());
      instances.delete(root);
    }
  };

  instances.set(root, controller);
  root.dataset.initialized = 'true';
  activate(current, { history: 'replace', scroll: mobileQuery.matches });
  return controller;
}
