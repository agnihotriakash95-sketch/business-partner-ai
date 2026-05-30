import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/functions'],
          charts: ['recharts'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
          pdf: ['jspdf'],
        },
      },
    },
  },
  server: {
    port: 5173,
  },
});
