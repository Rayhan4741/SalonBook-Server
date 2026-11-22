import { validatePasswordPolicy } from '../utils/security/passwordPolicy';
export function runPasswordPolicyTests() {
  if (!validatePasswordPolicy('SalonPass123!').valid) throw new Error('Strong password rejected');
  if (validatePasswordPolicy('weak').valid) throw new Error('Weak password accepted');
  return true;
}
