import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Roots-Knotty-Roots/',   // repo name with slashes
  plugins: [react()],
})
