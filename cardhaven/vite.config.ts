// Automatic deployment enabled via GitHub Actions
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/CARDHAVEN/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: 'esnext',
    sourcemap: false,
  },
})
