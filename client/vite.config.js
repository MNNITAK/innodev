import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- ADD THIS IMPORT
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- ADD THIS PLUGIN
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})