import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/admin',
  assetsInclude: ['**/icons/*.svg', 'assets/*.css', '**/*.html?inline'],
  build: {
    assetsInlineLimit: 0,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@icons': path.resolve(__dirname, './src/assets/icons'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  preview: {
    port: 5550,
  },
})
