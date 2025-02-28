import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
  },
  server: {
    proxy: {
      // Proxy for API requests
      '/api': {
        target: 'http://localhost:8080', // Backend server
        changeOrigin: true,            // Ensures the Host header matches the target
        rewrite: (path) => path.replace(/^\/api/, ''), // Optionally rewrite paths
      },
      // Proxy for WebSocket connections
      '/ws': {
        target: 'http://localhost:8080', // Backend server
        ws: true,                       // Enable WebSocket proxying
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
