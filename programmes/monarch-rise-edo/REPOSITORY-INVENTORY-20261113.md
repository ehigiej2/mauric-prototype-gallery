# Verified Repository Inventory & Integration Decision
2026-11-13 · Review only · CROWN HOLD

## Inspected on main (GitHub blob SHA)
- index.html: d8ccbcd74b4f866a07f751be3d587dc739e3dacc — PUBLIC RESEARCH GALLERY, not authenticated unified app shell. Links separate demos; explicitly excludes private founder cockpit.
- terry-benin-waka-trade-community.html: 01d82499dd24112df407dcfe1c9c7e03f4c324de — separate Benin Waka/Trade simulation with Osayi guidance, tiles and scenarios.
- waka-rider-requester-farmer.html: 202347af314a47076e386981eb8416c61dba62cf — separate five-trip synthetic rider/requester/farmer workflow with human acceptance and handover gates.
- stephen-preview.html: 714f2a5303ad42b901058df484daaca06977b396 — separate Stephen research cockpit with recorded Osayi chapters and multiple sectors.
- pilots/manchester-2026-11/preview.html: 69f09a6a2752746705c5a1c0476d074076461097 — six-button sector-configured preview; synthetic, no voice.
- programmes/monarch-rise-edo/offline-practice.html: review branch commit 3aaa84c5cd5597817054f068e472b7d1bf0fc683 — isolated synthetic offline learning fixture.

## Evidence-based decision
These public gallery files do NOT establish the authoritative private single-app shell, shared identity/session, wallet, OS-level routing, tenant isolation or deployed Osayi integration. The private cockpit must be located and inspected before wiring RISE into it. Do not insert a RISE link into the public gallery as a substitute: that would be a separate public demo, contrary to one-app requirements and sensitive programme governance.

## Proposed integration seam (pending source discovery)
Main app → Work Together → Start Earning → RISE; Osayi start-earning intent → same nested route. Original six home buttons unchanged. Learning fixture becomes an internal route/component, not a second installable app, second account or new wallet. Restrict custody-mode to institutionally authorised offline content, never live marketplace data.

## Next source discovery
1. Locate actual approved private MONARCH cockpit and its version/commit, including source, tests and deployment boundary.
2. Locate Osayi intent router, identity/session, policy/role controls and existing Start Earning component, if any.
3. Build a change-impact and threat matrix; implement minimal routing in isolated branch.
4. Test unchanged six home actions, navigation back, same session, offline behaviour, prohibited custody-mode network/data access, tenant isolation and mobile accessibility.
5. Require owner review before merge/deployment.

## Current result
Source inspection completed for named public prototypes; one-app integration BLOCKED by unverified authoritative private shell. No live code modified, no merge or deployment. UNKNOWN stays UNKNOWN.
