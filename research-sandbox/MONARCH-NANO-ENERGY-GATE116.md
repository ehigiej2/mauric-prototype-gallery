# Gate 116 — Nano Reach Energy Autonomy Research
Status: research hypothesis, not validated hardware. CROWN HOLD.

## Architecture
Gateway powered by authorised existing broadband and mains/solar where approved. Receiver uses ultra-low-power radio with scheduled receive windows, e-paper/segment display, buzzer, tactile ACK/review buttons, rechargeable protected cell and optional indoor PV + energy-harvesting PMIC. The gateway buffers notifications; receiver authenticates end-to-end with server. No unauthorised Wi-Fi or spectrum use.

## Critical physical constraints
Energy autonomy requires average harvested power >= average consumed power + storage/conversion losses over real duty cycles. A battery supplies storage, not new energy. NFC harvesting requires nearby active reader and cannot power a long-distance receiver continuously. LoRaWAN Class A only receives downlink after uplink; Class B supports scheduled windows; Class C draws more power. Evaluate Bluetooth LE PAwR for bidirectional scheduled communication; hardware support must be checked.

## Reproducible illustrative calculations (NOT measured)
At 3.7 V, 500 mAh stores nominal 1.85 Wh. At 1 mW continuous average, ideal endurance 1850 hours = 77.1 days before losses and capacity derating; at 10 mW, 185 hours = 7.7 days; at 50 mW, 37 hours = 1.54 days. This demonstrates why actual radio listening duty cycle dominates battery life. At 1 mW average, daily energy use 24 mWh; at 10 mW, 240 mWh. Actual usable energy and charge/discharge limits require measured validation.
Energy budget per day: E_sleep + E_radio_listen + E_radio_transmit + E_alert + E_display + E_leakage + E_gateway_share (separately, for system cost). Harvested energy: integrated measured power at device plane across real lighting hours, temperature and ageing; never infer autonomy from nominal panel wattage.

## Differentiated research hypotheses
1. Adaptive wake scheduling from order arrival probability, with hard maximum notification latency; no discrimination against low-volume merchants.
2. Gateway-buffered store-and-forward; duplicate-safe ACK; alert state must remain PENDING until authenticated merchant response.
3. Dual power mode: USB-powered in dark stores, indoor-PV-assisted in bright stores, battery-only during outages.
4. E-paper/segment display retains last state without continuous refresh; screen content contains alias only.
5. Battery health and low-energy escalation to merchant-approved backup, without leaking order data.
6. Compare BLE PAwR, Wi-Fi, ESP-NOW and LoRaWAN class B in field measurements; never assert universal range.

## Falsifiable test matrix
Record p50/p95/p99 alert latency, event delivery %, false ACK %, offline recovery, standby current, receive current, TX current, alert energy, battery capacity, lux and spectrum, harvested mWh/day, dark autonomy hours, thermal profile, cell protection, charging safety, device cost and per-merchant connectivity cost. Test 24h/72h/7d light/dark profiles, gateway failure, lost device, stale events, power loss, revoked credentials, wrong tenant and accessible alerts. UNKNOWN stays UNKNOWN.

## Commercial gate
Optimise total cost of ownership: BOM + tooling/NRE + certifications + gateway amortisation + backhaul + energy + repairs + replacement + security maintenance + shipping/import charges + support. Compare against existing merchant phone/browser and passive QR. £500 research budget maximum, no expenditure authorised.

## Sources (reviewed November 2026)
Nature (2026) indoor PV review: https://www.nature.com/articles/s41586-026-11133-y
ACS (2026) deployment-centred indoor PV: https://pubs.acs.org/aelccp/article/11/3/2474/5152190/Underexplored-Dimensions-of-Emerging-Indoor
IEEE batteryless intermittent computing: https://ieeexplore.ieee.org/abstract/document/11244474
Bluetooth LE primer (PAwR): https://www.bluetooth.com/bluetooth-le-primer/
LoRa Alliance class descriptions: https://lora-alliance.org/about-lorawan-old/
ST battery-free NFC: https://www.st.com/content/st_com/en/products/nfc/st25-nfc-rfid-tags-and-readers/st25-dynamic-nfc-tags.html
