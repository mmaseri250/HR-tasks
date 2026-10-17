const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');
const js = fs.readFileSync('public/js/app.js', 'utf8');

// Extract all onclick handlers
const onclickRegex = /onclick="([a-zA-Z0-9_]+)\(/g;
let match;
const usedFunctions = new Set();
while ((match = onclickRegex.exec(html)) !== null) {
  usedFunctions.add(match[1]);
}

console.log('Total unique onclick functions in index.html:', usedFunctions.size);

const missingFns = [];
for (const fn of usedFunctions) {
  // Check if defined as function fn, or window.fn, or async function fn, or let/const fn =
  const pattern = new RegExp(`(function\\s+${fn}\\b|window\\.${fn}\\s*=|const\\s+${fn}\\s*=|let\\s+${fn}\\s*=)`);
  if (!pattern.test(js)) {
    missingFns.push(fn);
  }
}

console.log('Missing functions from app.js:', missingFns);
if (missingFns.length > 0) {
  console.error('FAIL: Found onclick functions with no definition in app.js!');
} else {
  console.log('SUCCESS: All onclick functions in index.html are properly defined in app.js!');
}
