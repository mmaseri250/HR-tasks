const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const assert = require('assert');

async function testShamaEss() {
  const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost:3000/'
  });

  const { window } = dom;

  // Mock currentUser as Shama
  window.localStorage.setItem('jm_hrms_user', JSON.stringify({
    id: 3,
    username: 'shama.asiri',
    full_name: 'شامة علي محمد عسيري',
    role: 'employee',
    emp_id: 14632,
    emp_code: 'JM-1053'
  }));

  window.fetch = async (url) => {
    let data = { success: true, data: [] };
    if (url.includes('/api/leaves/balances/14632')) {
      data = { success: true, data: { annual_remaining: 20 } };
    } else if (url.includes('/api/tasks')) {
      data = { success: true, data: [{ id: 1, task_no: 'TSK-2026-0001', title: 'مراجعة وتدقيق إشعارات العقود', status: 'قيد التنفيذ' }] };
    } else if (url.includes('/api/requests')) {
      data = {
        success: true,
        data: [
          { id: 26, request_no: 'REQ-2026-0001', emp_id: 14632, request_type: 'إجازة سنوية', full_name_ar: 'شامة علي محمد عسيري', status: 'معلق - بانتظار موافقة المدير المباشر' }
        ]
      };
    }
    return {
      ok: true,
      status: 200,
      json: async () => data,
      text: async () => JSON.stringify(data)
    };
  };

  const appJs = fs.readFileSync(path.join(__dirname, '../public/js/app.js'), 'utf8');
  window.eval(appJs);

  window.state.employees = [
    { id: 14620, emp_code: 'JM-1000', full_name_ar: 'عبدالملك سعيد الشريف', job_title_ar: 'المدير التنفيذي للموارد البشرية', annual_leave_balance: 30 },
    { id: 14632, emp_code: 'JM-1053', full_name_ar: 'شامة علي  محمد عسيري', job_title_ar: 'موظفة موارد بشرية', annual_leave_balance: 20, department_name_ar: 'إدارة الموارد البشرية' }
  ];

  window.state.currentUser = JSON.parse(window.localStorage.getItem('jm_hrms_user'));
  await window.loadSelfService();

  const nameEl = window.document.getElementById('essEmployeeName');
  const titleEl = window.document.getElementById('essEmployeeTitle');
  const balEl = window.document.getElementById('essLeaveBalance');
  const selContainer = window.document.getElementById('essEmpSelectorContainer');

  console.log('ESS Name:', nameEl.textContent);
  console.log('ESS Title:', titleEl.textContent);
  console.log('ESS Balance:', balEl.textContent);
  console.log('ESS Selector Hidden:', selContainer ? selContainer.classList.contains('hidden') : 'no container');

  assert.strictEqual(nameEl.textContent, 'شامة علي  محمد عسيري', 'Employee name must match logged-in employee');
  assert.ok(titleEl.textContent.includes('موظفة موارد بشرية'), 'Job title must match');
  assert.strictEqual(balEl.textContent, '20 يوم', 'Balance must be 20 days');
  assert.ok(selContainer && selContainer.classList.contains('hidden'), 'Employee selector must be hidden for employee role');

  console.log('✓ Shama ESS View verification PASSED 100%!');
}

testShamaEss().then(() => process.exit(0)).catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
