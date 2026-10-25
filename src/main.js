import './style.css';

const icons = {
  activity: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 7-7 7 7M12 5v14"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>',
  crosshair: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 9 6-9 6V6Z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg>',
  volume: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6l-5 4H4ZM17 9.5a4 4 0 0 1 0 5M19 7a7 7 0 0 1 0 10"/></svg>',
  settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="m19 13 .1-2-1.8-.7-.5-1.2 1-1.7-1.4-1.4-1.7 1-.1-.1-1.1-.5L11 4.1H9l-.6 1.8-1.2.5-1.7-1L4.1 6.8l1 1.7-.5 1.2-1.8.7v2l1.8.7.5 1.2-1 1.7 1.4 1.4 1.7-1 1.2.5.6 1.8h2l.7-1.8 1.1-.5 1.7 1 1.4-1.4-1-1.7.5-1.2L19 13Z"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L12 4Z"/></svg>',
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.6-3L4 10M4 5v5h5M4 13a8 8 0 0 0 14.6 3L20 14m0 5v-5h-5"/></svg>',
  filter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
  more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
  target: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></svg>'
};

const state = {
  mode: 'analyst',
  language: 'English',
  focusPlayer: 'L. Medina',
  isLive: true,
  elapsed: 68 * 60 + 42,
  selectedEvent: 'pressure',
  toast: '',
  eventCursor: 0,
  newEventCount: 0
};

const events = [
  { id: 'pressure', time: '68:41', type: 'PRESSURE', icon: 'bolt', tone: 'mint', title: 'Pressure forced the turnover', player: 'L. Medina', detail: 'A 9.2s high press compressed the left channel and won possession 24m from goal.', metric: '+0.31 xT', why: 'This is a control moment: Atlético’s press turned a stable build-up into a high-value attack before the defence could reset.' },
  { id: 'pass', time: '67:12', type: 'PASS', icon: 'arrowUp', tone: 'blue', title: 'Line-breaking pass', player: 'J. Alvarez', detail: 'A 32m pass split two midfield lines and moved the ball into the final third.', metric: '87% quality', why: 'The pass mattered because it skipped the opponent’s pressure shape, not just because it reached a teammate.' },
  { id: 'shot', time: '63:08', type: 'SHOT', icon: 'target', tone: 'orange', title: 'Shot from a shrinking window', player: 'R. Silva', detail: 'Shot speed hit 102 km/h from 18m as the angle closed to 21°.', metric: '0.18 xG', why: 'The window closed quickly: Silva created a shot before the back line could block the lane.' },
  { id: 'possession', time: '59:44', type: 'POSSESSION', icon: 'activity', tone: 'purple', title: 'Momentum tilted right', player: 'Atlético Norte', detail: 'Five consecutive possessions ended in the attacking third over 2:18.', metric: '+12% control', why: 'Sustained territory, rather than a single pass, explains the shift in match control.' },
  { id: 'tackle', time: '54:29', type: 'TACKLE', icon: 'crosshair', tone: 'pink', title: 'Last-ditch recovery', player: 'M. Okafor', detail: 'Recovered 0.8s after the ball entered the danger zone, stopping a 3v2.', metric: '0.8s reaction', why: 'The timing prevented a numerical disadvantage from becoming a clear chance.' }
];

const narratives = {
  English: {
    analyst: 'Atlético Norte are winning the second ball battle. Their pressure is not constant — it is timed: the last three recoveries arrived within 10 seconds of an opponent’s first touch facing their own goal.',
    casual: 'Atlético Norte are making life uncomfortable. They keep winning the ball back quickly, especially when the other team turns toward their own goal.',
    recap: 'Atlético Norte control the match through smart pressure and faster recoveries. Medina is the live wire: his movement has created the most valuable attacking sequence of the second half.'
  },
  Español: {
    analyst: 'Atlético Norte está ganando la segunda jugada. Su presión no es constante: está sincronizada. Las últimas tres recuperaciones llegaron en menos de diez segundos tras un primer toque de espaldas.',
    casual: 'Atlético Norte está haciendo el partido incómodo. Recupera el balón rápido cuando el rival recibe de espaldas.',
    recap: 'Atlético Norte controla el partido con presión inteligente y recuperaciones rápidas. Medina es el motor de la segunda parte.'
  },
  Français: {
    analyst: 'Atlético Norte domine les deuxièmes ballons. Leur pressing est ciblé : les trois dernières récupérations sont arrivées dans les dix secondes après une première touche dos au jeu.',
    casual: 'Atlético Norte rend le match difficile. Ils récupèrent vite quand l’adversaire reçoit dos au but.',
    recap: 'Atlético Norte contrôle le match grâce à un pressing intelligent et des récupérations rapides. Medina anime la seconde période.'
  }
};

