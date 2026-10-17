// server/modules/tasks.js - Independent Tasks System & Manager Dashboard
const { query, get, run } = require('../database/db');

/**
 * Auto-update overdue tasks
 */
function updateOverdueTasksStatus() {
  const todayStr = new Date().toISOString().split('T')[0];
  run(`
    UPDATE tasks
    SET status = 'متأخرة',
        updated_at = datetime('now')
    WHERE status NOT IN ('مكتملة', 'متأخرة')
      AND due_date < ?
  `, [todayStr]);
}

/**
 * Get all tasks with filters
 */
function getAllTasks(filters = {}) {
  updateOverdueTasksStatus();

  let sql = `
    SELECT t.*,
           e.emp_code, e.full_name_ar AS assigned_to_name, e.job_title_ar AS assigned_to_job,
           d.name_ar AS department_name, b.name_ar AS branch_name,
           m.full_name_ar AS direct_manager_name,
           assigner.full_name_ar AS assigned_by_emp_name
    FROM tasks t
    JOIN employees e ON t.assigned_to = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    LEFT JOIN employees m ON e.manager_id = m.id
    LEFT JOIN employees assigner ON t.assigned_by = assigner.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.assigned_to) {
    sql += ` AND t.assigned_to = ?`;
    params.push(filters.assigned_to);
  }

  if (filters.status) {
    sql += ` AND t.status = ?`;
    params.push(filters.status);
  }

  if (filters.priority) {
    sql += ` AND t.priority = ?`;
    params.push(filters.priority);
  }

  if (filters.department_id) {
    sql += ` AND e.department_id = ?`;
    params.push(filters.department_id);
  }

  if (filters.search) {
    sql += ` AND (t.title LIKE ? OR t.description LIKE ? OR e.full_name_ar LIKE ? OR t.task_no LIKE ?)`;
    const searchPattern = `%${filters.search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }

  sql += ` ORDER BY t.due_date ASC, t.id DESC`;
  const rows = query(sql, params);
  return rows.map(r => ({ ...r, progress_percentage: r.progress_percent }));
}

/**
 * Get task by ID
 */
function getTaskById(id) {
  updateOverdueTasksStatus();
  const sql = `
    SELECT t.*,
           e.emp_code, e.full_name_ar AS assigned_to_name, e.job_title_ar AS assigned_to_job,
           d.name_ar AS department_name, b.name_ar AS branch_name,
           m.full_name_ar AS direct_manager_name,
           assigner.full_name_ar AS assigned_by_emp_name
    FROM tasks t
    JOIN employees e ON t.assigned_to = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    LEFT JOIN employees m ON e.manager_id = m.id
    LEFT JOIN employees assigner ON t.assigned_by = assigner.id
    WHERE t.id = ?
  `;
  const row = get(sql, [id]);
  return row ? { ...row, progress_percentage: row.progress_percent } : null;
}

/**
 * Create a new task
 */
function createTask(data) {
  const {
    title,
    description = '',
    assigned_to,
    assigned_by = null,
    assigned_by_name = 'مدير النظام',
    start_date,
    due_date,
    priority = 'متوسطة',
    progress_percent = 0,
    status = 'جديدة'
  } = data;

  if (!title || !assigned_to || !start_date || !due_date) {
    throw new Error('بيانات المهمة غير مكتملة (العنوان، الموظف المكلف، تاريخ البداية، تاريخ الاستحقاق)');
  }

  const emp = get('SELECT id, full_name_ar FROM employees WHERE id = ?', [assigned_to]);
  if (!emp) {
    throw new Error('الموظف المكلف غير موجود');
  }

  const year = new Date().getFullYear();
  const countRow = get('SELECT COUNT(*) AS total FROM tasks');
  const seq = String((countRow.total || 0) + 1).padStart(4, '0');
  const task_no = `TSK-${year}-${seq}`;

  const todayStr = new Date().toISOString().split('T')[0];
  let finalStatus = status;
  if (finalStatus !== 'مكتملة' && due_date < todayStr) {
    finalStatus = 'متأخرة';
  }

  const sql = `
    INSERT INTO tasks (
      task_no, title, description, assigned_to, assigned_by, assigned_by_name,
      start_date, due_date, priority, progress_percent, status, manager_approval,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'معلق', datetime('now'), datetime('now'))
  `;

  const result = run(sql, [
    task_no, title, description, assigned_to, assigned_by, assigned_by_name,
    start_date, due_date, priority, Number(progress_percent) || 0, finalStatus
  ]);

  return getTaskById(result.lastInsertRowid);
}

/**
 * Update task progress and details
 */
