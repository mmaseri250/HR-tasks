// tests/users_persistence.test.js - Verification of Users Data Persistence & Synchronization
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const db = require('../server/database/db');
const usersModule = require('../server/modules/users');
const { seedDatabase } = require('../server/database/seedData');

console.log('========================================================================');
console.log('   اختبار حفظ ومزامنة بيانات المستخدمين وحمايتها من الحذف عند التعديل   ');
console.log('========================================================================\n');

// 1. Verify restore from persisted_users.json
console.log('[1/5] التحقق من استعادة كافة المستخدمين من ملف الحفظ الدائم (persisted_users.json)...');
const persistedPath = path.join(__dirname, '../server/database/persisted_users.json');
assert(fs.existsSync(persistedPath), 'ملف persisted_users.json يجب أن يكون موجوداً');

usersModule.restoreUsersFromDisk();
const allUsers = usersModule.getAllUsers();
console.log(`✓ عدد المستخدمين المسترجع في قاعدة البيانات: ${allUsers.length}`);
assert(allUsers.length >= 2, 'يجب توفر مستخدمين على الأقل');

const adminUser = allUsers.find(u => u.username === 'admin');
const hrUser = allUsers.find(u => u.username === 'abdulmalik');
assert(adminUser, 'يجب وجود المستخدم admin');
assert(hrUser, 'يجب وجود المستخدم abdulmalik');
console.log('✓ نجح: تم تأكيد وجود الحسابات الإدارية الأساسية.');

// 2. Test Creating a New User and verify it is written to persistent file
console.log('\n[2/5] إنشاء مستخدم جديد والتحقق من حفظه تلقائياً في قاعدة البيانات والملف الدائم...');
const testUsername = 'test_engineer_' + Date.now().toString().slice(-4);
const created = usersModule.createUser({
  username: testUsername,
  password: 'TestPassword123',
  full_name: 'مهندس اختبار مؤقت',
  email: `${testUsername}@jalmajd.com`,
  role: 'dept_manager',
  permissions: ['requests', 'approvals', 'employees']
});

assert(created && created.id, 'يجب إنشاء المستخدم بنجاح');
assert.strictEqual(created.username, testUsername);

// Verify in database
const dbUser = db.get('SELECT * FROM users WHERE username = ?', [testUsername]);
assert(dbUser, 'يجب أن يكون المستخدم مسجلاً في قاعدة بيانات SQLite');

// Verify in JSON file
const fileRaw = fs.readFileSync(persistedPath, 'utf8');
const fileUsers = JSON.parse(fileRaw);
const inJson = fileUsers.find(u => u.username === testUsername);
assert(inJson, 'يجب أن يكون المستخدم محفوظاً في ملف persisted_users.json تلقائياً');
console.log(`✓ نجح: تم حفظ المستخدم [${testUsername}] في SQLite وملف النسخة الاحتياطية الدائمة.`);

// 3. Test Modifying a User without losing password or other fields
console.log('\n[3/5] تعديل بيانات وصلاحيات المستخدم والتحقق من بقاء كلمة المرور والمدخلات دون حذف...');
const updated = usersModule.updateUser(created.id, {
  full_name: 'مهندس اختبار معتمد ومحدث',
  role: 'hr_manager',
  permissions: ['requests', 'approvals', 'employees', 'attendance']
  // password intentionally omitted to simulate edit without changing password
});

assert.strictEqual(updated.full_name, 'مهندس اختبار معتمد ومحدث');
assert.strictEqual(updated.role, 'hr_manager');

// Check that password was NOT deleted or cleared
const afterUpdateInDb = db.get('SELECT password FROM users WHERE id = ?', [created.id]);
assert.strictEqual(afterUpdateInDb.password, 'TestPassword123', 'كلمة المرور يجب أن تظل محفوظة ولم تحذف عند التعديل');

// Check that JSON file is updated
const updatedJsonUsers = JSON.parse(fs.readFileSync(persistedPath, 'utf8'));
const updatedInJson = updatedJsonUsers.find(u => u.username === testUsername);
assert.strictEqual(updatedInJson.full_name, 'مهندس اختبار معتمد ومحدث');
console.log('✓ نجح: تم تعديل البيانات بنجاح مع صيانة كلمة المرور وكافة الحقول دون أي فقدان.');

// 4. Test seedDatabase does NOT delete users
console.log('\n[4/5] التحقق من أن إعادة تهيئة البيانات (seedDatabase) تحافظ على المستخدمين ولا تحذفهم...');
seedDatabase();
const userAfterSeed = db.get('SELECT * FROM users WHERE username = ?', [testUsername]);
assert(userAfterSeed, 'يجب عدم حذف المستخدم المنشأ عند تشغيل seedDatabase');
console.log('✓ نجح: تم حماية المستخدمين المنشئين بنجاح من الحذف أثناء أي عمليات تهيئة.');

// 5. Test syncUsers bulk sync
console.log('\n[5/5] اختبار دالة المزامنة الشاملة (syncUsers)...');
const syncBatch = [
  { username: testUsername, full_name: 'مهندس اختبار بعد المزامنة الشاملة', role: 'admin', permissions: ['all'] }
];
const syncedList = usersModule.syncUsers(syncBatch);
const syncedUser = syncedList.find(u => u.username === testUsername);
assert(syncedUser);
assert.strictEqual(syncedUser.full_name, 'مهندس اختبار بعد المزامنة الشاملة');

// Cleanup test user
usersModule.deleteUser(created.id);
const finalDbUser = db.get('SELECT * FROM users WHERE username = ?', [testUsername]);
assert.strictEqual(finalDbUser, undefined, 'تم حذف مستخدم الاختبار بنجاح');
console.log('✓ نجح: المزامنة الشاملة تعمل بدقة، وتم تنظيف مستخدم الاختبار.');

console.log('\n========================================================================');
console.log('   كافة اختبارات حفظ ومزامنة المستخدمين اجتازت بنجاح فائق 100%   ');
console.log('========================================================================');
