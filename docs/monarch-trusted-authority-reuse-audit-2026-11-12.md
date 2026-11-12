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

## Second-pass discovery — source verified

### Gate 032: CAPREG Git-backed persistence — FOUND
- `ehigiej2/crown-genesis-aion/governance/capreg-001-r2/persistence.py` Git blob SHA `5f04e406e30605fb19708d53bd368152fda68390`.
- `governance/capreg-001-r2/PERSISTENCE_CONTRACT.md` SHA `2e6dd09866422bae5c30588324b4c5af4f0daf2e`.
- `governance/capreg-001-r2/test_persistence.py` SHA `83881d09cce51863a41405ad3cba2edd60d903fb`; 21 test methods observed in source, not rerun during this audit.
- Recovery enforces contiguous historical snapshots, unique terminal head, parent digest lineage, current-pointer match, and fail-closed rejection of ambiguity. Canonical physical changes require separately authorised changes on Git `main`.
- `governance/capreg-001-r2/state/CURRENT_SNAPSHOT.json` exists at SHA `5a6f953fd3dd8974fc037f1e441593e888df71da`, pointing to genesis `CAPREG-SNAPSHOT-000001` with `execution_authority:false`. This is not evidence of permission to mutate.

### Gate 039: post-genesis authority consumption — FOUND
- Commit `41add440620cde279816cea6050c140d1e96667a` modifies CAPREG persistence, tests, HAB evaluator, and tests to enforce current state bindings and reject reused authority decision digests.
- Current CAPREG persistence source/contract inspected. No live registry mutation authorised.

### Ed25519/HIA signing — FOUND
- `governance/hia-001/verifier.py` SHA `1ee4ddc4c900fb62a4b756fffaf5425c3158ae0d`.
- `governance/hia-001/README.md` SHA `3c1c88087e96bd061ef775af27dd248d1addcb3b`.
- `governance/hia-001/test_verifier.py` SHA `780412db68af786531553002b7e7f2ca869755d6`, 17 test methods observed; not rerun here.
- Signed canonical record+attestation metadata; active key verification and revocation/expiry handling; OpenSSL Ed25519 detached signature verification. HIA is identity evidence, not standalone approval or deployment authority.

### HAB human approval — FOUND
- `governance/hab-001/evaluator.py` SHA `fcddffeaed4bbc7125d73d36d6b3da2c2a2c90ad`.
- `governance/hab-001/test_evaluator.py` SHA `fbf4a31c27817778b27187b23ed1bf834660ca5e`; 46 test methods observed; not rerun here.
- Explicitly bounded action classes, authority tiers, scope/digest lineage, signature integration and fail-closed replay handling.

### Reuse decision
**Re-use the existing source of truth; do not rebuild:** CAPREG recovery and canonical history; HAB authority checks; HIA cryptographic signer verification; EXEC-CONS execution replay ledger; OpsNudge organisation-scoped audit/outbox; MONARCH encrypted local vault. Integration should use a minimal contract and metadata-only digest references, not centralised client transaction data.

**Unresolved:** CAPREG canonical Git pointer is checked against repo history but does not independently establish rollback detection if the canonical repository itself is replaced or rewritten by a fully privileged adversary. The currently observed genesis pointer has execution_authority=false. An independently held, authenticated and monotonic head/checkpoint (or equivalently trusted append-only transparency/custody) is still necessary for the stronger malicious rollback threat model. Do not label a Git commit SHA or client-provided pointer alone an independent anchor.

**Gate 040/041:** no exact corresponding commit found from commit-message searches. Treat their source mapping as UNKNOWN, rather than infer from historical numbering.

### Next acceptance
1. Execute existing CAPREG 21 / HIA 17 / HAB 46 source-level tests in a permitted isolated runtime and record exact refs; no claim of pass until execution.
2. Determine whether a separate, signed checkpoint/custody implementation exists elsewhere, including non-default review branches and user-held archives.
3. Define only the missing adapter and out-of-band head custody; request separate approval before any production authority/storage activation.

## Third-pass trust-root and integration discovery — 2026-11-12

**FOUND: existing HAB × HIA trust-root integration, with explicit non-authority controls.**

- `governance/hab-hia-int-001/INTEGRATION_CONTRACT.md` — SHA `1637825a81d3aafd4d764ad1ab52eb0c7736d844`. Requires HAB policy PASS AND HIA cryptographic attestation PASS, exact action/scope, fresh verified receipt bound to current registry digest and permission not expired/revoked/consumed. Does not itself execute a consequential action.
- `governance/hab-hia-int-001/integration-manifest.json` — SHA `c325a1cf99456bb2dc24fd1c448ad39392deb2c1`. Confirms founder signer enrolled, bootstrap consumed, Payload V1 reconciliation; marks `execution_authorised=false`, `deployment_authorised=false`, `production_authorised=false`.
- `governance/trust-bootstrap-001/validator.py` — SHA `d1deaf5bf32f027b75621cfd0ef0f37101842548`; `README.md` — SHA `9893a8d3b0542a67278252a240ff49cad8759344`. This is a permanently consumed bootstrap: intentionally not reusable for new permissions. Do not attempt to reactivate it.
- Commit search also identifies `governance/trust-bootstrap-001/test_validator.py` and `governance/hab-hia-int-001` integration pinning. The detailed tests have not been executed in this inspection.

**Reuse conclusion:** reuse HIA public-key verification + HAB policy + existing integration manifest for *identity and bounded authorisation*. Reuse CAPREG canonical history for monotonic snapshots within the repository. These are not substitutes for an *independently custodied, rollback-resistant* checkpoint of the archive version across device loss or a repository-history compromise.

**Local test blocker:** this runtime cannot resolve the private GitHub hostname, and the registered remote `penguin` device remains offline. GitHub connector can inspect code, but there is no safe way shown yet to execute complete original Python test suites in the user's repository checkout. Therefore 21 CAPREG, 17 HIA and 46 HAB test-method counts refer to source inspection, not passing results in this turn.

**Recommendation:** no new signer, bootstrap, generic ledger, or authority engine. Design a metadata-only boundary mapping `tenant, archive version, digest, current anchored head` into existing HAB/HIA-controlled checkpoint write, with separate independent custody and monotonicity; verify before implementing any write.
