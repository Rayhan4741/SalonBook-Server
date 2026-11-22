import { recordFailedLogin, isAccountLocked } from '../utils/security/accountLockout';
export function runLockoutTests() {
  for (let i = 0; i < 5; i++) recordFailedLogin('test@lockout.com');
  if (!isAccountLocked('test@lockout.com')) throw new Error('Lockout failed to engage');
  return true;
}
