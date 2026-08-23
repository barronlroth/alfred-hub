(() => {
  const WALK_MINUTES = 17;
  const timeEl = document.querySelector('#departure-time');
  const noteEl = document.querySelector('#dispatch-note');
  const customInput = document.querySelector('#custom-wait');
  const waitButtons = [...document.querySelectorAll('[data-wait]')];
  let selectedWait = 30;
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

  const updateDispatch = (minutes, animate = true) => {
    selectedWait = Math.max(5, Math.min(120, Number(minutes) || 30));
    const now = new Date();
    const leaveIn = Math.max(0, selectedWait - WALK_MINUTES);
    const departure = new Date(now.getTime() + leaveIn * 60_000);
    const arrival = new Date(now.getTime() + Math.max(WALK_MINUTES, selectedWait) * 60_000);

    if (animate) {
      timeEl.classList.add('is-updating');
      window.clearTimeout(animationTimer);
      animationTimer = window.setTimeout(() => timeEl.classList.remove('is-updating'), 180);
    }

    if (selectedWait <= 20) {
      timeEl.textContent = 'Walk now';
      noteEl.textContent = `The quoted wait is ${selectedWait} minutes. Start south now and arrive around ${formatTime(arrival)}.`;
    } else {
      timeEl.textContent = formatTime(departure);
      const parkMinutes = leaveIn;
      noteEl.textContent = `Stay at Dunphy Park for ${parkMinutes} minute${parkMinutes === 1 ? '' : 's'}, then walk. Expected arrival: ${formatTime(arrival)}.`;
    }
  };

  waitButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const minutes = Number(button.dataset.wait);
      customInput.value = '';
      setSelectedButton(minutes);
      updateDispatch(minutes);
    });
  });

  customInput.addEventListener('input', () => {
    if (!customInput.value) return;
    const minutes = Number(customInput.value);
    if (minutes < 5 || minutes > 120) return;
    setSelectedButton(-1);
    updateDispatch(minutes);
  });

  customInput.addEventListener('blur', () => {
    if (!customInput.value) return;
    const clamped = Math.max(5, Math.min(120, Number(customInput.value) || selectedWait));
    customInput.value = String(clamped);
    updateDispatch(clamped);
  });

  updateDispatch(selectedWait, false);
  window.setInterval(() => updateDispatch(selectedWait, false), 30_000);
})();
