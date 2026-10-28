const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');
const lines = html.split('\n');
console.log('--- Search views in index.html ---');
lines.forEach((l, i) => {
  if (l.includes('switchView') || l.includes('showView') || l.includes('data-view') || l.includes('view-') || l.includes('الإجازات') || l.includes('الطلبات') || l.includes('الموافقات')) {
    if (l.length < 150) console.log(`${i+1}: ${l.trim()}`);
  }
});
