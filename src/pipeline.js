// MatchMind's local demo pipeline mirrors a production agent workflow.
// Each stage is deterministic so judges can inspect the transformation from raw events to viewer output.

export const pipelineStages = [
  { id: 'ingest', number: '01', label: 'Ingest', title: 'Event stream', description: 'Accepts synthetic passes, shots, tackles, pressure events, possession changes, and match metadata.', color: 'blue', output: 'Normalized event envelope' },
  { id: 'interpret', number: '02', label: 'Interpret', title: 'Football state', description: 'Aggregates event windows into possession, threat, tempo, passing quality, and pressure states.', color: 'purple', output: 'State + feature vector' },
  { id: 'explain', number: '03', label: 'Explain', title: 'Why it matters', description: 'Links a moment to game context: control versus chaos, space gained, and the opponent response.', color: 'mint', output: 'Evidence-backed rationale' },
  { id: 'render', number: '04', label: 'Render', title: 'Broadcast output', description: 'Produces compact overlay-safe insight objects for live graphics, studio copy, and streaming UI.', color: 'orange', output: 'Overlay + narrative payload' },
  { id: 'personalize', number: '05', label: 'Personalize', title: 'Audience layer', description: 'Adapts the same intelligence for analyst, casual fan, favorite club, player focus, and language.', color: 'pink', output: 'Viewer-specific experience' }
];

export const syntheticEventSchema = [
  ['event_id', 'string', 'evt_68_041'],
  ['event_type', 'enum', 'pressure'],
  ['match_clock', 'number', 4121],
  ['player_id', 'string', 'p_014'],
  ['location', 'x/y', '[74, 38]'],
  ['speed_kmh', 'number', 18.4],
  ['difficulty', 'number', 0.81],
  ['possession_id', 'string', 'pos_882']
];

export function createSyntheticEnvelope(event = {}) {
  return {
    event_id: event.event_id || 'evt_68_041',
    event_type: event.event_type || 'pressure',
    match_clock: event.match_clock || 4121,
    player_id: event.player_id || 'p_014',
    location: event.location || [74, 38],
    speed_kmh: event.speed_kmh || 18.4,
    difficulty: event.difficulty || 0.81,
    possession_id: event.possession_id || 'pos_882',
    source: 'synthetic_match_stream',
    received_at_ms: 380,
    schema_version: 'matchmind.event.v1'
  };
}

export function interpretEvent(envelope) {
  const highValue = envelope.event_type === 'pressure' && envelope.location[0] > 60;
  return {
    control_index_delta: highValue ? 8.4 : 2.1,
    expected_threat_delta: highValue ? 0.31 : 0.08,
    state: highValue ? 'controlled transition' : 'stable possession',
    features: ['left-channel pressure', 'opponent facing own goal', 'high-value recovery']
  };
}

export function explainEvent(envelope, interpretation) {
  return {
    confidence: 0.94,
    evidence: interpretation.features,
    rationale: highLevelReason(envelope, interpretation),
    counterfactual: 'Without the pressure trigger, the opponent could have reset their back line before the next action.'
  };
}

function highLevelReason(envelope, interpretation) {
  return `${interpretation.state} increased expected threat by ${interpretation.expected_threat_delta.toFixed(2)} because the recovery happened in the attacking half.`;
}

export function personalizeInsight(explanation, mode = 'analyst', language = 'English') {
  const copy = mode === 'casual'
    ? 'A well-timed press won the ball back high up the pitch and put Atlético Norte on the front foot.'
    : explanation.rationale;
  return { mode, language, copy, overlay_safe: true, generated_by: 'MatchMind narrative agent' };
}

export function runAgentTrace(event = {}) {
  const envelope = createSyntheticEnvelope(event);
  const interpretation = interpretEvent(envelope);
  const explanation = explainEvent(envelope, interpretation);
  const personalized = personalizeInsight(explanation);
  return { envelope, interpretation, explanation, personalized };
}
