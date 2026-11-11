/* MAURIC reusable business-domain conversation adapter, research only. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.MonarchBusinessConversation=api})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const domains={
akara:{name:'Mama Akara',unit:'portions of akara',inputs:'beans, oil, fuel, packaging, waste and delivery',next:'Estimate a batch, record ingredient cost and expected unsold portions'},
tailor:{name:'Tailor',unit:'tailoring orders',inputs:'fabric, fittings, labour, electricity, rework and unpaid balances',next:'Confirm customer measurements, deposit, material costs and collection date'},
materials:{name:'Building Materials',unit:'material orders',inputs:'unit sizes, supplier quotes, transport, damage, stock and returns',next:'Confirm specification, quantities, dated supplier quote and delivery terms'},
construction:{name:'Construction',unit:'construction jobs',inputs:'materials, skilled labour, transport, safety and contingency',next:'Record scope, quantities, worker consent and a reviewed quote'},
waka:{name:'Waka',unit:'delivery rounds',inputs:'distance, fuel, rider compensation, waiting, safety and failed trips',next:'Check trip feasibility and rider consent before any assignment'},
trade:{name:'MONARCH Trade',unit:'shop transactions',inputs:'purchase cost, stock, spoilage, operating cost and unpaid balances',next:'Record real stock units and dated prices before a decision'}};
const money=n=>'₦'+Number(n).toLocaleString('en-NG',{maximumFractionDigits:2});
function create(opts={}){const domain=domains[opts.domain]||domains.trade;const base=(typeof globalThis!=='undefined'?globalThis.MonarchConversationEngine:null).createSession({sessionId:opts.sessionId||'business-research'});const history=[];let active=null;function ask(question,ctx={}){const q=String(question||'What next?').trim();const previous=history[history.length-1];let response,reason='domain-guidance';const sales=Number(ctx.sales),cost=Number(ctx.cost),unpaid=Number(ctx.unpaid||0),numbers=Number.isFinite(sales)&&Number.isFinite(cost)&&sales>=0&&cost>=0&&ctx.sales!==''&&ctx.cost!==''&&ctx.sales!=null&&ctx.cost!=null;
if(/previous|before|last question|what did i ask/i.test(q)){reason='turn-memory';response=previous?'Your last question for '+domain.name+' na: '+previous.question:'This na our first question for '+domain.name+'.'}
else if(/profit|margin|cost|price|cash|sales|budget|overrun|money/i.test(q)){reason='cash-and-contribution';response=numbers?'For this fictional '+domain.name+' example: modelled sales '+money(sales)+', costs '+money(cost)+', contribution '+money(sales-cost)+'. If customer never pay '+money(unpaid)+', illustrative cash received na '+money(Math.max(0,sales-unpaid))+'. Contribution no be net profit. If costs rise 10%, contribution go be '+money(sales-cost*1.1)+'.':'I need your example sales and costs first. For '+domain.name+', count '+domain.inputs+'. I no go invent market prices.'}
else if(/risk|safe|approve|permit|legal|insurance/i.test(q)){reason='safety';response='For '+domain.name+', verify lawful trading conditions, accessibility, product safety and human approvals. Real evidence UNKNOWN. No automated authorisation.'}
else if(/supplier|stock|deliver|material|buy|transport/i.test(q)){reason='supply';response='For '+domain.name+', compare '+domain.inputs+'. Supplier quotes, stock and delivery availability remain UNKNOWN until you verify evidence.'}
else{reason='next-step';response='For '+domain.name+', '+domain.next+'. You fit ask about profit, cash, suppliers or safety. I go use only the figures you enter for this simulation.'}
response+='\n\nCROWN HOLD · Research only. No real payments, dispatch or orders.';const r=base.respond('What next?',{progress:0});active={...r,question:q,text:response,reason,domain:opts.domain};history.push(active);if(history.length>12)history.shift();return active}
function speech(){if(!active)return {status:'BLOCKED',reason:'Ask a question first'};return base.speechRequest(active)}
return {ask,speech,cancel:base.cancel,getHistory:()=>history.slice(),domain}}
return {domains,create};
});
