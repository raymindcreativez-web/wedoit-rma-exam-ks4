import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/wedoit-rma-exam-ks4/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      // optional: adjust as needed
    }
  }
});