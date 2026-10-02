import { defineConfig } from 'vite';

// Netlify / local: "/". GitHub Pages project site: BASE_PATH=/ai-radar/
const base = process.env.BASE_PATH || '/';

const freeserpProxy = {
  '/api/freeserp': {
    target: 'https://freeserp.ai',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api\/freeserp/, '/api.php'),
  },
};

export default defineConfig({
  base,
  server: { proxy: freeserpProxy },
  preview: { proxy: freeserpProxy },
});
