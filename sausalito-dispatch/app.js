(() => {
  const WALK_MINUTES = 17;
  const timeEl = document.querySelector('#departure-time');
  const noteEl = document.querySelector('#dispatch-note');
  const customInput = document.querySelector('#custom-wait');
  const waitButtons = [...document.querySelectorAll('[data-wait]')];
  let selectedWait = 30;
  let quoteStartedAt = new Date();
  let animationTimer;

  const formatTime = (date) => new Intl.DateTimeFormat([], {
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);

  const setSelectedButton = (minutes) => {
    waitButtons.forEach((button) => {
      const selected = Number(button.dataset.wait) === minutes;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  };

  const updateDispatch = (minutes, { animate = true, resetQuote = false } = {}) => {
    selectedWait = Math.max(5, Math.min(120, Number(minutes) || 30));
    if (resetQuote) quoteStartedAt = new Date();

    const now = new Date();
    const readyAt = new Date(quoteStartedAt.getTime() + selectedWait * 60_000);
    const departureAt = new Date(readyAt.getTime() - WALK_MINUTES * 60_000);
    const leaveInMs = departureAt.getTime() - now.getTime();
    const leaveInMinutes = Math.max(0, Math.ceil(leaveInMs / 60_000));

    if (animate) {
      timeEl.classList.add('is-updating');
      window.clearTimeout(animationTimer);
      animationTimer = window.setTimeout(() => timeEl.classList.remove('is-updating'), 180);
    }

    if (leaveInMs <= 0) {
      const arrival = new Date(now.getTime() + WALK_MINUTES * 60_000);
      timeEl.textContent = 'Walk now';
      noteEl.textContent = `Head south now. At a 17-minute walk, you’ll arrive around ${formatTime(arrival)}.`;
    } else {
      timeEl.textContent = formatTime(departureAt);
      noteEl.textContent = `Stay at Dunphy Park for ${leaveInMinutes} minute${leaveInMinutes === 1 ? '' : 's'}, then walk. Quoted table time: ${formatTime(readyAt)}.`;
    }
  };

  waitButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const minutes = Number(button.dataset.wait);
      customInput.value = '';
      setSelectedButton(minutes);
      updateDispatch(minutes, { resetQuote: true });
    });
  });

  customInput.addEventListener('input', () => {
    if (!customInput.value) return;
    const minutes = Number(customInput.value);
    if (minutes < 5 || minutes > 120) return;
    setSelectedButton(-1);
    updateDispatch(minutes, { resetQuote: true });
  });

  customInput.addEventListener('blur', () => {
    if (!customInput.value) return;
    const clamped = Math.max(5, Math.min(120, Number(customInput.value) || selectedWait));
    customInput.value = String(clamped);
    updateDispatch(clamped, { resetQuote: true });
  });

  updateDispatch(selectedWait, { animate: false });
  window.setInterval(() => updateDispatch(selectedWait, { animate: false }), 30_000);
})();
