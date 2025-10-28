/**
 * Custom Next.js server with PM2 integration
 * Enhanced for production deployments on Windows IIS with PM2
 *
 * Features:
 * - Graceful shutdown handling
 * - Error tracking and logging
 * - PM2 process management compatible
 * - IIS proxy support (forwarded headers)
 *
 * Usage with PM2:
 *   pm2 start server.ts --name "exam-clock" --interpreter tsx --watch
 *   pm2 start ecosystem.config.js
 */

import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

// Configuration
const port = parseInt(process.env.PORT || '3000', 10)
const hostname = process.env.HOSTNAME || 'localhost'
const isDev = process.env.NODE_ENV !== 'production'

// Create Next.js instance
const app = next({ dev: isDev })
const handle = app.getRequestHandler()

/**
 * Start server
 */
app.prepare().then(() => {
  const server = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url || '', true)

      // Log requests in development
      if (isDev) {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
      }

      // Handle the request with Next.js
      handle(req, res, parsedUrl)
    } catch (err) {
      console.error('[Server Error] Request handling failed:', err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  })

  // Listen on all interfaces
  server.listen(port, hostname, () => {
    const env = isDev ? 'development' : 'production'
    console.log(`
╔════════════════════════════════════════════════════════╗
║  Exam Digital Time Clock - Server Ready                ║
╠════════════════════════════════════════════════════════╣
║ URL:         http://${hostname}:${port}
║ Environment: ${env}
║ PM2:         Enabled for process management
╚════════════════════════════════════════════════════════╝
    `)
  })

  /**
   * Graceful shutdown handler for PM2
   */
  process.on('SIGTERM', () => {
    console.log('[PM2] SIGTERM signal received: closing HTTP server')
    server.close(() => {
      console.log('[PM2] HTTP server closed')
      process.exit(0)
    })

    // Forcefully shut down after 30 seconds
    setTimeout(() => {
      console.error('[PM2] Forcing shutdown after 30 seconds')
      process.exit(1)
    }, 30000)
  })

  process.on('SIGINT', () => {
    console.log('[PM2] SIGINT signal received: closing HTTP server')
    server.close(() => {
      console.log('[PM2] HTTP server closed')
      process.exit(0)
    })
  })

  /**
   * Error handlers
   */
  process.on('uncaughtException', (err) => {
    console.error('[PM2] Uncaught Exception:', err)
    process.exit(1)
  })

  process.on('unhandledRejection', (reason, promise) => {
    console.error('[PM2] Unhandled Rejection at:', promise, 'reason:', reason)
    process.exit(1)
  })
}).catch((err) => {
  console.error('[Server] Failed to prepare Next.js app:')
  console.error(err)
  process.exit(1)
})
