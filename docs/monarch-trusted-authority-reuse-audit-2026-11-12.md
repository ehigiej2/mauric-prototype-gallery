# REUSE-FIRST audit — MONARCH trusted evidence/version authority — 2026-11-12

## Decision
**DO NOT build a new generic ledger, event hash-chain, or login engine.** Reuse and harden existing canonical implementations. **Do not claim a trusted independent version authority already exists** until its separate custody, monotonic writes, signatures, and tenant scope are verified.

## Confirmed source inspected
1. `ehigiej2/crown-genesis-aion/governance/exec-cons-001/ledger.py` — Git blob SHA `714f223648399be406817adb82c9f746adb6d894`. Real JSONL append-only hash chain; exclusive `fcntl.flock`; `fsync`; replay guards by execution ID/idempotency key; states RESERVED / CONSUMED / FAILED_PRE_SIDE_EFFECT / UNKNOWN; recovery summary exposes head digest. Local/test only, no real side effects. Tests exist at `governance/exec-cons-001/test_ledger.py` (SHA `024612fb56a38b99c829c92293a9bf052e7`), **not rerun in this audit**.
2. `ehigiej2/opsnudge-platform/app/services/integrity.py` — SHA `83ceddc2836448f5e75d672de26086da1d791cbe`. SQL-backed audit-event SHA-256 predecessor chain; DB flush and audit-row lock; domain outbox event with idempotency key. Chain verifier exists. **DB row locking depends on backend semantics**; no separate independent anchor in this file.
3. `ehigiej2/opsnudge-platform/app/models.py` — SHA `f0ce807b221445e9620306dda0e9cdf102433b69`. Organisation-scoped AuditEvent, RuleVersion, SecurityEvent and implementation authority record models.
4. `ehigiej2/opsnudge-platform/app/services/auth.py` — SHA `a92c042f8bfecfff72fcd217a3aa600959ad44eb`: signed JWT/role and organisation claims with current-user middleware.
5. `ehigiej2/opsnudge-platform/app/routers/oidc.py` — SHA `7f284c9b9d5ba767f5bf1a6c0a30333093406dc4`: existing OIDC integration.
6. `ehigiej2/opsnudge-platform/app/routers/governance.py` — SHA `410c8228ae7f7060140e30eecaaa1074187710a6`: organisation-checked audit integrity endpoint.

## Existing MONARCH review reusables
- `shared/monarch-evidence-version-gate.js`: client-only inspect/propose and HOLD responses; no authority implementation.
- `shared/monarch-encrypted-vault.js`: AES-GCM IndexedDB adapter plus compare-and-swap; browser acceptance UNKNOWN.
- `shared/monarch-control-engine.js`: synthetic transaction state machine, not authenticated authority.
- `shared/monarch-synthetic-ledger.js`, `shared/monarch-offline-reconciliation.js`: synthetic idempotency/recovery research.

## Candidates and limits
**Best reuse path:** CROWN EXEC-CONS-001 for fail-closed execution/replay patterns, OpsNudge integrity/outbox/org auth for server-side audit services, MONARCH encrypted vault for private local data. Adapt via a small integration contract. Do not transplant whole systems or duplicate storage without tests.

**Critical gap:** hash chains prove consistency of available entries, not that an older *valid* chain wasn't substituted. A trusted monotonic checkpoint outside the user's restorable device is still required. Do not use a client-supplied hash, mutable local DB anchor, self-reported role, or unvalidated OIDC token as that trusted checkpoint.

## Historical leads requiring retrieval
Prior Gate 027 Ed25519 evidence signing; Gate 032 persistent checkpoint pinning; Gate 39 permission engine; Gate 40 audit-chain; Gate 41 reconciliation; Gate 25–35 IPC evidence lineage. Historical reports are **leads, not presently verified source paths or proven reusable production services**. Locate and re-evaluate before creating a new component.

## Release and actions
- No production authority selected or deployed.
- No new generic implementation started.
- Next: find exact Gate 027/032/39–41 source, inspect independent custody and test evidence; determine minimal adapter; run tests and negative security checks.
- CROWN HOLD remains active.
