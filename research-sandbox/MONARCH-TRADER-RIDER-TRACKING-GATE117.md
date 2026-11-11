# Gate 117 — Trader, Rider and Customer Live Fulfilment Contract
STATUS: DESIGN AND SYNTHETIC ACCEPTANCE SPEC ONLY. NOT LIVE TRACKING. CROWN HOLD.

## Principle
Tiny Nano = alert, acknowledgement and essential status. Trader browser/PWA = complete order, basket, rider status and authorised live tracking. Rider's own consented phone/app or approved tracking unit = location source. Customer sees only their own delivery. No mandatory trader app installation.

## State machine and source of authority
REQUESTED -> MERCHANT_REVIEW -> ACCEPTED -> PREPARING -> READY_FOR_PICKUP -> RIDER_ASSIGNED -> RIDER_ARRIVED -> PICKUP_VERIFIED -> IN_TRANSIT -> DELIVERED -> CLOSED.
Exceptions: REJECTED, STOCK_UNAVAILABLE, SUBSTITUTION_PENDING, RIDER_DELAYED, CANCELLED, DISPUTED, OFFLINE, LOST_SIGNAL, FAILED_DELIVERY.
Assignment is not pickup. Merchant handover alone is not proof of delivery. Only validated actor and event transition can change authoritative state.
Rider assignment needs authorised dispatch approval. Pickup requires mutually verified short-lived code or QR, plus optional package count. Delivery proof must respect privacy and accessibility; no coercive photography.

## Three views
NANO: alias, item count, alert, preparation state, arrival, verified pickup, network/battery status; never customer address, phone, precise GPS or rider personal data.
TRADER WEB: scoped full basket, substitutions, expected pickup window, assigned rider pseudonym/verification badge, status, optional live map of assigned delivery while legitimately needed, and issue/escalation controls.
RIDER WEB: accepted job, minimum required pickup/drop-off instructions, route, merchant contact proxy, confirm arrival, verified pickup, delivery outcome, report problem.
CUSTOMER WEB: own order, readiness, pickup verified, ETA range, optional live courier position during transit and support.

## Privacy and tracking
Tracking OFF until rider accepts a particular delivery and explicitly enables session. Begin precise location only when necessary for collection/transit; end at delivery, cancellation or session timeout. Avoid indefinite background tracking. Coarsen position for merchant/customer when appropriate; suppress home/stationary location; rotate short-lived tokens; no public tracking URLs. Location updates require tenant/order/actor/session authorisation and device-bound credentials. Rider may pause for safety, with status changing to TRACKING_PAUSED/LOCATION_STALE, not fabricated position. Apply location accuracy and timestamp freshness labels. Retention period requires lawful review; no unbounded location history by default.

## Low-bandwidth / energy strategy
Rider app uses adaptive GPS update intervals based on active journey and movement, balancing safety and battery; no guarantee of real-time accuracy. Send event-driven updates for key milestones. Nano receives compressed status over authorised gateway; detailed map remains on browser. Gateway buffers alerts; offline state must not be mistaken for acceptance or live tracking.

## Event contract
event_id, tenant_id, order_id_alias, revision, actor_role, event_type, occurred_at, received_at, source, evidence_ref, correlation_id. Tracking payload separately encrypted and access-controlled: session_id, coarse_lat/lon or precise location only for authorised roles, accuracy_m, observed_at, expires_at, consent_state. Use integer money units and preserve accepted quote; never infer payment from handover.

## Security / safety tests (all UNKNOWN)
1 wrong merchant denied; 2 wrong customer denied; 3 rider cannot track before assignment; 4 rider cannot track after completion; 5 no location on Nano; 6 no tracking after cancellation; 7 pickup code replay denied; 8 duplicate pickup denied; 9 rider assignment without approval denied; 10 stale GPS visibly labelled; 11 offline gap visibly labelled; 12 device revocation; 13 cross-tenant tracking blocked; 14 expired tracking link denied; 15 consent withdrawn; 16 customer order privacy; 17 failed delivery; 18 substitutions require approval; 19 no false delivered event; 20 accessibility; 21 battery saver; 22 route safety; 23 simulated map updates; 24 no real dispatch or payments.

## Commercial metrics
Measure merchant preparation time, rider waiting time, pickup success, customer ETA accuracy, missed-order rate, failed delivery, per-order energy/connectivity, and cost per successful delivery. Never equate gross courier pay with profit; no synthetic saving described as realised.

## Gate
Before external pilot: functional connected prototype, actor-based access tests, privacy impact assessment, lawful rider consent process, Nigerian/UK regulatory review where applicable, real-phone and gateway tests, human acceptance. £500 ceiling remains a research constraint, not spending authorisation.