function formatClock(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function eventCard(event, selected = false) {
  return `<button class="event-row ${selected ? 'selected' : ''}" data-event="${event.id}">
    <span class="event-time">${event.time}</span>
    <span class="event-type-icon ${event.tone}">${icons[event.icon]}</span>
    <span class="event-copy"><strong>${event.title}</strong><small>${event.player} · ${event.detail}</small></span>
    <span class="event-metric">${event.metric}</span>
    <span class="event-arrow">${icons.chevron}</span>
  </button>`;
}

function playerInitials(name) {
  return name.split(' ').map(part => part[0]).join('').replace('.', '').slice(0, 2);
}

function render() {
  const selected = events.find(event => event.id === state.selectedEvent) || events[0];
  const narrative = narratives[state.language];
  const casual = state.mode === 'casual';
  const players = [
    { name: 'L. Medina', role: 'Attacking midfielder', stat: '8.4', sub: 'match impact', color: 'mint', active: state.focusPlayer === 'L. Medina' },
    { name: 'J. Alvarez', role: 'Deep playmaker', stat: '91%', sub: 'pass accuracy', color: 'blue', active: state.focusPlayer === 'J. Alvarez' },
    { name: 'M. Okafor', role: 'Centre back', stat: '7', sub: 'recoveries', color: 'orange', active: state.focusPlayer === 'M. Okafor' }
  ];

  document.querySelector('#app').innerHTML = `
    <div class="app-shell ${casual ? 'casual-mode' : ''}">
      <header class="topbar">
        <a class="brand" href="#top" aria-label="MatchMind home"><span class="brand-mark"><i></i><i></i><i></i></span><span>match<span>mind</span></span></a>
        <nav class="topnav"><a class="active" href="#live">Live room</a><a href="#narrative">Narrative studio</a><a href="#data">Data lab</a></nav>
        <div class="top-actions">
          <span class="live-indicator"><span></span> Live sync</span>
          <button class="icon-btn" aria-label="Toggle sound">${icons.volume}</button>
          <label class="language-select">${icons.globe}<select id="language-select" aria-label="Language"><option ${state.language === 'English' ? 'selected' : ''}>English</option><option ${state.language === 'Español' ? 'selected' : ''}>Español</option><option ${state.language === 'Français' ? 'selected' : ''}>Français</option></select>${icons.chevron}</label>
          <div class="avatar">AK</div>
        </div>
      </header>

      <main id="top">
        <section class="intro-section">
          <div>
            <p class="eyebrow">MATCHMIND / ${state.isLive ? 'LIVE MATCH INTELLIGENCE' : 'MATCH ARCHIVE'}</p>
            <h1>Make the moment<br /><em>make sense.</em></h1>
            <p class="intro-copy">From event stream to explainable story — MatchMind helps every viewer understand what just changed, and why it matters.</p>
          </div>
          <div class="intro-actions">
            <button class="secondary-btn" id="refresh-sim">${icons.refresh}<span>Simulate next event</span></button>
            <button class="primary-btn" id="generate-recap">Generate recap <span>↗</span></button>
          </div>
        </section>

        <section class="status-strip">
          <div class="status-cell"><span class="status-dot mint"></span><div><small>EVENT STREAM</small><strong>Connected</strong></div></div>
          <div class="status-cell"><span class="status-icon">${icons.activity}</span><div><small>EVENTS PROCESSED</small><strong>${casual ? '1,248' : '1,248'} <b>+18 this half</b></strong></div></div>
          <div class="status-cell"><span class="status-icon">${icons.clock}</span><div><small>LATENCY</small><strong>380 ms <b>optimal</b></strong></div></div>
          <div class="status-cell status-audience"><span class="status-icon">${icons.target}</span><div><small>VIEWER MODE</small><strong>${casual ? 'Casual fan' : 'Analyst'} <b>personalized</b></strong></div></div>
        </section>

        <section class="dashboard-grid" id="live">
          <article class="panel match-panel">
            <div class="panel-header"><div><p class="eyebrow">LIVE MATCH / LA LIGA · 2024/25</p><h2>Atlético Norte <span>vs</span> Real Bahía</h2></div><div class="panel-tools"><span class="match-live"><i></i> LIVE</span><button class="icon-btn">${icons.more}</button></div></div>
            <div class="match-scoreline"><div class="team team-home"><span class="team-badge norte">AN</span><strong>1</strong></div><div class="score-time"><span>2ND HALF</span><b>${formatClock(state.elapsed)}</b><small>Match tempo <strong>fast</strong></small></div><div class="team team-away"><strong>0</strong><span class="team-badge bahia">RB</span></div></div>
            <div class="pitch-wrap">
              <div class="pitch-label home-label">ATLÉTICO NORTE</div><div class="pitch-label away-label">REAL BAHÍA</div>
              <svg class="pitch" viewBox="0 0 760 350" role="img" aria-label="Live pitch showing player positions and passing lanes">
                <defs><linearGradient id="grass" x1="0" x2="1"><stop offset="0" stop-color="#11352d"/><stop offset=".5" stop-color="#19503b"/><stop offset="1" stop-color="#12392f"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                <rect x="8" y="8" width="744" height="334" rx="12" fill="url(#grass)" stroke="#7ee2a4" stroke-opacity=".32"/>
                <path d="M380 8v334M8 72h92v206H8M752 72h-92v206h92M100 135h46v80h-46M660 135h-46v80h46M380 160a15 15 0 1 0 0 30 15 15 0 0 0 0-30Z" fill="none" stroke="#a9e6bf" stroke-opacity=".44" stroke-width="1.5"/>
                <path d="M126 144C236 90 288 152 362 174S484 170 604 117" fill="none" stroke="#adffcf" stroke-width="2.5" stroke-dasharray="7 7" opacity=".88"/><path d="M145 233C260 280 318 228 390 195" fill="none" stroke="#7cc6ff" stroke-width="2.5" stroke-dasharray="7 7" opacity=".82"/>
                <circle cx="607" cy="117" r="12" fill="#adffcf" stroke="#e8fff1" stroke-width="2" filter="url(#glow)"/><circle cx="607" cy="117" r="19" fill="none" stroke="#adffcf" opacity=".4"/><text x="626" y="113" fill="#eafff1" font-size="12" font-weight="700">MEDINA</text><text x="626" y="128" fill="#b9ddca" font-size="10">PRESSURE TRIGGER</text>
                <circle cx="390" cy="195" r="9" fill="#6dc2ff" stroke="#e4f4ff" stroke-width="2"/><circle cx="312" cy="114" r="9" fill="#6dc2ff" stroke="#e4f4ff" stroke-width="2"/><circle cx="266" cy="246" r="9" fill="#6dc2ff" stroke="#e4f4ff" stroke-width="2"/><circle cx="189" cy="165" r="9" fill="#6dc2ff" stroke="#e4f4ff" stroke-width="2"/><circle cx="116" cy="99" r="9" fill="#6dc2ff" stroke="#e4f4ff" stroke-width="2"/>
                <circle cx="562" cy="227" r="9" fill="#f79b72" stroke="#fff0e7" stroke-width="2"/><circle cx="506" cy="92" r="9" fill="#f79b72" stroke="#fff0e7" stroke-width="2"/><circle cx="474" cy="270" r="9" fill="#f79b72" stroke="#fff0e7" stroke-width="2"/><circle cx="650" cy="184" r="9" fill="#f79b72" stroke="#fff0e7" stroke-width="2"/>
                <circle cx="571" cy="116" r="4" fill="#fff8be"/><path d="M563 116h-22" stroke="#fff8be" stroke-width="2"/><text x="514" y="108" fill="#fff8be" font-size="10">102 km/h</text>
              </svg>
              <div class="pitch-legend"><span><i class="legend-dot mint"></i> live pressure</span><span><i class="legend-dot blue"></i> Atlético Norte</span><span><i class="legend-dot orange"></i> Real Bahía</span><span class="legend-spacer"></span><span>${icons.clock} updated 0.3s ago</span></div>
            </div>
            <div class="timeline"><div class="timeline-top"><span>00:00</span><span>HALF-TIME</span><span>90:00</span></div><div class="timeline-line"><i style="width:76%"></i><b style="left:76%"></b><span class="timeline-event one" style="left:62%"></span><span class="timeline-event two" style="left:70%"></span></div></div>
          </article>

          <article class="panel decoded-panel">
            <div class="panel-header"><div><p class="eyebrow">MOMENT DECODED</p><h2>${selected.type.toLowerCase()} / ${selected.time}</h2></div><span class="confidence">${icons.target} 94% confidence</span></div>
            <div class="moment-callout ${selected.tone}"><span class="moment-icon">${icons[selected.icon]}</span><div><strong>${selected.title}</strong><p>${selected.detail}</p></div></div>
            <div class="why-block"><div class="why-title"><span class="mini-spark">${icons.bolt}</span><span>WHY IT MATTERS</span><span class="line"></span></div><p>${selected.why}</p></div>
            <div class="decoded-stats"><div><small>EXPECTED THREAT</small><strong>${selected.id === 'pressure' ? '+0.31' : '+0.18'}</strong><span>xT added</span></div><div><small>GAME STATE</small><strong>${selected.id === 'possession' ? 'Control' : 'Tilted'}</strong><span>Atlético Norte</span></div></div>
            <div class="overlay-preview"><div class="overlay-top"><span>ON-SCREEN OVERLAY</span><span class="overlay-ready">${icons.activity} READY</span></div><div class="overlay-content"><span class="overlay-score">AN <b>1</b> — <b>0</b> RB</span><span class="overlay-copy">${casual ? 'A quick recovery puts Atlético Norte back on the front foot.' : 'Medina’s 9.2s press forced a turnover and added +0.31 expected threat.'}</span></div></div>
          </article>
        </section>

        <section class="insight-row" id="data">
          <article class="panel signal-panel"><div class="panel-header"><div><p class="eyebrow">SIGNAL STACK / LIVE</p><h2>What the event stream sees</h2></div><button class="text-btn">All metrics ${icons.chevron}</button></div><div class="signal-cards"><div class="signal-card mint-edge"><span class="signal-label">CONTROL INDEX</span><strong>61<span>%</span></strong><div class="signal-trend up">${icons.arrowUp} +8.4 <small>last 10 min</small></div><div class="mini-bars mint-bars"><i style="height:42%"></i><i style="height:54%"></i><i style="height:47%"></i><i style="height:68%"></i><i style="height:61%"></i><i style="height:82%"></i><i style="height:76%"></i><i style="height:91%"></i></div></div><div class="signal-card blue-edge"><span class="signal-label">PASS QUALITY</span><strong>87<span>%</span></strong><div class="signal-trend up">${icons.arrowUp} +4.2 <small>season avg.</small></div><div class="metric-bar"><i style="width:87%"></i></div><small class="bar-note">1.4× league average difficulty</small></div><div class="signal-card orange-edge"><span class="signal-label">BALL SPEED</span><strong>102<span> km/h</span></strong><div class="signal-trend down">${icons.arrowUp} -12.0 <small>peak this half</small></div><div class="speed-line"><i style="width:72%"></i><b></b></div><small class="bar-note">R. Silva · 63:08</small></div></div></article>
          <article class="panel rhythm-panel"><div class="panel-header"><div><p class="eyebrow">TACTICAL CONTEXT</p><h2>Rhythm & pressure</h2></div><div class="segmented"><button class="active">Control</button><button>Chaos</button></div></div><div class="chart-area"><div class="y-axis"><span>high</span><span>medium</span><span>low</span></div><svg class="rhythm-chart" viewBox="0 0 560 150" preserveAspectRatio="none"><defs><linearGradient id="chartfill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8effbf" stop-opacity=".3"/><stop offset="1" stop-color="#8effbf" stop-opacity="0"/></linearGradient></defs><path d="M0 108 C30 101 38 58 72 79 S115 112 145 78 S188 43 214 62 S252 102 276 76 S314 50 340 88 S368 119 394 70 S433 39 456 54 S484 89 512 46 S539 30 560 24 L560 150 L0 150Z" fill="url(#chartfill)"/><path d="M0 108 C30 101 38 58 72 79 S115 112 145 78 S188 43 214 62 S252 102 276 76 S314 50 340 88 S368 119 394 70 S433 39 456 54 S484 89 512 46 S539 30 560 24" fill="none" stroke="#a1ffc7" stroke-width="3"/><line x1="0" y1="125" x2="560" y2="125" stroke="#76908b" stroke-opacity=".2"/><line x1="0" y1="75" x2="560" y2="75" stroke="#76908b" stroke-opacity=".2"/><line x1="0" y1="25" x2="560" y2="25" stroke="#76908b" stroke-opacity=".2"/><circle cx="512" cy="46" r="5" fill="#a1ffc7" stroke="#0e2821" stroke-width="3"/></svg><span class="chart-callout">pressure spike <b>+22%</b></span></div><div class="chart-foot"><span>50:00</span><span>60:00</span><span>65:00</span><span>68:42</span></div><p class="context-note"><span>${icons.bolt}</span><b>Signal:</b> pressure is rising on the left channel. The next 90 seconds are a high-probability window for a transition.</p></article>
        </section>

        <section class="lower-grid">
          <article class="panel feed-panel"><div class="panel-header"><div><p class="eyebrow">EVENT FEED / ${state.newEventCount ? `${state.newEventCount} NEW` : 'LAST 5 MINUTES'}</p><h2>Every action has a story</h2></div><div class="feed-actions"><button class="filter-btn">${icons.filter} Filter</button><button class="icon-btn">${icons.more}</button></div></div><div class="event-list">${events.map(event => eventCard(event, event.id === state.selectedEvent)).join('')}</div><button class="load-more">Load earlier events <span>↓</span></button></article>
          <article class="panel player-panel"><div class="panel-header"><div><p class="eyebrow">PLAYER FOCUS</p><h2>${state.focusPlayer}</h2></div><label class="player-select"><select id="player-select" aria-label="Focus player"><option ${state.focusPlayer === 'L. Medina' ? 'selected' : ''}>L. Medina</option><option ${state.focusPlayer === 'J. Alvarez' ? 'selected' : ''}>J. Alvarez</option><option ${state.focusPlayer === 'M. Okafor' ? 'selected' : ''}>M. Okafor</option></select>${icons.chevron}</label></div><div class="player-hero"><div class="player-avatar ${state.focusPlayer === 'J. Alvarez' ? 'blue' : state.focusPlayer === 'M. Okafor' ? 'orange' : 'mint'}">${playerInitials(state.focusPlayer)}</div><div><strong>${state.focusPlayer}</strong><span>${players.find(p => p.name === state.focusPlayer)?.role}</span></div><span class="focus-badge">${icons.star} focused</span></div><div class="player-stats"><div><small>IMPACT</small><strong>${state.focusPlayer === 'L. Medina' ? '8.4' : state.focusPlayer === 'J. Alvarez' ? '7.9' : '7.6'}</strong><span>/ 10</span></div><div><small>INVOLVEMENT</small><strong>${state.focusPlayer === 'L. Medina' ? '42' : state.focusPlayer === 'J. Alvarez' ? '58' : '29'}</strong><span>touches</span></div><div><small>KEY ACTIONS</small><strong>${state.focusPlayer === 'L. Medina' ? '6' : state.focusPlayer === 'J. Alvarez' ? '8' : '7'}</strong><span>this half</span></div></div><div class="player-reading"><span class="reading-line"></span><div><small>PLAIN-LANGUAGE READING</small><p>${state.focusPlayer === 'L. Medina' ? 'Medina is finding the gap between the fullback and centre-back. His pressure triggers have directly shaped Atlético Norte’s best attacks.' : state.focusPlayer === 'J. Alvarez' ? 'Alvarez is keeping the game moving. His first-time passing is helping Atlético Norte play through pressure instead of around it.' : 'Okafor is protecting the lead with anticipation. His recoveries arrive before the danger becomes a chance.'}</p></div></div><div class="focus-toggle"><span>Keep focus on ${state.focusPlayer} throughout match</span><button class="toggle on" aria-label="Player focus enabled"><i></i></button></div></article>
        </section>

        <section class="narrative-section" id="narrative"><div class="section-heading"><div><p class="eyebrow">NARRATIVE STUDIO / GENERATIVE STORYTELLING</p><h2>One match. Your way in.</h2></div><p>MatchMind adapts the same underlying intelligence to the person watching — from tactical depth to a clean, human story.</p></div><div class="narrative-grid"><article class="panel story-panel"><div class="story-top"><div class="mode-tabs"><button class="${state.mode === 'analyst' ? 'active' : ''}" data-mode="analyst">Analyst mode</button><button class="${state.mode === 'casual' ? 'active' : ''}" data-mode="casual">Casual fan mode</button></div><span class="generated-label">${icons.activity} generated live</span></div><div class="story-body"><span class="quote-mark">“</span><p class="story-quote">${state.mode === 'analyst' ? narrative.analyst : narrative.casual}</p><div class="story-tags"><span>pressure context</span><span>player-aware</span><span>plain language</span></div></div><div class="story-footer"><span>${icons.clock} Updated after 68:41</span><button class="text-btn" id="more-story">Expand story ${icons.arrowUp}</button></div></article><article class="panel modes-panel"><div class="panel-header"><div><p class="eyebrow">YOUR MATCH / PREFERENCES</p><h2>Make it yours</h2></div>${icons.settings}</div><div class="preference-row"><div class="preference-icon mint">${icons.star}</div><div><strong>Favorite club</strong><small>Prioritize their key moments</small></div><span class="preference-value">Atlético Norte ${icons.chevron}</span></div><div class="preference-row"><div class="preference-icon blue">${icons.target}</div><div><strong>Player focus</strong><small>Follow one player all match</small></div><span class="preference-value">${state.focusPlayer} ${icons.chevron}</span></div><div class="preference-row"><div class="preference-icon orange">${icons.globe}</div><div><strong>Story language</strong><small>Natural-language output</small></div><span class="preference-value">${state.language} ${icons.chevron}</span></div><button class="manage-btn">Manage viewing experience <span>↗</span></button></article></div></section>
      </main>
      <footer class="footer"><div class="brand footer-brand"><span class="brand-mark"><i></i><i></i><i></i></span><span>match<span>mind</span></span></div><span>Explainable intelligence for every football story.</span><span class="footer-right">Synthetic data environment · v0.9.4</span></footer>
      ${state.toast ? `<div class="toast">${icons.activity}<span>${state.toast}</span></div>` : ''}
    </div>
  `;
  bindInteractions();
}

function bindInteractions() {
  document.querySelectorAll('[data-event]').forEach(button => button.addEventListener('click', () => {
    state.selectedEvent = button.dataset.event;
    state.newEventCount = 0;
    render();
  }));
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    state.mode = button.dataset.mode;
    render();
  }));
  document.querySelector('#language-select')?.addEventListener('change', event => { state.language = event.target.value; render(); });
  document.querySelector('#player-select')?.addEventListener('change', event => { state.focusPlayer = event.target.value; render(); });
  document.querySelector('#generate-recap')?.addEventListener('click', () => {
    state.toast = 'Recap generated — 3 key moments and 1 player storyline ready.';
    render();
    window.setTimeout(() => { state.toast = ''; render(); }, 3400);
  });
  document.querySelector('#refresh-sim')?.addEventListener('click', () => {
    const next = events[(events.findIndex(event => event.id === state.selectedEvent) + 1) % events.length];
    state.selectedEvent = next.id;
    state.newEventCount += 1;
    state.elapsed += 7;
    state.toast = `New ${next.type.toLowerCase()} event decoded at ${next.time}.`;
    render();
    window.setTimeout(() => { state.toast = ''; render(); }, 2600);
  });
  document.querySelector('#more-story')?.addEventListener('click', () => {
    state.toast = 'Full match story expanded in the Narrative Studio.';
    render();
    window.setTimeout(() => { state.toast = ''; render(); }, 2600);
  });
}

render();
window.setInterval(() => {
  if (!state.isLive) return;
  state.elapsed += 1;
  const clock = document.querySelector('.score-time b');
  if (clock) clock.textContent = formatClock(state.elapsed);
}, 1000);
