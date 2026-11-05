const fs = require('node:fs');
const path = require('node:path');

const appJsPath = path.join(__dirname, '..', 'public', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Replace filterEmployeesTable with enhanced subtab filtering
const oldFuncMarker = `function filterEmployeesTable() {
  const search = (document.getElementById('empSearchInput')?.value || '').toLowerCase().trim();
  const deptId = document.getElementById('empDeptFilter')?.value || '';
  const branchId = document.getElementById('empBranchFilter')?.value || '';
  const jobTitle = document.getElementById('empJobTitleFilter')?.value || '';
  const nat = document.getElementById('empNationalityFilter')?.value;
  const status = document.getElementById('empStatusFilter')?.value || '';
  const contractType = document.getElementById('empContractTypeFilter')?.value || '';
  const salaryRange = document.getElementById('empSalaryRangeFilter')?.value || '';

  const filtered = (state.employees || []).filter(e => {`;

const newFuncReplacement = `function filterEmployeesTable() {
  const search = (document.getElementById('empSearchInput')?.value || '').toLowerCase().trim();
  const deptId = document.getElementById('empDeptFilter')?.value || '';
  const branchId = document.getElementById('empBranchFilter')?.value || '';
  const jobTitle = document.getElementById('empJobTitleFilter')?.value || '';
  const nat = document.getElementById('empNationalityFilter')?.value;
  const status = document.getElementById('empStatusFilter')?.value || '';
  const contractType = document.getElementById('empContractTypeFilter')?.value || '';
  const salaryRange = document.getElementById('empSalaryRangeFilter')?.value || '';

  const activeSubTab = (typeof empDbState !== 'undefined' && empDbState.activeSubTab) ? empDbState.activeSubTab : 'active';

  // Update SubTab Badges
  const activeCount = (state.employees || []).filter(e => e.status === 'نشط').length;
  const terminatedCount = (state.employees || []).filter(e => e.status === 'منتهي الخدمة').length;
  const badgeActive = document.getElementById('badgeEmpActiveTabCount');
  if (badgeActive) badgeActive.textContent = activeCount;
  const badgeTerminated = document.getElementById('badgeEmpTerminatedTabCount');
  if (badgeTerminated) badgeTerminated.textContent = terminatedCount;

  const filtered = (state.employees || []).filter(e => {
    // Sub-tab filter: active vs terminated
    if (activeSubTab === 'active' && e.status !== 'نشط') return false;
    if (activeSubTab === 'terminated' && e.status !== 'منتهي الخدمة') return false;`;

if (appJs.includes(oldFuncMarker)) {
  appJs = appJs.replace(oldFuncMarker, newFuncReplacement);
  console.log('Successfully updated filterEmployeesTable with subtab filtering.');
} else {
  // Try CRLF
  const oldFuncMarkerCRLF = oldFuncMarker.replace(/\n/g, '\r\n');
  const newFuncReplacementCRLF = newFuncReplacement.replace(/\n/g, '\r\n');
  if (appJs.includes(oldFuncMarkerCRLF)) {
    appJs = appJs.replace(oldFuncMarkerCRLF, newFuncReplacementCRLF);
    console.log('Successfully updated filterEmployeesTable with subtab filtering (CRLF).');
  } else {
    console.warn('Could not locate oldFuncMarker in app.js.');
  }
}

// Ensure openEmployee360 loads photo and documents properly
const open360Marker = 'function openEmployee360(empId) {';
const open360Replacement = `function openEmployee360(empId) {
  window.current360EmpId = empId;
  const emp = (state.employees || []).find(e => e.id === Number(empId)) || {};
  const avatarCircle = document.getElementById('emp360AvatarCircle');
  if (avatarCircle) {
    if (emp.photo_url) {
      avatarCircle.innerHTML = \`<img src="\${emp.photo_url}" class="w-full h-full object-cover">\`;
    } else {
      const initials = (emp.full_name_ar || '').split(' ').slice(0, 2).map(w => w[0] || '').join('');
      avatarCircle.textContent = initials || 'JM';
    }
  }
  loadEmployeeDocuments(empId);`;

if (appJs.includes(open360Marker)) {
  appJs = appJs.replace(open360Marker, open360Replacement);
  console.log('Successfully patched openEmployee360.');
}

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('app.js saved.');
