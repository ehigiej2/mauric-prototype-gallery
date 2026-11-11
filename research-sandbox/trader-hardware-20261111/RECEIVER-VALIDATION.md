# Receiver simulation and packaging update — 11 November 2026
Local scripted demo only; no supplier contact, physical device, live backend, push/notification/audio, payment or shipping.

## Browser execution evidence
Chrome managed local preview http://127.0.0.1:4173/ . Observed by clicking controls and reading returned DOM/status:
- Receive simulated order, disconnect and accept: reply remains pending in demo memory, not confirmed.
- Simulated cancellation then reconnect/reconcile: stays CANCELLED, do not fulfil.
- Attempt simulated delivery while offline: no order appears.
- Missed-alert button increments demonstration count; explicitly no SMS/call/WhatsApp sent.
- Expiry blocks Accept.
- Repeating accepted order does not reset acceptance; status remains explicitly SIMULATED and not paid.
The demo holds one request at a time and prevents a new request overwriting an unanswered/pending request. It has no durable queue or clock-driven expiry. User-generated cancellation is not an actual remote cancellation; sync does not query any server. These must be engineered/tested separately.

## Automated checks
12 scripted state-machine checks pass; separate17 hardware evidence/TCO tests pass after adding mandatory packaging/complete-kit criterion and explicit cost fields. Tests use synthetic data, not physical hardware.60 candidate/criterion rows remain UNKNOWN; original14 physical cases remain NOT RUN. Additional field cases required: foreground/background sound/wake after permission setup; restart/autolaunch; network reconnect; missed-order authorised fallback; cancellation/expiry races; stable stand/heat/cable; shipping protection; handover and owner exit.

## Review artifact
order-receiver-review.html is a self-contained local HTML review copy, not public deployment or installation on a trader device. No notification permissions requested; no sound or external network service is used. It contains no customer/tenant data, QR code, device management or secret provisioning credential.

## Commercial status
All real complete-kit costs remain UNKNOWN; no unsupported low price printed. Packaging supplier listings screened, no qualified quote and no supplier contacted. Packaging/assembly and provisioning are explicit cost categories; avoid double-counting existing landed supplier packaging. Protect physical devices using adequate measured packaging, not an untested folded stand. The clear offer is 'arrives ready to receive orders'; software/service is provisioned by authorised setup, not downloaded by the trader onto a private phone.
