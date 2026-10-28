const fs = require('fs');
const content = fs.readFileSync('./public/js/app.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes("addEventListener('DOMContentLoaded'") || l.includes('window.onload') || l.includes('function init(') || l.includes('async function init(')) {
    console.log(`Line ${idx + 1}: ${l.trim()}`);
    console.log(lines.slice(idx, idx + 40).join('\n'));
    console.log('--------------------------------------------------');
  }
});
