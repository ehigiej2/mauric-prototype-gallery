# MONARCH Trade × Waka browser acceptance — 11 November 2026

CROWN HOLD remains active. Synthetic test evidence only; no release approval.

## Verified execution

- Successful run: https://github.com/ehigiej2/mauric-prototype-gallery/actions/runs/43121857169
- Tested commit: 659ddb94fb7ad814fa6f08570e3c158f47f7a1e2
- Job: 130864035145, synthetic-browser-tests, conclusion success.
- Test: tests/test_monarch_waka_browser.py
- Environment: GitHub-hosted Ubuntu 24.04; Python 3.12; Playwright 1.56.0; headless Chromium.
- Logged result: 2026-11-11T23:43:12.2481931Z PASS: 3 mobile viewports; six-button navigation; five synthetic workflows; Osayi recall/cancel/clear; no outbound HTTP

## Covered checks

- 320×568, 375×667 and 390×844 viewports; six visible buttons entirely inside each viewport; no horizontal overflow.
- All six panels open and return; background controls become inert; fixed workspace; Escape closes.
- Five synthetic form workflows create SIM records; repeated submit does not duplicate records.
- Osayi session recall, cancellation and clearing.
- Recorded greeting control exists and points to intro.mp3. Playback was NOT exercised.
- HTTP/HTTPS requests observed from before initial navigation; none observed in exercised journeys.
- No page script errors observed.

## Launch resolution

The previous workflow_dispatch-only definition was absent from main and had no runs.
A narrowly filtered push trigger on review/monarch-waka-q1-86 launched the test without changing main.
Repository permission is contents: read. Checkout does not persist credentials. There are no deployment steps.
First run 43121754714 failed at browser dependency installation: ubuntu-latest selected Ubuntu 26.04, unsupported by the pinned Playwright version.
Pinning Ubuntu 24.04 resolved setup; the second run executed the assertions successfully.
Local execution was attempted first but the browser could not start because a required socket operation was denied. That attempt supplied no application acceptance evidence.

## Boundaries

This does not establish physical iPhone/Safari acceptance, WebKit behaviour, actual voice playback, live conversational AI, persistence after browser restart, tenant isolation, verified bank payments, production backend behaviour, or full Q1–86 safeguard compliance.
The app stores scenarios in temporary memory; no restart persistence is claimed.
Observation of no HTTP/HTTPS requests in this suite is not a general privacy certification.

## Change control

Only the review branch was changed. Main remained c731950865b69936e8f5fafc901a38005883f4fd when checked after the successful run.
No merge, application deployment, purchase or payment was performed.
