// tests/page-connectivity.test.js - Verify complete page, tab, and navigation connectivity
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const app = require('../server/server');

console.log('--- تشغيل اختبار ترابط الصفحات وشبكة التنقل وعمل النظام الشامل ---');

const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
const jsPath = path.join(__dirname, '..', 'public', 'js', 'app.js');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const jsContent = fs.readFileSync(jsPath, 'utf8');

// 1. All system views and navigation tabs
const allTabs = [
  'dashboard',
  'employees-db',
  'leaves',
  'tasks',
  'forms',
  'compliance',
  'penalties',
  'attendance',
  'payroll',
  'loans',
  'terminated',
  'attendance-notices',
  'absence',
  'selfservice',
  'organization',
  'branches',
  'users',
  'data-exchange',
  'docs'
];

console.log('\n[1/4] فحص ترابط عناصر القائمة الجانبية مع أقسام الصفحات (Nav & Views)...');
allTabs.forEach(tab => {
  const navIdDouble = `id="nav-${tab}"`;
  const navIdSingle = `id='nav-${tab}'`;
  const hasNav = htmlContent.includes(navIdDouble) || htmlContent.includes(navIdSingle);

  const viewIdDouble = `id="view-${tab}"`;
  const viewIdSingle = `id='view-${tab}'`;
  const hasView = htmlContent.includes(viewIdDouble) || htmlContent.includes(viewIdSingle);

  assert(hasNav, `زر التنقل nav-${tab} غير موجود في index.html`);
  assert(hasView, `قسم الصفحة view-${tab} غير موجود في index.html`);
  console.log(`✓ نجح: ترابط التبويب (${tab}) - الزر [nav-${tab}] والقسم [view-${tab}] موجودان ومتطابقان.`);
});

// 2. Verify allTabs array in switchTab in app.js
console.log('\n[2/4] فحص مصفوفة التبديل switchTab داخل ملف app.js...');
allTabs.forEach(tab => {
  assert(jsContent.includes(`case '${tab}':`), `دالة switchTab تفتقد معالجة التبويب: case '${tab}':`);
});
console.log('✓ نجح: دالة switchTab تغطي كافة التبويبات الـ 19 بالكامل دون أي قسم مفقود.');

// 3. Verify Header Badges Deletion (User Request)
console.log('\n[3/4] فحص حذف الأيقونات العلوية (مؤشر الامتثال، أجهزة البصمة، حماية الأجور)...');
assert(!htmlContent.includes('id="headerExecCapsule"'), 'تم حذف كبسولة المؤشرات العلوية headerExecCapsule من رأس الصفحة بنجاح');
assert(!htmlContent.includes('id="headerNitaqatText"'), 'تم حذف نص مؤشر الامتثال من رأس الصفحة بنجاح');
assert(!htmlContent.includes('id="headerDevicesCountText"'), 'تم حذف نص أجهزة البصمة من رأس الصفحة بنجاح');
console.log('✓ نجح: التأكد من إزالة الأيقونات العلوية المشار إليها بالصورة تماماً.');

// 4. API Endpoints Connectivity Test
console.log('\n[4/4] اختبار استجابة وتكامل كافة نقاط النهاية الأساسية (API Endpoints)...');

async function testEndpoints() {
  const http = require('node:http');
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const endpoints = [
    { url: '/api/bootstrap', name: 'تحميل البيانات الموحد (Bootstrap)' },
    { url: '/api/employees', name: 'بيانات الموظفين (Employees)' },
    { url: '/api/employees/metrics/saudization', name: 'نسبة التوطين ونطاقات' },
    { url: '/api/departments', name: 'الإدارات والأقسام' },
    { url: '/api/branches', name: 'الفروع ومواقع العمل' },
    { url: '/api/devices', name: 'أجهزة البصمة المعتمدة' },
    { url: '/api/attendance/daily', name: 'سجلات الحضور اليومي' },
    { url: '/api/payroll/periods', name: 'مسيرات الرواتب' },
    { url: '/api/penalties/regulations', name: 'لائحة الجزاءات والمخالفات' },
    { url: '/api/penalties/issued', name: 'القرارات الجزائية الصادرة' },
    { url: '/api/leaves/kpis', name: 'مؤشرات الإجازات' },
    { url: '/api/leaves', name: 'قائمة الإجازات' },
    { url: '/api/leaves/balances', name: 'أرصدة الإجازات' },
    { url: '/api/tasks', name: 'نظام المهام' },
    { url: '/api/requests', name: 'طلبات الخدمة الذاتية' },
    { url: '/api/compliance/stats', name: 'مؤشرات الامتثال وتقرير مقيم' },
    { url: '/api/employees/terminated', name: 'الموظفون المنهي خدماتهم' },
    { url: '/api/employees/terminated/kpis', name: 'مؤشرات المنهي خدماتهم' },
    { url: '/api/loans', name: 'إدارة السلف والأقساط' },
    { url: '/api/loans/kpis', name: 'مؤشرات السلف والأقساط' },
    { url: '/api/attendance/notices', name: 'إشعارات وإنذارات الدوام والمادة 80' },
    { url: '/api/attendance/notices/kpis', name: 'مؤشرات إشعارات الدوام' },
    { url: '/api/absence-notices', name: 'إشعارات الغياب الرسمية' },
    { url: '/api/absence-notices/kpis', name: 'مؤشرات إشعارات الغياب' },
    { url: '/api/company-email/settings', name: 'إعدادات بريد الشركة (SMTP)' }
  ];

  for (const ep of endpoints) {
    const res = await fetch(`${baseUrl}${ep.url}`);
    assert.strictEqual(res.status, 200, `فشل الاتصال بنقطة النهاية: ${ep.url} (الكود: ${res.status})`);
    const data = await res.json();
    assert(data.success !== false, `استجابة خاطئة من ${ep.url}`);
    console.log(`✓ نجح: [200 OK] نقطة النهاية: ${ep.name} (${ep.url}) متصلة وتستجيب بدقة.`);
  }

  await new Promise((resolve) => server.close(resolve));
}

testEndpoints().then(() => {
  console.log('\n================================================================');
  console.log('  جميع اختبارات ترابط الصفحات واستجابة الـ APIs اجتازت بنجاح 100%!  ');
  console.log('================================================================');
}).catch(err => {
  console.error('❌ خطأ في اختبار الترابط:', err);
  process.exit(1);
});
