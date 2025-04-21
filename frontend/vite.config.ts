import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    viteCompression(),
    visualizer({
      filename: './stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@features': resolve(__dirname, './src/features'),
      '@store': resolve(__dirname, './src/store'),
      '@styles': resolve(__dirname, './src/styles'),
      '@types': resolve(__dirname, './src/types'),
      '@utils': resolve(__dirname, './src/utils')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          charts: ['chart.js', 'react-chartjs-2'],
          ui: ['styled-components', 'react-icons'],
          query: ['@tanstack/react-query']
        }
      }
    },
    sourcemap: true,
    chunkSizeWarningLimit: 1000
  }
})
