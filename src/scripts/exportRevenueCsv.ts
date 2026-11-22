export function generateRevenueCsvContent(transactions: any[]): string {
  const headers = 'ID,Customer,Amount,Status,Date\n';
  const rows = transactions.map(t => `${t._id},${t.customerId},${t.amount},${t.status},${t.createdAt}`).join('\n');
  return headers + rows;
}
