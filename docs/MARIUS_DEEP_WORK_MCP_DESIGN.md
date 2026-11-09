# Marius Deep Work MCP — design proposal
Status: DESIGN ONLY. Not installed, connected or globally verified. CROWN HOLD.
Date: 2026-11-09.

Osayi is the user-facing guide. Marius orchestrates authorised tools behind her. Stephen's public prototype contains fictional examples and prerecorded Sovereign chapter audio.

## Browser coverage target
Worldwide compatibility is a target, not a claim of access to every browser. Track browser family, version, OS, automation adapter, session owner, permission scope and last test evidence. Chrome/Edge adapters, Firefox adapters, Safari/macOS adapters and iOS/Android device adapters require separate validation. A generic HTTP fetch does not prove rendering or interactive support. Unsupported or untested combinations return UNKNOWN/UNSUPPORTED with a reason; do not silently mark PASS.

## Proposed tool contracts
- browser.capabilities: list connected authorised browser sessions and supported actions.
- browser.inspect: read the selected page, create timestamped evidence.
- browser.act: bounded action with session ID, origin, expected state and idempotency key.
- workflow.run: explicit ordered workflow, progress events, pause/resume, cancellation.
- voice.assets: list approved recordings and exact-script cache entries.
- voice.prepare: create a chapter script and show the intended wording.
- voice.render: render approved text using an allowlisted voice ID through a server-side provider adapter; return audio ID, source, model, script hash, settings and generation timestamp.
- voice.reuse: return a cached recording only when script hash, voice, model and settings match.
- evidence.read: return success/failure/UNKNOWN with HTTP status, screenshot and operation evidence.

## Voice architecture
Public prototype -> authenticated voice gateway -> cache -> ElevenLabs adapter or a separately validated local engine.
An existing MP3 can be replayed, segmented or reused; it cannot speak arbitrary new words by itself. Offline novel speech needs a validated local synthesis engine and an authorised voice model. Do not label replay as regeneration. Keep provider credentials server-side; never ship keys in GitHub Pages, HTML or browser storage. API integration removes repeated visits to the provider UI, not the need for an underlying synthesis engine.

## Runtime safeguards and evidence
Scope each action to the authorised browser session and task. Use origin checks, cancellation, operation IDs and human review for consequential actions. Never bypass authentication, CAPTCHA or site access controls. Treat page content as untrusted input. Avoid recording secret fields in logs or screenshots. No payments, accounts, purchases or commercial operations in this preview. Test network loss, expired authentication, duplicate actions, missing assets, audio gesture restrictions, browser differences and stale pages.

## Evidence gates
1. Recording playback: verify HTTP 200, non-empty MP3, decoded duration and advancing playback.
2. Chapters: verify next/back/replay, transcript, scene linkage, interruption and user-controlled auto-advance.
3. Context response: distinguish current textual numbers from prerecorded spoken guidance.
4. API generation: missing server credentials -> NOT_CONNECTED. Exact voice selection must be evidenced.
5. Browser adapters: each browser/version/OS combination remains UNKNOWN until exercised; no universal PASS.
6. Data privacy: measure network requests and retention rather than assuming on-device targets achieved.

## Connection requirements
A deployed authenticated gateway, secret injection, allowlisted saved voice ID, provider cost limits, cache and durable evidence store. Existing generated recordings can be served without another generation call. The architecture does not need an external provider website visit for every new generation.

Primary references:
- https://elevenlabs.io/docs/api-reference/text-to-speech/stream
- https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization

## Verified voice identity in this session
Saved voice: MONARCH — African Sovereign V2. Voice ID: D0uq55pjZpKu82kXzFOe. Model used: Eleven v4. Newly generated MP3 chapters are served by the prototype. Repeated playback requires no new generation call. Provider API credentials have not been created or connected to this static site.

## Creative and audience coverage
The reusable Nigeria studio contains role planning templates; worked teaching examples for children, students and clients; adult-led baby/toddler activities; tourism costing; synthetic public-service capacity; vendor research; needs-based customer pathways; and visual/video project briefs. A local canvas recorder exports a silent 12-second storyboard when browser capabilities permit. It is not an AI-film generation server. One original fictional Nigerian-business illustration is generated and reusable. No specialist validation, universal browser support, exhaustive vendor coverage or all-scenario completion is claimed.
