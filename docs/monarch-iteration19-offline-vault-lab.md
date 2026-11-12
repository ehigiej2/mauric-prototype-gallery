# Iteration 19 — encrypted offline recovery lab (isolated, NOT integrated)

Date: 2026-11-12. CROWN HOLD remains active.

The research vault source, tests and evidence were created and executed in the isolated session, **not committed as implementation** to this branch. Do not treat this document as proof of GitHub integration.

The locally generated source implements WebCrypto AES-256-GCM, PBKDF2-SHA256 (250,000 default iterations), tenant-bound authenticated encryption, record validation, encrypted storage through an injected adapter, and an IndexedDB adapter. Decrypted restored commands are **always quarantined**, never re-executed.

Local Node 22 WebCrypto tests passed for encrypt/decrypt, passphrase failure, ciphertext tampering, tenant mismatch, duplicate command rejection, invalid negative amounts and deletion. Tests used a fake asynchronous storage adapter; **real IndexedDB, Safari, browser reload, power interruption, concurrent tabs, durable crash recovery and repository integration remain UNKNOWN**.

Critical limitations: local passphrase handling is caller responsibility; valid older ciphertext could be rolled back; storage can be deleted or evicted; neither server-side authenticated identity nor independent audit exists. No live payments, goods movement or supplier interactions were performed.

Release verdict: HOLD. Next required step is to commit exact tested source/test files, check hashes, execute secure-context browser tests and verify restart and concurrency behaviour before any integration into prototype workflows.

## Repository follow-up
The exact source and regression test were subsequently committed to this non-publishing review branch:
- Source: `shared/monarch-encrypted-vault.js`; Git blob SHA `471948d1baf6c9607ff02b3c809c12f74be28a23`; local SHA-256 `d6632e72b5b985e45faa2ae58997297205c83f6ccf209992b1ae77f2aa1e2dfb`.
- Test: `tests/monarch-encrypted-vault.test.cjs`; Git blob SHA `b8a68c9bb8fe13d3b62be703f0c40373cb379e3d`; local SHA-256 `5584cb7e1c3ae40c7d3df134afdc10dc0c65b99ccf15cb942b909b00f6ed8d52`.
- Local test command: `node test-vault.cjs`, Node v22.16.0 — **PASS**.
- After commit, both files were fetched from GitHub and their byte lengths matched the locally tested source/test. Full cryptographic hash comparison against fetched bytes was not executed in the repository runtime.
- Browser IndexedDB, iPhone Safari, reload/power-loss, concurrent-tab and durable crash-recovery tests remain **UNKNOWN**.

## Iteration 20 — browser gate and concurrency hardening
- Attempted headless Chromium 144 with the system browser. Browser process launches, but navigation to the local HTTP test origin is blocked by the execution environment (`ERR_BLOCKED_BY_ADMINISTRATOR`). No browser IndexedDB test ran; Safari/browser persistence remains **UNKNOWN**.
- Added optional IndexedDB `compareAndSwap` implemented in one read-write transaction. `saveIfUnchanged(records, passphrase, expectedCiphertext)` now rejects a conflicting update rather than silently overwriting a changed encrypted archive. Callers must read the current ciphertext, pass that exact expected value (or null for first write), and resolve conflicts by human review.
- Source was re-fetched after commit and inspected: atomic compare-and-swap path present; no browser execution evidence.
- Important residual: the legacy `save()` method still performs an unconditional write. It must not be used by multi-tab or multi-device concurrent writers. CAS is same-origin IndexedDB concurrency control only, not distributed multi-device locking or rollback prevention.
- The vault still lacks monotonic server-signed versions, cross-device coordination, crash/restart acceptance, and independent security review. Release remains **HOLD**.
