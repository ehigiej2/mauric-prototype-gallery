"""Offline evidence validator; never authorises spending, rollout or contact."""
import math
from datetime import datetime,timezone
from pathlib import Path
import json
CRITERIA=[c['id'] for c in json.loads((Path(__file__).with_name('criteria.json')).read_text())]
COSTS=['landed_device','accessories_power','packaging_assembly','provisioning','setup_training','integration','monthly_connectivity','monthly_energy','monthly_consumables','monthly_support_licences','repair_replacement','downtime','return_exit','residual_value']
def gate(records,now):
    issues=[]; seen=set(); current=datetime.fromisoformat(now.replace('Z','+00:00'))
    for r in records:
        key=r.get('id')
        if key in seen: issues.append('duplicate:'+str(key))
        seen.add(key)
        if key not in CRITERIA: issues.append('unknown criterion:'+str(key));continue
        if r.get('result')!='PASS': issues.append(key+':not passed');continue
        if r.get('kind')!='OBSERVED' or not str(r.get('evidence','')).strip():issues.append(key+':no observed evidence')
        if not r.get('operator') or not r.get('reviewer') or r.get('operator')==r.get('reviewer'):issues.append(key+':independence missing')
        try:
            expiry=datetime.fromisoformat(r.get('valid_until','').replace('Z','+00:00'))
            if expiry.tzinfo is None or expiry<current:issues.append(key+':expired or undated timezone')
        except (ValueError,TypeError):issues.append(key+':invalid expiry')
    issues.extend('missing:'+k for k in CRITERIA if k not in seen)
    return {'status':'BLOCKED' if issues else 'EVIDENCE READY FOR OWNER REVIEW','issues':issues,'crown_hold':True,'purchase_authorised':False,'outreach_authorised':False,'physical_device_certified':False}
def tco(values,months=24):
    if not isinstance(months,int) or isinstance(months,bool) or months<=0:return {'status':'INVALID'}
    if not str(values.get('currency','')).strip() or not str(values.get('sources','')).strip():return {'status':'UNKNOWN'}
    nums={}
    for k in COSTS:
        v=values.get(k)
        if v is None or isinstance(v,bool) or str(v).strip()=='':return {'status':'UNKNOWN'}
        try: n=float(v)
        except (ValueError,TypeError):return {'status':'INVALID'}
        if not math.isfinite(n) or n<0:return {'status':'INVALID'}
        nums[k]=n
    gross=sum(v*(months if k.startswith('monthly_') else 1) for k,v in nums.items() if k!='residual_value')
    if not math.isfinite(gross) or nums['residual_value']>gross:return {'status':'INVALID'}
    return {'status':'SIMULATED','currency':values['currency'],'gross_cost':gross,'net_cost':gross-nums['residual_value'],'months':months,'purchase_authorised':False}
if __name__=='__main__':
    print(json.dumps(gate([],datetime.now(timezone.utc).isoformat()),indent=2))
