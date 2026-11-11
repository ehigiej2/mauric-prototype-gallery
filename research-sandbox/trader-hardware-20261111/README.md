# Trader hardware assessment
Start with FOUNDER-REVIEW.md. Contacts are published official routes, not qualified partners. All RFIs UNSENT. All physical tests NOT RUN and all candidate qualifications UNKNOWN.

Files: hardware-contact-register.csv; TECHNICAL-AND-COMMERCIAL-SPEC.md; physical-acceptance-tests.csv; qualification-register.csv; tco-24-month-inputs.csv; SOURCES.md; three draft RFIs; hardware_gate.py and unit tests.

Run `python -m unittest -v test_hardware_gate.py` from this folder. Unit-test fixtures are synthetic and do not certify hardware. Evidence readiness never grants contact, purchase or deployment authority. Manual verified evidence remains essential; the validator cannot authenticate a supplied document or a claimed reviewer.

TCO: landed device cost already includes purchase/import/freight/taxes; do not add those twice. Gross = landed + accessories/power + packaging/assembly + provisioning + setup/training + integration + horizon×(monthly connectivity+energy+consumables+support/licences) + repairs/replacements + downtime + return/exit. Net = gross minus substantiated residual. Include subscriptions/rental in correct nonoverlapping cost category, even for reuse. Any UNKNOWN input keeps result UNKNOWN; all calculated results SIMULATED until independent commercial validation.

No promise of free hardware, government support, supplier credit, assured revenue or functional payment integration. Proposed receipt/scanner tests must use test data and keep printed receipt status distinct from confirmed bank settlement.

Updated core offer and packaging: ORDER-RECEIVER-KIT.md; complete-kit-bom.csv. TCO now explicitly includes packaging/assembly and provisioning. receiver-demo/ is a local-only scripted demonstration; no remote order transport, real acceptance, push, audio or escalation service.
