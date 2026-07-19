(() => {
  "use strict";

  const datasets = { task: window.EVAL_DATA, personality: window.PERSONALITY_EVAL_DATA };
  if (!datasets.task?.cases?.length || !datasets.personality?.cases?.length) {
    document.body.innerHTML = "<main><p>Evaluation data could not be loaded.</p></main>";
    return;
  }

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const params = new URLSearchParams(location.search);
  const requestedSuite = params.get("suite");
  const initialSuite = requestedSuite === "personality" ? "personality" : "task";
  const defaults = {
    task: { left: "soul_baseline", right: "soul_adhd" },
    personality: { left: "soul_baseline", right: "default_concise" },
  };
  const requestedLeft = params.get("left");
  const requestedRight = params.get("right");
  if (
    datasets[initialSuite].condition_order.includes(requestedLeft)
    && datasets[initialSuite].condition_order.includes(requestedRight)
    && requestedLeft !== requestedRight
  ) {
    defaults[initialSuite] = { left: requestedLeft, right: requestedRight };
  }
  const state = {
    suite: initialSuite,
    index: 0,
    mobileSide: "left",
    pairs: structuredClone(defaults),
  };

  const suiteMeta = {
    task: {
      eyebrow: "FOUR-CONDITION TASK ERGONOMICS",
      title: "Two levers.<br>Four response surfaces.",
      lede: "Does Alfred’s SOUL change task quality? Does it change what the ADHD overlay adds? Same prompts, same model, both switches tested on and off.",
      legend: "ACCURACY / EFFICIENCY / WORDS",
      effectLabel: "FOUR CONTROLLED CONTRASTS",
      scoreMetric: "efficiency",
      scoreName: "Efficiency",
      gateLabel: "ACC",
      matrixFields: ["accuracy", "efficiency"],
      matrixPass: "accuracy_passes",
      matrixPassLabel: "accuracy pass",
      metricLabels: [["accuracy", "Accuracy"], ["efficiency", "Efficiency"], ["semantic_compression", "Compression"], ["words", "Words"], ["gate_votes", "Gate votes"]],
    },
    personality: {
      eyebrow: "SIX-CONDITION PERSONALITY & TASTE STUDY",
      title: "Same brain.<br>Different chemistry.",
      lede: "Does Alfred’s SOUL make casual answers warmer, sharper, and more personally attuned? ADHD and concise modes reveal whether presentation helps the voice or sands it off.",
      legend: "GATE / PERSONABILITY / WORDS",
      effectLabel: "NINE CONTROLLED CONTRASTS",
      scoreMetric: "personability",
      scoreName: "Personability",
      gateLabel: "GATE",
      matrixFields: ["gate_score", "personability"],
      matrixPass: "gate_passes",
      matrixPassLabel: "gate pass",
      metricLabels: [["gate_score", "Gate"], ["personability", "Personality"], ["attunement", "Attunement"], ["taste_and_specificity", "Taste"], ["natural_voice", "Voice"], ["words", "Words"]],
    },
  };

  const elements = {
    runLabel: $("#run-label"), model: $("#model-value"), provider: $("#provider-value"), caseCount: $("#case-count"),
    suiteEyebrow: $("#suite-eyebrow"), pageTitle: $("#page-title"), suiteLede: $("#suite-lede"), matrixLegend: $("#matrix-legend"),
    factorGrid: $("#factor-grid"), interactionCopy: $("#interaction-copy"), interactionStats: $("#interaction-stats"),
    effectsEyebrow: $("#effects-eyebrow"), effectGrid: $("#effect-grid"), caseNav: $("#case-nav"),
    activeIndex: $("#active-index"), totalIndex: $("#total-index"), category: $("#case-category"), caseId: $("#case-id"), prompt: $("#prompt-text"),
    leftSelect: $("#scenario-left"), rightSelect: $("#scenario-right"), swap: $("#swap-scenarios"),
    leftPanel: $("#baseline-panel"), rightPanel: $("#adhd-panel"), leftAnswer: $("#baseline-answer"), rightAnswer: $("#adhd-answer"),
    leftMetrics: $("#baseline-metrics"), rightMetrics: $("#adhd-metrics"), leftCode: $("#baseline-code"), rightCode: $("#adhd-code"),
    leftTitle: $("#baseline-title"), rightTitle: $("#adhd-title"), leftNote: $("#baseline-note"), rightNote: $("#adhd-note"),
    judgeEyebrow: $("#judge-eyebrow"), judgeWinner: $("#judge-winner"), decisionBasis: $("#decision-basis"),
    leftScore: $("#baseline-score"), rightScore: $("#adhd-score"), leftGate: $("#baseline-accuracy"), rightGate: $("#adhd-accuracy"),
    leftScoreLabel: $("#left-score-label"), rightScoreLabel: $("#right-score-label"), judgeAgreement: $("#judge-agreement"), judgeNotes: $("#judge-notes"),
    pairSummary: $("#identity-effect-grid"), prev: $("#prev-case"), next: $("#next-case"),
    methodCells: $("#method-cells"), methodConstant: $("#method-constant"), methodGate: $("#method-gate"),
  };

  const currentData = () => datasets[state.suite];
  const currentMeta = () => suiteMeta[state.suite];
  const currentPair = () => state.pairs[state.suite];
  const pairKey = (left, right) => `${left}__${right}`;
  const conditionLabel = (id) => currentData().condition_labels[id] || id;
  const conditionNote = (id) => {
    const [identity, mode] = id.split("_");
    const identityText = identity === "soul" ? "Custom Alfred identity" : "Built-in Hermes identity";
    const modeText = mode === "baseline" ? "no overlay" : `${mode.toUpperCase()} overlay`;
    return `${identityText} · ${modeText}`;
  };
  const conditionCode = (side, id) => `SCENARIO ${side} · ${id.replaceAll("_", " ").toUpperCase()}`;

  function appendInline(parent, text) {
    const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
    let cursor = 0;
    for (const match of text.matchAll(pattern)) {
      if (match.index > cursor) parent.append(document.createTextNode(text.slice(cursor, match.index)));
      const token = match[0], node = document.createElement(token.startsWith("**") ? "strong" : "code");
      node.textContent = token.startsWith("**") ? token.slice(2, -2) : token.slice(1, -1);
      parent.append(node); cursor = match.index + token.length;
    }
    if (cursor < text.length) parent.append(document.createTextNode(text.slice(cursor)));
  }

  function renderMarkdown(target, source) {
    target.replaceChildren();
    const lines = String(source).replace(/\r/g, "").split("\n");
    let index = 0, paragraph = [], list = null;
    const flushParagraph = () => {
      if (!paragraph.length) return;
      const p = document.createElement("p"); appendInline(p, paragraph.join(" ").trim()); target.append(p); paragraph = [];
    };
    while (index < lines.length) {
      const trimmed = lines[index].trim();
      if (trimmed.startsWith("```")) {
        flushParagraph(); list = null;
        const language = trimmed.slice(3).trim(), codeLines = []; index += 1;
        while (index < lines.length && !lines[index].trim().startsWith("```")) { codeLines.push(lines[index]); index += 1; }
        const pre = document.createElement("pre"), code = document.createElement("code");
        if (language) code.dataset.language = language; code.textContent = codeLines.join("\n"); pre.append(code); target.append(pre);
      } else if (!trimmed) { flushParagraph(); list = null; }
      else {
        const heading = trimmed.match(/^(#{2,4})\s+(.+)$/), ordered = trimmed.match(/^\d+[.)]\s+(.+)$/), unordered = trimmed.match(/^[-*+]\s+(.+)$/), quote = trimmed.match(/^>\s?(.+)$/);
        if (heading) { flushParagraph(); list = null; const h = document.createElement(`h${heading[1].length}`); appendInline(h, heading[2]); target.append(h); }
        else if (ordered || unordered) {
          flushParagraph(); const tag = ordered ? "ol" : "ul";
          if (!list || list.tagName.toLowerCase() !== tag) { list = document.createElement(tag); target.append(list); }
          const item = document.createElement("li"); appendInline(item, (ordered || unordered)[1]); list.append(item);
        } else if (quote) { flushParagraph(); list = null; const bq = document.createElement("blockquote"); appendInline(bq, quote[1]); target.append(bq); }
        else { list = null; paragraph.push(trimmed); }
      }
      index += 1;
    }
    flushParagraph();
  }

  function renderMetrics(target, metrics) {
    target.style.setProperty("--metric-columns", String(currentMeta().metricLabels.length));
    target.replaceChildren(...currentMeta().metricLabels.map(([key, label]) => {
      const wrapper = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd");
      wrapper.className = "metric"; dt.textContent = label; dd.textContent = metrics[key]; wrapper.append(dt, dd); return wrapper;
    }));
  }

  function shortCondition(condition, contrastId = "") {
    if (condition === "tie") return "Tie";
    if (contrastId.startsWith("concise_vs_adhd")) return condition.endsWith("_concise") ? "Concise" : "ADHD";
    if (contrastId.startsWith("adhd_")) return condition.endsWith("_adhd") ? "ADHD" : "Baseline";
    if (contrastId.startsWith("concise_")) return condition.endsWith("_concise") ? "Concise" : "Baseline";
    return condition.startsWith("soul_") ? "Alfred SOUL" : "Default identity";
  }

  function signed(value, suffix = "") {
    const number = Number(value), prefix = number > 0 ? "+" : "";
    return `${prefix}${number.toFixed(Number.isInteger(number) ? 0 : 2)}${suffix}`;
  }

  function renderFactorGrid() {
    const data = currentData(), meta = currentMeta();
    const overlays = state.suite === "task" ? ["baseline", "adhd"] : ["baseline", "adhd", "concise"];
    elements.factorGrid.dataset.columns = String(overlays.length + 1);
    const cells = [["", "factor-cell factor-cell--corner"], ...overlays.map((overlay) => [overlay === "baseline" ? "Baseline" : `${overlay.toUpperCase()} mode`, `factor-cell factor-cell--head factor-cell--${overlay}`])];
    for (const identity of ["soul", "default"]) {
      cells.push([identity === "soul" ? "Alfred SOUL" : "Default identity", "factor-cell factor-cell--row"]);
      for (const overlay of overlays) cells.push([`${identity}_${overlay}`, `factor-cell factor-cell--${overlay}`]);
    }
    elements.factorGrid.replaceChildren(...cells.map(([value, className]) => {
      const cell = document.createElement("div"); cell.className = className;
      if (data.aggregate[value]) {
        const row = data.aggregate[value], [first, second] = meta.matrixFields;
        const strong = document.createElement("strong");
        strong.append(document.createTextNode(Number(row[first]).toFixed(2)), Object.assign(document.createElement("i"), { textContent: " / " }), document.createTextNode(Number(row[second]).toFixed(2)), Object.assign(document.createElement("i"), { textContent: " / " }), document.createTextNode(row.words));
        const small = document.createElement("small"); small.textContent = `${row[meta.matrixPass]}/${data.case_count} ${meta.matrixPassLabel}`;
        cell.append(strong, small);
      } else cell.textContent = value;
      return cell;
    }));
  }

  function statNodes(stats) {
    return stats.map(([label, value]) => {
      const item = document.createElement("span"), strong = document.createElement("strong"); item.append(document.createTextNode(label)); strong.textContent = value; item.append(strong); return item;
    });
  }

  function renderInteraction() {
    const i = currentData().interaction;
    if (state.suite === "task") {
      const soulWords = Number(i.adhd_words_with_soul), defaultWords = Number(i.adhd_words_with_default_identity), did = Number(i.words_difference_in_differences);
      const interpretation = Math.abs(did) >= 10 ? (Math.abs(soulWords) < Math.abs(defaultWords) ? "Alfred’s SOUL dampened ADHD’s extra brevity; the instruction layers overlap." : "Alfred’s SOUL amplified ADHD’s brevity effect.") : "The two factors were roughly additive in this sample.";
      elements.interactionCopy.textContent = `Across nine task prompts, ADHD changed average length by ${signed(soulWords, " words")} with Alfred’s SOUL and ${signed(defaultWords, " words")} with the default identity. ${interpretation}`;
      elements.interactionStats.replaceChildren(...statNodes([
        ["WORD INTERACTION", signed(did, " words")], ["EFFICIENCY INTERACTION", signed(i.efficiency_difference_in_differences)],
        ["SOUL WORD EFFECT · BASE", signed(i.soul_words_without_adhd, " words")], ["SOUL WORD EFFECT · ADHD", signed(i.soul_words_with_adhd, " words")],
      ]));
    } else {
      elements.interactionCopy.textContent = `Across six casual prompts, Alfred’s SOUL changed personability by ${signed(i.soul_personability_without_overlay)} at baseline, ${signed(i.soul_personability_with_adhd)} with ADHD, and ${signed(i.soul_personability_with_concise)} with concise mode. Concise changed average length by ${signed(i.concise_words_with_soul, " words")} with Alfred and ${signed(i.concise_words_with_default_identity, " words")} with the default identity.`;
      elements.interactionStats.replaceChildren(...statNodes([
        ["SOUL PERSONALITY · BASE", signed(i.soul_personability_without_overlay)], ["SOUL PERSONALITY · ADHD", signed(i.soul_personability_with_adhd)],
        ["SOUL PERSONALITY · CONCISE", signed(i.soul_personability_with_concise)], ["CONCISE VS ADHD · ALFRED", signed(i.concise_vs_adhd_personability_with_soul)],
      ]));
    }
  }

  function renderEffectGrid() {
    const entries = Object.entries(currentData().contrasts);
    elements.effectGrid.classList.toggle("effect-grid--nine", entries.length > 4);
    elements.effectGrid.replaceChildren(...entries.map(([id, contrast], index) => {
      const card = document.createElement("article"); card.className = "effect-card";
      const rightWins = contrast.wins[contrast.right], leftWins = contrast.wins[contrast.left];
      card.dataset.leading = rightWins > leftWins ? "right" : leftWins > rightWins ? "left" : "tie";
      const eyebrow = document.createElement("span"), title = document.createElement("h3"), score = document.createElement("div");
      eyebrow.className = "eyebrow"; eyebrow.textContent = `CONTRAST ${String(index + 1).padStart(2, "0")}`; title.textContent = contrast.label; score.className = "effect-card__score";
      for (const [name, wins, cls] of [[shortCondition(contrast.left, id), leftWins, "left"], ["TIES", contrast.wins.tie, "tie"], [shortCondition(contrast.right, id), rightWins, "right"]]) {
        const node = cls === "tie" ? document.createElement("em") : document.createElement("span");
        if (cls === "tie") node.append(document.createTextNode(wins), Object.assign(document.createElement("small"), { textContent: name }));
        else node.append(document.createTextNode(name), Object.assign(document.createElement("strong"), { textContent: wins }));
        score.append(node);
      }
      card.append(eyebrow, title, score); return card;
    }));
  }

  function populateScenarioSelectors() {
    const data = currentData(), pair = currentPair();
    const build = (select, selected, disabled) => {
      select.replaceChildren(...data.condition_order.map((id) => {
        const option = document.createElement("option"); option.value = id; option.textContent = data.condition_labels[id];
        option.selected = id === selected; option.disabled = id === disabled; return option;
      }));
    };
    build(elements.leftSelect, pair.left, pair.right);
    build(elements.rightSelect, pair.right, pair.left);
  }

  function setScenario(side, value) {
    const pair = currentPair(), other = side === "left" ? "right" : "left", old = pair[side];
    if (!currentData().condition_order.includes(value)) return;
    if (value === pair[other]) pair[other] = old;
    pair[side] = value;
    populateScenarioSelectors(); renderCase(state.index);
  }

  function swapScenarios() {
    const pair = currentPair(); [pair.left, pair.right] = [pair.right, pair.left];
    state.mobileSide = state.mobileSide === "left" ? "right" : "left";
    populateScenarioSelectors(); renderCase(state.index);
  }

  function setMobileSide(side, moveFocus = false) {
    state.mobileSide = side;
    $$(".mobile-tab").forEach((tab) => {
      const active = tab.dataset.side === side; tab.classList.toggle("is-active", active); tab.setAttribute("aria-selected", String(active)); tab.tabIndex = active ? 0 : -1;
      if (active && moveFocus) tab.focus();
    });
    const leftActive = side === "left";
    elements.leftPanel.classList.toggle("is-mobile-active", leftActive); elements.leftPanel.hidden = !leftActive;
    elements.rightPanel.classList.toggle("is-mobile-active", !leftActive); elements.rightPanel.hidden = leftActive;
  }

  function evidenceLine(label, gate, quality) {
    const p = document.createElement("p"), strong = document.createElement("strong"); strong.textContent = label;
    p.append(strong, document.createTextNode(` ${gate || "Gate note unavailable."} ${quality || ""}`)); return p;
  }

  function renderJudge(specimen) {
    const pair = currentPair(), judge = specimen.pairwise[pairKey(pair.left, pair.right)], meta = currentMeta();
    elements.judgeEyebrow.textContent = "SELECTED PAIR · 3-PASS BLIND JUDGE";
    elements.leftScoreLabel.textContent = conditionLabel(pair.left).toUpperCase(); elements.rightScoreLabel.textContent = conditionLabel(pair.right).toUpperCase();
    elements.judgeWinner.textContent = judge.winner === "tie" ? "Tie" : judge.winner === pair.left ? "Scenario A" : "Scenario B";
    elements.judgeWinner.dataset.winner = judge.winner === "tie" ? "tie" : judge.winner === pair.left ? "left" : "right";
    elements.decisionBasis.textContent = judge.decision_basis;
    elements.leftScore.textContent = Number(judge.left_score).toFixed(2); elements.rightScore.textContent = Number(judge.right_score).toFixed(2);
    elements.leftGate.textContent = `${meta.gateLabel} ${Number(judge.left_gate_score).toFixed(2)} · ${judge.left_gate_votes}/3 PASS`;
    elements.rightGate.textContent = `${meta.gateLabel} ${Number(judge.right_gate_score).toFixed(2)} · ${judge.right_gate_votes}/3 PASS`;
    elements.judgeAgreement.textContent = `VERDICTS · A ${judge.votes[pair.left]} · TIE ${judge.votes.tie} · B ${judge.votes[pair.right]}`;
    elements.judgeNotes.replaceChildren(
      evidenceLine("Scenario A.", judge.notes.left_gate, judge.notes.left_quality),
      evidenceLine("Scenario B.", judge.notes.right_gate, judge.notes.right_quality),
    );
  }

  function summaryCard(title, value, label, detail) {
    const card = document.createElement("article"), h3 = document.createElement("h3"), strong = document.createElement("strong"), span = document.createElement("span"), p = document.createElement("p");
    card.className = "identity-effect"; h3.textContent = title; strong.textContent = value; span.textContent = label; p.textContent = detail;
    card.append(h3, strong, span, p); return card;
  }

  function renderPairSummary() {
    const data = currentData(), pair = currentPair(), key = pairKey(pair.left, pair.right), meta = currentMeta();
    const verdicts = data.cases.map((item) => item.pairwise[key].winner);
    const aWins = verdicts.filter((winner) => winner === pair.left).length, bWins = verdicts.filter((winner) => winner === pair.right).length, ties = verdicts.filter((winner) => winner === "tie").length;
    const leftAggregate = data.aggregate[pair.left], rightAggregate = data.aggregate[pair.right];
    elements.pairSummary.dataset.count = "3";
    elements.pairSummary.replaceChildren(
      summaryCard("Suite verdicts", `${aWins} · ${ties} · ${bWins}`, "A WINS · TIES · B WINS", `${conditionLabel(pair.left)} versus ${conditionLabel(pair.right)}.`),
      summaryCard(`Average ${meta.scoreName.toLowerCase()}`, `${Number(leftAggregate[meta.scoreMetric]).toFixed(2)} / ${Number(rightAggregate[meta.scoreMetric]).toFixed(2)}`, "SCENARIO A / SCENARIO B", "The focal score, averaged across every case."),
      summaryCard("Average length", `${leftAggregate.words} / ${rightAggregate.words}`, "WORDS · SCENARIO A / B", "Descriptive only; short is not automatically good."),
    );
  }

  function renderCase(index, updateUrl = true) {
    const data = currentData(), pair = currentPair(); state.index = (index + data.cases.length) % data.cases.length;
    const specimen = data.cases[state.index], left = specimen.conditions[pair.left], right = specimen.conditions[pair.right];
    elements.activeIndex.textContent = String(state.index + 1).padStart(2, "0"); elements.totalIndex.textContent = String(data.case_count).padStart(2, "0");
    elements.category.textContent = specimen.category; elements.caseId.textContent = specimen.id; elements.prompt.textContent = specimen.prompt;
    elements.leftCode.textContent = conditionCode("A", pair.left); elements.rightCode.textContent = conditionCode("B", pair.right);
    elements.leftTitle.textContent = conditionLabel(pair.left); elements.rightTitle.textContent = conditionLabel(pair.right);
    elements.leftNote.textContent = conditionNote(pair.left); elements.rightNote.textContent = conditionNote(pair.right);
    elements.leftMetrics.setAttribute("aria-label", `${conditionLabel(pair.left)} answer metrics`); elements.rightMetrics.setAttribute("aria-label", `${conditionLabel(pair.right)} answer metrics`);
    renderMarkdown(elements.leftAnswer, left.answer); renderMarkdown(elements.rightAnswer, right.answer);
    renderMetrics(elements.leftMetrics, left.metrics); renderMetrics(elements.rightMetrics, right.metrics); renderJudge(specimen); renderPairSummary();
    [...elements.caseNav.children].forEach((button, buttonIndex) => {
      const active = buttonIndex === state.index; button.classList.toggle("is-active", active);
      active ? button.setAttribute("aria-current", "true") : button.removeAttribute("aria-current");
      if (active) {
        const leftEdge = button.offsetLeft;
        const rightEdge = leftEdge + button.offsetWidth;
        const visibleLeft = elements.caseNav.scrollLeft;
        const visibleRight = visibleLeft + elements.caseNav.clientWidth;
        if (leftEdge < visibleLeft) elements.caseNav.scrollLeft = leftEdge;
        else if (rightEdge > visibleRight) elements.caseNav.scrollLeft = rightEdge - elements.caseNav.clientWidth;
      }
    });
    if (updateUrl) {
      const url = new URL(location.href); url.searchParams.set("suite", state.suite); url.searchParams.set("left", pair.left); url.searchParams.set("right", pair.right); url.hash = specimen.id; history.replaceState(null, "", url);
    }
    setMobileSide(state.mobileSide);
  }

  function rebuildCaseNav() {
    elements.caseNav.replaceChildren(); const fragment = document.createDocumentFragment();
    elements.caseNav.style.gridTemplateColumns = `repeat(${currentData().case_count}, minmax(112px, 1fr))`;
    currentData().cases.forEach((specimen, index) => {
      const button = document.createElement("button"); button.type = "button"; button.dataset.index = String(index + 1).padStart(2, "0"); button.textContent = specimen.category;
      button.addEventListener("click", () => renderCase(index)); fragment.append(button);
    });
    elements.caseNav.append(fragment);
  }

  function renderSuite() {
    const data = currentData(), meta = currentMeta();
    elements.runLabel.textContent = `RUN ${data.run_id}`; elements.model.textContent = data.model; elements.provider.textContent = data.provider; elements.caseCount.textContent = data.case_count;
    elements.suiteEyebrow.textContent = meta.eyebrow; elements.pageTitle.innerHTML = meta.title; elements.suiteLede.textContent = meta.lede; elements.matrixLegend.textContent = meta.legend; elements.effectsEyebrow.textContent = meta.effectLabel;
    elements.methodCells.innerHTML = state.suite === "task" ? "<strong>Four matched cells</strong>Alfred SOUL or default identity crossed with ADHD off or on." : "<strong>Six matched cells</strong>Alfred SOUL or default identity crossed with baseline, ADHD, and concise modes.";
    elements.methodConstant.innerHTML = `<strong>Held constant</strong>Model, provider, memory, user profile, skills, tools, config, working directory, and ${data.case_count} prompts.`;
    elements.methodGate.innerHTML = state.suite === "task" ? "<strong>Accuracy first</strong>Accuracy gates efficiency before the strict blind comparison." : "<strong>Appropriateness first</strong>Accuracy and tone gate personability before the strict blind comparison.";
    $$(".suite-tab").forEach((tab) => { const active = tab.dataset.suite === state.suite; tab.classList.toggle("is-active", active); tab.setAttribute("aria-pressed", String(active)); });
    renderFactorGrid(); renderInteraction(); renderEffectGrid(); populateScenarioSelectors(); rebuildCaseNav();
    const initialIndex = data.cases.findIndex((item) => `#${item.id}` === location.hash); renderCase(initialIndex >= 0 ? initialIndex : 0, true);
  }

  function setSuite(suite) {
    if (!datasets[suite]?.cases?.length) return;
    state.suite = suite; state.index = 0; state.mobileSide = "left"; renderSuite();
  }

  function initialize() {
    $$(".suite-tab").forEach((tab) => tab.addEventListener("click", () => setSuite(tab.dataset.suite)));
    elements.leftSelect.addEventListener("change", () => setScenario("left", elements.leftSelect.value));
    elements.rightSelect.addEventListener("change", () => setScenario("right", elements.rightSelect.value));
    elements.swap.addEventListener("click", swapScenarios);
    elements.prev.addEventListener("click", () => renderCase(state.index - 1)); elements.next.addEventListener("click", () => renderCase(state.index + 1));
    $$(".mobile-tab").forEach((tab) => tab.addEventListener("click", () => setMobileSide(tab.dataset.side)));
    document.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest("button, a, input, textarea, select")) return;
      if (event.key === "ArrowLeft") renderCase(state.index - 1); if (event.key === "ArrowRight") renderCase(state.index + 1);
    });
    const ticks = document.createDocumentFragment(); for (let index = 0; index < 40; index += 1) ticks.append(document.createElement("i")); $("#seam-ticks").append(ticks);
    renderSuite();
  }

  initialize();
})();
