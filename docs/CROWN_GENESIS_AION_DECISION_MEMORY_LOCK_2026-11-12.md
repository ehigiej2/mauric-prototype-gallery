# CROWN × GENESIS × AION — Decision Memory One Way of Working
Decision: LOCKED BY FOUNDER IN CHAT · 2026-11-12
Scope: MAURIC × MONARCH × Osayi/Osayuki and all **approved** prototypes
Implementation state: POLICY LOCKED; cross-prototype rollout NOT COMPLETE
Branch: review/monarch-memory-poc-20261112

## Founder-approved rule
When the founder explicitly locks a decision in an authorised conversation, the applicable connected prototype should offer one-action, idempotent recording into its permissioned decision ledger. Reuse that decision as contextual guidance across authorised prototypes **only after** scope, identity, consent, source and conflict checks. The user must not have to re-enter information already available in that authorised context.

## One Way of Working
1. **Capture:** recognise explicit founder lock; prepare concise decision, rationale, source, tenant, applicable prototypes, version and approval evidence. Do not treat ordinary assistant output as founder approval.
2. **Verify:** check actual authority, provenance, consent, tenant boundary and duplicate/conflict state. UNKNOWN stays UNKNOWN.
3. **Lock:** append auditable decision event; never silently overwrite. Repeat same event is idempotent.
4. **Apply:** make latest valid, scoped decision available to approved prototype engines, with no cross-tenant plaintext exposure or automatic external communications.
5. **Correct:** supersede or revoke through an explicit approved event; preserve history where lawful and authorised.
6. **Prove:** test real source, security, Safari, voice coexistence, accessibility and negative cases before declaring integration PASS.
7. **Gate:** CROWN HOLD remains active: no spending, purchasing, contracts, hiring, dispatch, publication, merge, deployment or external communication merely because a decision was locked.

## Application inventory — target, not evidence of implementation
- MONARCH Trade × Waka: synthetic ledger and memory modules available in review branch; full decision UI NOT INTEGRATED.
- Osayi / Osayuki: target adapter, integration UNKNOWN.
- Joeyvette / Stephen: target adapter, integration UNKNOWN.
- Knightpride: target adapter, integration UNKNOWN.
- Hospital / pharmacy: target adapter; patient data prohibited in synthetic POC; integration UNKNOWN.
- Other approved prototypes: require inventory and explicit source inspection; integration UNKNOWN.

## Required engineering interfaces
- Authorised chat integration emits signed/verified approval events; current synthetic adapter has no authentication or signatures.
- Decision records require provenance, immutable event identifiers, version/supersession chain, explicit scope, evidence links and per-tenant access control.
- Memory and ledger should use an authenticated encrypted datastore, retention policy, recovery and deletion reconciliation; browser localStorage is NOT production approved.
- Cross-tab deletion and concurrency must pass actual tests. Cross-device sync requires approved secure service.
- Human confirmation is required for ambiguous or conflicting decisions.

## Current implementation and limitations
`shared/mauric-synthetic-decision-ledger.js` supports explicit lock, idempotent capture, scoped list, supersede/revoke and no execution authority; its records are synthetic localStorage only.
`shared/secure-research-memory.js` has a cross-tab deletion revision check, but no independent CI evidence is confirmed in this record.
No universal ChatGPT chat feed is connected or claimed. ChatGPT Memory and external prototype storage are separate systems.
CROWN HOLD: no merge to main, deployment, publication, real data or spending without separate founder authorisation.
