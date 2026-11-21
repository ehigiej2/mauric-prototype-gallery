export const gates=["applicable_law","product_safety","authenticity","traceability","required_certification","recall_status","storage_transport_suitability"];
export function assessStock(stock, now) {
 const blocked=(reason)=>({eligible:false,release:false,reason});
 if(!stock||!Number.isFinite(now)||!stock.productId||!stock.jurisdiction||!stock.category)return blocked("IDENTITY_OR_SCOPE_MISSING");
 if(stock.recalled!==false)return blocked("RECALL_STATUS_BLOCK");
 for(const gate of gates){
 const e=stock.evidence?.[gate];
 if(!e||e.status!=="VERIFIED"||e.independentReview!==true||!e.reference||e.productId!==stock.productId||e.jurisdiction!==stock.jurisdiction||!Number.isFinite(e.expiresAt)||e.expiresAt<=now)return blocked(gate);
 }
 return {eligible:true,release:false,reason:"EVIDENCE_RECORDS_COMPLETE_REVIEW_REQUIRED"};
}
