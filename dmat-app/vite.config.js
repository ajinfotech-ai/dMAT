import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { createAIProxyMiddleware } from './server/aiProxy.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables (such as OMNIROUTE_API_KEY) into process.env server-side only
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
      react(),
      {
        name: 'omni-route-ai-proxy',
        configureServer(server) {
          server.middlewares.use(createAIProxyMiddleware())
        },
        configurePreviewServer(server) {
          server.middlewares.use(createAIProxyMiddleware())
        }
      }
    ]
  }
})
