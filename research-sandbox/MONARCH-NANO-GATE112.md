# Gate 112: MONARCH Nano (research only)
Status: SPECIFIED, NOT BUILT OR TESTED. CROWN HOLD.

Goal: No compulsory merchant app download. Tiny order notification and acknowledgement endpoint, not a payment terminal or autonomous dispatcher.

Hardware hypothesis: ESP32-C3 Wi-Fi MCU, buzzer, status LED, two buttons (acknowledge / review), optional small screen, USB power. NFC or QR optional for pairing; passive NFC cannot receive remote orders. Compare alternatives before procurement.

Order states: ROUTED -> PRESENTED -> ACKNOWLEDGED / NEEDS_REVIEW. Exceptions: OFFLINE, EXPIRED, REVOKED, CANCELLED. ACK means receipt only, not stock, payment, collection or delivery. Server authoritative.

Event schema: schema_version, event_id, tenant_id, device_id, order_alias, revision, event_type, issued_at, expires_at, nonce, payload_digest. No customer names, addresses, phone numbers, basket contents or payment details in alerts. Detailed order data requires separate authenticated view.

Security: TLS authenticated device identity; tenant isolation; replay and expiry prevention; idempotent acknowledgement; monotonic revision checks; revocation; secure firmware updates; evaluate secure boot and encrypted storage on actual hardware. Keep secrets out of public repositories.

Acceptance tests pending: correct tenant; wrong tenant; duplicate order; duplicate ACK; replay; expiry; out-of-order; 30-minute offline; power loss; lost device; device revocation; reset/reprovision; TLS failure; malicious firmware; accessibility; simultaneous simulated devices; privacy; no real dispatch; no real payment; audit evidence. Every test must record commit, firmware version, environment, outcome and proof. UNKNOWN is not PASS.

Economics: £500 maximum sample research envelope, no purchase authorised. Request 1/100/500/1000/2000/5000 unit factory quotes with tooling, BOM, shipping, taxes, certification, updates, warranty, lead time, and landed Nigeria cost. Do not place bulk orders before independent tests and merchant demand validation.

External research: synthetic data only. Protected core, signatures, identity documents, customer information and proprietary firmware stay private. No public deployment or live transactions under CROWN HOLD.