# MONARCH Profit Coach — Executed Function Regression Evidence
Date: 2026-11-13
Scope: review branch only, no deployment, no browser runtime, no external data.
Source: ehigiej2/mauric-prototype-gallery / review/monarch-rise-edo-pilot-20261113 / programmes/monarch-rise-edo/profit-coach-synthetic.html
Verified source blob SHA: c02d7d702196bb2de89f18bd0bb6ac4759283286

## Method
Fetched the exact GitHub source through the connected GitHub file API. Extracted the literal `calculate(values)` and `compareOpportunities(a,b,verified)` function definitions from that file, executed them in a JavaScript V8 isolate, and asserted the expected results. No reimplementation of those two functions was used. This tests the business logic only; DOM interactions and browser compatibility were not tested.

## Executed results
1. Printing example 50 × ₦100 less 50 × ₦42, ₦300 transport, ₦100 other => ₦2,500 contribution — PASS.
2. Negative contribution from unit cost exceeding price => −₦40 — PASS.
3. Zero sales with ₦100 transport => −₦100 — PASS.
4. Break-even quantity of 3 given ₦40/unit margin and ₦100 fixed costs — PASS.
5. Negative quantity rejected — PASS.
6. Overflow of extreme multiplication rejected — PASS.
7. Unverified opportunity => HOLD — PASS.
8. Higher positive opportunity B chosen when synthetic verified flag true — PASS.
9. Both nonpositive => HOLD — PASS.
10. Equal contribution => TIE — PASS.
11. NaN input => HOLD — PASS.

TOTAL: 11/11 PASS.

## Known gaps / limitations
- The comparison's 'verified' flag is a synthetic user-selectable assumption, NOT a trusted authority or actual evidence validation. No real recommendation or transaction should rely on it.
- Not tested: browser/DOM event handling, iOS Safari, Pidgin speech, accessibility, integration, tenancy, financial correctness beyond selected examples, persisted evidence, licensing or operational safety.
- Source arithmetic uses JavaScript Number; currency rounding/precision for arbitrary decimal inputs remains an open gap. Production financial logic needs integer minor units or tested decimal arithmetic.
- Break-even formula assumes constant price/unit cost and does not account for variable transport or stepwise expenses.
- No proof of actual profit improvement, actual sellers, real demand, or app-shell integration.
- CROWN HOLD, CE-001 priority and existing governance remain unchanged.

## Next bounded tasks
Review decimal precision and input validation; execute DOM/browser tests in an authorised runtime; resolve canonical shell before any one-app integration. Do not infer all-green production status from function tests.
