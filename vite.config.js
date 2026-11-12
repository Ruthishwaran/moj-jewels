import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function razorpayLocalApiPlugin() {
  const attachMiddleware = (server, env) => {
    if (!process.env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_ID) process.env.RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID
    if (!process.env.RAZORPAY_KEY_SECRET && env.RAZORPAY_KEY_SECRET) process.env.RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET
    if (!process.env.VITE_RAZORPAY_KEY_ID && env.VITE_RAZORPAY_KEY_ID) process.env.VITE_RAZORPAY_KEY_ID = env.VITE_RAZORPAY_KEY_ID

    server.middlewares.use((req, res, next) => {
      const urlPath = (req.url || '').split('?')[0]
      if (urlPath !== '/api/create-order' && urlPath !== '/api/verify-payment') {
        return next()
      }

      if (typeof res.status !== 'function') {
        res.status = (code) => {
          res.statusCode = code
          return res
        }
      }
      if (typeof res.json !== 'function') {
        res.json = (payload) => {
          if (!res.headersSent) {
            res.setHeader('Content-Type', 'application/json')
          }
          res.end(JSON.stringify(payload))
          return res
        }
      }

      const chunks = []
      req.on('data', (chunk) => chunks.push(chunk))
      req.on('end', async () => {
        try {
          req.body = Buffer.concat(chunks).toString('utf8')
          const targetFile = urlPath === '/api/create-order' ? 'api/create-order.js' : 'api/verify-payment.js'
          const fileUrl = pathToFileURL(path.resolve(process.cwd(), targetFile)).href
          const { default: handler } = await import(fileUrl)
          await handler(req, res)
        } catch (err) {
          res.status(500).json({ error: err?.message || 'Local API handler error' })
        }
      })
    })
  }

  return {
    name: 'razorpay-local-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      attachMiddleware(server, env)
    },
    configurePreviewServer(server) {
      const env = loadEnv('production', process.cwd(), '')
      attachMiddleware(server, env)
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), razorpayLocalApiPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore'],
          icons: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 800
  },
  server: {
    port: 3000,
    open: true
  }
})
