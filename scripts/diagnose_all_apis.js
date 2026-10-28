const fs = require('fs');
const path = require('path');

const serverContent = fs.readFileSync(path.join(__dirname, '../server/server.js'), 'utf8');
const appContent = fs.readFileSync(path.join(__dirname, '../public/js/app.js'), 'utf8');

// Find all routes in server.js: app.get, app.post, app.put, app.delete
const serverRouteRegex = /app\.(get|post|put|delete)\s*\(\s*['"]([^'"]+)['"]/g;
const serverRoutes = [];
let m;
while ((m = serverRouteRegex.exec(serverContent)) !== null) {
  serverRoutes.push({ method: m[1].toUpperCase(), route: m[2] });
}

// Find all fetch or apiFetch calls in app.js
const clientFetchRegex = /(?:fetch|apiFetch)\s*\(\s*[`'"](\/api\/[^`'"?]+)/g;
const clientRoutes = new Set();
while ((m = clientFetchRegex.exec(appContent)) !== null) {
  clientRoutes.add(m[1]);
}

console.log(`Server Routes count: ${serverRoutes.length}`);
console.log(`Client API endpoints called count: ${clientRoutes.size}`);

// Check if any client route has NO matching server route (allowing for params like :id or :month)
const missingRoutes = [];
for (const clientRoute of clientRoutes) {
  const parts = clientRoute.split('/').filter(Boolean);
  const matched = serverRoutes.some(sr => {
    const sParts = sr.route.split('/').filter(Boolean);
    if (sParts.length !== parts.length) return false;
    return sParts.every((sp, i) => sp.startsWith(':') || sp === parts[i]);
  });
  if (!matched) {
    missingRoutes.push(clientRoute);
  }
}

console.log('\nMissing Server Routes (called by client but not defined on server):', missingRoutes.length);
missingRoutes.forEach(r => console.log('  ❌ MISSING:', r));
