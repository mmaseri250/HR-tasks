// scripts/debug_live_issues.js
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

async function debugIssues() {
  const adminLogin = await request('/api/auth/login', { method: 'POST' }, {
    username: 'admin',
    password: 'Jj123'
  });
  const adminHeaders = { 'Authorization': `Bearer ${adminLogin.json.token}` };

  console.log('--- Checking 113 employees vs 114 ---');
  const empsRes = await request('/api/employees', { headers: adminHeaders });
  const liveEmps = empsRes.json?.data || [];
  console.log('Live employees count:', liveEmps.length);

  // Compare with local DB employees
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync('server/database/hrms.db');
  const localEmps = db.prepare('SELECT id, emp_code, full_name_ar FROM employees').all();
  console.log('Local employees count:', localEmps.length);

  const missingInLive = localEmps.filter(l => !liveEmps.some(e => e.emp_code === l.emp_code || e.full_name_ar === l.full_name_ar));
  console.log('Missing in Live:', missingInLive);

  console.log('\n--- Checking Qiwa Resignation Response ---');
  const shama = liveEmps.find(e => e.full_name_ar.includes('شامة'));
  const calc = await request('/api/employees/terminated/calculate', {
    method: 'POST',
    headers: adminHeaders
  }, {
    emp_id: shama ? shama.id : 1,
    termination_date: '2026-10-31',
    termination_type: 'استقالة الموظف',
    deductions_amount: 0
  });
  console.log('Calc response:', calc.statusCode, calc.json);

  console.log('\n--- Checking Pending Approvals Endpoint ---');
  const hrLogin = await request('/api/auth/login', { method: 'POST' }, {
    username: 'abdulmalik',
    password: 'Hr123'
  });
  console.log('Abdulmalik token:', hrLogin.json?.token ? 'present' : 'missing');
  const pending = await request('/api/requests/pending-approvals', {
    headers: { 'Authorization': `Bearer ${hrLogin.json.token}` }
  });
  console.log('Pending approvals status:', pending.statusCode);
  console.log('Pending approvals body:', pending.body);
}

debugIssues().catch(console.error);
