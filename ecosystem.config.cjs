/**
 * PM2 Ecosystem Configuration
 * Manages the Exam Digital Time Clock application on Windows IIS
 *
 * Usage:
 *   pm2 start ecosystem.config.js                    # Start with PM2
 *   pm2 start ecosystem.config.js --env production  # Start in production
 *   pm2 monitor                                      # Monitor in browser
 *   pm2 logs                                         # View logs
 *   pm2 reload ecosystem.config.js                  # Reload gracefully
 *   pm2 restart ecosystem.config.js                 # Restart immediately
 */

module.exports = {
  apps: [
    {
      // Application name
      name: 'exam-digital-time',

      // Script to run (use Next.js built-in server)
      script: 'node_modules/next/dist/bin/next',
      args: 'start',

      // Interpreter
      interpreter: 'node',

      // Number of instances to run
      // 1 = single instance (recommended for IIS proxy)
      // 'max' = CPU cores count
      instances: 1,

      // Execution mode
      exec_mode: 'cluster',

      // Node environment
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOSTNAME: 'localhost',
      },

      // Production environment
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: 'localhost',
      },

      // Watch for file changes (disable in production)
      watch: false,
      watch_delay: 1000,
      ignore_watch: [
        'node_modules',
        '.next',
        '.git',
        'coverage',
        'logs',
        '*.log',
      ],

      // Automatic restart on crash
      autorestart: true,

      // Max memory restart
      max_memory_restart: '1G',

      // Error log file
      error_file: './logs/error.log',

      // Output log file
      out_file: './logs/out.log',

      // Combined log file
      log_file: './logs/combined.log',

      // Merge logs from all instances
      merge_logs: true,

      // Log timestamp
      time: true,

      // Graceful shutdown timeout (milliseconds)
      kill_timeout: 10000,

      // Listen for IIS specific signals
      listen_timeout: 3000,

      // Environment variables file
      env_file: '.env.production',

      // Post-update hook (after code update)
      post_update: ['npm install --production'],

      // Min uptime before considering app as started
      min_uptime: '10s',

      // Max restarts in time window before stopping
      max_restarts: 10,
      min_uptime_window: 60000, // 1 minute window

      // Node arguments
      node_args: '--max-old-space-size=512',

      // Cron restart (e.g., restart daily at 2 AM)
      // cron_restart: '0 2 * * *',

      // Custom instance variables for multi-instance setup
      // Uncomment for load balancing scenarios
      // instance_var: 'INSTANCE_ID',

      // Logs directory
      instances_logs_folder: './logs',
    },
  ],

  // Deploy configuration (optional)
  deploy: {
    production: {
      user: 'node',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/exam-digital-time.git',
      path: '/var/www/exam-digital-time',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
    },
  },
}
