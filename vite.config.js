import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],
  base: '/curry2cakes/', // This fixes GitHub Pages path issue
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
