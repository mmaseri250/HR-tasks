const fs = require('fs');
const html = fs.readFileSync('./public/index.html', 'utf8');

const hasSidebar = html.includes('sidebar-desktop-container');
const hasHiddenOnSidebar = /<aside[^>]*sidebar-desktop-container[^>]*hidden/.test(html);
const hasNavDashboard = html.includes('id="nav-dashboard"');
const hasViewDashboard = html.includes('id="view-dashboard"');
const hasGlassStatCard = html.includes('glass-stat-card');
const hasApexDept = html.includes('id="apexDeptChart"');
const hasApexAtt = html.includes('id="apexAttendanceChart"');
const hasAlertsSearch = html.includes('id="dashboardAlertsSearch"');
const hasPenaltiesSearch = html.includes('id="dashboardPenaltiesSearch"');
const hasBrandHeader = html.includes('شركة جوهرة المجد');

console.log('DOM checks:');
console.log('- Sidebar container present:', hasSidebar);
console.log('- Sidebar has unexpected hidden class in tag:', hasHiddenOnSidebar);
console.log('- nav-dashboard button present:', hasNavDashboard);
console.log('- view-dashboard section present:', hasViewDashboard);
console.log('- glass-stat-card classes present:', hasGlassStatCard);
console.log('- apexDeptChart container present:', hasApexDept);
console.log('- apexAttendanceChart container present:', hasApexAtt);
console.log('- Smart tables search inputs present:', hasAlertsSearch && hasPenaltiesSearch);
console.log('- Brand Header present:', hasBrandHeader);

if (!hasSidebar || hasHiddenOnSidebar || !hasNavDashboard || !hasViewDashboard || !hasGlassStatCard || !hasApexDept || !hasApexAtt) {
  console.error('DOM validation failed!');
  process.exit(1);
} else {
  console.log('✓ All DOM checks PASSED cleanly!');
}
