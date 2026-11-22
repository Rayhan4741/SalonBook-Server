import { isValidMongoId } from '../utils/db/objectIdValidator';
export function runMongoIdTests() {
  if (!isValidMongoId('507f1f77bcf86cd799439011')) throw new Error('Valid mongo id rejected');
  if (isValidMongoId('invalid-id-string')) throw new Error('Invalid mongo id accepted');
  return true;
}
