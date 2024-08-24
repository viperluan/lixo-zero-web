import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '~api': path.resolve(__dirname, './src/api'),
      '~assets': path.resolve(__dirname, './src/assets'),
      '~components': path.resolve(__dirname, './src/components'),
      '~context': path.resolve(__dirname, './src/context'),
      '~layouts': path.resolve(__dirname, './src/layouts'),
      '~views': path.resolve(__dirname, './src/views'),
      '~bootstrap': path.resolve(__dirname, './node_modules/bootstrap'),
    }
  },
})
