import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'supabase': ['@supabase/supabase-js'],
          'framer':   ['framer-motion'],
          'vendor':   ['react', 'react-dom'],
        },
      },
    },
  },
})
