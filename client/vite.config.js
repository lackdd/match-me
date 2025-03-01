import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy for API requests
      '/api': {
        target: process.env.VITE_BACKEND_URL || (process.env.DOCKER_ENV ? 'http://match-me-backend:8080' : 'http://localhost:8080'), // Backend server, http://match-me-backend:8080 for docker
        changeOrigin: true,            // Ensures the Host header matches the target
        rewrite: (path) => path.replace(/^\/api/, ''), // Optionally rewrite paths
      },
      // Proxy for WebSocket connections (Socket.IO)
      '/socket.io': {
        target: process.env.VITE_BACKEND_URL || (process.env.DOCKER_ENV ? 'http://match-me-backend:8080' : 'http://localhost:8080'), // Backend server, http://match-me-backend:8080 for docker
        ws: true,                       // Enable WebSocket proxying
        changeOrigin: true,
      },
    },
  },
});
