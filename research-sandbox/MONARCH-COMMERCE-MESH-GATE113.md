# Gate 113 — Sovereign Commerce Mesh: Commercial + Engineering Acceptance Contract
Status: RESEARCH DESIGN. Not production, not independently validated. CROWN HOLD.

## Principle
OPTIMISE FIRST. BUY LAST. Do not claim savings or commercial outcomes without traceable evidence. UNKNOWN remains UNKNOWN. No autonomous financial commitment.

## Five layers
1. Customer and merchant journeys (existing Waka / Trade prototypes; inspect and adapt, do not assume integrated).
2. Nano notification endpoint (order alias, state, nonce, expiry; no PII).
3. Order orchestration and event log (idempotent, versioned, tenant-scoped, signed events).
4. Commercial optimiser (costed options, explicit baselines, constraints and uncertainty).
5. CROWN acceptance and release evidence (human approvals, audit, rollback).

## Economic model per simulated order (minor currency units)
Customer baseline = separately evidenced independent purchase + delivery cost.
Customer quoted total = merchandise + allocated pooled delivery + applicable fees.
Claimed customer saving = baseline - quoted total. If baseline unknown, saving UNKNOWN.
Courier gross pay = accepted delivery allocation + disclosed tips.
Courier contribution = gross pay - courier-borne variable cost; NEVER equate gross pay with profit.
Merchant contribution = net merchant receipts - item cost - merchant fulfilment costs - merchant platform fees.
Platform contribution = explicitly disclosed platform fee + other recognised revenue - payment processing - support - fulfilment subsidies - device amortisation - refunds and other attributable costs.
Group delivery allocation: use a documented fair rule with rounding conservation, sum(customer shares) = total allocated delivery cost. No unapproved quote mutation.
Do not double count merchant and platform revenue or pretend hypothetical savings are cash realised.

## Acceptance conditions
- A simulated order can be sent to Nano without leaking customer identity.
- Acknowledgement is a receipt event, NOT stock confirmation or payment authorisation.
- Outage, duplicate, stale and revocation handling preserve the accepted quote and completed stops.
- All monetary calculations use integer minor units, explicit currency and documented rounding.
- Counterfactual baseline must be sourced or marked synthetic/UNKNOWN.
- Every recommendation carries evidence quality, constraints, human decision and rollback path.
- Optimiser must be allowed to recommend NO POOLING / NO PURCHASE when that is better.
- Tenants cannot read one another's event or commercial ledgers.
- Merchant can decline without retaliation; advertising is opt-in and separately contracted.
- No live payment, banking, dispatch, procurement, supplier contact or device ordering.

## Experiment design
Simulate 5 merchants, 5 orders, 2 couriers, 1 disrupted stop; compare pooled vs separate fulfilment using declared synthetic inputs. Vary volume, delay, failed-delivery cost, device landed cost, merchant acceptance and network outage. Produce a sensitivity matrix; label every result SYNTHETIC.
Negative tests: negative margins; insufficient courier pay; unfair allocation; baseline unavailable; cancelled order; unavailable stock; network failure; wrong-tenant event; duplicate ACK; revocation.

## Hardware economics
Compare passive QR/NFC, Wi-Fi Nano, existing merchant phone/browser, thermal printer, and full POS. Include setup, connectivity, security maintenance, replacement, failure, freight, certification and support. Request 1/100/500/1000/2000/5000 supplier price tiers. £500 maximum pilot budget, no expenditure authorised.

## Release governance
Research branch only. Do not expose protected core IP, NIN, signatures, personal records, credentials or voice-training originals. CROWN HOLD remains active. Production, external publication and purchases require separate evidence and explicit approval.
