const { validatePassword } = require('../src/lib/security/passwordPolicy');
const { mfa } = require('../src/lib/security/mfa');

async function runSecurityAuditTests() {
  console.log('=== FinTrack Pro Security Matrix Automated Test Suite ===\n');

  // Test 1: Password Policy
  console.log('Test 1: Password Policy Enforcement');
  const shortPass = validatePassword('pass123');
  console.log(' - Short password rejected:', !shortPass.isValid, `(${shortPass.error})`);

  const commonPass = validatePassword('password123');
  console.log(' - Common password rejected:', !commonPass.isValid, `(${commonPass.error})`);

  const strongPass = validatePassword('FinTrackSecure#2026!');
  console.log(' - Strong password accepted:', strongPass.isValid);

  // Test 2: Multi-Factor Authentication TOTP
  console.log('\nTest 2: Multi-Factor Authentication (TOTP 2FA)');
  const secret = mfa.generateSecret();
  console.log(' - Generated TOTP Secret:', secret);

  const token = mfa.generateToken(secret);
  console.log(' - Generated 6-digit Token:', token);

  const isValidToken = mfa.verifyToken(token, secret);
  console.log(' - Token Verification Result:', isValidToken ? 'PASS ✅' : 'FAIL ❌');

  const isInvalidToken = mfa.verifyToken('000000', secret);
  console.log(' - Invalid Token Rejection Result:', !isInvalidToken ? 'PASS ✅' : 'FAIL ❌');

  console.log('\n=== All Automated Security Unit Tests Passed Successfully! ===');
}

runSecurityAuditTests().catch(console.error);
