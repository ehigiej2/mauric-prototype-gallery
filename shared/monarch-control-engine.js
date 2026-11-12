/* MONARCH controlled research adapter v0.1 — REVIEW ONLY. No production actions. */
(function(global){
"use strict";
const STATES=Object.freeze(["REQUEST","RESEARCH","EVIDENCE_REVIEW","OWNER_REVIEW","APPROVED_FOR_SIMULATION","FULFILMENT_SIMULATED","POD_SIMULATED","SETTLEMENT_SIMULATED","STOPPED"]);
const NEXT=Object.freeze({REQUEST:"RESEARCH",RESEARCH:"EVIDENCE_REVIEW",EVIDENCE_REVIEW:"OWNER_REVIEW",OWNER_REVIEW:"APPROVED_FOR_SIMULATION",APPROVED_FOR_SIMULATION:"FULFILMENT_SIMULATED",FULFILMENT_SIMULATED:"POD_SIMULATED",POD_SIMULATED:"SETTLEMENT_SIMULATED"});
const REQUIRED=["supplier","provider","safety","consent","riderFairness"];
const allowedTenant=/^[a-z0-9][a-z0-9_-]{1,63}$/;
function makeEngine({tenant,prototype,clock=()=>new Date().toISOString()}={}){
 if(!allowedTenant.test(tenant||"")||!allowedTenant.test(prototype||""))throw Error("Explicit tenant and prototype IDs required");
 let seq=0;const cases=new Map();const events=[];
 function log(id,kind,detail){const entry=Object.freeze({sequence:++seq,time:clock(),caseId:id,kind,detail});events.push(entry);return entry}
 function create(id){if(!/^[a-zA-Z0-9_-]{2,80}$/.test(id||"")||cases.has(id))throw Error("Invalid or duplicate case ID");const c={id,tenant,prototype,status:"REQUEST",revision:1,checks:Object.fromEntries(REQUIRED.map(x=>[x,"UNKNOWN"])),approvedBy:null,reason:null};cases.set(id,c);log(id,"CREATE","Synthetic case created");return view(id)}
 function get(id){const c=cases.get(id);if(!c)throw Error("Case not found or not accessible in this tenant");return c}
 function view(id){const c=get(id);return Object.freeze({...c,checks:Object.freeze({...c.checks})})}
 function invalidate(c,why){c.revision++;c.approvedBy=null;c.reason=why;if(c.status!=="STOPPED"&&c.status!=="REQUEST")c.status="EVIDENCE_REVIEW";log(c.id,"INVALIDATE",why)}
 function record(id,key,status){const c=get(id);if(!REQUIRED.includes(key))throw Error("Unknown evidence gate");if(!["UNKNOWN","SUPPLIED_UNVERIFIED","REVIEWED_UNAUTHENTICATED","REVOKED","EXPIRED"].includes(status))throw Error("Invalid evidence status");if(c.status==="STOPPED")throw Error("STOPPED case is immutable");if(c.checks[key]===status)return view(id);c.checks[key]=status;invalidate(c,key+" changed to "+status);return view(id)}
 function transition(id,target,{actor="researcher",reason=""}={}){const c=get(id);if(!STATES.includes(target))throw Error("Unknown state");if(target==="STOPPED"){if(c.status==="STOPPED")return view(id);c.status="STOPPED";c.approvedBy=null;c.reason=reason||"Stopped by human or safeguard";c.revision++;log(id,"STOP",c.reason);return view(id)}
 if(c.status==="STOPPED")throw Error("Stopped case cannot restart");if(NEXT[c.status]!==target)throw Error("Invalid state transition");
 if(target==="OWNER_REVIEW"&&REQUIRED.some(k=>c.checks[k]==="UNKNOWN"||c.checks[k]==="REVOKED"||c.checks[k]==="EXPIRED"))throw Error("Missing or invalid evidence; owner review blocked");
 if(target==="APPROVED_FOR_SIMULATION"){if(actor!=="owner")throw Error("Owner required");if(REQUIRED.some(k=>c.checks[k]!=="REVIEWED_UNAUTHENTICATED"))throw Error("All evidence must be recorded as reviewed, but remains unverified");c.approvedBy="owner (synthetic)";}
 c.status=target;c.revision++;log(id,"TRANSITION",target+" via "+actor);return view(id)}
 function revokeConsent(id){return record(id,"consent","REVOKED")}

 // Handoff carries synthetic non-sensitive references only. Never serialise approvals, evidence or payment details.
 const CHANNEL="monarch-review-handoff-v1";
 function handoff(id,destination){const c=get(id);if(c.status==="STOPPED")throw Error("Stopped case cannot be handed off");if(!allowedTenant.test(destination||""))throw Error("Invalid destination prototype");
 const packet=Object.freeze({schema:CHANNEL,tenant,source:prototype,destination,sourceCaseId:id,sourceRevision:c.revision,kind:"RESEARCH_REFERENCE_ONLY",created:clock()});
 log(id,"HANDOFF","Research-only reference prepared for "+destination);return packet}
 function receive(packet){if(!packet||packet.schema!==CHANNEL||packet.tenant!==tenant||packet.destination!==prototype||packet.kind!=="RESEARCH_REFERENCE_ONLY")throw Error("Rejected cross-tenant, cross-target or invalid handoff");
 if(!allowedTenant.test(packet.source||"")||!/^[a-zA-Z0-9_-]{2,80}$/.test(packet.sourceCaseId||"")||!Number.isSafeInteger(packet.sourceRevision)||packet.sourceRevision<1)throw Error("Malformed research reference");
 const id="IN_"+packet.source+"_"+packet.sourceCaseId;
 if(cases.has(id))return Object.freeze({duplicate:true,case:view(id)});
 const imported=create(id);log(id,"RECEIVE","Quarantined research reference from "+packet.source+"; re-verification required");return Object.freeze({duplicate:false,case:imported})}
 function ledger(id){if(id)get(id);return Object.freeze(events.filter(e=>!id||e.caseId===id).map(x=>({...x})))}
 function snapshot(){return Object.freeze({tenant,prototype,cases:[...cases.keys()].map(view),events:ledger(),note:"SYNTHETIC SESSION ONLY; NOT AN AUTHORITATIVE AUDIT LEDGER"})}
 return Object.freeze({create,view,record,transition,revokeConsent,ledger,snapshot,handoff,receive,states:STATES});
}
function attach({tenant,prototype,label="Decision controls"}={}){if(!global.document)return null;const engine=makeEngine({tenant,prototype});const key="__monarch_controls_"+tenant+"_"+prototype;if(global[key])return global[key];global[key]=engine;
 const button=global.document.createElement("button");button.type="button";button.textContent="🔒 "+label;button.setAttribute("aria-expanded","false");button.style.cssText="position:fixed;right:12px;bottom:12px;z-index:2147483000;background:#153d6a;color:#fff;border:2px solid #fff;border-radius:16px;padding:12px 16px;font:700 14px system-ui;box-shadow:0 5px 20px #0004;cursor:pointer";
 const panel=global.document.createElement("section");panel.hidden=true;panel.setAttribute("role","region");panel.setAttribute("aria-label","Synthetic transaction controls");panel.style.cssText="position:fixed;right:12px;bottom:70px;z-index:2147483000;width:min(360px,calc(100vw - 24px));max-height:68dvh;overflow:auto;background:#fff;color:#17304b;border:2px solid #153d6a;border-radius:16px;padding:15px;box-shadow:0 10px 35px #0005;font:14px system-ui";
 const title=global.document.createElement("strong");title.textContent="MONARCH Control Lab · "+prototype;panel.append(title);
 const note=global.document.createElement("p");note.textContent="SYNTHETIC · CROWN HOLD. No real approval, payment, dispatch or settlement. All evidence remains unauthenticated.";panel.append(note);
 const status=global.document.createElement("pre");status.style.cssText="white-space:pre-wrap;overflow-wrap:anywhere;background:#edf3fa;padding:10px;border-radius:10px";panel.append(status);
 const create=global.document.createElement("button");create.type="button";create.textContent="Create fictional case";create.style.cssText="padding:10px;background:#1858a5;color:white;border:0;border-radius:10px";
 const advance=global.document.createElement("button");advance.type="button";advance.textContent="Advance one research gate";advance.style.cssText="padding:10px;margin:8px;background:#e7eef8;border:0;border-radius:10px";
 const stop=global.document.createElement("button");stop.type="button";stop.textContent="Stop this case";stop.style.cssText="padding:10px;background:#78322e;color:white;border:0;border-radius:10px";
 panel.append(create,advance,stop);
 let current=null;function render(msg){status.textContent=(msg?msg+"\n\n":"")+(current?JSON.stringify(engine.view(current),null,2):"No case yet.")}render();
 create.onclick=()=>{current="SIM_"+String(Date.now())+"_"+String(Math.floor(Math.random()*9999));engine.create(current);render("Fictional case created")};
 advance.onclick=()=>{if(!current)return render("Create a case first");try{const s=engine.view(current).status;engine.transition(current,NEXT[s]||"OWNER_REVIEW");render("Moved forward")}catch(e){render("BLOCKED: "+e.message)}};
 stop.onclick=()=>{if(current){engine.transition(current,"STOPPED",{reason:"Manually stopped in review prototype"});render("Case stopped")}};
 button.onclick=()=>{panel.hidden=!panel.hidden;button.setAttribute("aria-expanded",String(!panel.hidden));if(!panel.hidden)render()};
 global.document.body.append(button,panel);return engine}
global.MonarchControl=Object.freeze({makeEngine,attach,STATES,REQUIRED});
})(typeof window!=="undefined"?window:globalThis);
