import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Roots-Knotty-Roots/',   // 👈 IMPORTANT
  plugins: [react()],
})
