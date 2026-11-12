const assert=require('node:assert/strict');const fs=require('node:fs'),vm=require('node:vm');
const ctx={};vm.runInNewContext(fs.readFileSync(__dirname+'/../shared/monarch-capreg-readonly-adapter.js','utf8'),ctx);
const api=ctx.MonarchCAPREGReadAdapter;
(async()=>{
const meta={tenant:'tenant_one',caseId:'CASE_001',registryDigest:'sha256:'+'a'.repeat(64)};
const recovered={state:'RECOVERED',execution_authority:false,current_registry_digest:meta.registryDigest,current_snapshot_digest:'sha256:'+'b'.repeat(64),current_snapshot_id:'CAPREG-SNAPSHOT-000001',snapshot_count:1};
const attestor=async x=>({verified:true,canonicalMain:true,commitSha:'c'.repeat(40),registryDigest:x.registryDigest,snapshotDigest:x.snapshotDigest});
const adapter=api.makeCAPREGReadAdapter({recover:async()=>recovered,headAttestor:attestor});
const ok=await adapter(meta);assert.equal(ok.valid,true);assert.equal(ok.canonicalMain,true);assert.equal(ok.executionAuthority,false);
const bad=api.makeCAPREGReadAdapter({recover:async()=>({...recovered,current_registry_digest:'sha256:'+'d'.repeat(64)}),headAttestor:attestor});
assert.equal((await bad(meta)).valid,false);
const untrusted=api.makeCAPREGReadAdapter({recover:async()=>recovered,headAttestor:async()=>({verified:false,canonicalMain:false})});
assert.equal((await untrusted(meta)).valid,false);
const offline=api.makeCAPREGReadAdapter({recover:async()=>{throw Error('unavailable')},headAttestor:attestor});
assert.equal((await offline(meta)).valid,false);
await assert.rejects(async()=>api.makeCAPREGReadAdapter({recover:async()=>recovered}),/attestor required/i);
console.log('PASS CAPREG read adapter: recovered head, registry mismatch, untrusted main attestation, source outage and constructor fail-closed');
})().catch(e=>{console.error(e);process.exitCode=1});