const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');

console.log('=== SCRIPTS IN INDEX.HTML ===');
const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  const src = match[1];
  const isExternal = src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//');
  const localPath = path.join(__dirname, '../public', src);
  const exists = isExternal ? 'CDN' : fs.existsSync(localPath) ? 'EXISTS' : 'MISSING!';
  console.log(`  ${src} [${exists}]`);
}

console.log('\n=== CSS IN INDEX.HTML ===');
const cssRegex = /<link[^>]*href=["']([^"']+)["'][^>]*>/gi;
while ((match = cssRegex.exec(html)) !== null) {
  const href = match[1];
  const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');
  const localPath = path.join(__dirname, '../public', href);
  const exists = isExternal ? 'CDN' : fs.existsSync(localPath) ? 'EXISTS' : 'MISSING!';
  console.log(`  ${href} [${exists}]`);
}
