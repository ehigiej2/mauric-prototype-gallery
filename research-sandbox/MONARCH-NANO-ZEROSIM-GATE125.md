# GATE 125 — MONARCH Nano Zero-SIM
Status: Research specification, NOT manufactured, NOT deployed. CROWN HOLD.

## Architecture
One reusable secure low-power PCB design; two enclosure SKUs:
A. Alert Puck: LED/buzzer/button, no display; smartphone/browser provides order details.
B. E-paper Mini: same PCB plus display; order reference and minimum non-sensitive status only.

Neither Nano contains a cellular modem, SIM or subscription. Transport selection: (1) authorised merchant Wi-Fi where available, or (2) BLE to merchant-controlled phone with foreground/background limitations tested on iOS/Android, or (3) authorised shared mains-powered gateway. No unauthorised third-party relaying. No internet path means queued events, NOT guaranteed immediate order delivery.

## Trust and event model
Each Nano has a unique provisioned device identity and secure key storage appropriate to threat model and BOM. Gateway must verify authenticated events, replay counters, expiry, tenant boundary and revocation; device never displays sensitive customer details by default. No actual payments or independent acceptance of orders. User explicitly authorises every network and relay. Encrypted queue bounded by capacity, wear, retention and power loss; sync idempotent and acknowledgements authenticated. Security architecture is PROPOSED, not implemented.

## Economic model (GBP per device, illustrative assumptions only)
Shared core = MCU/radio + power + battery + PCB/assembly + enclosure + tests + packaging + warranty allocation.
Screen variant = shared core + display + mounting/assembly + display-specific failures.
Delivered unit cost = parts + assembly + yield loss + tooling amortisation + QA + certification amortisation + freight + duty/tax + warranty + gateway subsidy.
Network TCO (N users, G gateways, T months) = N*delivered_unit_cost + G*gateway_installed_cost + T*(connectivity + maintenance + support + power) + replacements.
Per-device SIM alternative = N*cellular_terminal_cost + N*T*monthly_SIM_fee + other operations.
Savings = SIM alternative TCO - Nano network TCO.
**Zero dedicated Nano SIM fee is not zero network cost.**

## Measurable acceptance gates
- Hardware BOM quotations: UNKNOWN.
- Battery endurance in Benin conditions: UNKNOWN; measure daily energy budget, alert latency, buzzer peak draw, self-discharge, charging/harvesting.
- BLE iOS background reliability: UNKNOWN; must not promise always-on iOS bridging.
- Wi-Fi radio range, walls, shop congestion, packet loss: UNKNOWN; test in field.
- Device alert delivery latency and delivery acknowledgement: UNKNOWN; define SLA and demonstrate.
- Data isolation, forged events, revoked device, replay, offline queue: NOT TESTED.
- Accessibility: tactile button, audible/visual options, understandable Pidgin prompts, disabled-friendly controls; voice engine hardware feasibility UNKNOWN.
- Manufacturing: quality, ingress, drop, repairability, battery safety, radio compliance, product traceability, supplier QA and landed cost UNKNOWN.

## Pilot selection
Use synthetic simulator first; then consented 5-trader bench/field evaluation only after governance approval, verified security and legal readiness. No purchase, public deployment, payment, rider tracking or user contact authorised by this research file.

## Founder decision
Prioritise Alert Puck as lowest-cost baseline; retain E-paper Mini for accessible phone-free status. Reject any architecture that quietly consumes another person's connectivity, storage, battery or personal data.
