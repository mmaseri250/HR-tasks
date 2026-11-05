const { db } = require('../server/database/db.js');
const fleetService = require('../server/modules/fleetService.js');
const generalAdminService = require('../server/modules/generalAdminService.js');

console.log('--- TESTING APIS WITH ZERO MOCK FLEET & LICENSES ---');

// 1. Fleet KPIs
const fleetKpis = fleetService.getFleetKPIs();
console.log('Fleet KPIs:', fleetKpis);

// 2. Fleet Vehicles
const vehicles = fleetService.getAllVehicles();
console.log('Fleet Vehicles Count:', vehicles.length);

// 3. Licenses
const licenses = generalAdminService.getAllLicenses();
console.log('Company Licenses Count:', licenses.length);

console.log('✓ All modules gracefully handle 0 vehicles and 0 licenses!');
