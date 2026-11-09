#!/usr/bin/env node
"use strict";
// Source/DOM contract checks only. Does not claim Safari, audio, or HTTPS deployment.
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const path=require("node:path"),root=path.join(__dirname,"..");
const html=fs.readFileSync(path.join(root,"stephen/osayi-unified-journey.html"),"utf8");
const voice=fs.readFileSync(path.join(root,"stephen/osayi-voice-layer.js"),"utf8");
const checks=[
 ["Research hold visible",()=>{assert.match(html,/CROWN HOLD/);assert.match(html,/RESEARCH ONLY/)}],
 ["Three trade choices",()=>{for(const id of ["home","retail","agri"])assert.match(html,new RegExp('value="'+id+'"'))}],
 ["Buttons and handlers connected",()=>{for(const id of ["prepare","evidence","compare","review"]){assert.match(html,new RegExp('id="'+id+'"'));assert.match(html,new RegExp('\\$\\("'+id+'"\\)\\.onclick='))}}],
 ["No remote dependencies or external calls",()=>{assert.doesNotMatch(html,/\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|<script[^>]+src=["']https?:/i)}],
 ["No real transactions",()=>{assert.match(html,/No prices, customers or demand verified/);assert.match(html,/NOT SENT/);assert.match(html,/All work na local simulation/)}],
 ["Voice script is local",()=>assert.match(html,/src="\.\/osayi-voice-layer\.js"/)],
 ["Selected voice defaults",()=>{for(const marker of ['profile:"african"','language:"pidgin"','pace:"normal"','enabled:false','engineeredVoiceStatus:"NOT_CONNECTED"'])assert.ok(voice.includes(marker),marker)}],
 ["Inline JavaScript parses",()=>{for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))new vm.Script(m[1])}],
 ["Voice layer JavaScript parses",()=>new vm.Script(voice)]
];
let errors=0;for(const [label,fn] of checks){try{fn();console.log("PASS",label)}catch(e){errors++;console.error("FAIL",label,e.message)}}
process.exitCode=errors?1:0;
