#!/usr/bin/env node
"use strict";
// Offline source-level contract checks, not browser/audio playback verification.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"../stephen/osayi-voice-layer.js"),"utf8");
new vm.Script(source,{filename:"osayi-voice-layer.js"});
for(const [label,pattern] of [
 ["African Sovereign selected",/profile:"african"/],
 ["Pidgin default",/language:"pidgin"/],
 ["Normal pace",/pace:"normal"/],
 ["Normal browser speech rate",/u\.rate=1\.0/],
 ["Voice disabled until opted in",/enabled:false/],
 ["No engineered audio claim",/engineeredVoiceStatus:"NOT_CONNECTED"/],
 ["Browser fallback disclosed",/fallback:"DEVICE_BROWSER_TTS"/],
 ["User stop control",/add\("■ Stop"/],
 ["User repeat control",/add\("🔁 Repeat"/],
 ["Public configuration getter",/getConfig:/]
]){assert.match(source,pattern,label);console.log("PASS",label)}
assert.doesNotMatch(source,/\bfetch\s*\(|XMLHttpRequest|WebSocket|MediaRecorder|sendBeacon/,"No network/recording calls in voice layer");
console.log("PASS no remote data calls");
