import './style.css';
import './history.css';
import './agent.css';
import './counterfactual.css';
import './reference-features.css';
import './scroll-motion.css';
import './submission-features.css';
import './requirements.css';
import './tagline.css';
import './language.css';
import { pipelineStages, syntheticEventSchema, runAgentTrace } from './pipeline.js';
import { mountTechText } from './tech-text.js';

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
  historyMatch: 'all',
  timelinePlaying: true,
  timelineSpeed: 1,
  persona: 'Analyst',
  catalogQuery: '',
  catalogFilter: 'All',
  guidedDemo: false,
  demoStep: 0,
  askQuery: '',
  askMessages: [],
  recapTab: 'Match report',
  tacticalTab: 'Passing network',
  highlightReady: false,
  datasetSize: 25,
  audience: 'Fan View',
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

const tacticalCatalog = [
  { title: 'Timed left-channel press', type: 'Pressing wave', count: '4 moments', color: 'mint', summary: 'How Atlético Norte collapse space after an opponent receives facing their own goal.', tags: ['pressure', 'transitions'] },
  { title: 'Third-man escape', type: 'Build-up pattern', count: '7 sequences', color: 'blue', summary: 'The midfielder who receives after the first line has been pulled out of shape.', tags: ['passing', 'possession'] },
  { title: 'Fast-side overload', type: 'Territory pattern', count: '3 moments', color: 'orange', summary: 'A compact route from recovery to final-third entry in under ten seconds.', tags: ['tempo', 'width'] },
  { title: 'Protecting a narrow lead', type: 'Game-state pattern', count: '2 matches', color: 'purple', summary: 'How the back line changes its risk profile after Atlético Norte goes ahead.', tags: ['control', 'defending'] }
];

// Synthetic previous-match feed used to give the live intelligence historical context.
const previousMatches = [
  { id: 'm05', date: '18 May', opponent: 'CD Levante', venue: 'H', result: 'W', score: '2–0', possession: 58, shots: 14, shotsOnTarget: 6, passAccuracy: 89, passes: 512, pressureRecoveries: 11, xg: 1.84, distance: 108.4, topPlayer: 'L. Medina', topRating: 8.7 },
  { id: 'm04', date: '11 May', opponent: 'Unión Costa', venue: 'A', result: 'D', score: '1–1', possession: 54, shots: 11, shotsOnTarget: 4, passAccuracy: 86, passes: 466, pressureRecoveries: 8, xg: 1.21, distance: 106.1, topPlayer: 'J. Alvarez', topRating: 7.9 },
  { id: 'm03', date: '04 May', opponent: 'Real Sierra', venue: 'H', result: 'W', score: '3–1', possession: 62, shots: 18, shotsOnTarget: 8, passAccuracy: 91, passes: 588, pressureRecoveries: 14, xg: 2.38, distance: 111.2, topPlayer: 'R. Silva', topRating: 9.1 },
  { id: 'm02', date: '27 Apr', opponent: 'Atlético Sur', venue: 'A', result: 'L', score: '0–1', possession: 49, shots: 9, shotsOnTarget: 2, passAccuracy: 82, passes: 401, pressureRecoveries: 6, xg: 0.73, distance: 103.7, topPlayer: 'M. Okafor', topRating: 7.4 },
  { id: 'm01', date: '20 Apr', opponent: 'Racing Verde', venue: 'H', result: 'W', score: '2–1', possession: 56, shots: 13, shotsOnTarget: 5, passAccuracy: 88, passes: 493, pressureRecoveries: 10, xg: 1.67, distance: 109.6, topPlayer: 'L. Medina', topRating: 8.5 }
];

function historyRows() {
  return state.historyMatch === 'all' ? previousMatches : previousMatches.filter(match => match.id === state.historyMatch);
}

function historicalStats() {
  const rows = historyRows();
  const total = rows.length || 1;
  const wins = rows.filter(match => match.result === 'W').length;
  return {
    record: `${wins}–${rows.filter(match => match.result === 'D').length}–${rows.filter(match => match.result === 'L').length}`,
    points: `${wins * 3 + rows.filter(match => match.result === 'D').length}/${total * 3}`,
    possession: Math.round(rows.reduce((sum, match) => sum + match.possession, 0) / total),
    passAccuracy: Math.round(rows.reduce((sum, match) => sum + match.passAccuracy, 0) / total),
    shots: (rows.reduce((sum, match) => sum + match.shots, 0) / total).toFixed(1),
    xg: (rows.reduce((sum, match) => sum + match.xg, 0) / total).toFixed(2),
    pressure: (rows.reduce((sum, match) => sum + match.pressureRecoveries, 0) / total).toFixed(1),
    distance: (rows.reduce((sum, match) => sum + match.distance, 0) / total).toFixed(1)
  };
}

function formPill(result) {
  return `<span class="form-pill ${result === 'W' ? 'win' : result === 'D' ? 'draw' : 'loss'}">${result}</span>`;
}

function filteredCatalog() {
  const query = state.catalogQuery.trim().toLowerCase();
  return tacticalCatalog.filter(item => {
    const matchesFilter = state.catalogFilter === 'All' || item.type === state.catalogFilter;
    const matchesQuery = !query || `${item.title} ${item.type} ${item.summary} ${item.tags.join(' ')}`.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });
}

function askAnswer(query) {
  const q = query.toLowerCase();
  if (q.includes('press') || q.includes('60')) return { answer: 'The press became less effective after the 60th minute because Real Bahía stopped receiving square in the left channel. Atlético Norte recovered 3 times within 10 seconds before the phase, then only once in the next spell.', citations: ['54:29', '59:44', '68:41'] };
  if (q.includes('medina') || q.includes('player')) return { answer: 'Medina is the match’s highest-leverage player: his 9.2-second pressure action forced the key turnover, added +0.31 expected threat, and moved the next possession 24m closer to goal.', citations: ['68:41', '67:12'] };
  if (q.includes('win') || q.includes('control')) return { answer: 'The control edge comes from territory and recovery timing rather than raw possession. Atlético Norte have 61% control, 87% pass quality, and five attacking-third possessions in the last 2:18.', citations: ['59:44', '68:41'] };
  return { answer: 'Ask about the press, Medina, control, or what changed after the 60th minute. I will answer only from the synthetic event stream and cite the moments used.', citations: ['68:41'] };
}

