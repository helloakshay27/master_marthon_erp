import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Exposes server to network (0.0.0.0)
    port: 3000,  // Use a non-privileged port
    strictPort: true, // Fail if port 3000 is not available
  },
})
