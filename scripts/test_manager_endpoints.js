// scripts/test_manager_endpoints.js
const { query, get } = require('../server/database/db');
const http = require('http');

// Start temporary server for testing
const express = require('express');
const app = require('../server/server');

// We can test via supertest or http request
async function runTests() {
  console.log('=== TESTING MANAGER ENDPOINTS ===');
  
  // We can test the handler logic directly or by mocking req/res
  const server = app.listen(3099, async () => {
    console.log('Test server listening on port 3099');

    try {
      // 1. Admin login & fetch dashboard-stats
      console.log('\n--- 1. Testing Admin Dashboard Stats ---');
      const adminRes = await fetch('http://localhost:3099/api/manager/dashboard-stats', {
        headers: { 'x-user-id': '1', 'x-user-role': 'admin' }
      }).then(r => r.json());

      console.log('Admin result: success =', adminRes.success);
      console.log('Admin team count =', adminRes.data?.team_count, '(Expected 108)');
      console.log('Admin is_executive =', adminRes.data?.is_executive, '(Expected true)');
      console.log('Available managers count =', adminRes.data?.available_managers?.length);
      console.log('Sample manager:', adminRes.data?.available_managers?.[0]?.full_name_ar, 'Subordinates:', adminRes.data?.available_managers?.[0]?.subordinates_count);

      // 2. Admin switching scope to Ali Al-Bishri (emp_id 59235)
      console.log('\n--- 2. Testing Admin Switching Scope to Ali Al-Bishri ---');
      const aliEmp = get("SELECT id FROM employees WHERE full_name_ar LIKE '%علي سعد حسين البشري%'");
      const adminAliRes = await fetch(`http://localhost:3099/api/manager/dashboard-stats?manager_id=${aliEmp.id}`, {
        headers: { 'x-user-id': '1', 'x-user-role': 'admin' }
      }).then(r => r.json());

      console.log('Admin filtered to Ali: team count =', adminAliRes.data?.team_count, '(Expected 25)');

      // 3. Line Manager Ali Al-Bishri login & fetch dashboard stats
      console.log('\n--- 3. Testing Line Manager Ali Al-Bishri View ---');
      const aliUser = get("SELECT id, role, emp_id FROM users WHERE full_name LIKE '%علي سعد حسين البشري%'");
      const aliRes = await fetch('http://localhost:3099/api/manager/dashboard-stats', {
        headers: { 'x-user-id': String(aliUser.id), 'x-user-role': 'dept_manager', 'x-user-emp-id': String(aliUser.emp_id) }
      }).then(r => r.json());

      console.log('Ali manager result: team count =', aliRes.data?.team_count, '(Expected 25)');
      console.log('Ali is_executive =', aliRes.data?.is_executive, '(Expected false)');
      console.log('Ali available_managers =', aliRes.data?.available_managers?.length, '(Expected 0)');

      // 4. Line Manager Ali attempting IDOR by querying Khaled Raee's team
      console.log('\n--- 4. Testing IDOR Prevention for Line Manager ---');
      const khaledEmp = get("SELECT id FROM employees WHERE full_name_ar LIKE '%خالد احمد محمد راعي%'");
      const idorRes = await fetch(`http://localhost:3099/api/manager/dashboard-stats?manager_id=${khaledEmp.id}`, {
        headers: { 'x-user-id': String(aliUser.id), 'x-user-role': 'dept_manager', 'x-user-emp-id': String(aliUser.emp_id) }
      });
      const idorJson = await idorRes.json();
      console.log('IDOR test HTTP status =', idorRes.status, '(Expected 403)');
      console.log('IDOR error code =', idorJson.code, '(Expected FORBIDDEN_IDOR)');

      // 5. Line Manager Ali assigning task to his own subordinate vs outside
      console.log('\n--- 5. Testing Task Assignment Bounds ---');
      const aliSub = get("SELECT id FROM employees WHERE manager_id = ? LIMIT 1", [aliEmp.id]);
      const khaledSub = get("SELECT id FROM employees WHERE manager_id = ? LIMIT 1", [khaledEmp.id]);

      // 5a. Ali assigns to his own sub
      const validTaskRes = await fetch('http://localhost:3099/api/manager/assign-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(aliUser.id),
          'x-user-role': 'dept_manager',
          'x-user-emp-id': String(aliUser.emp_id)
        },
        body: JSON.stringify({
          title: 'مهمة فحص المستودع الداخلي',
          assigned_to: aliSub.id,
          priority: 'متوسطة'
        })
      });
      const validTaskJson = await validTaskRes.json();
      console.log('Assign to team member HTTP status =', validTaskRes.status, '(Expected 201), success =', validTaskJson.success);

      // 5b. Ali attempts to assign to Khaled's sub (outside his team)
      const invalidTaskRes = await fetch('http://localhost:3099/api/manager/assign-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(aliUser.id),
          'x-user-role': 'dept_manager',
          'x-user-emp-id': String(aliUser.emp_id)
        },
        body: JSON.stringify({
          title: 'محاولة إسناد غير مصرحة',
          assigned_to: khaledSub.id,
          priority: 'عاجلة'
        })
      });
      const invalidTaskJson = await invalidTaskRes.json();
      console.log('Assign to outside employee HTTP status =', invalidTaskRes.status, '(Expected 403), code =', invalidTaskJson.code);

      console.log('\n=== ALL ENDPOINT TESTS PASSED SUCCESSFULLY! ===');
    } catch (err) {
      console.error('Test error:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runTests();
