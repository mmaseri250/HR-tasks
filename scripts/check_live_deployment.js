// scripts/check_live_deployment.js
const https = require('https');

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

async function runChecks() {
  console.log('--- 1. Checking Home Page on Production ---');
  try {
    const home = await fetchUrl('https://jawharat-hrms.onrender.com');
    console.log('HTTP Status:', home.statusCode);
    console.log('HTML Length:', home.body.length);
    console.log('Contains max-w-none:', home.body.includes('max-w-none'));
    console.log('Contains max-w-7xl:', home.body.includes('max-w-7xl'));
    console.log('Contains modalSalaryCertificate:', home.body.includes('modalSalaryCertificate'));
    console.log('Contains عبدالملك سعيد الشريف:', home.body.includes('عبدالملك سعيد الشريف'));
    console.log('Contains هاني عبدالرحمن القحطاني:', home.body.includes('هاني عبدالرحمن القحطاني'));
  } catch (err) {
    console.error('Home Page Error:', err.message);
  }

  console.log('\n--- 2. Checking App.js on Production ---');
  try {
    const js = await fetchUrl('https://jawharat-hrms.onrender.com/js/app.js');
    console.log('HTTP Status:', js.statusCode);
    console.log('JS Length:', js.body.length);
    console.log('Contains openOfficialFormPreview:', js.body.includes('openOfficialFormPreview'));
    console.log('Contains certificateContainer in refreshSalaryCert:', js.body.includes('certificateContainer'));
    console.log('Contains هاني عبدالرحمن القحطاني:', js.body.includes('هاني عبدالرحمن القحطاني'));
  } catch (err) {
    console.error('app.js Error:', err.message);
  }

  console.log('\n--- 3. Checking API Forms & Endpoints ---');
  try {
    const certHtml = await fetchUrl('https://jawharat-hrms.onrender.com/api/forms/html/salary-cert/1');
    console.log('Salary Cert HTML Status:', certHtml.statusCode);
    console.log('Cert HTML Length:', certHtml.body.length);
    console.log('Cert Contains عبدالملك سعيد الشريف:', certHtml.body.includes('عبدالملك سعيد الشريف'));
    console.log('Cert Contains هاني عبدالرحمن القحطاني:', certHtml.body.includes('هاني عبدالرحمن القحطاني'));
  } catch (err) {
    console.error('API Error:', err.message);
  }

  console.log('\n--- 4. Checking Leave Form HTML for Non-existent / Emp_ID ---');
  try {
    const leaveHtml = await fetchUrl('https://jawharat-hrms.onrender.com/api/forms/html/leave/15321?emp_id=15321');
    console.log('Leave HTML Status:', leaveHtml.statusCode);
    console.log('Contains "طلب الإجازة غير موجود":', leaveHtml.body.includes('طلب الإجازة غير موجود'));
    console.log('Contains "JM-HR-F-001":', leaveHtml.body.includes('JM-HR-F-001'));
  } catch (err) {
    console.error('Leave API Error:', err.message);
  }
}

runChecks();
