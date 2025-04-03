import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/feed-of-posts/',
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve('./src') }],
  },
  server: {
    open: true,
  },
})
