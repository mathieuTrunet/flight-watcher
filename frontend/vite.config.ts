import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: { preprocessorOptions: { scss: { implementation: 'sass' } } },
  server: {
    proxy: {
      '/api': { target: 'http://backend:4000', changeOrigin: true, rewrite: path => path.replace('^/api', '') },
    },
    host: true,
    port: 3000,
  },
})
