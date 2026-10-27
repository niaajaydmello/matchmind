# MatchMind submission

## Project description

MatchMind is an explainable football-intelligence workspace that turns live match events into stories people can understand and use. It simulates a football event stream, identifies tactical patterns, explains key moments in plain language, and adapts the same evidence to a casual fan, tactics nerd, broadcaster, or social-media editor. Viewers can replay the match, inspect a pitch and momentum view, generate recaps and social outputs, search a tactical catalogue, switch across seven languages, and ask grounded questions such as “Why did the press fail after the 60th minute?” Every answer points back to match-clock evidence. The demo uses fictional clubs and coherent synthetic data so the judging experience is deterministic, safe, and runnable without API keys. Its provider-neutral event contract is ready to connect to tracking providers, Azure AI, GitHub Models, Fabric, MCP tools, or an Azure database in a production build.

## Two-minute demo script

**0:00–0:15 — The problem.** Open MatchMind and say: “A scoreline tells us what happened. It does not tell every viewer why it mattered.” Point to the live match, pitch, and status strip.

**0:15–0:40 — Live event.** Click a feed event or use Simulate next event. Pause the timeline, change replay speed, and show the selected moment on the pitch. Read the What happened and Why it mattered cards.

**0:40–1:00 — Explainability.** Scroll to the agent trace and show Ingest, Interpret, Explain, Render, and Personalize. Highlight the cited evidence, confidence, and counterfactual. Explain that this keeps the demo from inventing stats.

**1:00–1:20 — Ask the match.** Open Ask the Match and submit “Why did the press fail after the 60th minute?” Show the answer and its 54:29, 59:44, and 68:41 citations.

**1:20–1:42 — Story outputs.** Open Recap Studio and switch from Match report to 60-second script, Tweet thread, and Instagram caption. Demonstrate Copy output or Export .txt.

**1:42–1:55 — Personalization.** Switch Analyst/Casual fan/Broadcaster/Social editor, then switch the language selector across the seven supported language labels. Point out that the underlying event facts stay stable while the telling changes.

**1:55–2:00 — Close.** Show Tactical Lab and Impact. Close with: “MatchMind makes more people able to read the game, and gives production teams a clear path from synthetic demo to governed matchday infrastructure.”

## Judging-criteria alignment

- **Technological implementation:** deterministic synthetic event contract, maintainable modules, responsive frontend, replay state, evidence citations, output exports, responsive CSS, reduced-motion handling, static build contract, and connector-ready boundaries for Azure/Fabric/MCP.
- **Agentic design and innovation:** the product models a transparent five-stage agent flow and a six-step evidence audit. Ask the Match is grounded to the event stream and returns cited timestamps. The provider seam supports MOCK mode now and managed AI routing later.
- **Real-world impact:** fans, analysts, broadcasters, accessibility users, social editors, and emerging-market audiences all receive a useful version of the same match truth.
- **User experience and presentation:** dark sports-tech visual system, guided demo, replay controls, tactical visualizations, multilingual/persona switches, scroll storytelling, mobile layout, and fast no-login demo path.
- **Hackathon category fit:** the product directly demonstrates real-time event analysis, generated recaps/narratives/highlights, plain-language tactical explanation, multilingual output, personalized modes, and an AI agent chat.

## What is mocked

The current demo uses fictional clubs, players, match events, charts, recap output, and chat answers. The Azure OpenAI/GitHub Models adapter, live sports provider adapter, persistent database, real auth, real video auto-eventing, and production evaluation loop are not connected. The README labels these as future integration seams rather than completed integrations.

## Direct requirement evidence

- **Real-time analysis:** Live Match Center simulates an incoming event stream, updates the match clock, highlights new events, and exposes a versioned event envelope plus a five-stage processing trace.
- **Stories, highlights, and recaps:** Narrative Studio and Recap Studio generate persona-specific stories and four output formats. Auto-Highlight Agent scores three turning points and produces a visible clip package contract with captions and evidence.
- **Tactical explanation:** Moment Decoded explains what happened, why it mattered, and what would have changed. Tactical Lab visualizes passing network, pressing intensity, and shot map evidence.
- **Dataset expansion:** Dataset Forge starts from the 25-event match JSON and interactively adds labelled event rows for analytics, evaluation, and future model training.
- **Global delivery:** The UI supports English, Hindi, Spanish, Arabic, Portuguese, French, and Mandarin labels plus persona-specific narrative modes.
- **Personalized destinations:** Delivery Surfaces explicitly demonstrate Fan View, Studio Desk, and Streaming Platform outputs from the same underlying event facts.