function updateTask(id, data) {
  const existing = getTaskById(id);
  if (!existing) {
    throw new Error('المهمة غير موجودة');
  }

  const todayStr = new Date().toISOString().split('T')[0];
  let progress = data.progress_percentage !== undefined ? Number(data.progress_percentage) : (data.progress_percent !== undefined ? Number(data.progress_percent) : existing.progress_percent);
  let status = data.status || existing.status;
  let completedAt = existing.completed_at;

  // Auto-status transitions based on progress if status not explicitly provided
  if (!data.status) {
    if (progress >= 100) {
      status = 'مكتملة';
    } else if (progress > 0 && status === 'جديدة') {
      status = 'قيد التنفيذ';
    }
  }

  if (status === 'مكتملة' && !completedAt) {
    completedAt = datetimeNow();
  }

  const dueDate = data.due_date || existing.due_date;
  if (status !== 'مكتملة' && dueDate < todayStr) {
    status = 'متأخرة';
  }

  const sql = `
    UPDATE tasks SET
      title = ?,
      description = ?,
      assigned_to = ?,
      start_date = ?,
      due_date = ?,
      priority = ?,
      progress_percent = ?,
      status = ?,
      manager_comment = ?,
      hr_comment = ?,
      completed_at = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `;

  run(sql, [
    data.title !== undefined ? data.title : existing.title,
    data.description !== undefined ? data.description : existing.description,
    data.assigned_to !== undefined ? Number(data.assigned_to) : existing.assigned_to,
    data.start_date || existing.start_date,
    dueDate,
    data.priority || existing.priority,
    progress,
    status,
    data.manager_comment !== undefined ? data.manager_comment : existing.manager_comment,
    data.hr_comment !== undefined ? data.hr_comment : existing.hr_comment,
    completedAt,
    id
  ]);

  return getTaskById(id);
}

/**
 * Approve / Complete task by Manager or HR
 */
function approveTask(id, action, role = 'manager', comment = '') {
  const task = getTaskById(id);
  if (!task) {
    throw new Error('المهمة غير موجودة');
  }

  if (role === 'manager' || role === 'direct_manager') {
    if (action === 'approve') {
      run(`
        UPDATE tasks
        SET manager_approval = 'معتمد من المدير المباشر',
            manager_comment = ?,
            status = 'بانتظار الاعتماد',
            updated_at = datetime('now')
        WHERE id = ?
      `, [comment || 'تم الاعتماد المبدئي من قبل المدير المباشر', id]);
    } else {
      run(`
        UPDATE tasks
        SET manager_approval = 'مرفوض من المدير المباشر',
            manager_comment = ?,
            status = 'قيد التنفيذ',
            updated_at = datetime('now')
        WHERE id = ?
      `, [comment || 'تم طلب تعديل أو إعادة المهمة', id]);
    }
  } else {
    // HR Manager / Admin
    if (action === 'approve') {
      run(`
        UPDATE tasks
        SET manager_approval = 'معتمد نهائياً',
            hr_comment = ?,
            progress_percent = 100,
            status = 'مكتملة',
            completed_at = datetime('now'),
            updated_at = datetime('now')
        WHERE id = ?
      `, [comment || 'تم الاعتماد النهائي للمهمة بنجاح', id]);
    } else {
      run(`
        UPDATE tasks
        SET manager_approval = 'مرفوض من الموارد البشرية',
            hr_comment = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `, [comment || 'ملاحظات وتعديلات مطلوبة من إدارة الموارد البشرية', id]);
    }
  }

  return getTaskById(id);
}

/**
 * Delete task
 */
function deleteTask(id) {
  return run('DELETE FROM tasks WHERE id = ?', [id]);
}

/**
 * Helper to get current ISO datetime string
 */
function datetimeNow() {
  return new Date().toISOString();
}

/**
 * Tasks KPIs & Manager Dashboard
 */
function getTasksDashboardMetrics(filters = {}) {
  updateOverdueTasksStatus();

  const totalRow = get('SELECT COUNT(*) AS total FROM tasks');
  const openRow = get(`SELECT COUNT(*) AS total FROM tasks WHERE status IN ('جديدة', 'قيد التنفيذ', 'بانتظار الاعتماد')`);
  const completedRow = get(`SELECT COUNT(*) AS total FROM tasks WHERE status = 'مكتملة'`);
  const overdueRow = get(`SELECT COUNT(*) AS total FROM tasks WHERE status = 'متأخرة'`);
  const avgProgressRow = get('SELECT COALESCE(AVG(progress_percent), 0) AS avg_prog FROM tasks');

  // Breakdown by priority
  const byPriority = query(`
    SELECT priority, COUNT(id) AS count
    FROM tasks
    GROUP BY priority
  `);

  // Breakdown by status
  const byStatus = query(`
    SELECT status, COUNT(id) AS count
    FROM tasks
    GROUP BY status
  `);

  // Breakdown by employee
  const byEmployee = query(`
    SELECT e.id, e.emp_code, e.full_name_ar,
           COUNT(t.id) AS total_tasks,
           SUM(CASE WHEN t.status = 'مكتملة' THEN 1 ELSE 0 END) AS completed_tasks,
           SUM(CASE WHEN t.status = 'متأخرة' THEN 1 ELSE 0 END) AS overdue_tasks,
           COALESCE(AVG(t.progress_percent), 0) AS avg_progress
    FROM employees e
    JOIN tasks t ON e.id = t.assigned_to
    GROUP BY e.id
    ORDER BY total_tasks DESC
    LIMIT 10
  `);

  return {
    total: totalRow.total || 0,
    open: openRow.total || 0,
    completed: completedRow.total || 0,
    overdue: overdueRow.total || 0,
    totalTasks: totalRow.total || 0,
    openTasks: openRow.total || 0,
    completedTasks: completedRow.total || 0,
    overdueTasks: overdueRow.total || 0,
    completionRate: Math.round((avgProgressRow.avg_prog || 0) * 10) / 10,
    byPriority,
    byStatus,
    byEmployee
  };
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  approveTask,
  deleteTask,
  getTasksDashboardMetrics
};
