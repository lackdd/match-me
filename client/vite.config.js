import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode (e.g., 'development', 'production')
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      global: "window",
    },
    server: {
      proxy: {
        // Proxy for API requests
        '/api': {
          target: env.VITE_BACKEND_URL || (env.DOCKER_ENV ? 'http://match-me-backend:8080' : 'http://localhost:8080'),
          changeOrigin: true,            // Ensures the Host header matches the target
          rewrite: (path) => path.replace(/^\/api/, ''), // Optionally rewrite paths
        },
        // Proxy for WebSocket connections
        '/ws': {
          target: env.VITE_BACKEND_URL || (env.DOCKER_ENV ? 'http://match-me-backend:8080' : 'http://localhost:8080'),
          ws: true,                       // Enable WebSocket proxying
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
