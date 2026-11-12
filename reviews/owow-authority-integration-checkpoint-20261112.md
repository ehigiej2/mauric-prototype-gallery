# MONARCH authority integration — review gate

This is a review-only integration checkpoint. The OWOW browser guard and synthetic event scoping are connected in the Waka/Trade review prototype. A separate server-side authority contract was locally tested (33/33 across v1/v2), but it has NOT been integrated into the production backend.

## Mandatory production work
1. Keep server context issuance private to authenticated middleware; browser flags are not identity.
2. Bind tenant, principal, action, state, service and idempotency to authenticated server data.
3. Resolve CROWN HOLD and policy revision from a trusted authoritative store.
4. Make approval/revocation/idempotency reservation atomic in a durable transactional store.
5. Revalidate immediately before execution; maintain tamper-evident audit and compensating recovery.
6. Prove multi-tenant isolation, offline queue quarantine, transport licensing and payment permissions with real integration tests.
7. No production merge or deployment without owner approval and complete acceptance evidence.

Status: REVIEW ONLY / UNKNOWN for production / CROWN HOLD.
