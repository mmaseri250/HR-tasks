// scripts/test_live_production_suite.js
const https = require('https');

const BASE_URL = 'https://jawharat-hrms.onrender.com';

function request(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = https.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          json
        });
      });
    });

    req.on('error', reject);
    if (body) {
      if (typeof body === 'object') {
        req.setHeader('Content-Type', 'application/json');
        req.write(JSON.stringify(body));
      } else {
        req.write(body);
      }
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('   LIVE PRODUCTION INTEGRATION & INTEGRITY SUITE    ');
  console.log('   Target: ' + BASE_URL);
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✓ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${message}`);
    }
  }

  // 1. Check Root HTML Viewport & Widths
  const home = await request('/');
  assert(home.statusCode === 200, 'Home page returns HTTP 200 OK');
  assert(home.body.includes('max-w-none'), 'Header & container contain max-w-none (Full width 100%)');
  assert(!home.body.includes('max-w-7xl'), 'No restrictive max-w-7xl limits remain on layout');
  assert(!home.body.includes('id="modalSalaryCertificate"'), 'Legacy modalSalaryCertificate is purged');

  // 2. Check Static Assets & CSS
  const css = await request('/css/style.css');
  assert(css.statusCode === 200, 'style.css loaded successfully');

  const letterhead = await request('/images/company_letterhead.png');
  assert(letterhead.statusCode === 200, 'Official company letterhead image is accessible');
  assert(Number(letterhead.headers['content-length']) > 100000, 'Letterhead image is high resolution (>100KB)');

  // 3. Test Authentication for Admin
  const adminLogin = await request('/api/auth/login', { method: 'POST' }, {
    username: 'admin',
    password: 'Jj123'
  });
  assert(adminLogin.statusCode === 200 && adminLogin.json?.success === true, 'Admin login succeeds');
  const adminToken = adminLogin.json?.token;
  const adminHeaders = adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {};

  // 4. Test Authentication for HR Director Abdulmalik
  const hrLogin = await request('/api/auth/login', { method: 'POST' }, {
    username: 'abdulmalik',
    password: 'Hr123'
  });
  assert(hrLogin.statusCode === 200 && hrLogin.json?.success === true, 'HR Director (Abdulmalik) login succeeds');
  assert(hrLogin.json?.user?.role === 'hr_manager', 'Abdulmalik has hr_manager role');

  // 5. Test Authentication for Dept Managers
  const mgrKhaled = await request('/api/auth/login', { method: 'POST' }, {
    username: 'khaled.raee',
    password: 'Mgr123'
  });
  assert(mgrKhaled.statusCode === 200 && mgrKhaled.json?.success === true, 'Dept Manager (Khaled Raee) login succeeds');
  assert(mgrKhaled.json?.user?.role === 'dept_manager', 'Khaled Raee has dept_manager role');

  const mgrAli = await request('/api/auth/login', { method: 'POST' }, {
    username: 'ali.boshra',
    password: 'Mgr123'
  });
  assert(mgrAli.statusCode === 200 && mgrAli.json?.success === true, 'Dept Manager (Ali Boshra) login succeeds');

  const mgrHani = await request('/api/auth/login', { method: 'POST' }, {
    username: 'hani.qahtani',
    password: 'Mgr123'
  });
  assert(mgrHani.statusCode === 200 && mgrHani.json?.success === true, 'Finance Manager (Hani Qahtani) login succeeds');

  // 6. Test Employees Count & Integrity
  const empsRes = await request('/api/employees', { headers: adminHeaders });
  assert(empsRes.statusCode === 200, 'Employees API returns HTTP 200');
  const emps = empsRes.json?.data || [];
  assert(emps.length === 111, `Total approved employees count is 111 (found: ${emps.length})`);

  // Check specific employees and fields
  const shama = emps.find(e => e.full_name_ar.includes('شامة'));
  assert(shama && shama.basic_salary === 4000, 'Shama Asiri verified with exact salary 4000 SAR');
  assert(shama && shama.direct_manager_name === 'عبدالملك سعيد الشريف', 'Shama reporting to HR Director Abdulmalik');

  const abdulmalikEmp = emps.find(e => e.full_name_ar.includes('عبدالملك سعيد'));
  assert(abdulmalikEmp, 'Abdulmalik verified as HR Executive Director');

  // Check Khaled Raee subordinates count
  const khaledSubs = emps.filter(e => e.direct_manager_name && e.direct_manager_name.includes('خالد احمد محمد راعي'));
  assert(khaledSubs.length === 25, `Khaled Raee has 25 subordinates in City Park (found: ${khaledSubs.length})`);

  // Check Ali Boshra subordinates count
  const aliSubs = emps.filter(e => e.direct_manager_name && e.direct_manager_name.includes('علي سعد حسين البشري'));
  assert(aliSubs.length === 26, `Ali Boshra has 26 subordinates in Hayy Al-Mowadafeen (found: ${aliSubs.length})`);

  // 7. Test Departments & Branches
  const deptsRes = await request('/api/departments', { headers: adminHeaders });
  const depts = deptsRes.json?.data || [];
  const hasSupportDept = depts.some(d => d.name_ar.includes('الخدمات المساندة') || d.name_ar.includes('المساندة'));
  assert(hasSupportDept, 'Department "إدارة الخدمات المساندة والنظافة" exists in production DB');

  const branchesRes = await request('/api/branches', { headers: adminHeaders });
  const branches = branchesRes.json?.data || [];
  assert(branches.length >= 10, `Official branches count is at least 10 (found: ${branches.length})`);

  // 8. Test Biometric Devices Integrity (Zero mock/experimental devices)
  const devicesRes = await request('/api/devices', { headers: adminHeaders });
  const devices = devicesRes.json?.data || [];
  const mockDevices = devices.filter(d => (d.name && d.name.includes('تجريبي')) || (d.location && d.location.includes('افتراضي')));
  assert(mockDevices.length === 0, `Zero mock or experimental biometric devices (found: ${mockDevices.length})`);

  // 9. Test Qiwa-Compliant End of Service Gratuity Calculation
  const qiwaResignationCalc = await request('/api/employees/terminated/calculate', {
    method: 'POST',
    headers: adminHeaders
  }, {
    emp_id: shama ? shama.id : 1,
    termination_date: '2026-10-31',
    termination_type: 'استقالة الموظف',
    deductions_amount: 0
  });
  assert(qiwaResignationCalc.statusCode === 200 && qiwaResignationCalc.json?.success === true, 'Qiwa termination calculate endpoint responds 200 OK');
  assert(qiwaResignationCalc.json?.data?.statutory_article === 'المادة 85' || qiwaResignationCalc.json?.data?.statutory_rule?.includes('85'), 'Article 85 rule applied for resignation');

  const qiwaProbationCalc = await request('/api/employees/terminated/calculate', {
    method: 'POST',
    headers: adminHeaders
  }, {
    emp_id: shama ? shama.id : 1,
    termination_date: '2026-10-31',
    termination_type: 'فسخ العقد خلال فترة التجربة وفقاً للمادة 53 من نظام العمل',
    deductions_amount: 0
  });
  assert(qiwaProbationCalc.json?.data?.end_of_service_reward === 0, 'Zero gratuity during probation (Article 53)');

  // 10. Test Official Form Previews & Generation (JM-HR-F-001 through JM-HR-F-008)
  const salaryCertHtml = await request(`/api/forms/html/salary-cert/${shama ? shama.id : 1}`);
  assert(salaryCertHtml.statusCode === 200, 'Salary Certificate HTML renders 200 OK');
  assert(salaryCertHtml.body.includes('عبدالملك سعيد الشريف'), 'Salary certificate signed by عبدالملك سعيد الشريف');
  assert(!salaryCertHtml.body.includes('هاني عبدالرحمن القحطاني'), 'No mention of old HR name in salary certificate');

  const leaveFormHtml = await request(`/api/forms/html/leave/${shama ? shama.id : 1}?emp_id=${shama ? shama.id : 1}`);
  assert(leaveFormHtml.statusCode === 200, 'Leave Form HTML renders 200 OK');
  assert(leaveFormHtml.body.includes('JM-HR-F-001'), 'Leave Form reference is official JM-HR-F-001');

  // Word generator test
  const wordSalaryCert = await request(`/api/forms/word/salary_cert?emp_id=${shama ? shama.id : 1}`);
  assert(wordSalaryCert.statusCode === 200, 'Word Salary Cert generated 200 OK');
  assert(Number(wordSalaryCert.headers['content-length']) > 5000, 'Word docx file has valid non-empty buffer');

  // 11. Test Pending Approvals Engine for Manager
  const pendingRes = await request('/api/approvals/pending', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(pendingRes.statusCode === 200, 'Pending approvals endpoint (/api/approvals/pending) responds 200 OK');

  console.log('\n====================================================');
  console.log(`Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================');
}

runTestSuite().catch(e => console.error('Suite error:', e));
