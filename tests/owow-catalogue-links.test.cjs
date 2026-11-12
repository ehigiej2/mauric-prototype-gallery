#!/usr/bin/env node
// OWOW review-only static catalogue audit. No network, deployment, writes, or real data.
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const page=path.join(root,'owow-approved-prototypes-review.html');
const html=fs.readFileSync(page,'utf8');const failures=[];let links=0;
for(const [,href] of html.matchAll(/\bhref="([^"]+)"/g)){
  if(/^(https?:|mailto:|#)/i.test(href))continue;
  links++;const rel=decodeURIComponent(href.split(/[?#]/)[0]);
  const target=path.resolve(root,rel);
  if(!target.startsWith(root+path.sep))failures.push('Path traversal: '+href);
  else if(!fs.existsSync(target))failures.push('Missing local target: '+href);
}
const buttons=[...html.matchAll(/<button\b[^>]*class="nav"[^>]*aria-controls="([^"]+)"/g)].map(m=>m[1]);
if(buttons.length!==6)failures.push('Expected six navigation controls, found '+buttons.length);
for(const id of buttons){if(!html.includes('id="'+id+'"'))failures.push('Missing section: '+id);}
if(!html.includes('CROWN HOLD'))failures.push('Missing CROWN HOLD disclaimer');
if(!html.includes('Knightpride Logistics'))failures.push('Missing Knightpride unresolved entry');
if(!html.includes('Stephen · Joeyvette'))failures.push('Missing Stephen preview entry');
console.log(JSON.stringify({check:'OWOW_STATIC_CATALOGUE',localLinksChecked:links,sections:buttons.length,failures},null,2));
if(failures.length)process.exitCode=1;
