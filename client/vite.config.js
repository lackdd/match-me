import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    plugins: [react()],
    define: {
      global: "window",  // To make global available
      'process.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL),
      'process.env.VITE_GOOGLE_API': JSON.stringify(process.env.VITE_GOOGLE_API),
      'process.env.VITE_GOOGLE_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_API_KEY),
    },
    server: {
      proxy: {
        // Proxy for API requests
        '/api': {
          target: process.env.VITE_BACKEND_URL || 'http://localhost:8080',  // Default to localhost if not set
          changeOrigin: true,  // Ensures the Host header matches the target
        },
        // Proxy for WebSocket connections
        '/ws': {
          target: process.env.VITE_BACKEND_URL || 'http://localhost:8080',  // Default to localhost if not set
          ws: true,  // Enable WebSocket proxying
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});

/*export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
  },
  server: {
    proxy: {
      // Proxy for API requests
      '/api': {
        target: process.env.VITE_BACKEND_URL || (process.env.DOCKER_ENV ? 'http://match-me-backend:8080' : 'http://localhost:8080'), // Backend server, http://match-me-backend:8080 for docker
        changeOrigin: true,            // Ensures the Host header matches the target
        rewrite: (path) => path.replace(/^\/api/, ''), // Optionally rewrite paths
      },
      // Proxy for WebSocket connections
      '/ws': {
		  target: process.env.VITE_BACKEND_URL || (process.env.DOCKER_ENV ? 'http://match-me-backend:8080' : 'http://localhost:8080'), // Backend server, http://match-me-backend:8080 for docker
        ws: true,                       // Enable WebSocket proxying
        changeOrigin: true,
        secure: false,
      },
    },
  },
});*/
