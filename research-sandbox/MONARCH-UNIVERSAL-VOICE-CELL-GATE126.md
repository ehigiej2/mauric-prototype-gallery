# GATE 126 — MONARCH Universal Voice Cell
Status: DRAFT RESEARCH ARCHITECTURE · CROWN HOLD · no hardware or live voice integration verified.

## Founder mandate
A user without a smartphone — akara seller, market trader, shopkeeper, mechanic, electrician, plumber, carpenter or other independent service provider — can converse with Osayi in Nigerian Pidgin by default. English optional. User retains pricing, payment, work acceptance and consent authority. Accessible controls, offline-first, no involuntary workforce replacement. Eligible verified solo-owner basic access free, excluding disclosed external goods/delivery/tax/network fees.

## Design variants
A. Shared Voice Station: mains-powered, authorised market/shop/cooperative gateway with mic, speaker, local ASR/TTS inference if feasible; multiple personal push-to-talk tokens/receivers; privacy by identity and explicit consent.
B. Personal Voice Cell: low-power battery mic/speaker/button, audio over authenticated local link to nearby gateway. No SIM or per-device subscription. Cannot promise working without a gateway; gateway costs must be transparently funded.
C. Standalone cellular voice: last-resort optional infrastructure; recurring connectivity exists and is not falsely called subscription-free.

## Conversation flow
Wake via tactile push-to-talk (not continuous microphone). User speaks -> local audio buffer -> consented encrypted transmission -> gateway performs speech recognition/intent interpretation -> asks for missing facts -> computes a proposed result -> spoken response with user-controlled confirmation. On no network or no model, offer locally stored phrases and bounded order functions; do NOT invent a generated response. No recording retained by default. Clear audio capture indicator, mute, cancel, replay and language controls. No voice identity verification assumed.

## Domain workflows
- Akara/food: verbal sales entry, ingredient usage, reorder suggestions, customer order readback, transparent cost/margin estimates.
- Market retail/shop: stock count, item prices, low-stock reminder, customer order acceptance, supplier comparison from permissioned evidence.
- Handyman: job intake, materials/labour estimate, appointment proposals, scope changes, quote confirmation, job completion evidence.
All values UNKNOWN until provided or independently verified. No autonomous banking, spending, dispatch or acceptance. No double charging.

## Technical acceptance
- Demonstrate mic quality and speech recognition in real market noise, Edo accents/Pidgin; native-speaker evaluation and consent.
- Measure total energy including push-to-talk, radio/audio bursts, speech playback, idle sleep and battery aging.
- Benchmark local gateway compute/storage for privacy-preserving ASR/TTS and conversation latency; actual voice timbre use requires licensed reusable voice asset, model rights and runtime proof.
- Device identity, authentication, per-tenant isolation, encrypted transit/storage, replay resistance, revocation, bounded queues, deletion and safe failure.
- Human-centred accessibility: audible/visual/tactile feedback; ability to ask again; loudness control and hearing-access alternative.
- Compare full network TCO including shared gateway, power, connectivity, maintenance, certification, warranty, replacements and support.
- No claim that Nano runs a full LLM, voice engine or data centre.

## Proposed research test scenarios
1. Akara seller with no smartphone: request sales total, record 3 sales, receive spoken recap; no fabricated stock.
2. Shopkeeper: update stock, propose reorder, require explicit owner confirmation.
3. Electrician: capture materials and labour, compute quote, require human approval.
4. Offline: local bounded commands only; explain unavailable features and queue with expiry.
5. Cross-tenant: prevent other trader hearing or retrieving sensitive records.
6. Revoked device: refuse sync; no fake order confirmation.
7. No gateway: explain limited service rather than pretending to be online.
8. Cost: compare shared-voice station with personal voice cell for 5/50/500 traders.

Next deliverable: executable synthetic conversational test harness and quantified gateway-versus-device voice budget, followed by independent runtime evidence. No public release without founder authorisation.
