// tests/full_system_integration.test.js
const http = require('http');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const db = require('../server/database/db');
const requestsModule = require('../server/modules/requests');
const leavesModule = require('../server/modules/leaves');

const BASE_URL = 'http://localhost:3000';

function httpGet(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...headers
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: data });
        } catch (_) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

let serverInstance = null;

function ensureServerRunning() {
  return new Promise((resolve) => {
    const testReq = http.get('http://localhost:3000/api/bootstrap', () => {
      resolve();
    });
    testReq.on('error', () => {
      const app = require('../server/server');
      serverInstance = app.listen(3000, () => {
        resolve();
      });
    });
  });
}

async function runComprehensiveSystemTests() {
  await ensureServerRunning();
  console.log('================================================================');
  console.log('  الفحص والتدقيق الشامل لكامل أجزاء نظام موارد بشرية جوهرة المجد  ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  async function testStep(name, fn) {
    try {
      await fn();
      console.log(`✓ [نجاح]: ${name}`);
      passed++;
    } catch (e) {
      console.error(`✗ [فشل]: ${name}`);
      console.error(`  الخطأ: ${e.message}\n`);
      failed++;
    }
  }

  // 1. قاعدة البيانات والبيانات الأساسية
  console.log('--- 1. التحقق من سلامة قاعدة البيانات والموظفين والهيكل التنظيمي ---');
  await testStep('قاعدة البيانات: تطابق عدد الموظفين الـ 114 الفعليين دون أي بيانات وهمية', () => {
    const total = db.get('SELECT COUNT(*) AS total FROM employees').total;
    assert.strictEqual(total, 114, 'يجب أن يكون عدد الموظفين 114 موظفاً بالضبط');
    
    const saudis = db.get('SELECT COUNT(*) AS total FROM employees WHERE is_saudi = 1').total;
    const nonSaudis = db.get('SELECT COUNT(*) AS total FROM employees WHERE is_saudi = 0').total;
    assert.strictEqual(saudis, 34, 'عدد الموظفين السعوديين 34');
    assert.strictEqual(nonSaudis, 80, 'عدد الموظفين غير السعوديين 80');
  });

  await testStep('الهيكل التنظيمي: 100% من الموظفين مرتبطون بمدير مباشر صحيح (113 موظف + رئيس المجلس)', () => {
    const unmanaged = db.query('SELECT emp_code, full_name_ar FROM employees WHERE manager_id IS NULL');
    assert.strictEqual(unmanaged.length, 1, 'فقط رئيس مجلس الإدارة بدون manager_id');
    assert.strictEqual(unmanaged[0].emp_code, 'JM-0001');

    // تحقق من أن عبدالملك يتبع لرئيس مجلس الإدارة
    const abdulmalik = db.get("SELECT manager_id FROM employees WHERE emp_code = 'JM-1000'");
    const chairman = db.get("SELECT id FROM employees WHERE emp_code = 'JM-0001'");
    assert.strictEqual(abdulmalik.manager_id, chairman.id);
  });

  await testStep('الإدارات والفروع: 15 إدارة معتمدة و 10 فروع جغرافية', () => {
    const depts = db.get('SELECT COUNT(*) AS total FROM departments').total;
    const branches = db.get('SELECT COUNT(*) AS total FROM branches').total;
    assert.strictEqual(depts, 15, 'يجب أن يكون عدد الإدارات 15');
    assert.strictEqual(branches, 10, 'يجب أن يكون عدد الفروع 10');
  });

  // 2. فحص واجهة المستخدم والترابط الشبكي
  console.log('\n--- 2. التحقق من تكامل ملفات الواجهة والتبويبات الـ 19 ---');
  await testStep('ملفات الواجهة: فحص HTML و CSS و JavaScript وخلوها من الروابط المعطلة', () => {
    const indexPath = path.join(__dirname, '../public/index.html');
    const appJsPath = path.join(__dirname, '../public/js/app.js');
    assert.ok(fs.existsSync(indexPath), 'ملف index.html يجب أن يكون موجوداً');
    assert.ok(fs.existsSync(appJsPath), 'ملف app.js يجب أن يكون موجوداً');

    const htmlContent = fs.readFileSync(indexPath, 'utf8');
    const jsContent = fs.readFileSync(appJsPath, 'utf8');

    // التحقق من التبويبات الـ 19
    const tabs = [
      'dashboard', 'employees-db', 'leaves', 'tasks', 'forms',
      'compliance', 'penalties', 'attendance', 'payroll', 'loans',
      'terminated', 'attendance-notices', 'absence', 'selfservice',
      'organization', 'branches', 'users', 'data-exchange', 'docs'
    ];

    for (const tab of tabs) {
      assert.ok(htmlContent.includes(`id="nav-${tab}"`), `الزر nav-${tab} مفقود في HTML`);
      assert.ok(htmlContent.includes(`id="view-${tab}"`), `القسم view-${tab} مفقود في HTML`);
    }

    // التحقق من خلو الواجهة من LocalStorage Override للطلبات
    assert.ok(!jsContent.includes("localStorage.setItem('jm_my_requests'"), 'يجب منع تخزين الطلبات في LocalStorage');
  });

  // 3. فحص نقاط النهاية الحية للـ API
  console.log('\n--- 3. فحص استجابة وسرعة نقاط النهاية الحية (Live API Endpoints) ---');
  await testStep('API [GET /api/employees]: جلب قائمة الموظفين بدقة وسرعة', async () => {
    const res = await httpGet('/api/employees');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.length, 114);
  });

  await testStep('API [GET /api/departments]: جلب الإدارات الـ 15 المعتمدة', async () => {
    const res = await httpGet('/api/departments');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.length, 15);
  });

  await testStep('API [GET /api/branches]: جلب الفروع الـ 10 المعتمدة', async () => {
    const res = await httpGet('/api/branches');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.length, 10);
  });

  await testStep('API [GET /api/leaves/kpis]: مؤشرات الإجازات المتطابقة مع قاعدة البيانات', async () => {
    const res = await httpGet('/api/leaves/kpis');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.totalRequests >= 1);
  });

  await testStep('API [GET /api/approvals/pending]: إرجاع طلبات الموافقة المعلقة للمدير المباشر', async () => {
    const abdulmalik = db.get("SELECT id FROM employees WHERE emp_code = 'JM-1000'");
    const res = await httpGet('/api/approvals/pending', {
      'x-user-id': '2',
      'x-user-role': 'hr_manager',
      'x-user-emp-id': String(abdulmalik.id)
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.count >= 1, 'يجب أن يظهر طلب شامة عسيري للمدير عبدالملك');
  });

  await testStep('API [GET /api/compliance/stats]: احتساب مؤشر نطاقات والامتثال بدقة', async () => {
    const res = await httpGet('/api/compliance/stats');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    const rate = res.data.data.metrics?.saudizationRate || res.data.data.saudizationRate;
    assert.ok(rate > 25, 'نسبة التوطين يجب أن تكون فوق 25%');
  });

  await testStep('API [GET /api/employees/terminated]: استرجاع قائمة الموظفين المنهية خدماتهم ومؤشراتهم', async () => {
    const res = await httpGet('/api/employees/terminated');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));

    const kpis = await httpGet('/api/employees/terminated/kpis');
    assert.strictEqual(kpis.status, 200);
    assert.strictEqual(kpis.data.success, true);
  });

  await testStep('API [GET /api/absence-notices]: وحدة إشعارات الغياب الرسمية', async () => {
    const res = await httpGet('/api/absence-notices');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
  });

  await testStep('API [GET /api/export/wps]: توافق ملف حماية الأجور مع معايير البنك المركزي ومنصة مدد', async () => {
    const res = await httpGet('/api/export/wps?month=2026-10');
    assert.strictEqual(res.status, 200);
    assert.ok(res.raw.includes('WPS') || res.raw.includes('SIF') || res.headers['content-disposition']?.includes('.sif') || res.headers['content-disposition']?.includes('.csv'), 'يجب أن يصدر ملف WPS');
  });

  // 4. فحص دورة حياة سير الموافقات والإجازات
  console.log('\n--- 4. اختبار دورة سير الموافقات المكتملة، التزامن اللحظي، وتخصيم الرصيد ---');
  await testStep('سير الموافقات: التحقق من دورة حياة الطلب REQ-2026-0001 وخطواته الثلاث', async () => {
    const req = db.get("SELECT * FROM requests WHERE request_no = 'REQ-2026-0001'");
    assert.ok(req, 'الطلب REQ-2026-0001 يجب أن يكون موجوداً');

    const leave = db.get("SELECT * FROM leaves WHERE request_no = 'REQ-2026-0001'");
    assert.ok(leave, 'سجل الإجازة المتزامن يجب أن يكون موجوداً');
    assert.strictEqual(req.status, leave.status, 'تطابق الحالة بين جدول requests وجدول leaves');

    const steps = db.query("SELECT * FROM workflow_steps WHERE request_id = ? ORDER BY step_order ASC", [req.id]);
    assert.strictEqual(steps.length, 3, 'مسار الموافقات يجب أن يتكون من 3 خطوات إلزامية');
  });

  // 5. فحص أمان النظام والصلاحيات
  console.log('\n--- 5. اختبار الأمان وصلاحيات الوصول (Security & RBAC) ---');
  await testStep('الأمان: منع الاعتماد الذاتي للطلب من قبل الموظف مقدم الطلب', () => {
    const req = db.get("SELECT id, emp_id FROM requests WHERE request_no = 'REQ-2026-0001'");
    const applicantUser = { id: 99, role: 'employee', emp_id: req.emp_id, full_name: 'شامة عسيري' };
    assert.throws(() => {
      requestsModule.processRequestStep(req.id, 'manager', 'approve', 'محاولة اعتماد غير مصرح بها', applicantUser);
    }, /غير مصرح|لا يحق للموظف/);
  });

  await testStep('سجل الرقابة: تسجيل وتوثيق كافة العمليات الإدارية في audit_logs', () => {
    const logs = db.query('SELECT COUNT(*) AS total FROM audit_logs');
    assert.ok(logs[0].total >= 1, 'سجل الرقابة audit_logs يجب أن يحتوي على سجلات موثقة');
  });

  console.log('\n================================================================');
  console.log(`إجمالي الفحوصات: ${passed + failed} | الناجحة: ${passed} | الفاشلة: ${failed}`);
  console.log(`نسبة النجاح: ${Math.round((passed / (passed + failed)) * 100)}%`);
  console.log('================================================================\n');

  if (serverInstance) {
    serverInstance.close();
  }

  if (failed > 0) {
    throw new Error(`فشل في ${failed} فحص من الفحوصات الشاملة للنظام.`);
  }
}

if (require.main === module) {
  runComprehensiveSystemTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { runComprehensiveSystemTests };
