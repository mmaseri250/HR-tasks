const fs = require('node:fs');
const path = require('node:path');

const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

indexHtml = indexHtml.replace(
  '>111</h3>',
  '>108</h3>'
);

indexHtml = indexHtml.replace(
  '31 سعودي • 80 مقيم</span>',
  '<span id="statTotalEmployeesSub">30 سعودي • 78 مقيم</span></span>'
);

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('Updated statTotalEmployees placeholders in index.html.');
