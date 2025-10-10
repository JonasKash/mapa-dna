import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'lp.mapadnafinanceiro.com',
      'www.lp.mapadnafinanceiro.com',
      'mapadnafinanceiro.com',
      'www.mapadnafinanceiro.com'
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
