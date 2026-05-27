import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Para GitHub Pages em subpasta, use GH_PAGES_BASE (definido no deploy-gh-pages.mjs)
const ghPagesBase = process.env.GH_PAGES_BASE || '/'

export default defineConfig({
  plugins: [react()],
  base: ghPagesBase,
})

