export interface RefundRecord {
  transactionId: string;
  reason: string;
  refundedAt: string;
}
export function formatRefundRecord(txId: string, reason: string): RefundRecord {
  return { transactionId: txId, reason, refundedAt: new Date().toISOString() };
}
