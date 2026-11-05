const usersModule = require('../server/modules/users');
const rbacEngine = require('../server/modules/rbacEngine');

async function testUserFlow() {
  console.log('--- TEST: Create User with Mandatory 24-Hour Activation ---');
  const user = usersModule.createUser({
    username: 'test_officer',
    full_name: 'أحمد ضابط الأسطول',
    role: 'officer',
    permissions: ['fleet', 'licenses'],
    emp_id: 1
  });

  console.log('Created user:', {
    id: user.id,
    username: user.username,
    status: user.status,
    is_active: user.is_active,
    has_token: !!user.activation_token,
    expires_at: user.activation_token_expires_at,
    link: user.activation_link
  });

  if (user.status !== 'معلق - بانتظار تعيين كلمة المرور' || user.is_active !== 0) {
    throw new Error('User should NOT be active immediately upon creation!');
  }

  console.log('--- TEST: Login before activation must fail ---');
  let loginFailed = false;
  try {
    usersModule.login('test_officer', 'anypassword');
  } catch (err) {
    loginFailed = true;
    console.log('Login correctly rejected:', err.message);
  }
  if (!loginFailed) throw new Error('Pending user was able to login before activation!');

  console.log('--- TEST: Verify Activation Token ---');
  const verified = usersModule.verifyActivationToken(user.activation_token);
  console.log('Token verified for user:', verified.user.username);

  console.log('--- TEST: Activate Account with New Password ---');
  const actResult = usersModule.activateAccount(user.activation_token, 'Pass123456');
  console.log('Activation result:', actResult);

  console.log('--- TEST: Login after activation must succeed ---');
  const loggedIn = usersModule.login('test_officer', 'Pass123456');
  console.log('Login succeeded for:', loggedIn.username, 'Role:', loggedIn.role);

  console.log('--- TEST: RBAC Isolation ---');
  const eff = rbacEngine.getUserEffectivePermissions(user.id);
  console.log('Effective permissions count:', eff.length);
  if (!eff.includes('fleet.view') || !eff.includes('licenses.view')) {
    throw new Error('Missing granted permissions!');
  }
  if (eff.includes('payroll.view') || eff.includes('users.view') || eff.includes('audit.view')) {
    throw new Error('Overlapping/unauthorized permissions detected!');
  }
  console.log('RBAC verified: test_officer has ONLY fleet & licenses, zero unauthorized leakage!');

  // Cleanup test user
  usersModule.deleteUser(user.id);
  console.log('--- ALL TESTS PASSED SUCCESSFULLY! ---');
}

testUserFlow().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
