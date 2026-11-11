# Gate 154 — Executed embedded checks with simulated DOM

**Source blob SHA:** `52e92225251e6b9b0bcf090c8ab68cc4d3fedad7`

## Method
The exact HTML was retrieved via the connected GitHub repository. Its first application JavaScript block was extracted and executed using JavaScript `Function` with a deliberately minimal mock `document` implementing the page's expected inputs, button click handlers, role selection and validity checks. The real `#tests` handler was invoked. This is an **isolated simulated DOM execution**, not a Chromium/Playwright, Safari or physical device test.

## Result
**19/19 embedded assertions PASS**. Named assertions:
1. Basic arithmetic
2. Zero loss
3. Spoilage reduces revenue
4. Loss cannot exceed quantity
5. Negative cost rejected
6. Fractional units rejected
7. Zero quantity works
8. Large integer arithmetic exact
9. Mining sales disabled
10. All five roles available
11. Cost increases lower contribution
12. Unverified stock never fabricated
13. Voice requires explicit consent control
14. Voice session cancellation control exists
15. Empty input rejected
16. Decimal input rejected
17. Confirmation requires reviewed snapshot
18. Sector switch invalidates displayed calculation
19. Role change invalidates approval

Selected cattle role was restored after the test routine. No actual audio was used.

## Caveats
The test's own validity checks were provided by the mock; actual HTML input validity, browser event propagation, CSS/layout, microphone permissions, voice capture and playback were **not** verified. The embedded checks include assertions about control presence, not proof of hardware functionality. Independent Chromium and iPhone Safari acceptance remain UNKNOWN.

## Controls
Research branch only. No external messages, deployment, payment, supplier onboarding, hardware purchasing or live trading. CROWN HOLD preserved.
