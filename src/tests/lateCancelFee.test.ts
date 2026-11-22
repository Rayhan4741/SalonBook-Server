import { calculateLateCancelFee } from '../services/cancellationFeeCalculator';
export function runLateCancelTests() {
  if (calculateLateCancelFee(10000, 6) !== 5000) throw new Error('Late cancel fee failed');
  if (calculateLateCancelFee(10000, 24) !== 0) throw new Error('Advance cancel fee was not waived');
  return true;
}
