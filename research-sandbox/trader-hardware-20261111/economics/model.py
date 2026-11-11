import json,math
from decimal import Decimal as D
from pathlib import Path
PHONE=D('143500')
EXTRAS={'stand_case_charger_allowance':8000,'packaging_card_band':2000,'provisioning_and_QA':5000,'Benin_distribution':3000}
FIXED={'knowledge_transfer_tools_allowance':5000000,'platform_alerts_security_readiness_allowance':10000000}
MONTHLY_OTHER={'support':1000,'EMM_licences':500,'energy':250,'hosting_alerts':500,'repair_loss_reserve':750}
# All discounts, non-data add-ons, fixed budgets and operating reserves are SIMULATED.
def scenario(n,discount):
 phone=PHONE*(1-D(str(discount)));unit=phone+sum(EXTRAS.values());spares=math.ceil(n*.03);sparecost=spares*phone
 pre=unit*n+sparecost+sum(FIXED.values());cont=pre*D('.10');upfront=pre+cont
 data24=n*26*1500 # conservatively allow13 30-day bundles/year for24 calendar months
 run24=data24+n*24*sum(MONTHLY_OTHER.values());tco=upfront+run24
 return dict(quantity=n,assumed_discount=float(discount),phone_unit=float(phone),kit_unit_before_fixed_spares_contingency=float(unit),extra_spare_devices=spares,upfront=float(upfront),monthly_equivalent_running=float(run24/24),tco24=float(tco),monthly_equivalent_full_cost_per_deployed_unit=float(tco/24/n),orders_per_active_trader_day_at_60pct_active_500_contribution=float(tco/24/(D(n)*D('.6'))/26/500))
rows=[scenario(1000,0),scenario(2000,.10),scenario(5000,.15),scenario(5000,0)]
output={'status':'SIMULATED planning scenarios anchored to public listing; NOT quotes or purchase approval','retailer_phone_anchor_ngn':143500,'extras_assumptions':EXTRAS,'fixed_assumptions':FIXED,'monthly_other_assumptions':MONTHLY_OTHER,'data_plan_public_price_30days':1500,'data_bundles_24_calendar_months_budgeted':26,'scenarios':rows,'extra_upfront_5k_vs_1k':rows[2]['upfront']-rows[0]['upfront'],'price_discount_5k_vs_same_volume_undiscounted':rows[3]['upfront']-rows[2]['upfront'],'SUNMI_lower_UK_price_gbp':249.61,'illustrative_reported_GBP_NGN':1808.356,'SUNMI_lower_device_only_conversion_ngn':249.61*1808.356,'idle4000_purchase_cost_at_assumed5k_price':4000*rows[2]['phone_unit']}
assert rows[0]['upfront']==198885500
assert rows[0]['tco24']==309885500
assert rows[2]['tco24']==rows[2]['upfront']+555000000
Path('maths.json').write_text(json.dumps(output,indent=2));print(json.dumps(output,indent=2))
def odm(n,landed,custom=5000000):
 spares=math.ceil(n*.03);pre=D(n)*(D(landed)+sum(EXTRAS.values()))+spares*D(landed)+sum(FIXED.values())+custom
 upfront=pre*D('1.1');running=n*(26*1500+24*sum(MONTHLY_OTHER.values()));total=upfront+running
 return dict(quantity=n,target_landed_device_ngn=landed,customisation_allowance_ngn=custom,upfront=float(upfront),running_24_months=running,tco24=float(total),monthly_full_cost_per_deployed=float(total/n/24),orders_per_active_day_at_60pct_active_500_contribution=float(total/24/(D(n)*D('.6'))/26/500))
output['ODM_TARGET_SCENARIOS_NOT_QUOTES']=[odm(1000,110000),odm(2000,110000),odm(5000,110000),odm(5000,90000)]
output['nre_break_even_rule']='Maximum justified additional customisation cost = quantity * verified same-scope landed saving per device, less other incremental costs. No savings assumed achieved.'
assert odm(1000,110000)['upfront']==166430000
assert odm(5000,90000)['upfront']==630850000
Path('maths.json').write_text(json.dumps(output,indent=2));print(json.dumps(output['ODM_TARGET_SCENARIOS_NOT_QUOTES'],indent=2))
