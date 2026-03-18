import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Nutze die Umgebungsvariable
export default defineConfig({
  plugins: [react()],
  base: '/zetkin-jl/',  // Setze dies auf deinen GitHub Pages-Pfad (z. B. "/<repo-name>/")
  build: {
    outDir: 'dist',  // Stelle sicher, dass der Build-Output in das 'dist'-Verzeichnis geht
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL, // Stelle sicher, dass du die Umgebungsvariable korrekt verwendest
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
