/* MONARCH reusable conversation engine v1: no secrets, network calls or provider synthesis. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.MonarchConversationEngine=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VOICE={manifest:'./audio/stephen-osayi-v5/manifest.json',identity:'MONARCH — African Sovereign V2',voiceId:'D0uq55pjZpKu82kXzFOe',model:'eleven_v4'};
const stages=['Customer Request','Materials & Supply','Skilled Worker','Quote & Cost','Safety & Approval','Job Handover'];
const money=n=>'₦'+Math.round(n).toLocaleString('en-NG');
function createSession(opts={}){let seq=0,history=[],active=0;const listeners=[];const emit=(type,detail={})=>{const event={schema:'monarch.conversation.v1',type,sessionId:opts.sessionId||'local-research',turnId:active,sequence:++seq,...detail};listeners.forEach(fn=>fn(event));return event};const on=fn=>{listeners.push(fn);return()=>{const i=listeners.indexOf(fn);if(i>=0)listeners.splice(i,1)}};
function cancel(){active++;emit('speech.cancelled',{reason:'new turn or stop'});return active}
function respond(question,ctx={}){cancel();const id=active;emit('turn.started',{question});const q=String(question||'What next?').trim();const progress=Math.max(0,Math.min(6,Number(ctx.progress)||0));const cost=Number.isFinite(ctx.cost)?ctx.cost:null,quote=Number.isFinite(ctx.quote)?ctx.quote:null;let text,reason;
if(/profit|margin|cost|quote|price|budget|overrun/i.test(q)){reason='financial-model';text=cost!==null&&quote!==null?'For this simulated job, quote na '+money(quote)+', estimated cost na '+money(cost)+', contribution na '+money(quote-cost)+'. If costs rise by 10%, contribution go be '+money(quote-cost*1.1)+'. Contribution no be net profit; tax, warranty and overhead still matter.':'No complete saved quote and cost yet. Complete the materials, worker and quote stages first. I no go invent figures.'}
else if(/risk|safe|permit|approval|insurance|legal/i.test(q)){reason='safety';text='Safety assessment, permits, insurance and competent worker checks remain UNKNOWN. Human approval and inspection are required; practice approval no authorise real work.'}
else if(/supplier|timber|material|stock|deliver|transport/i.test(q)){reason='supplier';text='Compare dated delivered cost, specification, lawful origin, stock, lead time and returns. Real supplier evidence is UNKNOWN; no automatic purchase.'}
else if(/worker|labour|carpenter|electrician|trade/i.test(q)){reason='worker';text='Check trade fit, consent, qualifications where required, safety, insurance and availability. No verified worker matching or dispatch.'}
else if(/previous|before|last question|what did i ask/i.test(q)){reason='conversation-memory';text=history.length?'Your previous question na: '+history[history.length-1].question+'. You fit ask follow-up about that job.':'This na our first question for this session.'}
else{reason='next-step';text=progress===6?'Six practice stages recorded. Review all evidence before any real decision.':'You don complete '+progress+'/6 practice stages. Next step na '+stages[progress]+'. Save the stage, then ask me to review.'}
text+='\n\nCROWN HOLD · Fictional research only. No live payments or dispatch.';const item={turnId:id,question:q,text,reason,progress};history.push(item);if(history.length>12)history.shift();emit('reply.ready',{text,reason});return item}
function speechRequest(reply){return {schema:'monarch.speech.v1',turnId:reply.turnId,text:reply.text,voice:VOICE.identity,voiceId:VOICE.voiceId,model:VOICE.model,lexicon:'pidgin-v1',adapter:'NOT_CONNECTED',status:'BLOCKED',reason:'No approved on-demand synthesis backend'} }
return {respond,cancel,on,emit,speechRequest,getHistory:()=>history.slice(),getTurn:()=>active}}
return {VOICE,createSession,stages};
});
