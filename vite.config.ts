import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backend = env.VITE_PROXY_TARGET || 'http://localhost:8081'

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
      // Mọi request /api/** được chuyển tới VITE_PROXY_TARGET (hiện là fd-auth-service), bỏ tiền tố /api.
      // Trình duyệt chỉ thấy origin của Vite nên cookie HttpOnly của fd-auth-service hoạt động, không vướng CORS.
      proxy: {
        '/api': {
          target: backend,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
          // Backend đặt cookie refresh_token với Path=/auth, nhưng trình duyệt gọi /api/auth/...: không đổi path
          // thì cookie không bao giờ được gửi kèm POST /api/auth/refresh và mọi lần làm mới phiên đều lỗi 401
          cookiePathRewrite: { '/auth': '/api/auth' },
        },
      },
    },
  }
})
