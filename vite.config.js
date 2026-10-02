import { defineConfig } from 'vite';

// GitHub Pages project URL: https://boxq69.github.io/ai-radar/
const base = process.env.BASE_PATH || '/ai-radar/';

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
