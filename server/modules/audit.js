// server/modules/audit.js - Comprehensive Immutable System-Wide Audit Log Engine
const { query, get, run } = require('../database/db');
const xlsx = require('xlsx');

function detectBrowserAndDevice(userAgent = '') {
  let browser = 'Unknown Browser';
  let device = 'Desktop';

  if (!userAgent) return { browser, device };

  const ua = userAgent.toLowerCase();

  // Device detection
  if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(ua)) {
    device = 'Mobile';
  } else if (/ipad|tablet|android(?!.*mobile)/i.test(ua)) {
    device = 'Tablet';
  } else {
    device = 'Desktop';
  }

  // Browser detection
  if (ua.includes('edg/')) browser = 'Microsoft Edge';
  else if (ua.includes('chrome/') && !ua.includes('edg/')) browser = 'Google Chrome';
  else if (ua.includes('safari/') && !ua.includes('chrome/')) browser = 'Apple Safari';
  else if (ua.includes('firefox/')) browser = 'Mozilla Firefox';
  else if (ua.includes('opera/') || ua.includes('opr/')) browser = 'Opera';

  return { browser, device };
}

/**
 * Logs a system-wide audit event. Immutable and tamper-proof.
 */
function logAuditEvent(req, data = {}) {
  try {
    let ip = '';
    let userAgent = '';
    let actorId = data.performed_by_id || (data.user_id ? parseInt(data.user_id, 10) : null);
    let actorName = data.performed_by_name || data.username || '';
    let actorRole = data.performed_by_role || data.role || '';

    if (req) {
      ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '';
      userAgent = req.headers['user-agent'] || '';

      if (!actorId && req.headers['x-user-id']) {
        actorId = parseInt(req.headers['x-user-id'], 10) || null;
      }
      if (!actorName && req.headers['x-user-name']) {
        try {
          actorName = decodeURIComponent(req.headers['x-user-name']);
        } catch (e) {
          actorName = req.headers['x-user-name'];
        }
      }
      if (!actorRole && req.headers['x-user-role']) {
        actorRole = req.headers['x-user-role'];
      }
    }

    const { browser, device } = detectBrowserAndDevice(userAgent);

    const oldValStr = typeof data.old_values === 'object' ? JSON.stringify(data.old_values) : (data.old_values || null);
    const newValStr = typeof data.new_values === 'object' ? JSON.stringify(data.new_values) : (data.new_values || null);

    const result = run(`
      INSERT INTO audit_logs (
        entity_type, entity_id, action,
        performed_by_id, performed_by_name, performed_by_role,
        old_status, new_status, stage, comment,
        ip_address, emp_code, department_name,
        old_values, new_values, browser, device,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
    `, [
      data.entity_type || data.module_name || 'system',
      data.entity_id != null ? String(data.entity_id) : (data.record_id != null ? String(data.record_id) : '0'),
      data.action || data.action_type || 'GENERAL_ACTION',
      actorId,
      actorName || 'النظام',
      actorRole || 'admin',
      data.old_status || null,
      data.new_status || null,
      data.stage || null,
      data.comment || data.details || null,
      ip || data.ip_address || '127.0.0.1',
      data.emp_code || null,
      data.department_name || null,
      oldValStr,
      newValStr,
      browser,
      device
    ]);

    return result && result.lastInsertRowid ? Number(result.lastInsertRowid) : true;
  } catch (err) {
    console.error('Audit Log Engine Error:', err.message);
    return false;
  }
}

/**
 * Query audit logs with multi-parameter filtering, search & pagination
 */
function getAuditLogs(params = {}) {
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const limit = Math.min(100, Math.max(10, parseInt(params.limit, 10) || 50));
  const offset = (page - 1) * limit;

  let whereClauses = ['1=1'];
  const args = [];

  if (params.search) {
    const s = `%${params.search.trim()}%`;
    whereClauses.push('(performed_by_name LIKE ? OR action LIKE ? OR entity_type LIKE ? OR comment LIKE ? OR emp_code LIKE ? OR old_values LIKE ? OR new_values LIKE ?)');
    args.push(s, s, s, s, s, s, s);
  }

  if (params.action && params.action !== 'all') {
    whereClauses.push('action = ?');
    args.push(params.action);
  }

  if (params.entity_type && params.entity_type !== 'all') {
    whereClauses.push('entity_type = ?');
    args.push(params.entity_type);
  }

  if (params.user_id) {
    whereClauses.push('performed_by_id = ?');
    args.push(parseInt(params.user_id, 10));
  }

  if (params.department) {
    whereClauses.push('department_name = ?');
    args.push(params.department);
  }

  if (params.date_from) {
    whereClauses.push('date(created_at) >= date(?)');
    args.push(params.date_from);
  }

  if (params.date_to) {
    whereClauses.push('date(created_at) <= date(?)');
    args.push(params.date_to);
  }

  const whereSql = whereClauses.join(' AND ');

  const countRow = get(`SELECT COUNT(*) as total FROM audit_logs WHERE ${whereSql}`, args);
  const total = countRow ? countRow.total : 0;

  const logs = query(`
    SELECT * FROM audit_logs 
    WHERE ${whereSql}
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `, [...args, limit, offset]);

  return {
    logs,
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit)
  };
}

/**
 * Generate Excel (.xlsx) buffer for Audit Log export
 */
function exportAuditLogsExcel(params = {}) {
  // Fetch up to 2000 rows matching the filters
  const data = getAuditLogs({ ...params, page: 1, limit: 2000 });
  const rows = data.logs.map(log => ({
    'رقم السجل': log.id,
    'التاريخ والوقت': log.created_at,
    'المستخدم': log.performed_by_name || 'النظام',
    'الدور': log.performed_by_role || '-',
    'الرقم الوظيفي': log.emp_code || '-',
    'نوع العملية': log.action,
    'الوحدة المستهدفة': log.entity_type,
    'معرف الكيان': log.entity_id,
    'الحالة السابقة': log.old_status || '-',
    'الحالة الجديدة': log.new_status || '-',
    'الملاحظات': log.comment || '-',
    'عنوان IP': log.ip_address || '-',
    'المتصفح': log.browser || '-',
    'الجهاز': log.device || '-',
    'القيم السابقة': log.old_values || '-',
    'القيم الجديدة': log.new_values || '-'
  }));

  const worksheet = xlsx.utils.json_to_sheet(rows);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'سجل الرقابة والعمليات');
  return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

function getAuditStats() {
  const total = get('SELECT COUNT(*) as c FROM audit_logs').c;
  const today = get("SELECT COUNT(*) as c FROM audit_logs WHERE date(created_at) = date('now', 'localtime')").c;
  const actions = query('SELECT action, COUNT(*) as c FROM audit_logs GROUP BY action ORDER BY c DESC LIMIT 10');
  const entities = query('SELECT entity_type, COUNT(*) as c FROM audit_logs GROUP BY entity_type ORDER BY c DESC LIMIT 10');

  return {
    total_events: total,
    today_events: today,
    top_actions: actions,
    top_entities: entities
  };
}

module.exports = {
  logAuditEvent,
  getAuditLogs,
  exportAuditLogsExcel,
  getAuditStats
};
