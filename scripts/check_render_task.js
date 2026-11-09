async function check() {
  const r = await fetch('https://jawharat-hrms.onrender.com/');
  const html = await r.text();
  const isNew = html.includes('id="leaveBalancesTabCount">108</span>');
  console.log('Is new commit live on Render?', isNew);

  const taskRes = await fetch('https://jawharat-hrms.onrender.com/api/tasks');
  const taskData = await taskRes.json();
  const found = (taskData.data || []).find(t => t.title && t.title.includes('TEST_EPHEMERAL_PERSISTENCE'));
  console.log('Task status on Render:', found ? 'FOUND (Task ID ' + found.id + ')' : 'NOT FOUND (Data was wiped/reset on redeploy!)');
  console.log('Total tasks count:', (taskData.data || []).length);
}
check();
