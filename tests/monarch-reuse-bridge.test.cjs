const assert=require('node:assert/strict');const fs=require('node:fs'),vm=require('node:vm');
const ctx={};vm.runInNewContext(fs.readFileSync(__dirname+'/../shared/monarch-reuse-bridge.js','utf8'),ctx);
const api=ctx.MonarchReuseBridge;
(async()=>{
const tenant='tenant_one',caseId='CASE_001',registryDigest='sha256:'+'a'.repeat(64),signerRegistryDigest='sha256:'+'c'.repeat(64),vaultDigest='sha256:'+'b'.repeat(64);
const base={tenant,caseId,registryDigest,signerRegistryDigest,version:4,vaultDigest,executionId:'EXEC_001',idempotencyKey:'IDEM_001'};
const pass={
capreg:async m=>({tenant:m.tenant,caseId:m.caseId,valid:true,registryDigest,canonicalMain:true,commitSha:'a'.repeat(40)}),
habHia:async m=>({tenant:m.tenant,caseId:m.caseId,valid:true,signerRegistryDigest,signatureScheme:'ED25519-HIA-PAYLOAD-V1',scopeMatched:true,currentKeyActive:true,policyValid:true,verificationReceiptCurrent:true}),
consumption:async m=>({tenant:m.tenant,caseId:m.caseId,replayBlocked:true,unknown:false}),
audit:async m=>({tenant:m.tenant,caseId:m.caseId,chainValid:true,orgScoped:true}),
checkpoint:async m=>({tenant:m.tenant,caseId:m.caseId,verified:true,version:4,vaultDigest,independentCustody:true})
};
const bridge=api.makeBridge({tenant,adapters:pass});
const result=await bridge.inspect(base);
assert.equal(result.failures.length,0);assert.equal(result.release,'HOLD');assert.equal(result.productionAuthority,false);assert.equal(result.customerDataCopied,false);
const broken=api.makeBridge({tenant,adapters:{...pass,checkpoint:async m=>({tenant,caseId,verified:false,version:3,vaultDigest,independentCustody:false})}});
const blocked=await broken.inspect(base);assert.ok(blocked.failures.some(x=>x.startsWith('checkpoint:')));assert.equal(blocked.release,'HOLD');
const wrongTenant=api.makeBridge({tenant,adapters:{...pass,capreg:async m=>({tenant:'tenant_two',caseId,valid:true,registryDigest,canonicalMain:true,commitSha:'a'.repeat(40)})}});
assert.ok((await wrongTenant.inspect(base)).failures.some(x=>x.startsWith('capreg:')));\nconst wrongSigner=api.makeBridge({tenant,adapters:{...pass,habHia:async m=>({tenant:m.tenant,caseId:m.caseId,valid:true,signerRegistryDigest:registryDigest,signatureScheme:'ED25519-HIA-PAYLOAD-V1',scopeMatched:true,currentKeyActive:true,policyValid:true,verificationReceiptCurrent:true})}});\nassert.ok((await wrongSigner.inspect(base)).failures.some(x=>x.startsWith('habHia:')));\nawait assert.rejects(()=>bridge.inspect({...base,signerRegistryDigest:'invalid'}),/Invalid version or digest/);
await assert.rejects(()=>bridge.inspect({...base,tenant:'tenant_two'}),/Tenant mismatch/);
await assert.rejects(()=>bridge.inspect({...base,version:0}),/Invalid version/);
assert.throws(()=>api.makeBridge({tenant,adapters:{}}),/Five independently supplied/);
console.log('PASS metadata bridge: five contract bindings, HOLD-only result, missing checkpoint, tenant mismatch, invalid version, constructor fail-closed');
})().catch(e=>{console.error(e);process.exitCode=1});