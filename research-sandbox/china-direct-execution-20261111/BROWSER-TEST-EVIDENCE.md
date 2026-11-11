# Separate browser execution record — 11 November 2026
Environment: managed local preview, Cloud Browser Chrome, http://127.0.0.1:4173/ . Private development preview, not public deployment. Original Gate159 source untouched.

Observed by executing UI clicks and reading returned DOM snapshots, separate from the arithmetic unit harness:
- Home: exactly six main buttons visible in DOM: Shop, Kids, Phones, Laptops, Delivery, Ask Osayi.
- Each of six buttons opened its corresponding heading/workflow. Back returned home after each.
- Shop, Kids and Phones each displayed the correct two supplier leads, their source links, unresolved risks and NOT SENT status.
- Laptops displayed the unqualified supplier/warranty/regulatory gate.
- Delivery empty form submission returned UNKNOWN, no calculated price.
- Delivery fixture: goods1000, freight200, returns/defects100, other costs explicitly0, accepted units10, NGN and SIMULATED source description. Result: SIMULATED NGN total1300.00; per accepted unit130.00, not approved quotation.
- Ask Osayi default Pidgin displayed; selecting English changed guidance text. Explicit scripted/no voice limitation visible.

21 arithmetic checks passed; see test-output.txt and test-cost-engine.cjs. This is not an independent third-party audit: the implementing assistant ran a separate test harness and browser checks. Real iPhone/Safari layout, screen-reader usability, live conversations/voice, protected payments, stock integrations, tenant isolation, recovery, fulfilment and returns were NOT tested. No production release or operational acceptance claimed. No customer/tenant data stored; source-reference input is session-only and should not receive personal information.

Follow-up comparison and decision-brief browser checks are recorded in CONTINUATION-20261111.md; 43 arithmetic/comparison checks now pass.
