import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built app works from any subpath (e.g. GitHub
  // Pages project sites serve from /<repo-name>/, not the domain root).
  base: './',
  plugins: [react(), tailwindcss()],
})
