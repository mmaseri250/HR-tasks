const https = require('https');

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), raw: data });
        } catch (_) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function verifyLive() {
  console.log('Testing live Render production deployment at https://jawharat-hrms.onrender.com ...\n');

  try {
    const boot = await fetchUrl('https://jawharat-hrms.onrender.com/api/bootstrap');
    console.log('[1] Bootstrap API status:', boot.status);
    if (boot.data && boot.data.data) {
      const emps = boot.data.data.employees || [];
      console.log('    Total operational employees in bootstrap:', emps.length);
      const hasJM0001 = emps.some(e => e.emp_code === 'JM-0001');
      console.log('    Contains JM-0001 (Chairman):', hasJM0001 ? 'YES ❌' : 'NO (PURGED) ✅');
      const hasFaris = emps.some(e => e.emp_code === 'JM-0004');
      console.log('    Contains Faris (JM-0004):', hasFaris ? 'YES ✅' : 'NO ❌');
    }

    const rbacPerms = await fetchUrl('https://jawharat-hrms.onrender.com/api/rbac/permissions');
    console.log('\n[2] RBAC Permissions API status:', rbacPerms.status);
    if (rbacPerms.data && rbacPerms.data.data) {
      console.log('    Total permissions registered:', rbacPerms.data.data.length, '(Expected: 68)');
    }

    const leaveForm = await fetchUrl('https://jawharat-hrms.onrender.com/api/forms/html/leave/15321?emp_id=15321');
    console.log('\n[3] Leave HTML Form Preview status:', leaveForm.status);
    console.log('    Contains "طلب الإجازة غير موجود":', leaveForm.raw ? leaveForm.raw.includes('طلب الإجازة غير موجود') : 'N/A');

    const absenceForm = await fetchUrl('https://jawharat-hrms.onrender.com/api/forms/html/absence-penalty/28208?emp_id=28208');
    console.log('\n[4] Absence Penalty HTML Form Preview status:', absenceForm.status);
    console.log('    Contains "إشعار عقوبة غياب عن العمل":', absenceForm.raw ? absenceForm.raw.includes('إشعار عقوبة غياب عن العمل') : 'N/A');

    const payrollRes = await fetchUrl('https://jawharat-hrms.onrender.com/api/payroll/periods', {
      'x-user-id': '1',
      'x-user-role': 'admin'
    });
    console.log('\n[5] Payroll Periods status:', payrollRes.status);
    if (payrollRes.data && payrollRes.data.data) {
      console.log('    Periods count:', payrollRes.data.data.length);
      if (payrollRes.data.data[0]) {
        console.log('    Latest period net:', payrollRes.data.data[0].total_net);
      }
    }
  } catch (err) {
    console.error('Error contacting Render:', err.message);
  }
}

verifyLive();
