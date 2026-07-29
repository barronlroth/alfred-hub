(() => {
  const state = { activeBucket: "all", featured: "pebble-beach-proper" };
  const bucketIcons = { "few-hours": "03H", "full-day": "DAY", "one-night": "1N", "full-weekend": "W/E" };
  const bucketColors = { "few-hours": "#123b82", "full-day": "#d49b0b", "one-night": "#2f664a", "full-weekend": "#d53b2f" };
  const summaries = {
    all: "Twenty-four outings. Four sizes of freedom. The rest of the internet may keep its 137-item list.",
    "few-hours": "Six outings that fit inside a few hours. No hotel search, no annual leave, no excuse.",
    "full-day": "Nine full days with an actual shape: leave early, do the thing properly, come home smug.",
    "one-night": "Four escapes that justify one small bag and precisely one change of shirt.",
    "full-weekend": "Five proper weekends. Long enough to leave the Bay Area; short enough to keep your job."
  };

  const byId = (id) => OUTINGS.find((outing) => outing.id === id);
  const completed = OUTINGS.filter((outing) => outing.completed);

  const timeTickets = document.querySelector("#time-tickets");
  const filterBoard = document.querySelector("#filter-board");
  const postcardGrid = document.querySelector("#postcard-grid");
  const atlasSummary = document.querySelector("#atlas-summary");
  const dialog = document.querySelector("#outing-dialog");

  function renderTimeControls() {
    timeTickets.innerHTML = TIME_BUCKETS.map((bucket) => `
      <button class="time-ticket" type="button" data-bucket="${bucket.id}" aria-pressed="${state.activeBucket === bucket.id}" style="--ticket-color:${bucketColors[bucket.id]}">
        <span class="ticket-icon" aria-hidden="true">${bucketIcons[bucket.id]}</span>
        <span class="ticket-label">${bucket.label}</span>
        <span class="ticket-short">${bucket.short}</span>
      </button>
    `).join("");

    timeTickets.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        selectBucket(button.dataset.bucket, true);
        document.querySelector("#atlas").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      });
    });
  }

  function renderFilterBoard() {
    const controls = [{ id: "all", label: "All 24", short: "First edition" }, ...TIME_BUCKETS];
    filterBoard.innerHTML = controls.map((bucket) => {
      const count = bucket.id === "all" ? OUTINGS.length : OUTINGS.filter((outing) => outing.bucket === bucket.id).length;
      return `
        <button class="filter-button" type="button" data-bucket="${bucket.id}" aria-pressed="${state.activeBucket === bucket.id}">
          ${bucket.label}<small>${count} outings · ${bucket.short || ""}</small>
        </button>`;
    }).join("");

    filterBoard.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => selectBucket(button.dataset.bucket, false));
    });
  }

  function selectBucket(bucket, updateHero) {
    state.activeBucket = bucket;
    if (updateHero && bucket !== "all") {
      const first = OUTINGS.find((outing) => outing.bucket === bucket);
      if (first) setFeatured(first.id);
    }
    renderTimeControls();
    renderFilterBoard();
    renderCards();
  }

  function setFeatured(id) {
    const outing = byId(id);
    if (!outing) return;
    state.featured = id;
    const image = document.querySelector("#hero-image");
    image.src = outing.artwork;
    image.alt = `Illustrated postcard for ${outing.title}`;
    document.querySelector("#hero-number").textContent = outing.number;
    document.querySelector("#hero-outing-title").innerHTML = outing.title.replace(/, /, ",<br>");
    document.querySelector("#hero-short").textContent = outing.short;
    document.querySelector("#hero-beats").innerHTML = outing.itinerary.slice(0, 3).map((beat) => `<li><b>${beat[0]}</b>${beat[1]}</li>`).join("");
    document.querySelector("#hero-open").onclick = () => openGuide(outing.id);
  }

  function renderCards() {
    const visible = state.activeBucket === "all" ? OUTINGS : OUTINGS.filter((outing) => outing.bucket === state.activeBucket);
    atlasSummary.textContent = summaries[state.activeBucket];
    postcardGrid.innerHTML = visible.map((outing) => `
      <button class="postcard ${outing.completed ? "completed" : ""}" type="button" data-outing="${outing.id}" aria-label="Open field guide for ${outing.title}">
        <span class="postcard-art">
          <img src="${outing.artwork}" alt="" loading="lazy" width="900" height="675">
          <span class="postcard-no">${outing.number} / 24</span>
          <span class="card-stamp">${outing.region}</span>
        </span>
        <span class="postcard-copy">
          <span class="postcard-kicker">${outing.time} · ${outing.season[0]}</span>
          <h3>${outing.title}</h3>
          <p>${outing.short}</p>
          <span class="card-facts"><span>${outing.duration}</span><span>${outing.energy}</span><span>${outing.cost}</span></span>
        </span>
      </button>
    `).join("");

    postcardGrid.querySelectorAll(".postcard").forEach((card) => {
      card.addEventListener("click", () => openGuide(card.dataset.outing));
    });
  }

  function renderMap() {
    const points = document.querySelector("#map-points");
    const routes = document.querySelector("#map-routes");
    const tooltip = document.querySelector("#map-tooltip");
    const sf = [30, 72];

    routes.innerHTML = OUTINGS
      .filter((outing) => Math.abs(outing.map[0] - sf[0]) + Math.abs(outing.map[1] - sf[1]) > 7)
      .map((outing) => `<path class="map-route" d="M ${sf[0]} ${sf[1]} Q ${(sf[0] + outing.map[0]) / 2 + 4} ${(sf[1] + outing.map[1]) / 2 - 3} ${outing.map[0]} ${outing.map[1]}" />`)
      .join("");

    points.innerHTML = OUTINGS.map((outing) => `
      <g class="map-point" data-outing="${outing.id}" transform="translate(${outing.map[0]} ${outing.map[1]})" tabindex="0" role="button" aria-label="${outing.number}. ${outing.title}">
        <circle r="1.8"></circle>
        <text y=".1">${Number(outing.number)}</text>
      </g>
    `).join("");

    points.querySelectorAll(".map-point").forEach((point) => {
      const show = () => {
        const outing = byId(point.dataset.outing);
        tooltip.innerHTML = `<b>${outing.number}</b> · ${outing.title}<br><small>${outing.duration} · ${outing.region}</small>`;
        tooltip.classList.add("visible");
      };
      const hide = () => tooltip.classList.remove("visible");
      point.addEventListener("mouseenter", show);
      point.addEventListener("focus", show);
      point.addEventListener("mouseleave", hide);
      point.addEventListener("blur", hide);
      point.addEventListener("click", () => openGuide(point.dataset.outing));
      point.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openGuide(point.dataset.outing);
        }
      });
    });
  }

  function renderLedger() {
    document.querySelector("#completed-count").textContent = `${completed.length}/24`;
    document.querySelector(".completion-stamp").setAttribute("aria-label", `${completed.length} of 24 outings completed`);
    document.querySelector(".ledger-head b").textContent = `${completed.length}/24`;
    document.querySelector("#stamp-grid").innerHTML = OUTINGS.map((outing) => `<span class="stamp-slot ${outing.completed ? "done" : ""}" title="${outing.title}">${outing.number}</span>`).join("");
  }

  function openGuide(id, updateHash = true) {
    const outing = byId(id);
    if (!outing) return;

    const dialogImage = document.querySelector("#dialog-image");
    dialogImage.src = outing.artwork;
    dialogImage.alt = `Illustrated postcard for ${outing.title}`;
    document.querySelector("#dialog-image-caption").textContent = `${outing.number} / 24 · ${outing.region}`;
    document.querySelector("#dialog-meta").textContent = `${outing.time} · ${outing.duration} · ${outing.season.join(" / ")}`;
    document.querySelector("#dialog-title").textContent = outing.title;
    document.querySelector("#dialog-verdict").textContent = outing.verdict;
    document.querySelector("#dialog-stamp").innerHTML = outing.completed ? "OUTING<br>DONE" : "FIELD<br>GUIDE";

    const facts = [
      ["From SF", outing.drive],
      ["Energy", outing.energy],
      ["Planning lead", outing.lead],
      ["Cost", outing.cost]
    ];
    document.querySelector("#dialog-facts").innerHTML = facts.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
    document.querySelector("#dialog-itinerary").innerHTML = outing.itinerary.map(([time, title, detail]) => `
      <li><div><time>${time}</time><b>${title}</b><p>${detail}</p></div></li>
    `).join("");
    document.querySelector("#dialog-swaps").innerHTML = outing.swaps.map((swap) => `<li>${swap}</li>`).join("");
    document.querySelector("#dialog-sources").innerHTML = outing.sources.map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener">${label} ↗</a>`).join("");

    if (!dialog.open) dialog.showModal();
    if (updateHash) history.replaceState(null, "", `#outing=${outing.id}`);
    document.querySelector(".dialog-close").focus();
  }

  function closeGuide() {
    if (dialog.open) dialog.close();
    if (location.hash.startsWith("#outing=")) history.replaceState(null, "", location.pathname + location.search);
  }

  document.querySelector(".dialog-close").addEventListener("click", closeGuide);
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) closeGuide();
  });
  dialog.addEventListener("close", () => {
    if (location.hash.startsWith("#outing=")) history.replaceState(null, "", location.pathname + location.search);
  });

  renderTimeControls();
  renderFilterBoard();
  renderCards();
  renderMap();
  renderLedger();
  setFeatured(state.featured);

  const hashMatch = location.hash.match(/^#outing=(.+)$/);
  if (hashMatch) openGuide(hashMatch[1], false);
})();
