// scripts/build-check.js
// Pre-build environment and database integrity verification
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('  التحقق من جاهزية بناء نظام موارد بشرية جوهرة المجد  ');
console.log('====================================================');

// 1. Check Node.js version
const [major, minor] = process.versions.node.split('.').map(Number);
console.log(`- إصدار Node.js الحالي: v${process.versions.node}`);
if (major < 22) {
  console.error(`❌ خطأ: يتطلب النظام Node.js إصدار 22 أو أحدث (المتوفر: v${process.versions.node})`);
  console.error('   السبب: النظام يستخدم مكتبة node:sqlite المدمجة في Node.js 22+');
  process.exit(1);
}
console.log('✓ فحص إصدار Node.js: متوافق مع محرك قاعدة البيانات.');

// 2. Ensure directories
const dirs = ['uploads', 'server/database', 'public/assets', 'public/images', 'logs'];
for (const dir of dirs) {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✓ تم إنشاء المجلد: ${dir}`);
  }
}

// 3. Check Database and Core Records
try {
  const db = require('../server/database/db');
  const vCount = db.get('SELECT COUNT(*) as c FROM vehicles')?.c || 0;
  const lCount = db.get('SELECT COUNT(*) as c FROM company_licenses')?.c || 0;
  const eCount = db.get("SELECT COUNT(*) as c FROM employees WHERE status = 'نشط'")?.c || 0;
  const uCount = db.get('SELECT COUNT(*) as c FROM users')?.c || 0;

  console.log(`✓ فحص قاعدة البيانات: متصلة بنجاح.`);
  console.log(`  - الموظفون النشطون: ${eCount} موظفاً`);
  console.log(`  - أسطول المركبات (تم): ${vCount} مركبة`);
  console.log(`  - السجلات والتراخيص: ${lCount} وثيقة رسمية`);
  console.log(`  - المستخدمون الإداريون: ${uCount} حساب`);
} catch (err) {
  console.error('❌ خطأ في فحص قاعدة البيانات:', err.message);
  process.exit(1);
}

console.log('\n✅ جاهزية البناء مكتملة بنجاح 100%!');
