# OWOW encrypted persistence acceptance — 2026-11-12

Status: ENGINE PASS / WAKA INTEGRATION NOT YET ACCEPTED / CROWN HOLD.

## Executed
`OWOW_CHROMIUM_PATH=<existing cached Chromium> NODE_PATH=<existing Playwright installation> node tests/owow-encrypted-indexeddb-browser.cjs`

Chromium launched on connected Chromebook and executed seven assertions against the existing `shared/monarch-encrypted-vault.js` using a local HTTP server and actual IndexedDB:
1. Stored envelope does not contain the plaintext synthetic case ID.
2. Separate tenant sees no other tenant's archive.
3. Archive restored after storage write.
4. Restored records are quarantined as untrusted; no automatic replay.
5. Incorrect passphrase rejected.
6. Stale compare-and-swap update rejected.
7. Modified ciphertext rejected.

Result: PASS 7/7; no production data, external calls, deployment or new packages.

## Release blockers
- Waka `monarch-trade-waka-review.html` still uses transient `state` and loses synthetic orders on reload. Vault currently validates only a narrower queue-command schema; arbitrary business records must NOT be force-mapped into payment commands.
- Integrate a separately versioned synthetic business-record schema with strict validation, tenant isolation, encryption, atomic writes, restore quarantine and explicit user-supplied key; do not store keys or plaintext in browser storage.
- Ensure UI never labels a record 'saved' until durable commit completes; prevent duplicate submits during pending commit and handle storage failure visibly.
- Verify reload, concurrent tab conflicts, wrong key, tamper, revocation, lost key, offline reopen, recovery and migration in actual Waka page.
- Live production identity, independent trusted checkpoints and authenticated backend remain UNKNOWN. No live money, dispatch or clinical actions.

No production merge; CROWN HOLD.
