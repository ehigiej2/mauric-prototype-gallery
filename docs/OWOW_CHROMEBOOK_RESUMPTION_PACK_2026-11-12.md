# OWOW Chromebook resumption pack — 2026-11-12

**Status:** source reconciliation completed to extent possible via GitHub connector; real runtime/device acceptance **NOT RUN**. CROWN HOLD. No merge/deployment/payment.

## Verified source objects on review branch
- `owow-approved-prototypes-review.html` blob `44b1cff31225c64f4a4806dee8cd272c704c6676`
- `owow/prototype-registry.review.json` blob `0a6bf4b77feb1e8f13daccccc96009e91416635e`
- `tests/owow-catalogue-links.test.cjs` blob `5571768bd52add99ca459e4c5d1ef7a37caee1b4`
- `docs/MONARCH_WAKA_DEVICE_ACCEPTANCE_GATE_2026-11-12.md` blob `ecf96ccb28131c9e3e61346646b8ce683772b895`
- 14 unique local catalogue destinations independently fetched and present in this branch; six navigation section IDs; 19 registry entries. This is **source-level**, not live acceptance.

## Review requests
- Gallery: https://github.com/ehigiej2/mauric-prototype-gallery/pull/7 (draft)
- Governance: https://github.com/ehigiej2/crown-genesis-aion/pull/266 (draft)
- Waka Q1–86: https://github.com/ehigiej2/mauric-prototype-gallery/pull/5 (draft)
- Osayuki repair: https://github.com/ehigiej2/mauric-prototype-gallery/pull/6 (draft)
- Locked approved branches: `locked/mama-akara-nigeria-national-v1-2026-11-11`, `locked/tailor-osayi-nigeria-v1-founder-approved`, `locked/building-materials-osayi-nigeria-v1-founder-approved`. Do not replace these automatically.

## When Chromebook is on
1. Connect Chromebook to network, start Linux (penguin), confirm Remote Desktop Commander shows ONLINE. If needed open https://mcp.desktopcommander.app/ .
2. Open Linux terminal. Run `node --version`, `git --version`, `python3 --version`. Capture versions; do not install paid tools.
3. In an **isolated temporary directory**, clone or fetch `ehigiej2/mauric-prototype-gallery` using the existing authenticated GitHub setup; checkout `review/owow-unified-approved-catalogue-20261112`. **Do not checkout or overwrite existing uncommitted work.** If repository is already present, first run `git status --porcelain`, `git branch --show-current`, and `git remote -v`. Stop if dirty, detached or wrong remote.
4. From the isolated checkout run `node tests/owow-catalogue-links.test.cjs`. Record exit code, commit SHA and full output. Failure is a blocker; never auto-fix by deleting a missing entry.
5. Serve **only locally**: `python3 -m http.server 3997 --bind 127.0.0.1` in that isolated checkout, only after checking that port 3997 is free. If port is occupied, use another free local port; do not stop the existing cockpit. Open `http://127.0.0.1:3997/owow-approved-prototypes-review.html` on Chromebook. Test six buttons and every local link. Never treat the page as production.
6. Run existing Waka and shared-engine test commands after inspecting package manifests and README; do not guess commands or claim historical counts. Capture actual exit status, screenshots if available, logs, browser versions and Git commit SHA.
7. In Chromium and WebKit where installed, test keyboard navigation, no horizontal overflow at 320x568, 375x667 and 390x844, all local link destinations, no uncaught JS exceptions and no unexpected network requests. For voice, test audible output on physical device, not just audio-element presence.
8. Compare founder-approved locked snapshots to review and main **by actual file path and behavior** before promoting any candidate.
9. Find Knightpride's canonical source in local backups or approved repositories. Expected `knightpride.html` is absent from gallery branch. Restore only from verified source; no invented demo.
10. Log defects as BLOCKED / UNKNOWN / PASS with reproduction, exact file, evidence, proposed patch and regression; keep draft PRs unmerged and CROWN HOLD active.

## Safety stop conditions
No production deploy, merge, external messaging, live dispatch/payment/clinical operations, installation requiring purchase, deletion, secrets disclosure or changes to HMRC systems. Do not expose personal IDs, signature or NIN in logs. Do not copy live customer or patient data into tests. Use synthetic test fixtures.

## Completion criteria
- Node catalogue test PASS with logs and SHA.
- Browser functional and accessibility smoke PASS; real iPhone Safari and voice separately.
- All approved prototype journeys mapped to verified source commits, no regression against approved versions.
- Knightpride recovered or explicitly BLOCKED with provenance.
- Osayi/Context Lake/shared security integrations validated with tenant-isolation, offline replay, revocation and evidence gates.
- Founder reviews and authorises any release separately.
