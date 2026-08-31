import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built app works from any subpath (it's deployed
  // alongside Sparkagain and ChoreStars, at /Sparkagain/defis/).
  base: './',
  plugins: [react(), tailwindcss()],
})
