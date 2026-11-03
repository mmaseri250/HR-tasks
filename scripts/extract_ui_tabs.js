// scripts/extract_ui_tabs.js
const fs = require('fs');

const html = fs.readFileSync('./public/index.html', 'utf8');
const regex = /switchTab\(['"]([^'"]+)['"]\)/g;
const tabs = new Set();
let m;
while ((m = regex.exec(html)) !== null) {
  tabs.add(m[1]);
}

console.log('--- ALL UI TABS EXTRACTED FROM index.html ---');
const tabList = Array.from(tabs);
console.log('Count:', tabList.length);
tabList.forEach(t => console.log('Tab ID:', t));
