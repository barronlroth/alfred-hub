(() => {
  const desktop = document.querySelector('#desktop');
  const browserWindow = document.querySelector('#browserWindow');
  const titlebar = document.querySelector('#titlebar');
  const minimizeButton = document.querySelector('#minimizeButton');
  const maximizeButton = document.querySelector('#maximizeButton');
  const closeWindowButton = document.querySelector('#closeWindowButton');
  const firefoxTaskButton = document.querySelector('#firefoxTaskButton');
  const resizeGrip = document.querySelector('#resizeGrip');
  const newTabButton = document.querySelector('#newTabButton');
  const tabList = document.querySelector('#tabList');
  const tabPanels = document.querySelector('#tabPanels');
  const windowTitle = document.querySelector('#windowTitle');
  const addressInput = document.querySelector('#addressInput');
  const liveRegion = document.querySelector('#liveRegion');
  const startButton = document.querySelector('#startButton');
  const startMenu = document.querySelector('#startMenu');
  const clock = document.querySelector('#clock');

  let tabs = [];
  let activeTabId = null;
  let nextTabNumber = 1;
  let windowState = 'open';
  let previousGeometry = null;
  let pointerOperation = null;

  const TAB_ICONS = {
    forum: 'assets/firefox-2004.svg',
    myspace: 'assets/myspace-mark.svg',
    youtube: 'assets/youtube-2008.svg',
    'pm-twin': 'assets/pm-twin-patch.jpg',
    blank: 'assets/firefox-2004.svg',
  };

  const COMPANY_PROFILES = [
    { name: 'Firefox Beta', role: 'Curious user · fifth grade', note: 'I saw tabs, joined the Firefox forums, and started giving product feedback.' },
    { name: 'Computer Engineering', role: 'Systems foundation', note: 'Built the technical foundation for understanding products from the inside out.' },
    { name: 'AMD / Xbox', role: 'Engineer', note: 'Engineering work that taught me to build inside complex technical systems.' },
    { name: 'Blade', role: 'Engineer → Product Manager', note: 'I intentionally used engineering as the bridge into formal product management.' },
    { name: 'Screenshop', role: 'Founding Technical PM', note: 'Led product for consumer AI and style identification. Screenshop was acquired by Snap and integrated into Snapchat Scan.' },
    { name: 'The Rotation', role: 'Founder', note: 'Built a subscription menswear company: $350K raised, 300 members, 8,500 registered users, and 300% MRR growth reported by Vogue Business. Acquired in 2021.' },
    { name: 'Wonder', role: 'Founding team · Product + Growth', note: 'Started with order-routing infrastructure for chefs, then moved into the consumer product and growth.' },
    { name: 'Shopify', role: 'Frontier-AI builder', note: 'Turning emerging AI capabilities into products people can use—and the portal to what comes next.', nextKind: 'youtube' },
  ];

  const SHOPIFY_PROJECTS = [
    { id: 'agentic-commerce', eyebrow: 'EARLY PROTOTYPES', title: 'What if commerce had an agent?', summary: 'Early agentic-commerce and chat prototypes, built hands-on to learn how people might discover and buy through conversation.' },
    { id: 'storefront-mcp', eyebrow: 'STOREFRONT MCP', title: 'Giving AI a way into the storefront', summary: 'An experiment in making storefront capabilities available to AI workflows.' },
    { id: 'dev-mcp', eyebrow: 'DEV MCP', title: 'A tighter loop for building on Shopify', summary: 'A developer-focused prototype connecting intent, tools, and hands-on making.' },
  ];

  const isCompact = () => window.matchMedia('(max-width: 760px), (max-height: 560px)').matches;
  const visibleWorkspaceHeight = () => desktop.clientHeight - firefoxTaskButton.closest('.taskbar').offsetHeight;
  const createTabId = () => `tab-${Date.now().toString(36)}-${nextTabNumber++}`;

  function announce(message) {
    liveRegion.textContent = '';
    window.setTimeout(() => { liveRegion.textContent = message; }, 15);
  }

  function createTab({ focus = true, activate = true, kind = 'blank', title = '(Untitled)', url = 'about:blank' } = {}) {
    const id = createTabId();
    tabs.push({
      id,
      kind,
      title,
      url,
      selectedCompany: kind === 'myspace' ? 0 : undefined,
      selectedProject: kind === 'youtube' ? SHOPIFY_PROJECTS[0].id : undefined,
      pmStep: kind === 'pm-twin' ? 0 : undefined,
    });
    if (activate || !activeTabId) activeTabId = id;
    renderTabs();
    if (kind === 'blank') announce('New blank tab opened');
    if (focus && activate) requestAnimationFrame(() => document.querySelector(`#${id}`)?.focus());
  }

  function closeTab(id) {
    const closingIndex = tabs.findIndex((tab) => tab.id === id);
    if (closingIndex < 0) return;

    const wasActive = activeTabId === id;
    tabs.splice(closingIndex, 1);

    if (!tabs.length) {
      const freshId = createTabId();
      tabs.push({ id: freshId, kind: 'blank', title: '(Untitled)', url: 'about:blank' });
      activeTabId = freshId;
    } else if (wasActive) {
      activeTabId = tabs[Math.min(closingIndex, tabs.length - 1)].id;
    }

    renderTabs();
    announce('Tab closed');
    requestAnimationFrame(() => document.querySelector(`#${activeTabId}`)?.focus());
  }

  function selectTab(id, { focus = false } = {}) {
    if (!tabs.some((tab) => tab.id === id)) return;
    activeTabId = id;
    renderTabs();
    if (focus) requestAnimationFrame(() => document.querySelector(`#${id}`)?.focus());
  }

  function renderTabs() {
    tabList.replaceChildren();
    tabPanels.replaceChildren();

    tabs.forEach((tab) => {
      const selected = tab.id === activeTabId;
      const wrapper = document.createElement('div');
      wrapper.className = `tab-wrapper${selected ? ' active' : ''}`;
      const button = document.createElement('button');
      button.className = 'tab';
      button.type = 'button';
      button.id = tab.id;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', String(selected));
      button.setAttribute('aria-controls', `${tab.id}-panel`);
      button.setAttribute('aria-label', tab.title);
      button.tabIndex = selected ? 0 : -1;
      button.innerHTML = `
        <img class="tab-icon" src="${TAB_ICONS[tab.kind] ?? TAB_ICONS.blank}" alt="" />
        <span class="tab-label">${tab.title}</span>
      `;
      button.addEventListener('click', () => selectTab(tab.id));
      button.addEventListener('auxclick', (event) => {
        if (event.button === 1) closeTab(tab.id);
      });
      button.addEventListener('keydown', (event) => handleTabKeydown(event, tab.id));

      const closeButton = document.createElement('button');
      closeButton.className = 'tab-close';
      closeButton.type = 'button';
      closeButton.setAttribute('aria-label', `Close ${tab.title}`);
      closeButton.title = 'Close tab';
      closeButton.textContent = '×';
      closeButton.addEventListener('click', () => closeTab(tab.id));

      wrapper.append(button, closeButton);
      tabList.append(wrapper);

      const panel = document.createElement('section');
      panel.className = 'tab-panel';
      panel.id = `${tab.id}-panel`;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.hidden = !selected;
      if (tab.kind === 'forum') panel.innerHTML = getFirefoxForumMarkup();
      if (tab.kind === 'myspace') panel.innerHTML = getMySpaceProfileMarkup(tab.selectedCompany ?? 0);
      if (tab.kind === 'youtube') {
        panel.innerHTML = getYouTubeMarkup({ autoplay: selected, selectedProject: tab.selectedProject });
        wireYouTubePlayer(panel);
      }
      if (tab.kind === 'pm-twin') {
        panel.classList.add('pm-deck-panel');
        panel.innerHTML = '<iframe class="pm-deck-frame" src="pm-twin/index.html" title="PM Twin 2.0 presentation" allow="fullscreen" scrolling="no"></iframe>';
      }
      tabPanels.append(panel);
    });

    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    windowTitle.textContent = `${activeTab?.title ?? '(Untitled)'} - Mozilla Firefox`;
    addressInput.value = activeTab?.url ?? 'about:blank';
    firefoxTaskButton.querySelector('span').textContent = `${tabs.length > 1 ? `(${tabs.length}) ` : ''}Mozilla Firefox`;
    document.querySelector(`#${activeTabId}`)?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }

  function getYouTubeMarkup({ autoplay = false, selectedProject = SHOPIFY_PROJECTS[0].id } = {}) {
    const activeProject = SHOPIFY_PROJECTS.find((project) => project.id === selectedProject) ?? SHOPIFY_PROJECTS[0];
    const projectsMarkup = SHOPIFY_PROJECTS.map((project, index) => `
      <button type="button" class="yt-related-video${project.id === activeProject.id ? ' is-selected' : ''}" data-project-id="${project.id}" aria-pressed="${project.id === activeProject.id}">
        <span class="yt-related-thumb project-${index + 1}" aria-hidden="true"><b>${index === 0 ? 'AGENT' : 'MCP'}</b></span>
        <span class="yt-related-copy">
          <strong>${project.title}</strong>
          <span>From: Shopify AI Labs</span>
          <span>${project.eyebrow}</span>
        </span>
      </button>
    `).join('');

    return `
      <div class="youtube-page">
        <header class="yt-header">
          <div class="yt-header-top">
            <a href="#" class="yt-logo" aria-label="YouTube home"><img src="assets/youtube-logo-2005.svg" alt="YouTube" /><small>Broadcast Yourself™</small></a>
            <div class="yt-locale"><a href="#">Worldwide (All)</a> | <a href="#">English</a></div>
            <nav aria-label="YouTube account"><a href="#"><b>Sign Up</b></a> | <a href="#">QuickList (0)</a> | <a href="#">Help</a> | <a href="#">Sign In</a></nav>
          </div>
          <div class="yt-primary-row">
            <nav aria-label="YouTube sections"><a href="#" class="active">Home</a><a href="#">Videos</a><a href="#">Channels</a><a href="#">Community</a></nav>
          </div>
          <form class="yt-search" onsubmit="return false">
            <input type="search" aria-label="Search YouTube" />
            <select aria-label="Search category"><option>Videos</option><option>Channels</option></select>
            <button type="submit">Search</button>
            <a href="#">advanced</a>
            <button type="button" class="yt-upload">Upload</button>
          </form>
        </header>

        <main class="yt-watch-layout">
          <section class="yt-watch-main">
            <h1>Barron discovers AI at Shopify, becomes obsessed</h1>
            <div class="yt-player">
              <div class="yt-video-stage">
                <video class="yt-video" preload="metadata" playsinline${autoplay ? ' autoplay muted' : ''}>
                  <source src="assets/guy-opening-llm-box.mp4" type="video/mp4" />
                </video>
              </div>
              <div class="yt-player-controls">
                <button type="button" class="youtube-play-toggle" aria-label="Play video" aria-pressed="false">▶</button>
                <div class="yt-timeline" role="slider" tabindex="0" aria-label="Video timeline" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>
                <time>0:00 / 0:00</time>
                <button type="button" class="youtube-volume-toggle" aria-label="Mute video" aria-pressed="false">▮))</button>
                <button type="button" class="youtube-fullscreen" aria-label="Full screen">▰</button>
              </div>
            </div>
            <a href="#" class="yt-high-quality">watch in high quality</a>

            <div class="yt-video-stats">
              <div><b>Role:</b> Shopify’s first AI PM</div>
              <div><b>Team:</b> COO-sponsored AI Labs</div>
            </div>
            <nav class="yt-actions" aria-label="Video actions">
              <a href="#"><span>✣</span> Share</a><a href="#"><span>♥</span> Favorite</a><a href="#"><span>▤</span> Playlists</a><a href="#"><span>⚑</span> Flag</a>
            </nav>

            <section class="yt-description">
              <div><b>From:</b> <a href="#">barronlroth</a></div><div><b>Added:</b> 2023</div>
              <p>Barron joined Shopify to build products. As LLMs entered the workplace, he started prototyping to learn what they would change. The experiments grew into a small AI Labs team sponsored by the COO.</p>
              <p><b>Now playing:</b> ${activeProject.eyebrow} — ${activeProject.summary}</p>
              <p><b>Category:</b> <a href="#">Science &amp; Technology</a> &nbsp; <b>Tags:</b> <a href="#">shopify</a> <a href="#">llms</a> <a href="#">agentic-commerce</a> <a href="#">mcp</a></p>
            </section>

            <section class="yt-comments">
              <h2>About This Video</h2>
              <p><a href="#"><b>shopify_ai_labs</b></a> &nbsp; 2023</p>
              <blockquote>Early agentic-commerce prototypes led to Storefront MCP and Dev MCP. Anthropic confirmed the team was among the earliest external users of Claude Code.</blockquote>
              <button type="button" class="yt-continue" data-continue-kind="pm-twin">Next video: PM Twin 2.0 →</button>
            </section>
          </section>

          <aside class="yt-sidebar">
            <div class="yt-shopify-banner"><span>SHOPIFY</span><strong>MORE VIDEOS...</strong></div>
            <section class="yt-channel-card">
              <div class="yt-channel-heading"><span class="yt-channel-mark">SHOP</span><div>From: <a href="#">Shopify AI Labs</a><small>Added: 2023</small><a href="#" class="yt-more-info">(more info)</a></div><button type="button">Subscribe</button></div>
              <p>A small prototyping team exploring agentic commerce, AI-native developer tools, and the infrastructure agents need to work with Shopify.</p>
              <label>URL <input value="https://youtube.local/shopify-frontier-ai" readonly /></label>
              <label>Embed <input value="&lt;object width='425' height='344'&gt;..." readonly /></label>
            </section>
            <section class="yt-more-videos" aria-labelledby="shopify-projects-heading">
              <h2 id="shopify-projects-heading"><span aria-hidden="true">▾</span> More From: <a href="#">Shopify AI Labs</a></h2>
              ${projectsMarkup}
            </section>
          </aside>
        </main>
      </div>
    `;
  }

  function formatMediaTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }

  function syncYouTubePlayer(player) {
    const video = player?.querySelector('.yt-video');
    if (!video) return;
    const isPlaying = !video.paused && !video.ended;
    player.classList.toggle('playing', isPlaying);
    player.querySelectorAll('.youtube-play-toggle').forEach((button) => {
      button.setAttribute('aria-pressed', String(isPlaying));
      button.setAttribute('aria-label', `${isPlaying ? 'Pause' : 'Play'} video`);
      button.textContent = isPlaying ? '❚❚' : '▶';
    });
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const progress = duration ? Math.min(100, (video.currentTime / duration) * 100) : 0;
    const timeline = player.querySelector('.yt-timeline');
    timeline.querySelector('span').style.width = `${progress}%`;
    timeline.setAttribute('aria-valuenow', String(Math.round(progress)));
    player.querySelector('time').textContent = `${formatMediaTime(video.currentTime)} / ${formatMediaTime(duration)}`;
    const volumeButton = player.querySelector('.youtube-volume-toggle');
    volumeButton.setAttribute('aria-pressed', String(video.muted));
    volumeButton.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
    volumeButton.textContent = video.muted ? '×))' : '▮))';
  }

  function wireYouTubePlayer(panel) {
    const player = panel.querySelector('.yt-player');
    const video = player?.querySelector('.yt-video');
    if (!video) return;
    ['loadedmetadata', 'timeupdate', 'play', 'pause', 'ended', 'volumechange'].forEach((eventName) => {
      video.addEventListener(eventName, () => syncYouTubePlayer(player));
    });
    syncYouTubePlayer(player);
  }

  function getFirefoxForumMarkup() {
    const topics = [
      {
        type: 'sticky',
        badge: 'Sticky',
        title: 'The Official Win32 20090803 Branch build is not yet out',
        description: 'Daily build thread for testers running the latest Shiretoko branch.',
        author: 'nightly_tester',
        replies: '143',
        views: '4,812',
        lastPost: 'Today, 9:14 pm',
        lastAuthor: 'foxbyte',
      },
      {
        type: 'announcement',
        badge: 'Announcement',
        title: 'Firefox 3.5.2 release candidate testing',
        description: 'Please post reproducible regressions and include your build ID.',
        author: 'buildbot',
        replies: '68',
        views: '9,031',
        lastPost: 'Today, 8:42 pm',
        lastAuthor: 'Alice0775',
      },
      {
        title: 'New Tab button placement in Shiretoko nightlies',
        description: 'Should the plus button live beside the final tab or at the far right?',
        author: 'tab_mix',
        replies: '37',
        views: '1,206',
        lastPost: 'Today, 7:58 pm',
        lastAuthor: 'pixel_fox',
      },
      {
        title: 'Private Browsing feedback — what still leaks?',
        description: 'Testing history, downloads, cookies, form data, and session restore.',
        author: 'quiet_mode',
        replies: '24',
        views: '944',
        lastPost: 'Today, 6:21 pm',
        lastAuthor: 'mozfan88',
      },
      {
        type: 'hot',
        title: 'Awesome Bar ranking regression after today’s nightly',
        description: 'Previously visited bookmarks are appearing below low-frequency results.',
        author: 'locationbar',
        replies: '52',
        views: '2,417',
        lastPost: 'Today, 5:47 pm',
        lastAuthor: 'barrow',
      },
      {
        title: 'Crash when closing multiple tabs (Minefield 3.7a1pre)',
        description: 'STR and crash ID inside. Can anyone reproduce on a clean profile?',
        author: 'stacktrace',
        replies: '19',
        views: '781',
        lastPost: 'Today, 3:09 pm',
        lastAuthor: 'kernelpanic',
      },
      {
        title: 'Feature request: per-site zoom should persist',
        description: 'Remember the zoom level by domain between browser sessions.',
        author: 'one_more_thing',
        replies: '31',
        views: '1,119',
        lastPost: 'Yesterday, 11:52 pm',
        lastAuthor: 'uxgecko',
      },
      {
        type: 'hot',
        title: 'Nightly testers wanted: TraceMonkey JavaScript engine',
        description: 'Post benchmark results, broken sites, and extensions that behave strangely.',
        author: 'js_monkey',
        replies: '86',
        views: '5,603',
        lastPost: 'Yesterday, 10:17 pm',
        lastAuthor: 'codeorange',
      },
    ];

    const topicRows = topics.map((topic) => `
      <article class="forum-topic-row ${topic.type ?? ''}">
        <span class="forum-folder-icon" aria-hidden="true"><i></i></span>
        <div class="forum-topic-copy">
          <a href="#" class="forum-topic-title">${topic.badge ? `<b>${topic.badge}:</b> ` : ''}${topic.title}</a>
          <p>${topic.description}</p>
          <small>by <a href="#">${topic.author}</a></small>
        </div>
        <span class="forum-stat"><b>${topic.replies}</b><small>Replies</small></span>
        <span class="forum-stat"><b>${topic.views}</b><small>Views</small></span>
        <div class="forum-last-post">
          <span>${topic.lastPost}</span>
          <span>by <a href="#">${topic.lastAuthor}</a> <b aria-hidden="true">»</b></span>
        </div>
      </article>
    `).join('');

    return `
      <div class="forum-page">
        <header class="forum-masthead">
          <div class="forum-brand">
            <img src="assets/firefox-2004.svg" alt="" />
            <div><strong><span>mozilla</span>Zine</strong><small>forums</small></div>
          </div>
          <nav aria-label="MozillaZine sites">
            <a href="#">mozillaZine</a>
            <a href="#">Knowledge Base</a>
            <a href="#" aria-current="page">Forums</a>
          </nav>
        </header>

        <main class="forum-shell">
          <div class="forum-userbar">
            <span>You last visited on Today, 8:03 pm</span>
            <nav aria-label="Forum utilities">
              <span class="forum-secondary-links"><a href="#">FAQ</a> · <a href="#">Search</a> · <a href="#">Memberlist</a> · </span>
              <a href="#">Profile</a> · <a href="#">You have no new messages</a> · <a href="#" class="forum-account"><span aria-hidden="true">●</span> barronlroth</a> · <a href="#">Log out [ barronlroth ]</a>
            </nav>
          </div>

          <nav class="forum-breadcrumb" aria-label="Breadcrumb">
            <a href="#">MozillaZine Forums Forum Index</a><b>»</b><a href="#">Firefox Builds</a>
          </nav>

          <section class="forum-intro">
            <p class="forum-kicker">Mozilla Firefox Beta Discussion</p>
            <h1>Firefox Builds</h1>
            <p>Nightlies, betas, release candidates, regressions and feature testing. In fifth grade, Barron saw tabs, joined the Firefox forums, and started giving product feedback.</p>
            <button type="button" class="forum-continue" data-continue-kind="myspace">Continue to Barron's Top 8 →</button>
          </section>

          <div class="forum-actions">
            <button type="button" class="forum-new-topic"><span aria-hidden="true">✎</span> New Topic</button>
            <div>Page <b>1</b> of 147 &nbsp; <strong>1</strong>, <a href="#">2</a>, <a href="#">3</a> … <a href="#">147</a> <a href="#">Next</a></div>
          </div>

          <section class="forum-board" aria-labelledby="forum-board-heading">
            <h2 id="forum-board-heading">Firefox Builds</h2>
            <div class="forum-topic-row forum-table-head" aria-hidden="true">
              <span></span><span>Topics</span><span>Replies</span><span>Views</span><span>Last Post</span>
            </div>
            ${topicRows}
          </section>

          <div class="forum-actions forum-actions-bottom">
            <button type="button" class="forum-new-topic"><span aria-hidden="true">✎</span> New Topic</button>
            <a href="#">Mark all topics read</a>
          </div>

          <section class="forum-legend" aria-label="Topic legend">
            <div><span class="forum-folder-icon"><i></i></span> New posts</div>
            <div><span class="forum-folder-icon read"><i></i></span> No new posts</div>
            <div><span class="forum-folder-icon hot"><i></i></span> Popular topic</div>
            <p>You <b>cannot</b> post new topics · You <b>cannot</b> reply to topics · You <b>cannot</b> edit your posts</p>
          </section>

          <footer class="forum-footer">
            <p>All times are GMT - 5 Hours</p>
            <p>Powered by phpBB · MozillaZine is an independent Mozilla community site.</p>
          </footer>
        </main>
      </div>
    `;
  }

  function getCompanyDetailMarkup(index) {
    const company = COMPANY_PROFILES[index] ?? COMPANY_PROFILES[0];
    return `
      <div class="company-detail-copy">
        <small>CHAPTER ${(index + 1).toString().padStart(2, '0')} OF 08</small>
        <h3>${company.name}</h3>
        <strong>${company.role}</strong>
        <p>${company.note}</p>
        ${company.nextKind ? '<button type="button" class="myspace-continue" data-continue-kind="youtube">Continue to Shopify AI →</button>' : ''}
      </div>
    `;
  }

  function getMySpaceProfileMarkup(selectedCompany = 0) {
    const companies = COMPANY_PROFILES.map((company, index) => `
      <button type="button" class="company-friend${index === selectedCompany ? ' is-selected' : ''}" data-company-index="${index}" aria-expanded="${index === selectedCompany}" aria-controls="company-detail">
        <span class="company-number">${(index + 1).toString().padStart(2, '0')}</span>
        <strong>${company.name}</strong>
        <small>${company.role}</small>
      </button>
    `).join('');

    return `
      <div class="myspace-page">
        <header class="myspace-header">
          <div class="myspace-utility">
            <div><span>MySpace.com</span> | <span>Home</span></div>
            <div class="myspace-search" aria-hidden="true"><span>Search profiles</span><span class="myspace-search-field"></span></div>
            <div><span>Help</span> | <span>SignUp</span></div>
          </div>
          <div class="myspace-logo-panel">
            <div class="myspace-logo-lockup"><img src="assets/myspace-mark.svg" alt="" /><span><strong>myspace</strong><small>a place for career chapters</small></span></div>
          </div>
        </header>

        <nav class="myspace-nav" aria-label="Decorative MySpace navigation">
          <span>Home</span><i></i><span>Browse</span><i></i><span>Search</span><i></i><span>Blog</span><i></i><span>Favorites</span><i></i><span>Forum</span><i></i><span>Groups</span><i></i><span>Events</span><i></i><span>Music</span>
        </nav>

        <main class="myspace-profile">
          <div class="profile-main">
            <section class="extended-network"><h2>Barron is in your extended network</h2></section>

            <section class="blog-preview">
              <h2>Barron's Latest Blog Entry</h2>
              <p>From Firefox forums to frontier AI: why I keep moving toward capabilities before the product is obvious.</p>
            </section>

            <section class="orange-section about-section">
              <h2>Barron's Blurbs</h2>
              <h3>About me:</h3>
              <p>I tend to move toward emerging capabilities before the product is obvious. The throughline—from Firefox forums to frontier AI—is turning new technology into products people can actually use.</p>
              <p><strong>Curious user → systems foundation → engineer → PM → founding PM → founder → scale → frontier AI.</strong></p>
              <h3>Who I'd like to meet:</h3>
              <p>People who are early for the right reasons: curious, rigorous, and willing to build the missing product.</p>
            </section>

            <section class="orange-section friend-space">
              <h2>Barron's Top 8 Chapters</h2>
              <p class="friend-count"><strong>8</strong> chapters taught Barron how to build from zero. Choose one for the story.</p>
              <div class="company-grid">${companies}</div>
              <div class="company-detail" id="company-detail" aria-live="polite">${getCompanyDetailMarkup(selectedCompany)}</div>
            </section>

            <details class="profile-comment-easter-egg">
              <summary>View Comments (1)</summary>
              <p><strong>Barron // profile owner:</strong> no testimonials. the work is in the Top 8. click Shopify when you're ready for the next tab.</p>
            </details>
          </div>

          <aside class="profile-sidebar">
            <h1>Barron</h1>
            <div class="profile-intro">
              <div class="profile-photo-placeholder" role="img" aria-label="Barron monogram profile image"><span>B</span><small>PRODUCT BUILDER</small></div>
              <div class="profile-facts">
                <p>"online early. still building."</p>
                <p>Product builder<br />Internet years old</p>
                <p>California<br />UNITED STATES</p>
                <p class="last-login">Last Login:<br />Today</p>
              </div>
            </div>

            <section class="myspace-box interests-box">
              <h2>Barron's Interests</h2>
              <dl>
                <div><dt>General</dt><dd>Emerging technology, product craft, old computers, internet history, good interfaces, music, travel, and making the web feel personal.</dd></div>
                <div><dt>Music</dt><dd><strong>Currently playing:</strong> whatever helps me turn an unfinished idea into a working product.</dd></div>
                <div><dt>Heroes</dt><dd>People who make ambitious technology useful—and make the result feel obvious in hindsight.</dd></div>
              </dl>
            </section>
          </aside>
        </main>
      </div>
    `;
  }

  function getPMTwinMarkup(activeStep = 0) {
    const steps = [
      ['Briefing', 'Problem and thesis'],
      ['Flight loop', 'How context returns'],
      ['Decisions', 'Product trade-offs'],
      ['Safeguards', 'Trust and control'],
      ['Debrief', 'Evidence and next tests'],
    ];
    const nav = steps.map(([label, description], index) => `
      <button type="button" data-pm-step="${index}" aria-current="${index === activeStep ? 'step' : 'false'}">
        <span>${(index + 1).toString().padStart(2, '0')}</span><strong>${label}</strong><small>${description}</small>
      </button>
    `).join('');
    const hidden = (step) => step === activeStep ? '' : ' hidden';

    return `
      <div class="pm-page">
        <header class="pm-topbar">
          <div class="pm-mission-brand">
            <img src="assets/pm-twin-patch.jpg" alt="PM Twin mission patch" />
            <div><small>CASE 04 // AGENTIC CHIEF OF STAFF</small><strong>PM TWIN MISSION CONTROL</strong></div>
          </div>
          <div class="pm-local-status"><span></span> CONTEXT · MEMORY · SKILLS</div>
        </header>
        <div class="pm-app-shell">
          <nav class="pm-case-nav" aria-label="PM Twin case study chapters">${nav}</nav>
          <main class="pm-stage" aria-live="polite">
            <section class="pm-view" data-pm-view="0"${hidden(0)}>
              <div class="pm-briefing-grid">
                <div class="pm-patch-lockup">
                  <img src="assets/pm-twin-patch.jpg" alt="PM Twin mission patch reading Context, Memory, Skills" />
                  <span>PM TWIN 2.0</span>
                </div>
                <div class="pm-briefing-copy">
                  <small>MISSION BRIEFING</small>
                  <h1>A project isn’t a doc.<br />It’s a constellation.</h1>
                  <p>Work lives across conversations, documents, decisions, people, and time. Every fresh Jet Ski session arrived without that state.</p>
                  <div class="pm-restore-bridge"><b>FIREFOX SESSION RESTORE</b><span>Browsers restored tabs. PM Twin needed to restore the work itself.</span></div>
                </div>
              </div>
              <div class="pm-problem-console">
                <article class="pm-console-window">
                  <header><span>NEW JET SKI SESSION</span><b>CONTEXT OFFLINE</b></header>
                  <div class="pm-blank-session"><i aria-hidden="true"></i><h2>How can I help?</h2></div>
                  <p>Before useful work could begin, the human had to reconstruct priorities, decisions, and project history.</p>
                </article>
                <article class="pm-thesis-panel">
                  <small>THE PRODUCT REFRAME</small>
                  <h2>The agent made humans manage context.</h2>
                  <p>This was not a prompting problem. The product had assigned its own memory work to the user.</p>
                  <blockquote>The agent should manage its own context.</blockquote>
                </article>
              </div>
              <button type="button" class="pm-next" data-pm-step="1">Initiate the flight loop →</button>
            </section>

            <section class="pm-view" data-pm-view="1"${hidden(1)}>
              <div class="pm-section-heading"><small>FLIGHT LOOP // WHILE YOU’RE AWAY</small><h1>The system maintains mission state.</h1><p>Background agents turn current Workspace signals into durable, inspectable project context before the next session begins.</p></div>
              <ol class="pm-memory-pipeline">
                <li><span>01</span><strong>Workspace telemetry</strong><small>Chat, Gmail, Drive, Calendar</small></li>
                <li><span>02</span><strong>Scheduled sweeps</strong><small>Throughout the day, daily, weekly</small></li>
                <li><span>03</span><strong>Extract + reconcile</strong><small>Refresh, reject, or propose</small></li>
                <li><span>04</span><strong>Mission memory</strong><small>Transparent local project wiki</small></li>
                <li><span>05</span><strong>Informed launch</strong><small>Fresh Jet Ski session, context on</small></li>
              </ol>
              <div class="pm-telemetry-board">
                <section class="pm-constellation" aria-label="Workspace sources orbiting PM Twin mission memory">
                  <small>PROJECT CONSTELLATION</small>
                  <span class="pm-source source-chat">CHAT</span>
                  <span class="pm-source source-drive">DRIVE</span>
                  <span class="pm-source source-mail">GMAIL</span>
                  <span class="pm-source source-calendar">CAL</span>
                  <div class="pm-orbit orbit-one" aria-hidden="true"></div>
                  <div class="pm-orbit orbit-two" aria-hidden="true"></div>
                  <div class="pm-core"><img src="assets/pm-twin-patch.jpg" alt="" /><b>MISSION<br />MEMORY</b></div>
                </section>
                <section class="pm-flight-log">
                  <header><span>BACKGROUND AGENT LOG</span><b>SIMULATED WALKTHROUGH</b></header>
                  <ol>
                    <li><time>06:30</time><span>Daily priorities assembled from selected Workspace sources.</span><b>CAPTURED</b></li>
                    <li><time>11:45</time><span>Project decision matched against durable history.</span><b>RECONCILED</b></li>
                    <li><time>16:00</time><span>Unconfirmed owner change held for review.</span><b>NEEDS HUMAN</b></li>
                  </ol>
                </section>
              </div>
              <div class="pm-system-demo">
                <section class="pm-wiki-browser">
                  <header><span>MISSION MEMORY // PROJECT WIKI</span><b>LOCAL + INSPECTABLE</b></header>
                  <div class="pm-wiki-layout"><ul><li class="active">launch-plan.md</li><li>decisions.md</li><li>open-questions.md</li></ul><article><small>SOURCE · Workspace activity &nbsp; FRESHNESS · RECENTLY CHECKED</small><h2>Launch plan</h2><p class="pm-wiki-add">+ Current priority: reconcile the launch sequence</p><p class="pm-wiki-change">~ Proposed change: update owner after source confirmation</p><div class="pm-control-row"><button type="button">Approve</button><button type="button">Correct</button><button type="button">Forget</button></div></article></div>
                </section>
                <section class="pm-aware-session"><header><span>NEW JET SKI SESSION</span><b>PROJECT CONTEXT ON</b></header><p><strong>Jet Ski</strong> I have the current launch plan, decisions, and open questions. Where should we start?</p><small>Mission state restored. Sources remain inspectable.</small></section>
              </div>
              <button type="button" class="pm-next" data-pm-step="2">Open the flight plan →</button>
            </section>

            <section class="pm-view" data-pm-view="2"${hidden(2)}>
              <div class="pm-section-heading"><small>FLIGHT PLAN // PRODUCT DECISIONS</small><h1>Four choices made the thesis real.</h1><p>The interface was the easy part. The product lived in where context ran, what it remembered, and how people stayed in control.</p></div>
              <div class="pm-flight-plan" role="table" aria-label="PM Twin product decisions and trade-offs">
                <div class="pm-flight-plan-head" role="row"><span role="columnheader">CONSTRAINT</span><span role="columnheader">CHOICE</span><span role="columnheader">TRADE-OFF</span></div>
                <article role="row"><span role="cell">Workflow fragmentation</span><h2 role="cell">Embed PM Twin inside Jet Ski</h2><p role="cell">Less standalone identity, far less friction.</p></article>
                <article role="row"><span role="cell">Polluted legacy context</span><h2 role="cell">Fresh install first</h2><p role="cell">Optional V1 migration appears late in onboarding.</p></article>
                <article role="row"><span role="cell">Opaque machine memory</span><h2 role="cell">Use a transparent local wiki</h2><p role="cell">More structure to maintain, but every fact stays inspectable.</p></article>
                <article role="row"><span role="cell">Human prompt maintenance</span><h2 role="cell">Move context work into scheduled agents</h2><p role="cell">Accept asynchronous freshness to control latency, cost, and risk.</p></article>
              </div>
              <button type="button" class="pm-next" data-pm-step="3">Run the safety checks →</button>
            </section>

            <section class="pm-view" data-pm-view="3"${hidden(3)}>
              <div class="pm-section-heading"><small>SAFETY CONSOLE</small><h1>Memory only works when people can trust it.</h1><p>Autonomy earns its mandate through bounded sources, visible reasoning, and reversible decisions.</p></div>
              <div class="pm-safety-layout">
                <section class="pm-signal-console" aria-label="Context health signals">
                  <header>MISSION SIGNALS</header>
                  <div><span>FRESHNESS</span><i class="signal-good"></i><b>CHECKED</b></div>
                  <div><span>PROVENANCE</span><i class="signal-good"></i><b>VISIBLE</b></div>
                  <div><span>UNCERTAINTY</span><i class="signal-warn"></i><b>HELD FOR REVIEW</b></div>
                  <div><span>SOURCE SCOPE</span><i class="signal-good"></i><b>BOUNDED</b></div>
                </section>
                <div class="pm-safety-protocols">
                  <article><span>01</span><div><small>PRIVACY + TRUST</small><h2>Selected sources only</h2><p>Keep scope explicit and provide pause, delete, and export controls.</p></div></article>
                  <article><span>02</span><div><small>WRONG OR STALE MEMORY</small><h2>Show provenance and freshness</h2><p>Let people trace, correct, or reject every durable claim.</p></div></article>
                  <article><span>03</span><div><small>OVER-COLLECTION</small><h2>Save decisions, not exhaust</h2><p>Durable-context criteria prevent the wiki becoming a transcript landfill.</p></div></article>
                  <article><span>04</span><div><small>USER CONTROL</small><h2>Make every action reversible</h2><p>Preview proposed changes before they become mission memory.</p></div></article>
                </div>
              </div>
              <div class="pm-control-console"><span>CONTROL PANEL // SELECTED WORKSPACE SOURCES</span><button type="button">Pause sweeps</button><button type="button">Exclude source</button><button type="button">Export context</button><button type="button">Delete memory</button></div>
              <button type="button" class="pm-next" data-pm-step="4">Proceed to debrief →</button>
            </section>

            <section class="pm-view" data-pm-view="4"${hidden(4)}>
              <div class="pm-section-heading"><small>MISSION DEBRIEF // EVIDENCE + NEXT TEST</small><h1>The prototype proved the thesis.<br />The next test proves the product.</h1><p>Current evidence is qualitative: repeated setup burden, higher-leverage daily use, and a clear need for memory people can inspect and correct.</p></div>
              <div class="pm-debrief-grid">
                <aside><img src="assets/pm-twin-patch.jpg" alt="" /><small>PRIMARY QUESTION</small><blockquote>Does PM Twin reduce setup while preserving correctness, privacy, and trust?</blockquote></aside>
                <section aria-label="PM Twin next-test metrics">
                  <article><span>01</span><div><h2>Setup effort</h2><p>How much reconstruction does a useful new session require?</p></div><b>REDUCE</b></article>
                  <article><span>02</span><div><h2>Memory correctness</h2><p>What do people approve, correct, forget, or mark stale?</p></div><b>IMPROVE</b></article>
                  <article><span>03</span><div><h2>Trust + control</h2><p>Do provenance and reversible controls make autonomy feel safe?</p></div><b>EARN</b></article>
                </section>
              </div>
              <div class="pm-closing-signal"><span>MISSION THESIS</span><strong>The agent should manage its own context.</strong></div>
              <button type="button" class="pm-restart" data-pm-step="0">Replay mission briefing ↺</button>
            </section>
          </main>
        </div>
      </div>
    `;
  }

  function handleTabKeydown(event, id) {
    const index = tabs.findIndex((tab) => tab.id === id);
    let targetIndex = null;
    if (event.key === 'ArrowRight') targetIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') targetIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') targetIndex = 0;
    if (event.key === 'End') targetIndex = tabs.length - 1;
    if (event.key === 'Delete') {
      event.preventDefault();
      closeTab(id);
      return;
    }
    if (targetIndex !== null) {
      event.preventDefault();
      selectTab(tabs[targetIndex].id, { focus: true });
    }
  }

  function cycleTab(direction) {
    const index = tabs.findIndex((tab) => tab.id === activeTabId);
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    selectTab(tabs[nextIndex].id, { focus: true });
  }

  function continueToKind(kind, message) {
    const destination = tabs.find((tab) => tab.kind === kind);
    if (!destination) {
      announce('That chapter tab is no longer open');
      return;
    }
    selectTab(destination.id, { focus: true });
    announce(message);
  }

  function showWindow() {
    browserWindow.classList.remove('hidden');
    windowState = browserWindow.classList.contains('maximized') ? 'maximized' : 'open';
    firefoxTaskButton.classList.add('active');
    browserWindow.focus();
  }

  function hideWindow(kind) {
    browserWindow.classList.add('hidden');
    windowState = kind;
    firefoxTaskButton.classList.remove('active');
    startMenu.hidden = true;
    startButton.setAttribute('aria-expanded', 'false');
  }

  function getGeometry() {
    const rect = browserWindow.getBoundingClientRect();
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  }

  function setGeometry({ left, top, width, height }) {
    Object.assign(browserWindow.style, {
      left: `${Math.round(left)}px`,
      top: `${Math.round(top)}px`,
      width: `${Math.round(width)}px`,
      height: `${Math.round(height)}px`,
    });
  }

  function toggleMaximize() {
    if (isCompact()) return;
    if (browserWindow.classList.contains('maximized')) {
      browserWindow.classList.remove('maximized');
      if (previousGeometry) setGeometry(previousGeometry);
      windowState = 'open';
      maximizeButton.setAttribute('aria-label', 'Maximize Firefox');
    } else {
      previousGeometry = getGeometry();
      browserWindow.classList.add('maximized');
      windowState = 'maximized';
      maximizeButton.setAttribute('aria-label', 'Restore Firefox');
    }
  }

  function beginPointerOperation(event, type) {
    if (isCompact() || browserWindow.classList.contains('maximized') || event.button !== 0) return;
    if (event.target.closest('.window-controls')) return;
    const startGeometry = getGeometry();
    pointerOperation = {
      type,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startGeometry,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function updatePointerOperation(event) {
    if (!pointerOperation || pointerOperation.pointerId !== event.pointerId) return;
    const dx = event.clientX - pointerOperation.startX;
    const dy = event.clientY - pointerOperation.startY;
    const start = pointerOperation.startGeometry;

    if (pointerOperation.type === 'drag') {
      const minLeft = -start.width + 120;
      const maxLeft = desktop.clientWidth - 120;
      const maxTop = visibleWorkspaceHeight() - 24;
      setGeometry({
        ...start,
        left: Math.min(maxLeft, Math.max(minLeft, start.left + dx)),
        top: Math.min(maxTop, Math.max(0, start.top + dy)),
      });
    } else {
      setGeometry({
        ...start,
        width: Math.min(desktop.clientWidth - start.left, Math.max(640, start.width + dx)),
        height: Math.min(visibleWorkspaceHeight() - start.top, Math.max(420, start.height + dy)),
      });
    }
  }

  function endPointerOperation(event) {
    if (!pointerOperation || pointerOperation.pointerId !== event.pointerId) return;
    pointerOperation = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  newTabButton.addEventListener('click', () => createTab());
  tabList.addEventListener('dblclick', (event) => { if (!event.target.closest('.tab')) createTab(); });
  tabPanels.addEventListener('click', (event) => {
    const placeholderLink = event.target.closest('.myspace-page a[href="#"], .forum-page a[href="#"], .youtube-page a[href="#"], .pm-page a[href="#"]');
    if (placeholderLink) event.preventDefault();

    const continueButton = event.target.closest('[data-continue-kind]');
    if (continueButton) {
      const kind = continueButton.dataset.continueKind;
      const labels = { myspace: 'Opened Barron’s career chapters', youtube: 'Opened the Shopify AI chapter', 'pm-twin': 'Opened the PM Twin 2.0 case study' };
      continueToKind(kind, labels[kind] ?? 'Opened the next chapter');
      return;
    }

    const companyButton = event.target.closest('[data-company-index]');
    if (companyButton) {
      const index = Number(companyButton.dataset.companyIndex);
      const activeTab = tabs.find((tab) => tab.id === activeTabId);
      if (activeTab?.kind === 'myspace' && COMPANY_PROFILES[index]) {
        activeTab.selectedCompany = index;
        const page = companyButton.closest('.myspace-page');
        page.querySelectorAll('[data-company-index]').forEach((button) => {
          const selected = Number(button.dataset.companyIndex) === index;
          button.classList.toggle('is-selected', selected);
          button.setAttribute('aria-expanded', String(selected));
        });
        page.querySelector('.company-detail').innerHTML = getCompanyDetailMarkup(index);
        announce(`Selected ${COMPANY_PROFILES[index].name}: ${COMPANY_PROFILES[index].role}`);
      }
      return;
    }

    const projectButton = event.target.closest('[data-project-id]');
    if (projectButton) {
      const project = SHOPIFY_PROJECTS.find((item) => item.id === projectButton.dataset.projectId);
      const activeTab = tabs.find((tab) => tab.id === activeTabId);
      if (project && activeTab?.kind === 'youtube') {
        activeTab.selectedProject = project.id;
        const page = projectButton.closest('.youtube-page');
        page.querySelectorAll('[data-project-id]').forEach((button) => {
          const selected = button.dataset.projectId === project.id;
          button.classList.toggle('is-selected', selected);
          button.setAttribute('aria-expanded', String(selected));
        });
        page.querySelector('.yt-project-detail').innerHTML = `<small>${project.eyebrow}</small><h3>${project.title}</h3><p>${project.summary}</p>`;
        announce(`Opened ${project.title}`);
      }
      return;
    }

    const pmStepButton = event.target.closest('[data-pm-step]');
    if (pmStepButton) {
      const step = Number(pmStepButton.dataset.pmStep);
      const activeTab = tabs.find((tab) => tab.id === activeTabId);
      if (activeTab?.kind === 'pm-twin' && step >= 0 && step <= 4) {
        activeTab.pmStep = step;
        const page = pmStepButton.closest('.pm-page');
        page.querySelectorAll('[data-pm-view]').forEach((view) => { view.hidden = Number(view.dataset.pmView) !== step; });
        page.querySelectorAll('.pm-case-nav [data-pm-step]').forEach((button) => {
          button.setAttribute('aria-current', Number(button.dataset.pmStep) === step ? 'step' : 'false');
        });
        const scrollContainer = page.closest('.tab-panel');
        if (scrollContainer) scrollContainer.scrollTop = 0;
        announce(`PM Twin case study: ${['Problem and thesis', 'How context returns', 'Product decisions', 'Risks and safeguards', 'Evidence and next test'][step]}`);
      }
      return;
    }

    const youtubePlay = event.target.closest('.youtube-play-toggle');
    if (youtubePlay) {
      const player = youtubePlay.closest('.yt-player');
      const video = player.querySelector('.yt-video');
      if (video.paused || video.ended) video.play().catch(() => syncYouTubePlayer(player));
      else video.pause();
      return;
    }

    const youtubeVolume = event.target.closest('.youtube-volume-toggle');
    if (youtubeVolume) {
      const video = youtubeVolume.closest('.yt-player').querySelector('.yt-video');
      video.muted = !video.muted;
      return;
    }

    const youtubeFullscreen = event.target.closest('.youtube-fullscreen');
    if (youtubeFullscreen) {
      youtubeFullscreen.closest('.yt-player')?.requestFullscreen?.();
      return;
    }

    const youtubeTimeline = event.target.closest('.yt-timeline');
    if (youtubeTimeline) {
      const video = youtubeTimeline.closest('.yt-player').querySelector('.yt-video');
      const bounds = youtubeTimeline.getBoundingClientRect();
      if (Number.isFinite(video.duration)) video.currentTime = Math.max(0, Math.min(video.duration, ((event.clientX - bounds.left) / bounds.width) * video.duration));
      return;
    }

    const demoControl = event.target.closest('.pm-control-console button, .pm-wiki-browser button');
    if (demoControl) announce(`${demoControl.textContent.trim()} is shown as a PM Twin product control`);
  });

  tabPanels.addEventListener('keydown', (event) => {
    const timeline = event.target.closest('.yt-timeline');
    if (!timeline) return;
    const video = timeline.closest('.yt-player')?.querySelector('.yt-video');
    if (!video || !Number.isFinite(video.duration)) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + (event.key === 'ArrowRight' ? 5 : -5)));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      video.currentTime = event.key === 'Home' ? 0 : video.duration;
    }
  });
  minimizeButton.addEventListener('click', () => hideWindow('minimized'));
  closeWindowButton.addEventListener('click', () => hideWindow('closed'));
  maximizeButton.addEventListener('click', toggleMaximize);
  titlebar.addEventListener('dblclick', (event) => { if (!event.target.closest('.window-controls')) toggleMaximize(); });
  firefoxTaskButton.addEventListener('click', () => {
    if (browserWindow.classList.contains('hidden')) showWindow();
    else if (windowState !== 'closed') hideWindow('minimized');
  });

  document.querySelectorAll('[data-action="open-firefox"]').forEach((button) => {
    button.addEventListener('dblclick', showWindow);
    button.addEventListener('click', () => {
      if (button.closest('.start-menu')) showWindow();
      startMenu.hidden = true;
      startButton.setAttribute('aria-expanded', 'false');
    });
  });

  startButton.addEventListener('click', () => {
    const opening = startMenu.hidden;
    startMenu.hidden = !opening;
    startButton.setAttribute('aria-expanded', String(opening));
  });

  desktop.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('.start-menu, .start-button')) {
      startMenu.hidden = true;
      startButton.setAttribute('aria-expanded', 'false');
    }
    if (event.target.closest('.browser-window')) browserWindow.focus();
  });

  titlebar.addEventListener('pointerdown', (event) => beginPointerOperation(event, 'drag'));
  titlebar.addEventListener('pointermove', updatePointerOperation);
  titlebar.addEventListener('pointerup', endPointerOperation);
  titlebar.addEventListener('pointercancel', endPointerOperation);
  resizeGrip.addEventListener('pointerdown', (event) => beginPointerOperation(event, 'resize'));
  resizeGrip.addEventListener('pointermove', updatePointerOperation);
  resizeGrip.addEventListener('pointerup', endPointerOperation);
  resizeGrip.addEventListener('pointercancel', endPointerOperation);

  document.addEventListener('keydown', (event) => {
    if (pointerOperation && event.key === 'Escape') {
      setGeometry(pointerOperation.startGeometry);
      pointerOperation = null;
      return;
    }

    if (browserWindow.classList.contains('hidden') || !browserWindow.contains(document.activeElement)) return;
    const commandKey = event.ctrlKey || event.metaKey;
    if (commandKey && event.key.toLowerCase() === 't') {
      event.preventDefault();
      createTab();
    } else if (commandKey && event.key.toLowerCase() === 'w') {
      event.preventDefault();
      closeTab(activeTabId);
    } else if (event.ctrlKey && event.key === 'Tab') {
      event.preventDefault();
      cycleTab(event.shiftKey ? -1 : 1);
    } else if (commandKey && /^[1-9]$/.test(event.key)) {
      event.preventDefault();
      const number = Number(event.key);
      const index = number === 9 ? tabs.length - 1 : Math.min(number - 1, tabs.length - 1);
      selectTab(tabs[index].id, { focus: true });
    }
  });

  window.addEventListener('resize', () => {
    if (isCompact()) browserWindow.classList.remove('maximized');
  });

  function updateClock() {
    clock.textContent = new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit' }).format(new Date());
  }

  updateClock();
  window.setInterval(updateClock, 30_000);
  createTab({
    focus: false,
    kind: 'forum',
    title: 'MozillaZine Forums - Firefox Builds',
    url: 'http://forums.mozillazine.org/viewforum.php?f=23',
  });
  createTab({
    focus: false,
    activate: false,
    kind: 'myspace',
    title: 'MySpace.com - Barron',
    url: 'http://www.myspace.com/barron',
  });
  createTab({
    focus: false,
    activate: false,
    kind: 'youtube',
    title: 'YouTube - Shopify Frontier AI',
    url: 'http://youtube.local/shopify-frontier-ai',
  });
  createTab({
    focus: false,
    activate: false,
    kind: 'pm-twin',
    title: 'PM Twin 2.0 - Presentation',
    url: 'https://jetski.local/pm-twin-deck',
  });
})();
