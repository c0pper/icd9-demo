import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@slices': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  plugins: [react()],
})
