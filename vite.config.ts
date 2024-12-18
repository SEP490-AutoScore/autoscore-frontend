import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Đảm bảo base path trỏ về root
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true, // Tự động mở trình duyệt khi chạy server
    hmr: true, // Hot Module Replacement
  },
  // Thêm fallback cho SPA
  preview: {
    port: 8080, // Chạy trên port 8080 khi dùng chế độ preview
    host: '0.0.0.0',
  },
})