// =========================================================================
// نظام موارد بشرية شركة جوهرة المجد - Jawharat Al-Majd HRMS
// PM2 Process Manager Configuration (Linux / Windows Production Server)
// =========================================================================

module.exports = {
  apps: [
    {
      name: 'jawharat-hrms',
      script: 'server/server.js',
      instances: 1, // Node:sqlite DatabaseSync operates with WAL mode on single instance
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        TZ: 'Asia/Riyadh'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      time: true
    }
  ]
};
