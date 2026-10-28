const db = require('../server/database/db');

const checks = ['approvals', 'workflow_steps', 'notifications', 'audit_logs', 'requests', 'leaves', 'employees'];
for (const tbl of checks) {
  const row = db.get("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [tbl]);
  console.log(`Table ${tbl.padEnd(16)}: ${row ? 'EXISTS' : 'MISSING'}`);
}
