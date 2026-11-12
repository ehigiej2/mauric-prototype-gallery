# MONARCH shared-engine execution evidence — 2026-11-12

**Scope:** isolated JavaScript state-machine execution. This does **not** certify browser integration, persistence, authenticated actors, or live fulfilment.

- Repository: `ehigiej2/mauric-prototype-gallery`
- Review branch: `review/monarch-waka-q1-86` (unmerged)
- Evaluated engine blob SHA: `2d8f04274346142862da7a0016ad98bc96bc7d7f`
- Test suite: `tests/monarch-control-engine.test.cjs`
- Execution mechanism: V8 JavaScript execution of GitHub-fetched engine and regression source, with narrow `require`/filesystem/vm shims. **Not** Node.js or browser execution of the repository checkout.
- Independent in-memory test harness: **10/10 passing**.
- Committed regression suite evaluated in the same V8 harness: **PASS**.

## Independently exercised assertions
1. Duplicate case ID rejection.
2. Invalid transition skip rejection.
3. REQUEST preserved while recording initial evidence.
4. Non-owner simulation approval rejected.
5. Consent revocation invalidates prior approval and returns to evidence review.
6. Cross-tenant research handoff rejected.
7. Same-tenant handoff creates a new, quarantined REQUEST case.
8. Duplicate handoff replay detected.
9. STOPPED case cannot restart.
10. STOPPED case cannot be edited.

## Findings and limitations
- Prior bug corrected: initial evidence collection formerly forced REQUEST into EVIDENCE_REVIEW, breaking ordered progression. Fix commit: `6234540`.
- Three HTML preview entry points reference the shared engine, but the existing business workflow records are **not yet** consistently wired to its case identifiers.
- Hand-off packets are **untrusted client-origin references**; no cryptographic origin authentication or expiry is implemented. The receiver creates a new REQUEST record and must not accept approvals or evidence from a packet.
- `actor:"owner"` is a simulation string, not authenticated owner identity.
- The in-memory event array is not a tamper-evident, durable audit ledger.
- No real provider, bank, payment or dispatch integration.
- No Playwright run or actual iPhone Safari acceptance has passed for the combined three-prototype integration.

**Release verdict:** HOLD. Engineering evaluation only under CROWN HOLD. No merge, publication, spending or external contact.

## Next compulsory gates
1. Wire real preview workflow events to case identifiers and test semantics.
2. Authenticate and authorize actors in a separate approved identity layer.
3. Add trusted origin/version/expiry checks for handoffs before any cross-app data exchange.
4. Add durable, tenant-isolated, encrypted storage and negative security tests.
5. Execute independent browser and iPhone regressions.

## Follow-on workflow reference integration
- Added `captureReference` to accept only synthetic external IDs and an allow-listed record kind; it copies no source payload fields.
- Shared browser adapter listens for `monarch:synthetic-record` events and checks the declared tenant and prototype before recording a reference.
- Connected Trade × Waka synthetic record save, Waka completed fictional rehearsal, and Stephen local experiment save to emit these metadata-only events.
- Executed four additional checks against fetched engine source: first reference creates REQUEST, duplicate reference is idempotent, assurance checks default UNKNOWN, unsupported PAYMENT kind is rejected. **4/4 passed**.
- Regression suite extended with the same metadata-only capture checks. Test source is committed; browser event delivery has not been verified in Safari or end-to-end browser automation.
- These event details are client-originated and spoofable. They are not authoritative records and cannot prove a real workflow occurred. No server-side authentication, persistence, or audit guarantee is implied.

## Adversarial handoff hardening — follow-up
- Handoff receiver now rejects malformed timestamps, timestamps more than 2 minutes in the future, and references older than 15 minutes (using injected clock).
- A repeated same-case handoff with a different source revision/timestamp fingerprint is rejected as a conflicting replay; an identical replay is idempotent.
- Updated committed regression suite uses deterministic clocks and tests stale and conflicting replay rejection.
- Executed the committed test source against the exact fetched engine source in an isolated V8 harness: **PASS**.
- Engine blob SHA: `a57f852ac0b7aac9dd35f6f3c9b744844ba4afba`.
- Test blob SHA: `b9b38ff01abe45bfec650384a3607fa10bfc0edc`.
- This is still not cryptographic authenticity: packets can be forged by a client, the source revision is not independently checked against a trusted source, and replay state is in-memory only. The 15-minute freshness check limits accidental stale reuse, not a determined attacker.

## Decision-control hardening — iteration 16
- Simulation approval now requires both the explicit synthetic actor label and a separate `simulationAcknowledgement:"SYNTHETIC_ONLY"`. This remains a local simulation safeguard, **not authenticated owner identity**.
- Added optimistic revision check (`expectedRevision`) to reject stale state-transition requests.
- Added explicit `releaseReadiness` response which always returns `release:"HOLD"` and `realApproval:false` in this client-side research engine.
- Added handoff case-ID length guard to prevent generated IDs exceeding the engine's own case-ID constraints.
- Updated regression suite to test the explicit simulation acknowledgement, stale revision rejection and permanent HOLD output.
- Executed committed test source against exact fetched engine in isolated V8 harness: **PASS**.
- Engine SHA: `74dc40cb361019ff5a0a1ed53c1d01af19e2bf7b`; test SHA: `8dd0b4179f2ea5f5308ee62612fe889e0ded7ac5`.
- Security limit remains: caller-supplied actor labels and acknowledgements are forgeable. This engine intentionally cannot grant real approval or release. Trusted server-side authentication, authorisation, durable tenant-scoped state and independent audit remain mandatory.
