# MONARCH × Waka — device and persistence acceptance gate

Status: REVIEW ONLY · CROWN HOLD · 2026-11-12. No release authority.

## Grounded current implementation
- The six-button review page uses in-memory `state` arrays and `counter`. There is no localStorage, IndexedDB or server persistence in this review page. Refresh/restart recovery is therefore NOT IMPLEMENTED; do not claim PASS.
- Osayi replies are deterministic local keyword responses; the prerecorded greeting is an MP3. Live conversational AI, speech input, dynamically generated spoken replies and a reusable voice engine are NOT IMPLEMENTED in this review page.
- Existing Playwright checks exercise Chromium and WebKit at 320×568, 375×667 and 390×844; they do not prove real iPhone Safari speaker output, safe-area behaviour or browser-restart persistence.
- The synthetic control engine uses in-memory maps, synthetic actor strings and an explicitly unauthenticated evidence status. It is not production identity, tenant isolation or an authoritative ledger.

## Physical iPhone Safari acceptance procedure (human-operated; no deployment)
1. Open a separately authorised, non-public review copy on an iPhone. Record device model, iOS version, Safari version, build SHA and date. If no safely accessible review copy exists, mark BLOCKED, not PASS.
2. At initial load, capture screenshot. Confirm all six large buttons fit without vertical/horizontal scrolling, overlap, clipped text or safe-area obstruction, at default and enlarged text settings.
3. Open each button, confirm its correct heading/form and functional Back, and check keyboard, focus and VoiceOver labels.
4. For Sell, Send, Stock, Money and Team, enter only fictional data; verify SIM output, duplicate-submit prevention, cancellation and no real-world effects.
5. In Ask Osayi, ask two related fictional questions, confirm session recall, cancel a draft, clear conversation and verify clearing. Explicitly label the replies as scripted local guidance.
6. Tap prerecorded greeting with audio enabled; confirm audible sound, correct voice, pause/stop on exit and clearing, and no autoplay before user action. Log physical-device audio quality separately from automated media-element playback.
7. Reload Safari and fully close/reopen it. Verify current behaviour, record expected loss of in-memory scenarios/chat, and mark persistent recovery FAIL/NOT IMPLEMENTED until a consented, encrypted, tenant-scoped design and tests exist.
8. Inspect Safari network activity where available; note whether requests occur before/after navigation. Do not treat absent observed requests as privacy certification.
9. Record screenshots, timestamps, build SHA, expected/actual outcomes, defects and independent reviewer. Any critical FAIL or UNKNOWN blocks release.

## Next engineering gates
- Persistence design: explicit consent; minimal retention; authenticated tenant scope; encryption and key lifecycle; restore, tamper, offline replay, revocation and deletion tests; no sensitive data in localStorage. Architecture review before implementation.
- Voice design: reusable engine contract; consented microphone permission; Pidgin/English language handling; speech-input and spoken-output integration; accessibility fallback; cancellation; no unsupported claim of the original sovereign voice being regenerated.
- Integration: preserve the six-button contract and research-only control engine. No real banking, dispatch, identity, external network, deployment or app-store submission without separate approval.

Evidence classification: existing automated browser checks = reported PASS; real-device checks = UNKNOWN; reload persistence and live voice = NOT IMPLEMENTED in this review page.
