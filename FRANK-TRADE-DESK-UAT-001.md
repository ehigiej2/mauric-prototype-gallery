# FRANK-TRADE-DESK-UAT-001 — Five-job controlled acceptance pack

Status: **DESIGNED / NOT EXECUTED WITH FRANK**. CROWN HOLD. No real bookings, orders, payments, customer data or supplier integrations.

## Release requirements
- Six prominent accessible mobile buttons; each opens a useful working section.
- Every quote clearly separates labour, materials, travel and other costs; no false claim that contribution is take-home profit.
- Customer-supplied materials are not charged again.
- Materials comparisons use landed cost (quantity × unit price + delivery/collection), not just unit price.
- 50 savings checks are scenario calculations, **not 50 realised savings**; never sum overlapping opportunities.
- Copy actions are user-initiated; no automatic messages.
- All supplier, job and customer names remain fictional.
- Frank retains independent control of prices, customers, suppliers, bank, acceptance and purchases.
- No live MONARCH Trade supplier matching until consent, verification and release approval.

## Five fictional job test cases
| ID | Job | Labour | Materials | Travel charge | Other costs | Expected draft quote | Expected contribution* |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F01 | Paint a room | 8h × £32 | £85 | £20 | £35 | £361 | £221 |
| F02 | Mount a TV | 2h × £40 | £18 | £12 | £10 | £110 | £80 |
| F03 | Replace a tap | 3h × £38 | £65 | £15 | £20 | £194 | £94 |
| F04 | Assemble furniture | 4h × £30 | £0 (customer supplied) | £10 | £12 | £130 | £108 |
| F05 | Small building repair | 12h × £35 | £180 | £35 | £55 | £635 | £365 |

*Contribution = quote − materials − travel charge − listed other costs. Includes labour remuneration and is **not** net profit. Assumes charged travel equals travel cost for this simplified demo.

## Materials comparisons
| Case | Quantity | A unit + delivery | B unit + delivery | Expected totals | Expected cheaper |
| --- | --- | --- | --- | --- | --- |
| M01 paint | 3 | £19 + £12 | £22 + £0 | A £69 / B £66 | B by £3 |
| M02 fixings | 10 | £4 + £8 | £5 + £0 | A £48 / B £50 | A by £2 |
| M03 boards | 5 | £16 + £15 | £18 + £4 | A £95 / B £94 | B by £1 |
| M04 customer supplied | 2 | £22 + £5 | £25 + £0 | A £49 / B £50 | A by £1; Frank should not charge customer again |
| M05 cement | 12 | £8 + £25 | £9 + £10 | A £121 / B £118 | B by £3 |

## 50-check model validation
For each of the 50 checks, enter current £100, improved £80, frequency 4/month. Expected illustrative improvement = **£80/month**, **£960 over 12 months** for that individual check. With equal inputs, the output should not change with the category. This does **not** validate any real-world saving.

Negative checks: improved cost greater than current must show £0 improvement, zero frequency £0, missing specification must be flagged, no network/payment side effects, no customer details persisted, back navigation returns to six buttons, mobile viewport 320–430 px, keyboard focus visible.

## Evidence register
- Source file: `frank-trade-desk-v2.html`
- Static inspection: six `openPage` button handlers present, all ten five-item groups defined.
- GitHub Pages publishing: verify separately after deployment.
- Browser execution: **NOT VERIFIED**.
- Frank's consent and actual UAT: **NOT RECEIVED**.
- Actual supplier stock/prices, credentials, insurance: **UNKNOWN**.
- Release decision: **HOLD** pending hands-on UAT and documented evidence.
