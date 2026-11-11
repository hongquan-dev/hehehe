import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const gateway = env.VITE_PROXY_TARGET || 'http://localhost:8080'

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    build: {
      rollupOptions: {
        output: {
          // Tách thư viện ra chunk riêng: trình duyệt cache lâu, đổi code app không phải tải lại vendor
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            query: ['@tanstack/react-query', 'axios', 'zustand'],
            ui: [
              'motion/react',
              'sonner',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-avatar',
            ],
          },
        },
      },
    },
    server: {
      port: 5173,
      // Mọi request /api/** đi qua API Gateway (Spring Cloud Gateway), bỏ tiền tố /api.
      // Cùng origin với Vite nên cookie HttpOnly của fd-auth-service hoạt động, không vướng CORS.
      proxy: {
        '/api': {
          target: gateway,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
    },
  }
})
