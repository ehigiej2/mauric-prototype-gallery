/* Run: node --test pilots/manchester-2026-11/preview.test.cjs
   No browser dependencies, network or live business data. */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(__dirname+'/preview.html','utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(js,'inline script found');
function open(business){
 class Element {
  constructor(){this.children=[];this.textContent='';this.style={};this.listeners={};}
  appendChild(x){this.children.push(x);return x;}
  replaceChildren(){this.children=[];}
  setAttribute(){}
  addEventListener(name,fn){this.listeners[name]=fn;}
  click(){(this.listeners.click||this.onclick)?.();}
 }
 const nodes=new Map();
 const document={getElementById(id){if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id)},createElement(){return new Element()}};
 vm.runInNewContext(js,{document,URLSearchParams,location:{search:'?business='+business}},{timeout:1000});
 const buttons=nodes.get('actions').children;
 const press=(label)=>{const b=buttons.find(x=>x.textContent===label);assert.ok(b,'missing action '+label);b.click();return nodes.get('result').children};
 const act=(label)=>{const b=nodes.get('result').children.find(x=>x.textContent===label);assert.ok(b,'missing control '+label);b.click()};
 const status=()=>nodes.get('result').children[1].textContent;
 return {buttons,press,act,status,brand:nodes.get('brand').textContent};
}
const profiles=['exclusive-kutz','meat-me-here','sami-african-foods','gorton-superstore','moston-superstore','next-level-lounge','roots-restaurant','bakery-reserve','grocery-reserve','barber-reserve'];
for(const profile of profiles)test(profile+' renders six functional navigation buttons',()=>{const p=open(profile);assert.equal(p.buttons.length,6);for(const b of p.buttons){b.click();assert.ok(p.status().includes('Sample orders:'))}});
test('booking undo does not delete orders',()=>{const p=open('exclusive-kutz');p.press('Walk-in service');p.act('Add sample order');p.press('Appointment request');p.act('Add sample booking');p.act('Undo last sample');assert.match(p.status(),/Sample orders: 1 \| Sample bookings: 0/)});
test('sample stock never becomes negative',()=>{const p=open('sami-african-foods');p.press('Stock overview');for(let i=0;i<20;i++)p.act('Record sample sale (−1)');assert.match(p.status(),/Product stock: 0/)});
test('synthetic session reset clears activity',()=>{const p=open('meat-me-here');p.press('Sample order');p.act('Add sample order');p.press('Daily summary');p.act('Reset synthetic session');assert.match(p.status(),/Sample orders: 0/)});
test('no external requests or persistent storage',()=>{assert.doesNotMatch(js,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB/)});
