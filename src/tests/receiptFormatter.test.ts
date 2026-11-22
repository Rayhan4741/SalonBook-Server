import { generateReceiptNumber } from '../utils/business/receiptFormatter';
export function runReceiptFormatterTests() {
  const num = generateReceiptNumber('60c72b2f9b1d8b2bad000001', new Date('2026-01-01'));
  if (!num.startsWith('SB-2026-')) throw new Error('Receipt format invalid: ' + num);
  return true;
}
