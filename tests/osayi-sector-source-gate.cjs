#!/usr/bin/env node
// Research-only source and JavaScript parse gate. No browser or audio verification.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path'),root=path.join(__dirname,'..');
const files=['stephen/osayi-voice-guide.html','stephen/universal-sectors.html','stephen/sovereign-studio.html','stephen/control-centre.html'];
let failed=0;
function check(label,fn){try{fn();console.log('PASS '+label)}catch(e){failed++;console.error('FAIL '+label+': '+e.message)}}
for(const file of files){const html=fs.readFileSync(path.join(root,file),'utf8');check(file+' has research guardrails',()=>{assert.match(html,/CROWN HOLD/);assert.match(html,/RESEARCH/i)});
check(file+' JS parses',()=>{const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];assert.ok(scripts.length);for(const s of scripts)new vm.Script(s[1],{filename:file})});
check(file+' no remote scripts',()=>{assert.doesNotMatch(html,/<script[^>]+src=/i)});
}
const voice=fs.readFileSync(path.join(root,files[0]),'utf8'),sectors=fs.readFileSync(path.join(root,files[1]),'utf8');
check('Osayi handoff wired',()=>{assert.match(voice,/id="continue"/);assert.match(voice,/dest\.searchParams\.set\("sector"/);assert.match(voice,/step!==3/);assert.match(sectors,/new URLSearchParams\(window\.location\.search\)/);assert.match(sectors,/hasOwnProperty\.call\(cases,requested\)/)});
check('No microphone recording upload code',()=>{assert.doesNotMatch(voice,/\bfetch\s*\(|XMLHttpRequest|WebSocket|MediaRecorder|sendBeacon/);});
check('Osayi browser voice clearly labelled fallback',()=>assert.match(voice,/NOT the engineered African Sovereign voice/));
process.exitCode=failed?1:0;
