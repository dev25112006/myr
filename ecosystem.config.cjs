/** PM2 process definition for the MYR production server.
 *  Run on the VPS:  pm2 startOrReload ecosystem.config.cjs && pm2 save
 */
module.exports = {
  apps: [
    {
      name: 'myr',
      // `npm start` → node --env-file-if-exists=.env server/index.mjs
      script: 'npm',
      args: 'start',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      kill_timeout: 8000,
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
      },
      out_file: 'logs/out.log',
      error_file: 'logs/error.log',
      merge_logs: true,
      time: true,
    },
  ],
}
