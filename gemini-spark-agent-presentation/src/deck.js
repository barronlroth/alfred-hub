const MOBILE_QUERY = "(max-width: 760px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function parseSlide(value, total) {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed >= 1 && parsed <= total ? parsed : 1;
}

function isInteractiveTarget(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("button, a, input, textarea, select, summary, [contenteditable='true'], [data-keyboard-local], [role='textbox']"));
}

function withSlideInUrl(index) {
  const url = new URL(window.location.href);
  url.searchParams.set("slide", String(index));
  return `${url.pathname}${url.search}${url.hash}`;
}

function initializeDeck(root = document.querySelector(".deck")) {
  if (!root) return null;
  if (window.__sparkDeck?.root === root) return window.__sparkDeck;

  const slides = [...root.querySelectorAll(":scope > .slide")];
  const total = slides.length;
  const prevButton = document.querySelector("[data-action='prev']");
  const nextButton = document.querySelector("[data-action='next']");
  const currentLabel = document.querySelector("[data-current]");
  const totalLabel = document.querySelector("[data-total]");
  const presenterPanel = document.querySelector(".presenter-panel");
  const presenterText = document.querySelector("[data-presenter-note]");
  const presenterCount = document.querySelector("[data-presenter-count]");
  const mobileMedia = window.matchMedia(MOBILE_QUERY);
  const reducedMedia = window.matchMedia(REDUCED_QUERY);
  const presenter = new URL(window.location.href).searchParams.get("presenter") === "1";
  let current = parseSlide(new URL(window.location.href).searchParams.get("slide"), total);
  let mode = mobileMedia.matches ? "mobile" : "desktop";
  let pointerStart = null;
  let observer = null;

  function setSlideExposure(slide, active) {
    slide.classList.toggle("is-active", active);
    if (mode === "desktop") {
      slide.hidden = !active;
      slide.inert = !active;
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    } else {
      slide.hidden = false;
      slide.inert = false;
      slide.removeAttribute("aria-hidden");
    }
  }

  function syncUI() {
    slides.forEach((slide, position) => setSlideExposure(slide, position + 1 === current));
    currentLabel.textContent = String(current).padStart(2, "0");
    totalLabel.textContent = String(total).padStart(2, "0");
    prevButton.disabled = current === 1;
    nextButton.disabled = current === total;
    const activeSlide = slides[current - 1];
    const note = activeSlide.querySelector("[data-note]")?.textContent?.trim() || "No presenter note.";
    presenterText.textContent = note;
    presenterCount.textContent = `${String(current).padStart(2, "0")}/${String(total).padStart(2, "0")}`;
    document.documentElement.dataset.slide = String(current);
    document.title = `${String(current).padStart(2, "0")} · ${activeSlide.dataset.phase || "Slide"} | Alfred × Gemini Spark`;
  }

  function scrollToSlide(index, behavior = "smooth") {
    if (mode !== "mobile") return;
    const target = slides[index - 1];
    target.scrollIntoView({ block: "start", behavior: reducedMedia.matches ? "auto" : behavior });
  }

  function activate(index, options = {}) {
    const next = Math.min(total, Math.max(1, Number(index) || 1));
    const changed = next !== current;
    current = next;
    syncUI();

    if (options.history === "push" && changed) history.pushState({ slide: current }, "", withSlideInUrl(current));
    if (options.history === "replace") history.replaceState({ slide: current }, "", withSlideInUrl(current));
    if (options.scroll) scrollToSlide(current, options.behavior || "smooth");

    if (mode === "desktop" && changed && options.focus) {
      const heading = slides[current - 1].querySelector("h1, h2");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }
    return current;
  }

  function move(delta, options = {}) {
    return activate(current + delta, { history: "push", scroll: true, ...options });
  }

  function handleKeydown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key.toLowerCase() === "p") {
      event.preventDefault();
      presenterPanel.hidden = !presenterPanel.hidden;
      return;
    }
    if (event.key === "Escape" && !presenterPanel.hidden) {
      event.preventDefault();
      presenterPanel.hidden = true;
      return;
    }
    if (isInteractiveTarget(event.target)) return;
    const keys = ["ArrowRight", "ArrowDown", "PageDown", "ArrowLeft", "ArrowUp", "PageUp", "Home", "End", " "];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) move(1);
    if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) move(-1);
    if (event.key === "Home") activate(1, { history: "push", scroll: true });
    if (event.key === "End") activate(total, { history: "push", scroll: true });
  }

  function handlePointerDown(event) {
    if (event.pointerType === "mouse" || isInteractiveTarget(event.target)) return;
    pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event) {
    if (!pointerStart || pointerStart.id !== event.pointerId) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.35) return;
    if (dx < 0) move(1);
    if (dx > 0) move(-1);
  }

  function handlePopstate() {
    const index = parseSlide(new URL(window.location.href).searchParams.get("slide"), total);
    activate(index, { history: "none", scroll: true, behavior: "auto" });
  }

  function startMobileObserver() {
    observer?.disconnect();
    if (mode !== "mobile") return;
    observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const index = Number(visible.target.dataset.slide);
      if (index !== current) {
        current = index;
        syncUI();
      }
    }, { threshold: [0.35, 0.55, 0.75] });
    slides.forEach((slide) => observer.observe(slide));
  }

  function setMode(initial = false) {
    mode = mobileMedia.matches ? "mobile" : "desktop";
    document.body.classList.toggle("deck-mode", mode === "desktop");
    syncUI();
    startMobileObserver();
    if (mode === "mobile" && initial) {
      document.documentElement.style.scrollBehavior = "auto";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        scrollToSlide(current, "auto");
        document.documentElement.style.removeProperty("scroll-behavior");
      }));
    }
  }

  prevButton.addEventListener("click", () => move(-1, { focus: false }));
  nextButton.addEventListener("click", () => move(1, { focus: false }));
  document.addEventListener("keydown", handleKeydown);
  root.addEventListener("pointerdown", handlePointerDown, { passive: true });
  root.addEventListener("pointerup", handlePointerUp, { passive: true });
  window.addEventListener("popstate", handlePopstate);
  mobileMedia.addEventListener("change", () => setMode(false));
  reducedMedia.addEventListener("change", syncUI);

  presenterPanel.hidden = !presenter;
  totalLabel.textContent = String(total).padStart(2, "0");
  root.dataset.initialized = "true";
  setMode(true);
  activate(current, { history: "replace", scroll: mode === "mobile", behavior: "auto" });

  const controller = {
    root,
    slides,
    activate,
    next: () => move(1),
    previous: () => move(-1),
    get current() { return current; },
    get mode() { return mode; },
    get total() { return total; },
    initialize: () => initializeDeck(root)
  };
  window.__sparkDeck = controller;
  return controller;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initializeDeck(), { once: true });
} else {
  initializeDeck();
}

export { initializeDeck, parseSlide };
