const db = require('../server/database/db');
console.log('Notifications in DB:', db.query("SELECT * FROM notifications"));
