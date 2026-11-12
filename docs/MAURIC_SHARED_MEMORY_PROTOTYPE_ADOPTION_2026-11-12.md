# MAURIC shared research memory — prototype adoption contract
Status: REVIEW ONLY · CROWN HOLD · 2026-11-12

## What is implemented
- The MONARCH Trade × Waka review page loads `shared/secure-research-memory.js` and `shared/osayi-research-memory-ui.js` within its existing Ask Osayi workspace. The six home actions are unchanged.
- The shared `mauric-prototype-research-adapter.js` exposes explicit tenant/prototype-scoped encrypted synthetic notes and **reference-only** handoffs. The adapter is not yet wired into other prototypes.
- Two Node regression suites and a read-only, review-branch GitHub Actions workflow are committed. Latest workflow result must be checked independently; do not assume PASS.

## Adoption inventory — proposed only, not connected
| Prototype | Research namespace example | Integration state |
|---|---|---|
| MONARCH Trade × Waka | demo-tenant / trade | Research UI integrated, device acceptance UNKNOWN |
| Osayuki / Osayi research | dedicated approved tenant / osayuki | NOT INTEGRATED |
| Joeyvette / Stephen | joeyvette / homecare | NOT INTEGRATED |
| Knightpride Logistics | knightpride / logistics | NOT INTEGRATED |
| Hospital prototype | independently assigned tenant / hospital | NOT INTEGRATED |
| Pharmacy prototype | independently assigned tenant / pharmacy | NOT INTEGRATED |
| Other approved prototypes | independent tenant and prototype identifiers | NOT INVENTORIED / UNKNOWN |

Namespace examples are **not verified legal tenant identities** and must never be treated as authentication. Never re-use demo-tenant for live customer records.

## Required before connecting another prototype
1. Identify the exact approved source file, repository, branch, owner and existing save/consent behaviour; do not guess links.
2. Preserve the prototype's existing home controls, workflows, branding, accessibility and original Osayi voice implementation.
3. Load the shared memory module and adapter in a secure browser context, using explicit tenant/prototype identifiers and synthetic-only inputs.
4. Confirm local storage and WebCrypto availability; fail closed if unavailable. Do not send plaintext, passphrases or ciphertext to another tenant.
5. Expose Save, Recover, Delete only after explicit opt-in; ensure errors do not reveal sensitive details.
6. Test wrong key, expiry, tamper, no-consent, cross-tenant, cross-prototype, deletion, browser reload, iPhone Safari and voice coexistence.
7. Record build hash, screenshots, expected/actual, defects and independent review. UNKNOWN or FAIL blocks release.

## Security limitations requiring architecture review
- The current adapter is a browser-side proof of concept, not authenticated tenant isolation. A caller controlling JavaScript may choose arbitrary namespace IDs.
- Encrypted records are kept in browser localStorage; storage access, origin isolation, quota, clearing and device loss are not production guarantees.
- Passphrase length alone does not ensure strength. No recovery/key escrow or device migration exists.
- Reference packets are unsigned and unauthenticated; receiving one is never evidence of a valid consent, approval or live transaction.
- Deletion removes the current origin's local record; it cannot prove removal of browser backups, screenshots or other copies.
- No live voice, payment, dispatch, external communication, deployment or publication is authorised.

## Governance
CROWN HOLD. Review branch only. No main merge, release, real customer information, external outreach or spend without separate founder approval.
