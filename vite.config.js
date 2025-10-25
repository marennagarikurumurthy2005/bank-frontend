import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  build: {
    rollupOptions: {
      external: ["axios"], // ✅ explicitly tell Vite to treat axios as an external dependency
    },
  },
})