function demoSteps() {
  return [
    { title: 'Watch the live event', copy: 'Start with the match clock, pitch, and event stream.', target: '#live' },
    { title: 'Decode the moment', copy: 'Select a moment to see what happened and why it mattered.', target: '#live' },
    { title: 'Ask the match', copy: 'Use grounded chat to investigate a tactical question.', target: '#ask' },
    { title: 'Generate the story', copy: 'Switch output formats for a recap, script, or social post.', target: '#recap' },
    { title: 'Explore the impact', copy: 'See who the platform is designed to help.', target: '#impact' }
  ];
}

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
  },
  हिन्दी: { analyst: 'एटलेटिको नॉर्टे दूसरी गेंदों पर नियंत्रण बना रहा है। दबाव लगातार नहीं, बल्कि सही समय पर है।', casual: 'एटलेटिको नॉर्टे गेंद जल्दी वापस जीत रहा है और मैच को अपने पक्ष में मोड़ रहा है।', recap: 'स्मार्ट प्रेसिंग और तेज़ रिकवरी ने एटलेटिको नॉर्टे को मैच में नियंत्रण दिया।' },
  العربية: { analyst: 'يحافظ أتلتيكو نورتي على السيطرة على الكرات الثانية بضغط محسوب، لا بضغط مستمر.', casual: 'أتلتيكو نورتي يستعيد الكرة بسرعة ويجعل المباراة أصعب على الخصم.', recap: 'الضغط الذكي والاسترداد السريع منحا أتلتيكو نورتي السيطرة في الشوط الثاني.' },
  Português: { analyst: 'O Atlético Norte domina as segundas bolas com pressão temporizada, não constante.', casual: 'O Atlético Norte recupera a bola rápido e dita o ritmo do jogo.', recap: 'Pressão inteligente e recuperações rápidas deram o controle ao Atlético Norte.' },
  普通话: { analyst: '北方竞技通过有节奏的压迫控制第二落点，三次关键回收都发生在十秒内。', casual: '北方竞技很快夺回球权，比赛节奏正在向他们倾斜。', recap: '精准压迫和快速回收帮助北方竞技掌控下半场。' }
};

const languageOptions = ['English', 'हिन्दी', 'Español', 'العربية', 'Português', 'Français', '普通话'];

const uiCopy = {
  English: { heroLine1: 'Make the moment', heroLine2: 'make sense.', tagline: 'Turn every football moment into a story.', intro: 'From event stream to explainable story — MatchMind helps every viewer understand what just changed, and why it matters.', translated: 'English experience active' },
  हिन्दी: { heroLine1: 'हर पल को', heroLine2: 'समझने योग्य बनाएं।', tagline: 'हर फुटबॉल पल को एक कहानी में बदलें।', intro: 'इवेंट स्ट्रीम से समझने योग्य कहानी तक — MatchMind हर दर्शक को समझाता है कि अभी क्या बदला और क्यों महत्वपूर्ण है।', translated: 'हिन्दी अनुभव सक्रिय है' },
  Español: { heroLine1: 'Haz que el momento', heroLine2: 'tenga sentido.', tagline: 'Convierte cada momento del fútbol en una historia.', intro: 'De la secuencia de eventos a una historia explicable — MatchMind ayuda a entender qué cambió y por qué importa.', translated: 'Experiencia en español activa' },
  العربية: { heroLine1: 'اجعل اللحظة', heroLine2: 'مفهومة.', tagline: 'حوّل كل لحظة كروية إلى قصة.', intro: 'من تدفق الأحداث إلى قصة قابلة للفهم — يساعد MatchMind كل مشاهد على معرفة ما تغيّر ولماذا يهم.', translated: 'التجربة العربية مفعّلة' },
  Português: { heroLine1: 'Faça o momento', heroLine2: 'fazer sentido.', tagline: 'Transforme cada momento do futebol em uma história.', intro: 'Do fluxo de eventos à história explicável — o MatchMind mostra o que mudou e por que isso importa.', translated: 'Experiência em português ativa' },
  Français: { heroLine1: 'Donnez du sens', heroLine2: 'à chaque moment.', tagline: 'Transformez chaque moment de football en histoire.', intro: 'Du flux d’événements à une histoire explicable — MatchMind révèle ce qui vient de changer et pourquoi cela compte.', translated: 'Expérience française active' },
  普通话: { heroLine1: '让每个瞬间', heroLine2: '变得清晰。', tagline: '把每个足球瞬间变成一个故事。', intro: '从实时事件流到可解释的故事，MatchMind 帮助每位观众理解刚刚发生了什么，以及为什么重要。', translated: '普通话体验已启用' }
};

const recapOutputs = {
  'Match report': { title: 'Atlético Norte 1–0 Real Bahía', body: 'Atlético Norte’s 9.2-second press turned a calm build-up into the match’s clearest attacking window. The home side finished the half with 61% control, 87% pass quality, and three recoveries inside ten seconds of an opponent’s first touch facing their own goal.', label: 'FULL MATCH REPORT' },
  '60-second script': { title: 'A match changed by pressure', body: '[0:00] Atlético Norte start fast. [0:18] Medina triggers the press and wins it high. [0:31] Alvarez breaks the next line. [0:44] Silva shoots before the angle closes. [0:60] The story of the half: not more possession, but better-timed pressure.', label: 'VOICEOVER SCRIPT' },
  'Tweet thread': { title: 'Thread: the 9.2-second press', body: '1/ Atlético Norte’s biggest moment was not the scoreline — it was the speed of the recovery. 2/ Medina compressed the left channel for 9.2s. 3/ The turnover added +0.31 xT. 4/ That is how control becomes a chance.', label: 'SOCIAL THREAD' },
  'Instagram caption': { title: 'Pressure, then purpose.', body: 'Medina wins it high. Alvarez breaks the line. Silva gets the shot away. One sequence, three decisions, and a match that suddenly tilts. #MatchMind #ExplainTheGame', label: 'CAPTION' }
};

const audienceModes = {
  'Fan View': { label: 'Fan View', copy: 'Plain-language story, momentum signal, translated narrative, and one-tap context for every key moment.', output: 'Mobile match companion' },
  'Studio Desk': { label: 'Studio Desk', copy: 'Broadcast-safe overlays, evidence-backed talking points, player focus, and a fast path from event to presenter copy.', output: 'Producer console + lower third' },
  'Streaming Platform': { label: 'Streaming Platform', copy: 'Personalized live cards, auto-highlight queue, multilingual metadata, and explainers that keep viewers watching.', output: 'In-stream companion layer' }
};

const highlightScenes = [
  { time: '68:41', title: 'The 9.2-second press', detail: 'Medina forces the turnover and adds +0.31 xT.', tag: 'KEY TURNING POINT' },
  { time: '67:12', title: 'The line-breaking pass', detail: 'Alvarez finds Medina between the lines from 32m.', tag: 'TACTICAL PATTERN' },
  { time: '63:08', title: 'The window closes', detail: 'Silva gets the shot away at 102 km/h before the angle disappears.', tag: 'SHOT MOMENT' }
];

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

