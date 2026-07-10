(() => {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduceMotion = motionQuery.matches;
  const progress = document.getElementById('progressBar');
  const activeFrames = new Map();

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progress.style.height = `${ratio * 100}%`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  const revealTargets = document.querySelectorAll(
    '.chapter-label, .opening-copy, .chat-window, .notice-paper, .notice-analysis, .rule-card, .pull-quote, .operation-head, .operation-list li, .decision-head, .quote-table, .approval-checkpoint, .savings-block, .locker-head, .exhibits details, .twist-head, .twist-dialogue blockquote, .outcome-title, .scoreboard, .outcome-list article, .remaining-thread, .lessons > .eyebrow, .lessons > h2, .lesson-grid article'
  );

  const showAll = () => {
    revealTargets.forEach((node) => node.classList.add('is-visible'));
  };

  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    revealTargets.forEach((node) => node.classList.add('reveal'));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
    revealTargets.forEach((node) => revealObserver.observe(node));
  }

  const counters = document.querySelectorAll('[data-count]');
  const setCounterFinal = (node) => {
    const target = Number(node.dataset.count);
    const suffix = node.dataset.suffix || '';
    const decimals = String(target).includes('.') ? 1 : 0;
    node.textContent = `${target.toFixed(decimals)}${suffix}`;
  };

  const animateCounter = (node) => {
    if (reduceMotion) {
      setCounterFinal(node);
      return;
    }
    const target = Number(node.dataset.count);
    const suffix = node.dataset.suffix || '';
    const decimals = String(target).includes('.') ? 1 : 0;
    const start = performance.now();
    const duration = 1000;

    const frame = (now) => {
      if (reduceMotion) {
        setCounterFinal(node);
        activeFrames.delete(node);
        return;
      }
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
      if (t < 1) {
        activeFrames.set(node, requestAnimationFrame(frame));
      } else {
        activeFrames.delete(node);
      }
    };
    activeFrames.set(node, requestAnimationFrame(frame));
  };

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((node) => counterObserver.observe(node));
  } else {
    counters.forEach(setCounterFinal);
  }

  motionQuery.addEventListener?.('change', (event) => {
    reduceMotion = event.matches;
    if (!reduceMotion) return;
    activeFrames.forEach((id) => cancelAnimationFrame(id));
    activeFrames.clear();
    counters.forEach(setCounterFinal);
    showAll();
  });

  window.addEventListener('beforeprint', showAll);
})();
