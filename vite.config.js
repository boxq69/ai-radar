import { defineConfig } from 'vite';

// GitHub Pages project sites need "/<repo>/". Override via BASE_PATH.
// Example: BASE_PATH=/ai-search/ npm run build
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  server: {
    proxy: {
      '/api/freeserp': {
        target: 'https://freeserp.ai',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/freeserp/, '/api.php'),
      },
    },
  },
});
