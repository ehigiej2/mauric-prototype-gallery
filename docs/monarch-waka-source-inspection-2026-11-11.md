# MONARCH Trade × Waka — inspection evidence and defects
Date: 2026-11-11. Branch: review/monarch-waka-q1-86. No deployment or external testing.

## Evidence source
GitHub fetch_file of monarch-trade-waka-review.html on review branch. Source-level string/structure inspection only. No browser execution, iPhone, screen reader, microphone, network, bank or WhatsApp testing.

## Static checks (10/10 PASS)
1. Exactly six .tile buttons in source.
2. Six mode definitions present.
3. Form submit handler present.
4. No external script tag.
5. No fetch() network calls.
6. No localStorage/IndexedDB persistent storage.
7. Bank verification labelled UNKNOWN.
8. Staff delegation explicitly synthetic.
9. HTML escape helper declared (NOTE: helper is unused; no direct dynamic HTML insertion of user text found in current paths).
10. Exact “Watein you wan do?” heading.

## Defects and limitations — NOT ACCEPTED
D01 HIGH: The detail workspace is rendered below the six-button grid and scrollIntoView() scrolls the page. This does not yet satisfy the founder's strict one-screen/no-scroll interaction standard. Fix with full-viewport panel/overlay, reliable Back control, focus restoration and no page overflow.
D02 HIGH: No automated browser or mobile acceptance tests executed. Static checks do not prove runtime behaviour.
D03 HIGH: Ask Osayi is a local keyword reply script, not actual conversational model, sovereign voice, consented memory or previous-turn reasoning. Voice engine must be inspected and integrated with consent and fallback.
D04 HIGH: State held in in-memory JS object; refresh loses drafts. Offline encrypted recovery and cross-channel continuity not implemented.
D05 HIGH: No real tenant authentication/authorisation, revocation, ownership dispute, secure case storage, appeal review, payment verification or idempotent backend. Must not expose to real customers.
D06 MEDIUM: The existing Stephen preview and Waka rider/requester/farmer files were located, but reusable integration contracts and runtime evidence remain unverified.
D07 MEDIUM: Accessibility, Pidgin/English switch, low-end phone, offline, screen-reader and iOS Safari testing pending.
D08 MEDIUM: No evidence passport from independent reviewer; no risk-based release approval.

## Next acceptance sequence
A. Implement one-viewport panel and test at 320×568, 375×667, 390×844, landscape, 200% zoom, keyboard and screen reader.
B. Add isolated Playwright or equivalent browser tests: six actions; each form; back/focus; invalid input; XSS text; no network; no duplicates; responsive layout.
C. Inspect existing Osayi voice/conversation assets and implement explicit adapter interface; test question, previous-turn recall and cancel turn independently. No claim of voice parity until actual device verification.
D. Secure backend architecture with tenant isolation, owner permissions, revocation, case evidence lifecycle and offline idempotency; use synthetic test tenants.
E. Independent adversarial and accessibility review; signed evidence passport; founder approval for any release or external use.

CROWN HOLD: no deployment, spending, public communication, live pilots, real payment, rider dispatch, or real personal data. Mandatory legal notifications through lawful authorised governance.
