const http = require('http');
const fs = require('fs');
const path = require('path');

const serverContent = fs.readFileSync(path.join(__dirname, '../server/server.js'), 'utf8');

// Extract all GET routes
const getRouteRegex = /app\.get\s*\(\s*['"]([^'"]+)['"]/g;
const getRoutes = [];
let m;
while ((m = getRouteRegex.exec(serverContent)) !== null) {
  const r = m[1];
  // Replace params with dummy values for testing
  let testUrl = r
    .replace(':id', '1')
    .replace(':month', '2026-10')
    .replace(':code', 'JM-1000')
    .replace(':year', '2026')
    .replace(':requestId', '26')
    .replace(':entityType', 'employee');
  getRoutes.push({ original: r, testUrl });
}

console.log(`Testing ${getRoutes.length} GET routes against http://localhost:3000...`);

function checkRoute(routeObj) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.get(`http://localhost:3000${routeObj.testUrl}`, {
      headers: {
        'x-user-id': '1',
        'x-user-role': 'admin',
        'x-user-emp-id': '10130'
      }
    }, (res) => {
      const duration = Date.now() - start;
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let isJson = false;
        let parsed = null;
        try {
          parsed = JSON.parse(data);
          isJson = true;
        } catch (_) {}

        resolve({
          route: routeObj.original,
          testUrl: routeObj.testUrl,
          statusCode: res.statusCode,
          duration,
          isJson,
          success: parsed ? parsed.success : null,
          dataLen: data.length
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        route: routeObj.original,
        testUrl: routeObj.testUrl,
        statusCode: 0,
        error: err.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        route: routeObj.original,
        testUrl: routeObj.testUrl,
        statusCode: 408,
        error: 'Timeout'
      });
    });
  });
}

async function run() {
  const results = [];
  const failures = [];

  for (const r of getRoutes) {
    // Skip static or wildcard
    if (r.testUrl.includes('*')) continue;
    const res = await checkRoute(r);
    results.push(res);
    if (res.statusCode >= 400 || res.statusCode === 0) {
      failures.push(res);
      console.log(`❌ [${res.statusCode}] ${r.testUrl} (${res.duration || 0}ms) ${res.error || ''}`);
    } else {
      console.log(`✓ [${res.statusCode}] ${r.testUrl} (${res.duration}ms)`);
    }
  }

  console.log('\n====================================');
  console.log(`Total Routes Tested: ${results.length}`);
  console.log(`Successful: ${results.length - failures.length}`);
  console.log(`Failures: ${failures.length}`);
  console.log('====================================');

  if (failures.length > 0) {
    fs.writeFileSync(path.join(__dirname, 'endpoint_failures.json'), JSON.stringify(failures, null, 2));
  }
}

run();
