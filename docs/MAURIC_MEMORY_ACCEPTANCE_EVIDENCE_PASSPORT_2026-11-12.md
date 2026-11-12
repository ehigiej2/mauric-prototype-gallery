# MAURIC encrypted research memory — acceptance evidence passport
Date: 2026-11-12 · Branch: review/monarch-memory-poc-20261112
Status: RELEASE BLOCKED · CROWN HOLD · synthetic data only

## Evidence hierarchy
| Claim | Evidence | Status |
|---|---|---|
| Shared encryption module exists | shared/secure-research-memory.js | SOURCE CONFIRMED |
| Scoped handoff adapter exists | shared/mauric-prototype-research-adapter.js | SOURCE CONFIRMED |
| Ask Osayi save/recover/delete UI exists | shared/osayi-research-memory-ui.js | SOURCE CONFIRMED |
| Node security tests exist | tests/test_secure_research_memory.cjs; tests/test_mauric_prototype_research_adapter.cjs | SOURCE CONFIRMED |
| Chromium/WebKit acceptance test exists | tests/test_monarch_memory_browser.py | SOURCE CONFIRMED |
| Read-only CI workflow exists | .github/workflows/monarch-memory-review.yml | SOURCE CONFIRMED |
| Latest CI jobs passed | Actual GitHub run conclusion not independently retrieved | UNKNOWN |
| iPhone Safari saved/recovered research | Physical device evidence unavailable | UNKNOWN |
| Real authenticated tenant isolation | Browser namespace is not identity verification | NOT IMPLEMENTED |
| Cross-prototype live integration | No other approved prototype sources modified by this branch | NOT IMPLEMENTED |
| Live Osayi reasoning and speech | Existing review page is scripted and prerecorded | NOT IMPLEMENTED |

## Mandatory test report before release
For each test record: build commit SHA; runner/OS/browser; expected/actual; pass/fail; time; logs/screenshots; defect; reviewer; retest. Do not infer green status from a workflow YAML file or a push.

## Threats and outstanding controls
1. Browser localStorage is not a secure production datastore; client-controlled tenant IDs do not authenticate users.
2. Passphrase clearing reduces exposure but cannot prove secrets were removed from process memory or device backups.
3. Reference-only handoffs are unsigned and must not authorise actions.
4. Device loss, storage eviction, origin changes, offline replay, deletion across backups and key recovery remain UNKNOWN.
5. Real sensitive data, payment credentials, patient records, real delivery locations and customer identity are prohibited in this synthetic POC.
6. Do not merge or deploy until CI and physical-device evidence, architecture review and separate founder approval.

## Next independent verification
1. Retrieve actual CI job conclusions for the current head commit and preserve logs/artifacts.
2. If CI fails, repair tests or implementation on this isolated branch only; rerun and record evidence.
3. Validate six-button interface, encrypted memory, audio coexistence and deletion on physical iPhone Safari.
4. Inspect each approved prototype's source and existing tenant/consent controls before any integration.
