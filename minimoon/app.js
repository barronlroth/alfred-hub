(() => {
  "use strict";

  const state = {
    hotels: [],
    startDate: "2026-10-05",
    shortlist: new Set(),
    filters: { region: "all", budget: "all", weather: "all", intimacy: "all", activity: "all" }
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const confidenceLabels = {
    "exact-date": "Exact-date signal",
    "adjacent-date": "Adjacent-date signal",
    "generic-rate-signal": "Generic rate signal",
    "generic-signal": "Generic rate signal",
    "estimate": "Broad estimate"
  };
  const weatherOrder = { low: 1, medium: 2, high: 3 };

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }

  function normalizeLevel(value = "") {
    const text = String(value).toLowerCase();
    if (text.startsWith("medium") || text.includes("moderate")) return "medium";
    if (text.includes("medium")) return "medium";
    if (text.startsWith("low")) return "low";
    return "high";
  }

  function stayNights() { return state.startDate === "2026-10-05" ? 6 : 5; }

  function stayLabel() {
    return state.startDate === "2026-10-05" ? "Mon 05 → Sun 11 · 6 nights" : "Tue 06 → Sun 11 · 5 nights";
  }

  function stayRange(hotel) {
    if (stayNights() === 6) return hotel.sixNightRange;
    return hotel.sixNightRange.map(value => Math.round((value * 5 / 6) / 10) * 10);
  }

  function stayRangeTitle() { return stayNights() === 6 ? "Six-night planning range" : "Five-night derived estimate"; }
  function stayConfidence(hotel) { return stayNights() === 6 ? (confidenceLabels[hotel.priceConfidence] || hotel.priceConfidence) : "Derived from six-night research"; }
  function bookingUrl(hotel) { return state.startDate === "2026-10-05" ? hotel.bookingUrl : hotel.bookingUrl.replaceAll("2026-10-05", "2026-10-06"); }

  function scoreMarkup(attributes) {
    const labels = { romance: "Romance", privacy: "Privacy", service: "Service", foodSpa: "Food + spa", activities: "Activities", weather: "Weather" };
    return Object.entries(labels).map(([key, label]) => `
      <div class="attribute">
        <span class="attribute-label">${label}</span><span class="attribute-score">${attributes[key]}/10</span>
        <span class="attribute-bar" aria-hidden="true"><i style="--score:${attributes[key]}"></i></span>
      </div>`).join("");
  }

  function galleryMarkup(hotel) {
    const [main, ...thumbs] = hotel.images;
    return `
      <div class="gallery" data-gallery="${escapeHTML(hotel.slug)}">
        <figure class="gallery-main">
          <img src="${escapeHTML(main.localPath)}" alt="${escapeHTML(main.alt)}" width="1600" height="1000" loading="${hotel.editorialRank && hotel.editorialRank <= 3 ? "eager" : "lazy"}" data-main-image data-image-index="0">
          <figcaption><span data-main-caption>${escapeHTML(main.caption)}</span><a href="${escapeHTML(main.sourceUrl)}" target="_blank" rel="noopener" data-main-source>${escapeHTML(main.sourceName)}</a></figcaption>
        </figure>
        <div class="gallery-thumbs" aria-label="Choose the main image for ${escapeHTML(hotel.name)}">
          ${thumbs.map((image, index) => `<figure class="gallery-thumb-wrap"><button class="gallery-thumb" type="button" data-promote-image="${index + 1}" aria-label="Show ${escapeHTML(image.caption)} as main image"><img src="${escapeHTML(image.localPath)}" alt="" width="600" height="400" loading="lazy"><span class="thumb-number">0${index + 2}</span></button><figcaption><span>${escapeHTML(image.caption)}</span><a href="${escapeHTML(image.sourceUrl)}" target="_blank" rel="noopener">${escapeHTML(image.sourceName)}</a></figcaption></figure>`).join("")}
        </div>
      </div>`;
  }

  function hotelMarkup(hotel, sequenceIndex) {
    const index = hotel.editorialRank ? String(hotel.editorialRank).padStart(2, "0") : `E${String(sequenceIndex + 1).padStart(2, "0")}`;
    const label = hotel.editorialRank ? `Rank ${index}` : "Explore";
    return `
      <article class="hotel-chapter" id="hotel-${escapeHTML(hotel.slug)}" data-slug="${escapeHTML(hotel.slug)}" data-region="${escapeHTML(hotel.region)}">
        ${galleryMarkup(hotel)}
        <div class="hotel-copy">
          <div class="chapter-index"><strong>${index}</strong><span>${escapeHTML(hotel.region)} · ${escapeHTML(hotel.location)}</span></div>
          <h3>${escapeHTML(hotel.name)}</h3>
          <p class="hotel-role">${escapeHTML(hotel.role)}</p>
          <p class="hotel-summary">${escapeHTML(hotel.summary)}</p>
          <div class="facts">
            <div class="fact"><span class="eyebrow">Nightly planning range</span><strong>${money.format(hotel.nightlyRange[0])}–${money.format(hotel.nightlyRange[1])}</strong><span class="confidence">${stayConfidence(hotel)}</span></div>
            <div class="fact"><span class="eyebrow" data-stay-range-title>${stayRangeTitle()}</span><strong data-stay-range="${escapeHTML(hotel.slug)}">${money.format(stayRange(hotel)[0])}–${money.format(stayRange(hotel)[1])}</strong><span class="confidence" data-stay-label>${stayLabel()}</span></div>
            <div class="fact wide"><span class="eyebrow">Best room to price</span><strong>${escapeHTML(hotel.bestRoom)}</strong><details><summary>How confident is this price?</summary><p>${escapeHTML(hotel.priceNote)}</p></details></div>
          </div>
          <div class="attributes" aria-label="Attribute scores">${scoreMarkup(hotel.attributes)}</div>
          <div class="truth-block">
            <section><h4>Weather · ${escapeHTML(normalizeLevel(hotel.weatherRisk))} risk</h4><p>${escapeHTML(hotel.weather)}</p></section>
            <section><h4>Route · ${escapeHTML(normalizeLevel(hotel.travelFriction))} friction</h4><p>${escapeHTML(hotel.route)}</p></section>
            <section class="catch"><h4>The honest catch</h4><p>${escapeHTML(hotel.honestCatch)}</p></section>
          </div>
          <blockquote class="hotel-quote">“${escapeHTML(hotel.quote.text)}”<cite><a href="${escapeHTML(hotel.quote.url)}" target="_blank" rel="noopener">${escapeHTML(hotel.quote.sourceName)} ↗</a></cite></blockquote>
          <div class="hotel-actions">
            <button type="button" class="shortlist-button" data-shortlist="${escapeHTML(hotel.slug)}" aria-pressed="false">＋ Add to shortlist</button>
            <a href="${escapeHTML(hotel.officialUrl)}" target="_blank" rel="noopener">Official site ↗</a>
            <a href="${escapeHTML(bookingUrl(hotel))}" data-booking-link="${escapeHTML(hotel.slug)}" target="_blank" rel="noopener">Check dates ↗</a>
          </div>
          <span class="sr-only">${label}</span>
        </div>
      </article>`;
  }

  function openingMarkup(hotels) {
    const descriptions = ["The aesthetic yes", "The couple-first answer", "The beautiful wild card"];
    return hotels.slice(0, 3).map((hotel, index) => `
      <article class="opening-option">
        <span class="eyebrow">0${index + 1} · ${descriptions[index]}</span>
        <h3>${escapeHTML(hotel.name)}</h3>
        <p>${escapeHTML(hotel.role)}. ${money.format(stayRange(hotel)[0])}–${money.format(stayRange(hotel)[1])} for ${stayNights()} nights.</p>
        <a href="#hotel-${escapeHTML(hotel.slug)}">See why it belongs ↓</a>
      </article>`).join("");
  }

  function render() {
    const ranked = state.hotels.filter(h => h.collection === "ranked");
    const explore = state.hotels.filter(h => h.collection === "explore");
    $("#opening-options").innerHTML = openingMarkup(ranked);
    $("#ranked-hotels").innerHTML = ranked.map(hotelMarkup).join("");
    $("#explore-hotels").innerHTML = explore.map(hotelMarkup).join("");
    populateRegions();
    populateCredits();
    bindDynamicEvents();
    restoreShortlist();
    applyFilters();
  }

  function populateRegions() {
    const select = $('select[name="region"]');
    const regions = [...new Set(state.hotels.map(h => h.region))].sort((a, b) => a.localeCompare(b));
    select.querySelectorAll("option:not(:first-child)").forEach(option => option.remove());
    select.insertAdjacentHTML("beforeend", regions.map(region => `<option value="${escapeHTML(region)}">${escapeHTML(region)}</option>`).join(""));
  }

  function populateCredits() {
    $("#image-credits-list").innerHTML = state.hotels.map(hotel => `<section><h3>${escapeHTML(hotel.name)}</h3><p><a href="${escapeHTML(hotel.officialUrl)}" target="_blank" rel="noopener">Official site</a> · <a href="${escapeHTML(hotel.quote.url)}" target="_blank" rel="noopener">Review evidence</a></p><ol>${hotel.images.map(image => `<li><a href="${escapeHTML(image.sourceUrl)}" target="_blank" rel="noopener">${escapeHTML(image.caption)}</a> — ${escapeHTML(image.sourceName)}</li>`).join("")}</ol></section>`).join("");
  }

  function bindDynamicEvents() {
    $$('[data-promote-image]').forEach(button => button.addEventListener("click", () => promoteImage(button)));
    $$('[data-shortlist]').forEach(button => button.addEventListener("click", () => toggleShortlist(button.dataset.shortlist)));
    $$('img').forEach(image => {
      if (image.complete && image.naturalWidth) image.classList.add("is-loaded");
      image.addEventListener("load", () => image.classList.add("is-loaded"), { once: true });
      image.addEventListener("error", () => handleImageError(image), { once: true });
    });
  }

  function promoteImage(button) {
    const gallery = button.closest("[data-gallery]");
    const hotel = state.hotels.find(item => item.slug === gallery.dataset.gallery);
    const main = $("[data-main-image]", gallery);
    const currentIndex = Number(main.dataset.imageIndex);
    const nextIndex = Number(button.dataset.promoteImage);
    const current = hotel.images[currentIndex];
    const next = hotel.images[nextIndex];
    const thumbImage = $("img", button);
    const thumbWrap = button.closest(".gallery-thumb-wrap");
    thumbImage.src = current.localPath;
    thumbImage.alt = "";
    button.dataset.promoteImage = currentIndex;
    button.setAttribute("aria-label", `Show ${current.caption} as main image`);
    main.classList.remove("is-loaded");
    main.addEventListener("load", () => main.classList.add("is-loaded"), { once: true });
    main.src = next.localPath;
    main.alt = next.alt;
    main.dataset.imageIndex = nextIndex;
    $("[data-main-caption]", gallery).textContent = next.caption;
    const source = $("[data-main-source]", gallery);
    source.href = next.sourceUrl;
    source.textContent = next.sourceName;
    $("figcaption span", thumbWrap).textContent = current.caption;
    const thumbSource = $("figcaption a", thumbWrap);
    thumbSource.href = current.sourceUrl;
    thumbSource.textContent = current.sourceName;
    if (main.complete && main.naturalWidth) requestAnimationFrame(() => main.classList.add("is-loaded"));
  }

  function handleImageError(image) {
    const gallery = image.closest("[data-gallery]");
    if (!gallery || !image.matches("[data-main-image]")) {
      const replacement = document.createElement("div");
      replacement.className = "thumb-error";
      replacement.textContent = "Image unavailable";
      image.replaceWith(replacement);
      return;
    }
    const hotel = state.hotels.find(item => item.slug === gallery.dataset.gallery);
    const current = Number(image.dataset.imageIndex);
    const nextIndex = hotel.images.findIndex((_, index) => index !== current);
    if (nextIndex >= 0 && !image.dataset.retried) {
      image.dataset.retried = "true";
      image.dataset.imageIndex = String(nextIndex);
      image.src = hotel.images[nextIndex].localPath;
      image.alt = hotel.images[nextIndex].alt;
      $("[data-main-caption]", gallery).textContent = hotel.images[nextIndex].caption;
      const source = $("[data-main-source]", gallery);
      source.href = hotel.images[nextIndex].sourceUrl;
      source.textContent = hotel.images[nextIndex].sourceName;
      return;
    }
    const replacement = document.createElement("div");
    replacement.className = "image-error";
    replacement.textContent = `${hotel.name}: the photograph could not be loaded. The research and comparison details remain available.`;
    image.replaceWith(replacement);
  }

  function hotelMatches(hotel) {
    const f = state.filters;
    if (f.region !== "all" && hotel.region !== f.region) return false;
    if (f.budget !== "all" && stayRange(hotel)[1] > Number(f.budget)) return false;
    if (f.weather !== "all" && weatherOrder[normalizeLevel(hotel.weatherRisk)] > weatherOrder[f.weather]) return false;
    if (f.intimacy !== "all" && Math.min(hotel.attributes.romance, hotel.attributes.privacy) < Number(f.intimacy)) return false;
    if (f.activity !== "all" && hotel.attributes.activities < Number(f.activity)) return false;
    return true;
  }

  function applyFilters() {
    let count = 0;
    $$(".hotel-chapter").forEach(chapter => {
      const hotel = state.hotels.find(item => item.slug === chapter.dataset.slug);
      const visible = hotelMatches(hotel);
      chapter.classList.toggle("is-filtered", !visible);
      if (visible) count += 1;
    });
    $("#empty-state").hidden = count !== 0;
    $("#ranked").hidden = state.hotels.filter(h => h.collection === "ranked" && hotelMatches(h)).length === 0;
    $("#explore").hidden = state.hotels.filter(h => h.collection === "explore" && hotelMatches(h)).length === 0;
    const matching = state.hotels.filter(hotelMatches);
    $("#opening-case").hidden = matching.length === 0;
    $("#opening-options").innerHTML = openingMarkup(matching);
    if (count === 0) renderNearestMatches();
    $(".filter-status").textContent = `${count} of 25 stays in view`;
  }

  function renderNearestMatches() {
    const f = state.filters;
    const score = hotel => [
      f.region === "all" || hotel.region === f.region,
      f.budget === "all" || stayRange(hotel)[1] <= Number(f.budget),
      f.weather === "all" || weatherOrder[normalizeLevel(hotel.weatherRisk)] <= weatherOrder[f.weather],
      f.intimacy === "all" || Math.min(hotel.attributes.romance, hotel.attributes.privacy) >= Number(f.intimacy),
      f.activity === "all" || hotel.attributes.activities >= Number(f.activity)
    ].filter(Boolean).length;
    const nearest = [...state.hotels].sort((a, b) => score(b) - score(a) || (a.editorialRank || 99) - (b.editorialRank || 99)).slice(0, 3);
    $("#nearest-matches").innerHTML = `<p>Closest alternatives:</p>${nearest.map(hotel => `<a href="#hotel-${escapeHTML(hotel.slug)}">${escapeHTML(hotel.name)}</a>`).join("")}`;
  }

  function resetFilters() {
    const form = $("#filters");
    form.reset();
    Object.keys(state.filters).forEach(key => state.filters[key] = "all");
    applyFilters();
    $(".filter-toggle").focus();
  }

  function restoreShortlist() {
    try {
      const stored = JSON.parse(localStorage.getItem("minimoon-shortlist") || "[]");
      stored.filter(slug => state.hotels.some(h => h.slug === slug)).slice(0, 4).forEach(slug => state.shortlist.add(slug));
    } catch (_) {
      state.shortlist.clear();
    }
    updateShortlistUI();
  }

  function persistShortlist() {
    try { localStorage.setItem("minimoon-shortlist", JSON.stringify([...state.shortlist])); } catch (_) { /* private browsing can refuse storage */ }
  }

  function toggleShortlist(slug) {
    if (state.shortlist.has(slug)) state.shortlist.delete(slug);
    else if (state.shortlist.size >= 4) {
      showToast("Four is the limit. Remove one before adding another.");
      return;
    } else state.shortlist.add(slug);
    persistShortlist();
    updateShortlistUI();
  }

  function updateShortlistUI() {
    $$('[data-shortlist]').forEach(button => {
      const selected = state.shortlist.has(button.dataset.shortlist);
      button.setAttribute("aria-pressed", String(selected));
      button.textContent = selected ? "✓ Shortlisted" : "＋ Add to shortlist";
    });
    const selectedHotels = [...state.shortlist].map(slug => state.hotels.find(h => h.slug === slug)).filter(Boolean);
    const tray = $("#compare-tray");
    tray.hidden = selectedHotels.length === 0;
    $("#tray-count").textContent = String(selectedHotels.length);
    $("#tray-items").innerHTML = selectedHotels.map(hotel => `<div class="tray-item"><img src="${escapeHTML(hotel.images[0].localPath)}" alt=""><span>${escapeHTML(hotel.name)}</span><button type="button" data-tray-remove="${escapeHTML(hotel.slug)}" aria-label="Remove ${escapeHTML(hotel.name)}">×</button></div>`).join("");
    $$('[data-tray-remove]').forEach(button => button.addEventListener("click", () => toggleShortlist(button.dataset.trayRemove)));
    const ready = selectedHotels.length >= 2;
    const action = $("#compare-action");
    action.classList.toggle("is-disabled", !ready);
    action.setAttribute("aria-disabled", String(!ready));
    action.textContent = ready ? `Compare ${selectedHotels.length} stays` : "Choose 2–4 to compare";
    renderComparison(selectedHotels);
  }

  function renderComparison(hotels) {
    const section = $("#comparison");
    section.hidden = hotels.length < 2;
    if (hotels.length < 2) return;
    const rows = [
      ["Role", h => h.role],
      ["Best room", h => h.bestRoom],
      ["Nightly", h => `${money.format(h.nightlyRange[0])}–${money.format(h.nightlyRange[1])}`],
      [`${stayNights()} nights`, h => `${money.format(stayRange(h)[0])}–${money.format(stayRange(h)[1])}`],
      ["Confidence", h => stayConfidence(h)],
      ["Romance / privacy", h => `${h.attributes.romance} / ${h.attributes.privacy}`],
      ["Food + spa / activities", h => `${h.attributes.foodSpa} / ${h.attributes.activities}`],
      ["Weather", h => `${normalizeLevel(h.weatherRisk)} risk. ${h.weather}`],
      ["Travel", h => h.route],
      ["Honest catch", h => h.honestCatch]
    ];
    $("#comparison-matrix").innerHTML = `<thead><tr><th>Decision point</th>${hotels.map(h => `<th scope="col">${escapeHTML(h.name)}</th>`).join("")}</tr></thead><tbody>${rows.map(([label, value]) => `<tr><th scope="row">${label}</th>${hotels.map(h => `<td>${escapeHTML(value(h))}</td>`).join("")}</tr>`).join("")}</tbody>`;
  }

  let toastTimer;
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  function bindStaticEvents() {
    $$('[data-start-date]').forEach(button => button.addEventListener("click", () => {
      state.startDate = button.dataset.startDate;
      $$('[data-start-date]').forEach(other => {
        const active = other === button;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-pressed", String(active));
      });
      $$('[data-stay-label]').forEach(label => label.textContent = stayLabel());
      $$('[data-stay-night-count]').forEach(label => label.textContent = `${stayNights()} nights`);
      $$('[data-stay-range-title]').forEach(label => label.textContent = stayRangeTitle());
      $$('[data-stay-range]').forEach(price => {
        const hotel = state.hotels.find(item => item.slug === price.dataset.stayRange);
        price.textContent = `${money.format(stayRange(hotel)[0])}–${money.format(stayRange(hotel)[1])}`;
      });
      $$('[data-booking-link]').forEach(link => {
        const hotel = state.hotels.find(item => item.slug === link.dataset.bookingLink);
        link.href = bookingUrl(hotel);
      });
      renderComparison([...state.shortlist].map(slug => state.hotels.find(h => h.slug === slug)).filter(Boolean));
      applyFilters();
    }));

    const filterToggle = $(".filter-toggle");
    filterToggle.addEventListener("click", () => {
      const filters = $("#filters");
      const open = filters.hidden;
      filters.hidden = !open;
      filterToggle.setAttribute("aria-expanded", String(open));
      filterToggle.lastElementChild.textContent = open ? "−" : "＋";
    });
    $("#filters").addEventListener("change", event => {
      if (event.target.name) state.filters[event.target.name] = event.target.value;
      applyFilters();
    });
    $("#filters").addEventListener("reset", () => setTimeout(() => {
      Object.keys(state.filters).forEach(key => state.filters[key] = "all");
      applyFilters();
    }, 0));
    $('[data-reset-filters]').addEventListener("click", resetFilters);
    $('[data-clear-shortlist]').addEventListener("click", () => {
      state.shortlist.clear();
      persistShortlist();
      updateShortlistUI();
    });

    const dialog = $("#credits-dialog");
    $$('[data-open-credits]').forEach(button => button.addEventListener("click", () => {
      dialog.showModal();
      document.body.classList.add("dialog-open");
    }));
    $('[data-close-credits]').addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });
    $("#compare-action").addEventListener("click", event => {
      if (event.currentTarget.getAttribute("aria-disabled") === "true") event.preventDefault();
    });
  }

  async function loadData() {
    try {
      const response = await fetch("data/hotels.json", { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Hotel data returned ${response.status}`);
      const payload = await response.json();
      if (!payload.hotels || payload.hotels.length !== 25) throw new Error("Hotel data is incomplete");
      state.hotels = payload.hotels;
      render();
    } catch (error) {
      console.error("Minimoon data failed to load", error);
      $("#ranked-hotels").innerHTML = `<div class="error-state"><h3>The atlas could not open.</h3><p>The local hotel research did not load. Check the connection, then try again.</p><button type="button" data-retry>Try again</button></div>`;
      $(".filter-status").textContent = "Hotel data unavailable";
      $('[data-retry]').addEventListener("click", loadData);
    }
  }

  bindStaticEvents();
  loadData();
})();