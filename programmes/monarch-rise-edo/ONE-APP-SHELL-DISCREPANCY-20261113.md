# One-App Shell Discrepancy — MONARCH RISE
Status: REVIEW / HOLD · 2026-11-13

## Directly inspected
Repository: ehigiej2/monarch-executive, main, go.html, blob f373b0651c7644a8d25cde555f3b8eaae3c0c61d, title 'MONARCH Customer Access v23'.

Actual six home buttons:
1. Find Anything
2. Buy Something
3. Book a Service
4. Send Something
5. Choose Location
6. Talk to Osayi

This differs from the earlier proposed six buttons (Sell Something / Send Something / Buy Stock / My Money / Work Together / Ask Osayi). Do not silently replace the current v23 navigation with the earlier proposal or claim the two match. Determine which approved shell/version governs before editing.

In v23, MENU.osayi has six subchoices: Ask for Anything, Help Me Buy, Find a Professional, Help With Delivery, Help With Location, Explain MONARCH. No 'Start Earning' or 'Work Together' route was located in the inspected source. Text explicitly states 'Voice is not connected.' A source search found no fetch(), localStorage, navigator. or serviceWorker references; this does not prove comprehensive security, offline support or backend integration.

## Design reconciliation
MONARCH RISE remains a nested learning capability inside the eventual canonical single app, not a separate installable app. Until owner resolves shell version and authority, the proposed Work Together → Start Earning → RISE route is a PROPOSAL, not a current v23 implementation. Candidate alternative for v23: Talk to Osayi → optional Learn / Start Earning category → RISE internal view, subject to explicit review and tested routing; preserve all six v23 home buttons.

## Blocking gates
- Confirm which current app shell is authoritative and whether v23 is only a review surface.
- Identify actual authenticated session, permission and orchestration implementation (if any).
- Confirm permitted integration scope under CROWN and CE-001 problem-first governance.
- Obtain exact change approval before runtime modifications.
- Run actual browser and security regression on approved target.

No live app change, merge, release, external contact or spend. UNKNOWN remains UNKNOWN.
