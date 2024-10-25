// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Exposes server to the network (0.0.0.0)
    port: 5173, // Use a non-privileged port
    strictPort: true, // Fail if port 3000 is not available
    proxy: {
      '/api': {
        target: 'https://marathon.lockated.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
