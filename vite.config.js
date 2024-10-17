// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    proxy: {
      '/api': {
        target: 'https://marathon.lockated.com', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
=======
    host: true,  // Exposes server to network (0.0.0.0)
    port: 3000,  // Use a non-privileged port
    strictPort: true, // Fail if port 3000 is not available
  },
})
>>>>>>> cccc6a8547e9d71889255600281cd5d6b4463536
