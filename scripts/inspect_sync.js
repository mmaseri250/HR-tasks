const fs = require('fs');
const content = fs.readFileSync('./public/js/app.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('async function syncDataFromBackend') || l.includes('function syncDataFromBackend')) {
    console.log(`Line ${idx + 1}: ${l.trim()}`);
    console.log(lines.slice(idx, idx + 80).join('\n'));
    console.log('--------------------------------------------------');
  }
});
