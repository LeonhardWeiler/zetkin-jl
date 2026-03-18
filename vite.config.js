import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // Base path für GitHub Pages
  base: mode === 'production' ? '/zetkin-jl/' : '/',

  server: {
    proxy: {
      // Nur für lokale Entwicklung: /api → Zetkin API
      '/api': {
        target: 'https://app.zetkin.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        // Stelle sicher, dass Assets in 'assets/' liegen
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
}));
