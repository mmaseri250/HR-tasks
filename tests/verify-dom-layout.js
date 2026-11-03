const fs = require('fs');
const html = fs.readFileSync('./public/index.html', 'utf8');

const hasSidebar = html.includes('sidebar-desktop-container');
const hasHiddenOnSidebar = /<aside[^>]*sidebar-desktop-container[^>]*hidden/.test(html);
const hasNavDashboard = html.includes('id="nav-dashboard"');
const hasViewDashboard = html.includes('id="view-dashboard"');
const hasKpiStatCard = html.includes('kpi-stat-card');
const hasBrandHeader = html.includes('شركة جوهرة المجد');

console.log('DOM checks:');
console.log('- Sidebar container present:', hasSidebar);
console.log('- Sidebar has unexpected hidden class in tag:', hasHiddenOnSidebar);
console.log('- nav-dashboard button present:', hasNavDashboard);
console.log('- view-dashboard section present:', hasViewDashboard);
console.log('- kpi-stat-card classes present:', hasKpiStatCard);
console.log('- Brand Header present:', hasBrandHeader);

if (!hasSidebar || hasHiddenOnSidebar || !hasNavDashboard || !hasViewDashboard) {
  console.error('DOM validation failed!');
  process.exit(1);
} else {
  console.log('✓ All DOM checks PASSED cleanly!');
}