let scrollMotionBound = false;

function bindScrollMotion() {
  const revealItems = document.querySelectorAll('.panel, .section-heading, .status-strip, .intro-section, .footer');
  revealItems.forEach((item, index) => {
    item.classList.add('scroll-reveal');
    item.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 55}ms`);
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08, rootMargin: '0px 0px -24px' });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  const updateFootball = () => {
    const ball = document.querySelector('.scroll-ball');
    const orbit = document.querySelector('.scroll-orbit');
    if (!ball || !orbit) return;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    ball.style.transform = `translateY(${(progress - 0.5) * 320}px) rotate(${progress * 540}deg)`;
    orbit.style.setProperty('--scroll-progress', progress);
    orbit.classList.toggle('at-end', progress > .94);
  };
  updateFootball();
  if (!scrollMotionBound) {
    window.addEventListener('scroll', updateFootball, { passive: true });
    window.addEventListener('resize', updateFootball);
    scrollMotionBound = true;
  }
}

function render() {
  const selected = events.find(event => event.id === state.selectedEvent) || events[0];
  const narrative = narratives[state.language];
  const copy = uiCopy[state.language] || uiCopy.English;
  const casual = state.mode === 'casual';
  const history = historicalStats();
  const historyLabel = state.historyMatch === 'all' ? 'Last 5 matches' : previousMatches.find(match => match.id === state.historyMatch)?.opponent || 'Selected match';
  const agentTrace = runAgentTrace({ event_type: selected.id, location: [74, 38] });
  const catalogItems = filteredCatalog();
  const players = [
    { name: 'L. Medina', role: 'Attacking midfielder', stat: '8.4', sub: 'match impact', color: 'mint', active: state.focusPlayer === 'L. Medina' },
    { name: 'J. Alvarez', role: 'Deep playmaker', stat: '91%', sub: 'pass accuracy', color: 'blue', active: state.focusPlayer === 'J. Alvarez' },
    { name: 'M. Okafor', role: 'Centre back', stat: '7', sub: 'recoveries', color: 'orange', active: state.focusPlayer === 'M. Okafor' }
  ];

  document.querySelector('#app').innerHTML = `
    <div class="app-shell ${casual ? 'casual-mode' : ''}">
      <div class="scroll-orbit" aria-hidden="true"><span class="orbit-line"></span><span class="scroll-ball"><i></i><b></b><em></em></span><small>SCROLL / EXPLORE</small></div>
      <header class="topbar">
        <a class="brand" href="#top" aria-label="MatchMind home"><span class="brand-mark"><i></i><i></i><i></i></span><span>match<span>mind</span></span></a>
        <nav class="topnav"><a class="active" href="#live">Live room</a><a href="#recap">Recap</a><a href="#highlights">Highlights</a><a href="#tactical-lab">Tactical lab</a><a href="#dataset">Dataset</a><a href="#ask">Ask the match</a><a href="#impact">Impact</a></nav>
        <div class="top-actions">
          <span class="live-indicator"><span></span> Live sync</span>
          <button class="icon-btn" aria-label="Toggle sound">${icons.volume}</button>
          <label class="language-select">${icons.globe}<select id="language-select" aria-label="Language">${languageOptions.map(language => `<option ${state.language === language ? 'selected' : ''}>${language}</option>`).join('')}</select>${icons.chevron}</label>
          <div class="avatar">AK</div>
        </div>
      </header>

      <main id="top">
        <section class="intro-section">
          <div>
            <p class="eyebrow">MATCHMIND / ${state.isLive ? 'LIVE MATCH INTELLIGENCE' : 'MATCH ARCHIVE'}</p>
            <h1>${copy.heroLine1}<br /><em>${copy.heroLine2}</em></h1>
            <p class="brand-tagline">${copy.tagline}</p>
            <p class="intro-copy">${copy.intro}</p><div class="language-active-note">${icons.globe}<span>${copy.translated}</span></div><div id="tech-text-mount" class="tech-text-mount"></div>
          </div>
          <div class="intro-actions">
            <button class="secondary-btn" id="refresh-sim">${icons.refresh}<span>Simulate next event</span></button>
            <button class="secondary-btn" id="guided-demo">${icons.play}<span>Guided demo</span></button><button class="primary-btn" id="generate-recap">Generate recap <span>↗</span></button>
          </div>
        </section>

        <section class="status-strip">
          <div class="status-cell"><span class="status-dot mint"></span><div><small>EVENT STREAM</small><strong>Connected</strong></div></div>
          <div class="status-cell"><span class="status-icon">${icons.activity}</span><div><small>EVENTS PROCESSED</small><strong>${casual ? '1,248' : '1,248'} <b>+18 this half</b></strong></div></div>
          <div class="status-cell"><span class="status-icon">${icons.clock}</span><div><small>LATENCY</small><strong>380 ms <b>optimal</b></strong></div></div>
          <div class="status-cell status-audience"><span class="status-icon">${icons.target}</span><div><small>VIEWER MODE</small><strong>${casual ? 'Casual fan' : 'Analyst'} <b>personalized</b></strong></div></div>
        </section>
        ${state.guidedDemo ? `<section class="guided-demo panel"><div><span class="demo-kicker">GUIDED DEMO / ${state.demoStep + 1} OF ${demoSteps().length}</span><h2>${demoSteps()[state.demoStep].title}</h2><p>${demoSteps()[state.demoStep].copy}</p></div><div class="demo-actions"><button class="secondary-btn" id="demo-close">Exit</button><button class="primary-btn" id="demo-next">${state.demoStep === demoSteps().length - 1 ? 'Finish demo' : 'Next step'} <span>→</span></button></div><div class="demo-progress">${demoSteps().map((step, index) => `<i class="${index <= state.demoStep ? 'active' : ''}"></i>`).join('')}</div></section>` : ''}

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
            <div class="timeline"><div class="timeline-top"><span>00:00</span><span>HALF-TIME</span><span>90:00</span></div><div class="timeline-line"><i style="width:76%"></i><b style="left:76%"></b><span class="timeline-event one" style="left:62%"></span><span class="timeline-event two" style="left:70%"></span></div><div class="timeline-controls"><button class="playback-btn" id="timeline-play" aria-label="${state.timelinePlaying ? 'Pause' : 'Play'} timeline">${state.timelinePlaying ? icons.pause : icons.play}</button><span class="playback-label">${state.timelinePlaying ? 'Live playback' : 'Replay paused'}</span><div class="speed-controls">${[0.5, 1, 2, 4].map(speed => `<button class="${state.timelineSpeed === speed ? 'active' : ''}" data-speed="${speed}">${speed}×</button>`).join('')}</div><button class="replay-btn" id="replay-timeline">${icons.refresh} Replay from start</button></div></div>
          </article>

          <article class="panel decoded-panel">
            <div class="panel-header"><div><p class="eyebrow">MOMENT DECODED</p><h2>${selected.type.toLowerCase()} / ${selected.time}</h2></div><span class="confidence">${icons.target} 94% confidence</span></div>
            <div class="persona-tabs">${['Analyst', 'Casual fan', 'Broadcaster', 'Social editor'].map(persona => `<button class="${state.persona === persona ? 'active' : ''}" data-persona="${persona}">${persona}</button>`).join('')}</div><div class="moment-callout ${selected.tone}"><span class="moment-icon">${icons[selected.icon]}</span><div><strong>${selected.title}</strong><p>${state.persona === 'Casual fan' ? 'A quick recovery puts Atlético Norte back on the front foot.' : state.persona === 'Social editor' ? 'The press that changed the match: Medina wins it high and creates a new attacking window.' : selected.detail}</p></div></div>
            <div class="why-block"><div class="why-title"><span class="mini-spark">${icons.bolt}</span><span>WHY IT MATTERS</span><span class="line"></span></div><p>${selected.why}</p><div class="evidence-mini"><span>${icons.target}</span><b>Verified against 12 events</b><small>pitch coordinates · linked action · pressure pattern</small></div></div>
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

        <section class="history-section" id="history"><div class="section-heading"><div><p class="eyebrow">MATCH ARCHIVE / SYNTHETIC DATASET</p><h2>Form becomes context.</h2></div><p>Historical event data gives the live story a baseline: what is normal for Atlético Norte, and what is changing tonight?</p></div><div class="history-grid"><article class="panel history-overview"><div class="panel-header"><div><p class="eyebrow">ATLÉTICO NORTE / ${historyLabel.toUpperCase()}</p><h2>Previous match intelligence</h2></div><label class="history-select"><span>COMPARE</span><select id="history-select" aria-label="Choose historical match"><option value="all" ${state.historyMatch === 'all' ? 'selected' : ''}>Last 5 matches</option>${previousMatches.map(match => `<option value="${match.id}" ${state.historyMatch === match.id ? 'selected' : ''}>${match.date} · ${match.opponent}</option>`).join('')}</select>${icons.chevron}</label></div><div class="history-kpis"><div><small>FORM</small><strong>${history.record}</strong><span>${history.points} points</span></div><div><small>AVG POSSESSION</small><strong>${history.possession}<b>%</b></strong><span>${history.possession >= 55 ? 'above' : 'below'} league median</span></div><div><small>PASS ACCURACY</small><strong>${history.passAccuracy}<b>%</b></strong><span>${history.passAccuracy >= 87 ? 'clean circulation' : 'room to improve'}</span></div><div><small>AVG xG</small><strong>${history.xg}</strong><span>per match</span></div></div><div class="history-bars"><div class="bar-row"><span>Pressure recoveries</span><div><i style="width:${Math.min(100, Number(history.pressure) * 5.5)}%"></i></div><strong>${history.pressure}</strong></div><div class="bar-row"><span>Shots per match</span><div><i class="blue-fill" style="width:${Math.min(100, Number(history.shots) * 5)}%"></i></div><strong>${history.shots}</strong></div><div class="bar-row"><span>Distance covered</span><div><i class="orange-fill" style="width:${Math.min(100, Number(history.distance) - 70)}%"></i></div><strong>${history.distance} km</strong></div></div></article><article class="panel matches-panel"><div class="panel-header"><div><p class="eyebrow">RECENT RESULTS</p><h2>Five-match form</h2></div><span class="sample-label">${icons.activity} sample data</span></div><div class="match-table"><div class="match-table-head"><span>DATE</span><span>OPPONENT</span><span>RESULT</span><span>POS</span><span>PASS</span></div>${previousMatches.map(match => `<button class="match-table-row ${state.historyMatch === match.id ? 'selected' : ''}" data-history="${match.id}"><span>${match.date}</span><span><b>${match.venue}</b> ${match.opponent}</span><span>${formPill(match.result)} <em>${match.score}</em></span><span>${match.possession}%</span><span>${match.passAccuracy}%</span></button>`).join('')}</div><div class="history-note"><span>${icons.bolt}</span><p><b>Pattern detected:</b> ${history.possession >= 55 ? 'possession and pressure rise together in Atlético Norte wins.' : 'the selected match shows a lower-control game state than the recent baseline.'}</p></div></article></div></section>

        <section class="agent-section" id="architecture"><div class="section-heading"><div><p class="eyebrow">AGENT SYSTEM / ORCHESTRATION TRACE</p><h2>From raw event to human story.</h2></div><p>A transparent five-stage pipeline keeps every insight explainable, machine-readable, and ready for live production workflows.</p></div><div class="agent-layout"><article class="panel pipeline-panel"><div class="pipeline-head"><div><span class="trace-status"><i></i> processing live event</span><strong>${agentTrace.envelope.event_id}</strong></div><span class="latency-chip">${agentTrace.envelope.received_at_ms} ms end-to-end</span></div><div class="pipeline-flow">${pipelineStages.map((stage, index) => `<div class="pipeline-stage ${stage.color}"><div class="stage-number">${stage.number}</div><div class="stage-copy"><span>${stage.label}</span><strong>${stage.title}</strong><small>${stage.description}</small><em>${stage.output}</em></div>${index < pipelineStages.length - 1 ? '<span class="stage-connector">→</span>' : ''}</div>`).join('')}</div><div class="trace-result"><span class="result-icon">${icons.bolt}</span><div><small>AGENT OUTPUT / EVIDENCE-BACKED EXPLANATION</small><p>${agentTrace.explanation.rationale}</p><small class="counterfactual">Counterfactual: ${agentTrace.explanation.counterfactual}</small><span class="evidence-tags">${agentTrace.explanation.evidence.map(item => `<b>${item}</b>`).join('')}</span></div><span class="trace-confidence">94%<small>confidence</small></span></div></article><article class="panel implementation-panel"><div class="panel-header"><div><p class="eyebrow">IMPLEMENTATION CONTRACT</p><h2>Built to plug in.</h2></div><span class="connector-ready">● connector-ready</span></div><div class="stack-list"><div><span class="stack-logo foundry">F</span><p><strong>Foundry / narrative agents</strong><small>Replace the local demo runner with managed model routing and evaluation.</small></p></div><div><span class="stack-logo fabric">▦</span><p><strong>Fabric / event lakehouse</strong><small>Stream synthetic or tracking-provider events into durable match state.</small></p></div><div><span class="stack-logo mcp">⌘</span><p><strong>Azure MCP / tool layer</strong><small>Expose match state, player focus, and overlay rendering as governed tools.</small></p></div><div><span class="stack-logo azure">◆</span><p><strong>Azure database / API</strong><small>Persist match metadata, audience preferences, replayable narratives, and audit traces.</small></p></div></div><div class="schema-preview"><div><span>EVENT CONTRACT / v1</span><b>${syntheticEventSchema.length} fields</b></div>${syntheticEventSchema.slice(0, 4).map(field => `<code><i>${field[0]}</i><span>${field[1]}</span><b>${field[2]}</b></code>`).join('')}<small>+ ${syntheticEventSchema.length - 4} more fields · schema validated</small></div></article></div></section>

        <section class="recap-section" id="recap"><div class="section-heading"><div><p class="eyebrow">RECAP STUDIO / ONE CLICK OUTPUTS</p><h2>Turn the match into the story.</h2></div><p>Generate a full report, a 60-second voiceover, a thread, or a caption from the same verified event evidence.</p></div><div class="recap-grid"><article class="panel recap-panel"><div class="recap-tabs">${Object.keys(recapOutputs).map(tab => `<button class="${state.recapTab === tab ? 'active' : ''}" data-recap-tab="${tab}">${tab}</button>`).join('')}</div><div class="recap-output"><span class="recap-label">${recapOutputs[state.recapTab].label}</span><h3>${recapOutputs[state.recapTab].title}</h3><p>${recapOutputs[state.recapTab].body}</p></div><div class="recap-actions"><button class="secondary-btn" id="copy-recap">Copy output</button><button class="secondary-btn" id="export-recap">Export .txt <span>↗</span></button><span class="generated-label">${icons.activity} grounded in 12 cited events</span></div></article><article class="panel recap-side"><span class="eyebrow">HIGHLIGHT QUEUE</span><div class="highlight-row"><span>01</span><div><strong>Pressure forced the turnover</strong><small>68:41 · +0.31 xT · L. Medina</small></div><b>HIGH</b></div><div class="highlight-row"><span>02</span><div><strong>Line-breaking pass</strong><small>67:12 · 32m · J. Alvarez</small></div><b>MED</b></div><div class="highlight-row"><span>03</span><div><strong>Shot from a shrinking window</strong><small>63:08 · 0.18 xG · R. Silva</small></div><b>MED</b></div><div class="recap-confidence">${icons.target}<span>All outputs pass the evidence check</span><strong>94%</strong></div></article></div></section>

        <section class="highlight-builder-section" id="highlights"><div class="section-heading"><div><p class="eyebrow">AUTO-HIGHLIGHT AGENT / EVENT TO CLIP</p><h2>Find the moments worth replaying.</h2></div><p>MatchMind scores turning points from event density, tactical swing, expected threat, and narrative value — then packages the evidence for fans, studios, and streaming overlays.</p></div><div class="highlight-builder-grid"><article class="panel highlight-builder"><div class="highlight-builder-head"><div><span class="eyebrow">HIGHLIGHT QUEUE / ${state.highlightReady ? 'READY' : 'SCANNING'}</span><h3>${state.highlightReady ? 'Three clips are ready to package.' : 'Scanning the live event window…'}</h3></div><button class="primary-btn" id="generate-highlights">${state.highlightReady ? 'Regenerate queue' : 'Generate highlights'} <span>↗</span></button></div><div class="highlight-timeline">${highlightScenes.map((scene, index) => `<button class="highlight-scene ${state.highlightReady ? 'ready' : ''}" data-highlight-time="${scene.time}"><span class="scene-index">0${index + 1}</span><span><b>${scene.time} · ${scene.tag}</b><strong>${scene.title}</strong><small>${scene.detail}</small></span><em>${state.highlightReady ? 'CLIP READY' : 'AI SCORE'}</em></button>`).join('')}</div></article><article class="panel clip-output"><p class="eyebrow">OUTPUT CONTRACT</p><div class="clip-icon">▶</div><h3>${state.highlightReady ? 'Highlight package generated' : 'No clip exported yet'}</h3><p>${state.highlightReady ? '3 clips · 00:42 total · captions + evidence attached' : 'Generate a queue to create clip metadata, captions, and broadcast-safe context.'}</p><div class="clip-tags"><span>video moment</span><span>caption</span><span>evidence</span></div></article></div></section>

        <section class="tactical-lab-section" id="tactical-lab"><div class="section-heading"><div><p class="eyebrow">TACTICAL LAB / MATCH SHAPE</p><h2>See the shape behind the score.</h2></div><p>Three complementary views turn the event stream into a coachable match picture: who connected, where pressure landed, and how shots were created.</p></div><div class="lab-tabs">${['Passing network', 'Pressing intensity', 'Shot map'].map(tab => `<button class="${state.tacticalTab === tab ? 'active' : ''}" data-tactical-tab="${tab}">${tab}</button>`).join('')}</div><div class="lab-grid"><article class="panel lab-chart"><div class="panel-header"><div><p class="eyebrow">${state.tacticalTab.toUpperCase()}</p><h2>${state.tacticalTab === 'Passing network' ? 'The left side is the live wire.' : state.tacticalTab === 'Pressing intensity' ? 'Pressure arrives in waves.' : 'Shots came before the window closed.'}</h2></div><span class="chart-badge">SYNTHETIC / 68:42</span></div>${state.tacticalTab === 'Passing network' ? `<svg class="lab-svg network-svg" viewBox="0 0 700 260"><path d="M70 170 Q170 50 350 130 T625 80M70 170 Q250 220 350 130 T625 80M180 65 Q350 130 520 205M180 65 L350 130 L520 205" fill="none" stroke="#79c9ff" stroke-opacity=".35" stroke-width="2" stroke-dasharray="5 6"/><circle cx="70" cy="170" r="18" fill="#a1ffc7"/><circle cx="180" cy="65" r="14" fill="#79c9ff"/><circle cx="350" cy="130" r="21" fill="#a1ffc7"/><circle cx="520" cy="205" r="14" fill="#79c9ff"/><circle cx="625" cy="80" r="17" fill="#f6a37b"/><text x="48" y="210">OKAFOR</text><text x="155" y="42">ALVAREZ</text><text x="321" y="170">MEDINA</text><text x="494" y="240">SILVA</text><text x="600" y="55">WIDE</text></svg>` : state.tacticalTab === 'Pressing intensity' ? `<svg class="lab-svg" viewBox="0 0 700 260"><path d="M20 210 C85 205 90 90 150 130 S210 225 270 150 S340 65 400 125 S465 220 520 100 S610 55 680 75" fill="none" stroke="#a1ffc7" stroke-width="5"/><path d="M20 210 C85 205 90 90 150 130 S210 225 270 150 S340 65 400 125 S465 220 520 100 S610 55 680 75 L680 250 L20 250Z" fill="#a1ffc7" fill-opacity=".08"/><line x1="20" y1="210" x2="680" y2="210" stroke="#829e97" stroke-opacity=".2"/><line x1="20" y1="130" x2="680" y2="130" stroke="#829e97" stroke-opacity=".2"/><text x="25" y="246">50'</text><text x="325" y="246">60'</text><text x="640" y="246">68'</text></svg>` : `<svg class="lab-svg shot-svg" viewBox="0 0 700 260"><rect x="40" y="25" width="620" height="210" rx="10" fill="#11352d" stroke="#a9e6bf" stroke-opacity=".35"/><path d="M350 25v210M40 75h70v110H40M660 75h-70v110h70" fill="none" stroke="#a9e6bf" stroke-opacity=".4"/><circle cx="520" cy="100" r="12" fill="#a1ffc7"/><circle cx="475" cy="125" r="9" fill="#79c9ff"/><circle cx="560" cy="150" r="7" fill="#f6a37b"/><circle cx="405" cy="155" r="6" fill="#79c9ff"/><text x="500" y="80">0.18 xG</text></svg>`}<div class="lab-insight"><span>${icons.bolt}</span><p><b>AI reading:</b> ${state.tacticalTab === 'Passing network' ? 'Medina is the connector between the first pressure escape and the final-third entry.' : state.tacticalTab === 'Pressing intensity' ? 'The strongest wave follows a turnover, not a restart — evidence of reactive control.' : 'Three shots arrived from the right half-space; only one beat the closing angle.'}</p></div></article><article class="panel lab-metrics"><p class="eyebrow">MATCH LENS</p><div class="lab-metric"><span>NETWORK CENTRALITY</span><strong>0.68</strong><small>Medina · +21% vs team avg.</small></div><div class="lab-metric"><span>PRESS RECOVERIES</span><strong>11</strong><small>6 in attacking third</small></div><div class="lab-metric"><span>SHOT QUALITY</span><strong>0.74 xG</strong><small>3 shots · 2 on target</small></div><div class="lab-note">${icons.target} Pattern evidence is visible beside every chart, not hidden behind a model label.</div></article></div></section>

        <section class="dataset-forge-section" id="dataset"><div class="section-heading"><div><p class="eyebrow">DATASET FORGE / AI-READY EXPANSION</p><h2>Grow the training signal.</h2></div><p>Expand a compact match into labelled, football-realistic events for analytics, evaluation, and future model fine-tuning.</p></div><div class="dataset-forge-grid"><article class="panel dataset-forge"><div class="dataset-top"><div><span class="eyebrow">MATCH EVENT CONTRACT / v1</span><h3>${state.datasetSize} events indexed</h3></div><button class="primary-btn" id="expand-dataset">Generate 5 events <span>＋</span></button></div><div class="dataset-fields"><span>timestamp</span><span>event_type</span><span>team_id</span><span>player_id</span><span>location</span><span>outcome</span><span>pressure</span><span>xT_added</span></div><div class="dataset-progress"><i style="width:${Math.min(100, state.datasetSize / 50 * 100)}%"></i></div><div class="dataset-foot"><span>${icons.activity} ${state.datasetSize > 25 ? state.datasetSize - 25 : 0} generated in this session</span><span>labels validated · coordinates linked · schema checked</span></div></article><article class="panel dataset-purpose"><p class="eyebrow">WHY IT MATTERS</p><h3>More data, better questions.</h3><div><b>Analytics</b><span>training-ready event rows</span></div><div><b>AI evaluation</b><span>repeatable ground-truth cases</span></div><div><b>Product iteration</b><span>new patterns without new UI</span></div></article></div></section>

        <section class="ask-section" id="ask"><div class="section-heading"><div><p class="eyebrow">ASK THE MATCH / GROUNDED CHAT</p><h2>Ask why. Get the evidence.</h2></div><p>A match-aware chat agent answers only from the synthetic event stream and cites the timestamps that support each answer.</p></div><div class="ask-grid"><article class="panel ask-panel"><div class="ask-head"><span class="ask-status"><i></i> grounded agent online</span><span>MOCK MODE · no API key required</span></div><div class="chat-messages">${state.askMessages.length ? state.askMessages.map(message => `<div class="chat-message ${message.role}"><span>${message.role === 'user' ? 'YOU' : 'MATCHMIND'}</span><p>${message.text}</p>${message.citations ? `<div class="citations">${message.citations.map(citation => `<button data-citation="${citation}">↗ ${citation}</button>`).join('')}</div>` : ''}</div>`).join('') : `<div class="chat-empty"><span>${icons.target}</span><strong>What do you want to know?</strong><p>Try a suggested question or ask in your own words.</p></div>`}</div><div class="suggested-questions">${['Why did the press fail after the 60th minute?', 'Who changed the match?', 'How did Atlético gain control?'].map(question => `<button data-question="${question}">${question}</button>`).join('')}</div><form class="ask-form" id="ask-form"><input id="ask-input" value="${state.askQuery}" placeholder="Ask about the match…" aria-label="Ask the match" /><button class="primary-btn" type="submit">Ask <span>↗</span></button></form></article><article class="panel grounding-panel"><p class="eyebrow">GROUNDING CONTRACT</p><h2>No invented stats.</h2><div class="grounding-rule"><span>01</span><p><b>Retrieve</b> linked events from the match envelope.</p></div><div class="grounding-rule"><span>02</span><p><b>Reason</b> over patterns already detected in the feed.</p></div><div class="grounding-rule"><span>03</span><p><b>Cite</b> every answer with match-clock evidence.</p></div><div class="grounding-footer">${icons.activity}<span>12 evidence events available</span></div></article></div></section>

        <section class="audience-section"><div class="section-heading"><div><p class="eyebrow">PERSONALIZATION / DELIVERY SURFACES</p><h2>Same truth. Different destination.</h2></div><p>Choose the surface that should receive the insight. The event facts stay stable while the format, density, and action change for each audience.</p></div><div class="audience-tabs">${Object.keys(audienceModes).map(mode => `<button class="${state.audience === mode ? 'active' : ''}" data-audience="${mode}">${mode}</button>`).join('')}</div><div class="audience-preview panel"><div class="audience-preview-mark">${state.audience === 'Fan View' ? '01' : state.audience === 'Studio Desk' ? '02' : '03'}</div><div><span class="eyebrow">${audienceModes[state.audience].output}</span><h3>${audienceModes[state.audience].label} receives the next insight.</h3><p>${audienceModes[state.audience].copy}</p><div class="audience-payload"><span>68:41</span><b>Pressure forced the turnover</b><em>${state.audience === 'Studio Desk' ? 'LOWER THIRD READY' : state.audience === 'Streaming Platform' ? 'IN-STREAM CARD READY' : 'PLAIN-LANGUAGE READY'}</em></div></div></div></section>

        <section class="impact-section" id="impact"><div class="section-heading"><div><p class="eyebrow">IMPACT / WHO BENEFITS</p><h2>More people can read the game.</h2></div><p>MatchMind makes advanced football intelligence useful without assuming everyone watches, speaks, or analyzes the game in the same way.</p></div><div class="impact-grid">${[['01', 'Fans', 'Plain-language explanations turn a fast match into a story anyone can follow.'], ['02', 'Broadcasters', 'Verified lines, overlays, and 60-second scripts reduce the distance from event to air.'], ['03', 'Accessibility users', 'Multilingual, low-jargon narrative gives more viewers an equal way into the match.'], ['04', 'Emerging markets', 'A provider-neutral event contract makes local data and local language a first-class path.']].map(item => `<article class="panel impact-card"><span>${item[0]}</span><h3>${item[1]}</h3><p>${item[2]}</p></article>`).join('')}</div><div class="roadmap panel"><div><p class="eyebrow">ROADMAP / NEXT 3 BUILDS</p><h2>From demo to matchday infrastructure.</h2></div><div class="roadmap-items"><span><b>01</b> Live provider adapters</span><span><b>02</b> Azure AI evaluation loop</span><span><b>03</b> Saved clubs, notes, and recaps</span></div></div></section>

        <section class="catalog-section" id="catalog"><div class="section-heading"><div><p class="eyebrow">TACTICAL CATALOGUE / PATTERN LIBRARY</p><h2>Search the match for patterns.</h2></div><p>Turn a live moment into a reusable tactical reference. Search by team, pattern, or the question you want to ask next.</p></div><div class="catalog-toolbar"><label class="catalog-search">${icons.target}<input id="catalog-search" value="${state.catalogQuery}" placeholder="Search patterns, phases, or players…" aria-label="Search tactical catalogue" /></label><div class="catalog-filters">${['All', 'Pressing wave', 'Build-up pattern', 'Territory pattern', 'Game-state pattern'].map(filter => `<button class="${state.catalogFilter === filter ? 'active' : ''}" data-catalog-filter="${filter}">${filter}</button>`).join('')}</div></div><div class="catalog-grid">${catalogItems.length ? catalogItems.map(item => `<button class="panel catalog-card ${item.color}" data-catalog-card="${item.title}"><div class="catalog-card-top"><span class="catalog-type">${item.type}</span><span>${item.count} ${icons.chevron}</span></div><h3>${item.title}</h3><p>${item.summary}</p><div class="catalog-tags">${item.tags.map(tag => `<span>${tag}</span>`).join('')}</div></button>`).join('') : '<div class="panel empty-catalog">No matching tactical patterns. Try “pressure” or “possession”.</div>'}</div></section>

        <section class="reasoning-section"><div class="section-heading"><div><p class="eyebrow">EXPLAINABILITY / AUDIT TRAIL</p><h2>Every claim has a trail.</h2></div><p>Before a sentence reaches the viewer, MatchMind checks the event, its links, its pattern, and the numbers inside the draft.</p></div><div class="reasoning-steps">${['Event ingestion', 'Data audit', 'Pattern detection', 'Evidence retrieval', 'Explanation', 'Claim verification'].map((step, index) => `<div class="reasoning-step"><span>0${index + 1}</span><strong>${step}</strong><small>${['Read and normalize the incoming event envelope.', 'Validate ids, teams, players, locations, and links.', 'Scan for pressing waves, counterattacks, spells, and turnovers.', 'Retrieve the supporting events that the explanation rests on.', 'Compose the selected persona’s answer from retrieved evidence.', 'Re-read every number and citation against the source dataset.'][index]}</small></div>`).join('')}</div></section>

        <section class="narrative-section" id="narrative"><div class="section-heading"><div><p class="eyebrow">NARRATIVE STUDIO / GENERATIVE STORYTELLING</p><h2>One match. Your way in.</h2></div><p>MatchMind adapts the same underlying intelligence to the person watching — from tactical depth to a clean, human story.</p></div><div class="narrative-grid"><article class="panel story-panel"><div class="story-top"><div class="mode-tabs"><button class="${state.mode === 'analyst' ? 'active' : ''}" data-mode="analyst">Analyst mode</button><button class="${state.mode === 'casual' ? 'active' : ''}" data-mode="casual">Casual fan mode</button></div><span class="generated-label">${icons.activity} generated live</span></div><div class="story-body"><span class="quote-mark">“</span><p class="story-quote">${state.mode === 'analyst' ? narrative.analyst : narrative.casual}</p><div class="story-tags"><span>pressure context</span><span>player-aware</span><span>plain language</span></div></div><div class="story-footer"><span>${icons.clock} Updated after 68:41</span><button class="text-btn" id="more-story">Expand story ${icons.arrowUp}</button></div></article><article class="panel modes-panel"><div class="panel-header"><div><p class="eyebrow">YOUR MATCH / PREFERENCES</p><h2>Make it yours</h2></div>${icons.settings}</div><div class="preference-row"><div class="preference-icon mint">${icons.star}</div><div><strong>Favorite club</strong><small>Prioritize their key moments</small></div><span class="preference-value">Atlético Norte ${icons.chevron}</span></div><div class="preference-row"><div class="preference-icon blue">${icons.target}</div><div><strong>Player focus</strong><small>Follow one player all match</small></div><span class="preference-value">${state.focusPlayer} ${icons.chevron}</span></div><div class="preference-row"><div class="preference-icon orange">${icons.globe}</div><div><strong>Story language</strong><small>Natural-language output</small></div><span class="preference-value">${state.language} ${icons.chevron}</span></div><button class="manage-btn">Manage viewing experience <span>↗</span></button></article></div></section>
      </main>
      <footer class="footer"><div class="brand footer-brand"><span class="brand-mark"><i></i><i></i><i></i></span><span>match<span>mind</span></span></div><span>Explainable intelligence for every football story.</span><span class="footer-right">Synthetic data environment · v0.9.4</span></footer>
      ${state.toast ? `<div class="toast">${icons.activity}<span>${state.toast}</span></div>` : ''}
    </div>
  `;
  bindInteractions();
  bindScrollMotion();
  mountTechText(document.querySelector('#tech-text-mount'), { text: 'MATCHMIND', fontSize: 58, accentColor: '#a1ffc7' });
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
  document.querySelectorAll('[data-history]').forEach(button => button.addEventListener('click', () => {
    state.historyMatch = button.dataset.history;
    render();
    document.querySelector('#history')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  document.querySelector('#history-select')?.addEventListener('change', event => {
    state.historyMatch = event.target.value;
    render();
  });
  document.querySelector('#timeline-play')?.addEventListener('click', () => { state.timelinePlaying = !state.timelinePlaying; state.isLive = state.timelinePlaying; render(); });
  document.querySelector('#replay-timeline')?.addEventListener('click', () => { state.elapsed = 0; state.timelinePlaying = true; state.isLive = true; state.toast = 'Timeline replay restarted from kick-off.'; render(); window.setTimeout(() => { state.toast = ''; render(); }, 2200); });
  document.querySelectorAll('[data-speed]').forEach(button => button.addEventListener('click', () => { state.timelineSpeed = Number(button.dataset.speed); state.toast = `Replay speed set to ${button.dataset.speed}×.`; render(); window.setTimeout(() => { state.toast = ''; render(); }, 1800); }));
  document.querySelectorAll('[data-persona]').forEach(button => button.addEventListener('click', () => { state.persona = button.dataset.persona; render(); }));
  document.querySelectorAll('[data-catalog-filter]').forEach(button => button.addEventListener('click', () => { state.catalogFilter = button.dataset.catalogFilter; render(); }));
  document.querySelector('#catalog-search')?.addEventListener('input', event => { state.catalogQuery = event.target.value; render(); const search = document.querySelector('#catalog-search'); search?.focus(); search?.setSelectionRange(state.catalogQuery.length, state.catalogQuery.length); });
  document.querySelectorAll('[data-catalog-card]').forEach(button => button.addEventListener('click', () => { state.toast = `${button.dataset.catalogCard} opened as a tactical breakdown.`; render(); window.setTimeout(() => { state.toast = ''; render(); }, 2200); }));
  document.querySelector('#language-select')?.addEventListener('change', event => { state.language = event.target.value; state.toast = `${uiCopy[state.language]?.translated || state.language} — narrative and hero copy updated.`; render(); window.setTimeout(() => { state.toast = ''; render(); }, 2200); });
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
  document.querySelector('#guided-demo')?.addEventListener('click', () => { state.guidedDemo = true; state.demoStep = 0; render(); });
  document.querySelector('#demo-close')?.addEventListener('click', () => { state.guidedDemo = false; render(); });
  document.querySelector('#demo-next')?.addEventListener('click', () => { if (state.demoStep >= demoSteps().length - 1) { state.guidedDemo = false; state.toast = 'Guided demo complete — explore any surface to continue.'; render(); window.setTimeout(() => { state.toast = ''; render(); }, 2600); return; } state.demoStep += 1; render(); document.querySelector(demoSteps()[state.demoStep].target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  document.querySelectorAll('[data-recap-tab]').forEach(button => button.addEventListener('click', () => { state.recapTab = button.dataset.recapTab; render(); }));
  document.querySelector('#copy-recap')?.addEventListener('click', async () => { const output = recapOutputs[state.recapTab]; try { await navigator.clipboard?.writeText(`${output.title}\n\n${output.body}`); } catch {} state.toast = 'Recap output copied to clipboard.'; render(); window.setTimeout(() => { state.toast = ''; render(); }, 2200); });
  document.querySelector('#export-recap')?.addEventListener('click', () => { const output = recapOutputs[state.recapTab]; const blob = new Blob([`${output.title}\n\n${output.body}`], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `matchmind-${state.recapTab.toLowerCase().replaceAll(' ', '-')}.txt`; link.click(); URL.revokeObjectURL(url); });
  document.querySelectorAll('[data-tactical-tab]').forEach(button => button.addEventListener('click', () => { state.tacticalTab = button.dataset.tacticalTab; render(); }));
  document.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => { state.askQuery = button.dataset.question; const input = document.querySelector('#ask-input'); if (input) { input.value = state.askQuery; input.focus(); } }));
  document.querySelector('#ask-form')?.addEventListener('submit', event => { event.preventDefault(); const input = document.querySelector('#ask-input'); const query = input?.value.trim(); if (!query) return; const result = askAnswer(query); state.askQuery = ''; state.askMessages = [...state.askMessages, { role: 'user', text: query }, { role: 'agent', text: result.answer, citations: result.citations }]; render(); document.querySelector('#ask-input')?.focus(); });
  document.querySelectorAll('[data-citation]').forEach(button => button.addEventListener('click', () => { const event = events.find(item => item.time === button.dataset.citation); if (event) { state.selectedEvent = event.id; render(); document.querySelector('#live')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }));
  document.querySelector('#generate-highlights')?.addEventListener('click', () => { state.highlightReady = true; state.toast = 'Highlight queue generated from event density, xT swing, and tactical value.'; render(); window.setTimeout(() => { state.toast = ''; render(); }, 2600); });
  document.querySelectorAll('[data-highlight-time]').forEach(button => button.addEventListener('click', () => { const event = events.find(item => item.time === button.dataset.highlightTime); if (event) { state.selectedEvent = event.id; state.toast = `Jumped to ${button.dataset.highlightTime} — highlight evidence loaded.`; render(); window.setTimeout(() => { state.toast = ''; render(); }, 2200); } }));
  document.querySelector('#expand-dataset')?.addEventListener('click', () => { state.datasetSize += 5; state.toast = 'Five labelled football-realistic events added to the AI-ready dataset.'; render(); window.setTimeout(() => { state.toast = ''; render(); }, 2400); });
  document.querySelectorAll('[data-audience]').forEach(button => button.addEventListener('click', () => { state.audience = button.dataset.audience; render(); }));
}

render();
window.setInterval(() => {
  if (!state.isLive) return;
  state.elapsed += state.timelineSpeed;
  const clock = document.querySelector('.score-time b');
  if (clock) clock.textContent = formatClock(state.elapsed);
}, 1000);
