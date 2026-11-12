/* Synthetic-only Osayi research memory controls; not a production identity system. */
(function(){
'use strict';
const tenant='demo-tenant',prototype='trade';
// Scope is a synthetic demo namespace, never a verified account identity.
function mount(){
 const panel=document.querySelector('#workspace');
 if(!panel||panel.classList.contains('hidden')||document.querySelector('#heading')?.textContent!=='Ask Osayi'||document.querySelector('#researchMemory'))return;
 const holder=document.createElement('section');holder.id='researchMemory';
 holder.innerHTML='<h3>🔐 Research memory (fictional only)</h3><p class="muted">Optional encrypted local save. No real customer details. Keep your passphrase safe; it cannot be recovered.</p><label>Research note <textarea id="researchNote" maxlength="8000" rows="3" placeholder="Fictional research only"></textarea></label><label>Passphrase (12+ characters) <input id="researchPass" type="password" autocomplete="new-password" minlength="12"></label><label><input id="researchConsent" type="checkbox" style="width:auto"> I consent to saving this fictional research on this device</label><button class="action" type="button" id="researchSave">Save Research</button> <button class="action" type="button" id="researchRecover">Recover Research</button> <button class="action" type="button" id="researchDelete">Delete Research</button><p id="researchStatus" role="status" aria-live="polite"></p>';
 panel.append(holder);
 const note=holder.querySelector('#researchNote'),pass=holder.querySelector('#researchPass'),consent=holder.querySelector('#researchConsent'),status=holder.querySelector('#researchStatus');
 let memory;
 try{memory=MonarchResearchMemory.create({tenant,prototype,storage:localStorage});}
 catch{status.textContent='Encrypted local memory unavailable in this browser/context.';holder.querySelectorAll('button').forEach(b=>b.disabled=true);return;}
 holder.querySelector('#researchSave').onclick=async()=>{try{await memory.save({notes:note.value,questions:[]},pass.value,{consent:consent.checked});pass.value='';status.textContent='Encrypted fictional research saved locally for up to seven days.';}catch(e){status.textContent='Not saved: '+e.message;}};
 holder.querySelector('#researchRecover').onclick=async()=>{try{const data=await memory.load(pass.value);if(!data){status.textContent='No saved research for this demo scope.';return;}note.value=data.notes;pass.value='';status.textContent='Fictional research recovered locally.';}catch{status.textContent='Recovery failed: wrong passphrase, expired or invalid record.';}};
 holder.querySelector('#researchDelete').onclick=()=>{memory.clear();note.value='';pass.value='';consent.checked=false;status.textContent='Local encrypted research record deleted.';};
}
document.querySelectorAll('.tile').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#researchMemory')?.remove();if(b.dataset.mode==='osayi')mount();}));
document.querySelector('#back')?.addEventListener('click',()=>{const holder=document.querySelector('#researchMemory');if(holder){holder.querySelector('#researchPass').value='';holder.remove();}});
})();
