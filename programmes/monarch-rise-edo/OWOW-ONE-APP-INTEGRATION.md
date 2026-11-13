# OWOW One-App Integration Contract — MONARCH RISE
Status: REVIEW ONLY / CROWN HOLD. Not a deployment or proof of runtime integration.
Date: 2026-11-13

## Authoritative shell
ONE customer-facing MONARCH app; no standalone RISE app, duplicate identity, separate wallet or new production data silo.
Approved top-level six actions, unchanged:
1. Sell Something
2. Send Something
3. Buy Stock
4. My Money
5. Work Together
6. Ask Osayi

## Navigation
Work Together → Start Earning → MONARCH RISE (if user chooses learning/support).
Ask Osayi → intent 'I wan learn', 'I no know wetin to do', 'I need work' → same RISE route.
After entering RISE, nested contextual six actions:
My Strengths / Learn / Practise / Opportunities / My Progress / Ask for Help.
The nested screen is not a seventh top-level button. Back returns to shared shell without replacing user identity.
Prison-mode training is a facility-authorised offline variant of the same RISE learning content, NOT an internet-enabled prison account.

## Reusable services / no duplication
- CROWN: policy, authority, approvals, incident response, audit.
- GENESIS: component manifest, integration verification, tests, provenance.
- AION: permitted intent routing and opportunity matching; human oversight.
- Osayi: voice/Pidgin/English and accessible assisted interface.
- MONARCH marketplace: real jobs only when employer-authorised and verified; simulation otherwise.
- Waka/Trade: sector configurations and transaction workflows; role restrictions independently enforced.
- Identity: shared consented identity and recovery, with risk-based role checks.
- Records: consented learner portfolio, tenant-isolated; offline local-first privacy and secure sync only when evidenced.
- Payments: existing authorised reconciliation path; no new custody or wallet.
No assertion that these components are presently connected end-to-end.

## Explicit integration interface (proposed, not implemented)
Route: work-together/start-earning/rise
Intent: osayi.intent.start_earning | osayi.intent.learn_skill
Input: authenticated-or-approved-guest context, language preference, selected pathway, approved facility-mode flag.
Output: six nested actions, synthetic exercises, local temporary progress, consent-gated portfolio proposal.
Events: rise.lesson.started, rise.practice.checked, rise.skill.assessed, rise.portfolio.share_requested, rise.opportunity.requested.
Policy denies: custodial commercial work without written NCoS authority; any live customer/passenger/finance data in prison mode; sensitive role assignment without legal eligibility and individual review.
Never infer criminal status from the route or expose it to a marketplace participant.

## Existing artifact
programmes/monarch-rise-edo/offline-practice.html is a REVIEW FIXTURE and curriculum demonstrator, not a separately approved app.
Do not publish it as a standalone public service. Its inline JS currently keeps temporary scores in page memory; it does not use verified secure persistent storage or live identity. Treat as a non-production training fixture.

## Acceptance gates before 'integrated'
1. Inventory exact existing shell/route, identity, Osayi and marketplace modules with commit hashes.
2. Route Work Together → RISE and Osayi → same RISE screen; six original buttons unchanged.
3. Confirm same account/session and authorised role context; no parallel account or wallet.
4. Confirm all sector interfaces share permissioned services and tenant isolation.
5. Demonstrate browser, keyboard, mobile, offline and accessibility checks.
6. Prove no prison-mode network calls, sensitive-data access, live jobs or commercial payments.
7. Test user consent, portfolio portability, revocation and safe role escalation.
8. Threat-test impersonation, forged credentials, job scams, unsafe referrals and cross-tenant leaks.
9. Independent review, owner approval and documented release decision; CROWN HOLD remains until then.

## Delivery state
Design/specification saved to review branch; existing HTML fixture saved. Live integration UNKNOWN / NOT VERIFIED. No merges, deployment, contacts, hiring or payments.
