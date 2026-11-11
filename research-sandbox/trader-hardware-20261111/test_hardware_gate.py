import unittest
import hardware_gate as h
class HardwareGateTests(unittest.TestCase):
    now='2026-11-11T21:00:00+00:00'
    def fixture(self):return [dict(id=k,result='PASS',kind='OBSERVED',evidence='SYNTHETIC UNIT TEST FIXTURE',operator='test operator',reviewer='test reviewer',valid_until='2026-12-01T00:00:00+00:00') for k in h.CRITERIA]
    def test_unknown_all_blocks(self):self.assertEqual(h.gate([],self.now)['status'],'BLOCKED')
    def test_complete_fixture_no_purchase_authority(self):
        r=h.gate(self.fixture(),self.now);self.assertEqual(r['status'],'EVIDENCE READY FOR OWNER REVIEW');self.assertFalse(r['purchase_authorised']);self.assertTrue(r['crown_hold']);self.assertFalse(r['physical_device_certified'])
    def test_each_missing_criterion_blocks(self):
        for k in h.CRITERIA:
            with self.subTest(k=k):self.assertEqual(h.gate([r for r in self.fixture() if r['id']!=k],self.now)['status'],'BLOCKED')
    def test_simulation_cannot_qualify(self):
        r=self.fixture();r[0]['kind']='SIMULATED';self.assertEqual(h.gate(r,self.now)['status'],'BLOCKED')
    def test_failure_blocks(self):
        r=self.fixture();r[0]['result']='FAIL';self.assertEqual(h.gate(r,self.now)['status'],'BLOCKED')
    def test_missing_proof_blocks(self):
        r=self.fixture();r[0]['evidence']=' ';self.assertEqual(h.gate(r,self.now)['status'],'BLOCKED')
    def test_same_reviewer_blocks(self):
        r=self.fixture();r[0]['reviewer']=r[0]['operator'];self.assertEqual(h.gate(r,self.now)['status'],'BLOCKED')
    def test_expired_blocks(self):
        r=self.fixture();r[0]['valid_until']='2026-11-01T00:00:00+00:00';self.assertEqual(h.gate(r,self.now)['status'],'BLOCKED')
    def test_invalid_date_blocks(self):
        r=self.fixture();r[0]['valid_until']='bad';self.assertEqual(h.gate(r,self.now)['status'],'BLOCKED')
    def test_duplicate_blocks(self):
        r=self.fixture();r.append(r[0]);self.assertEqual(h.gate(r,self.now)['status'],'BLOCKED')
    def test_unknown_criterion_blocks(self):
        r=self.fixture();r.append(dict(id='made-up'));self.assertEqual(h.gate(r,self.now)['status'],'BLOCKED')
    def costs(self):return dict({k:0 for k in h.COSTS},currency='NGN',sources='SIMULATED TEST FIXTURE',landed_device=100000,monthly_support_licences=1000,residual_value=10000)
    def test_cost_arithmetic(self):self.assertEqual(h.tco(self.costs())['net_cost'],114000)
    def test_each_unknown_cost_stays_unknown(self):
        for k in h.COSTS:
            with self.subTest(k=k):self.assertEqual(h.tco({**self.costs(),k:''})['status'],'UNKNOWN')
    def test_negative_nonfinite_boolean_costs(self):
        for v in [-1,float('inf'),float('nan'),True]:
            with self.subTest(v=v):self.assertIn(h.tco({**self.costs(),'landed_device':v})['status'],['INVALID','UNKNOWN'])
    def test_sources_required(self):self.assertEqual(h.tco({**self.costs(),'sources':' '})['status'],'UNKNOWN')
    def test_residual_cannot_hide_cost(self):self.assertEqual(h.tco({**self.costs(),'residual_value':9999999})['status'],'INVALID')
    def test_horizon_positive_integer(self):
        for n in [0,-1,2.5,True]:
            with self.subTest(n=n):self.assertEqual(h.tco(self.costs(),n)['status'],'INVALID')
    def test_knowledge_transfer_cannot_be_omitted(self):
        r=[x for x in self.fixture() if x['id']!='knowledge_transfer']
        self.assertEqual(h.gate(r,self.now)['status'],'BLOCKED')
    def test_attendance_without_competence_evidence_blocks(self):
        r=self.fixture()
        next(x for x in r if x['id']=='knowledge_transfer')['evidence']=' '
        self.assertEqual(h.gate(r,self.now)['status'],'BLOCKED')
    def test_training_does_not_replace_repair_authorisation(self):
        r=[x for x in self.fixture() if x['id']!='local_service_authorisation']
        self.assertEqual(h.gate(r,self.now)['status'],'BLOCKED')
    def test_claimed_training_is_not_observed_evidence(self):
        r=self.fixture()
        next(x for x in r if x['id']=='knowledge_transfer')['kind']='SUPPLIER-CLAIMED'
        self.assertEqual(h.gate(r,self.now)['status'],'BLOCKED')
if __name__=='__main__':unittest.main(verbosity=2)
