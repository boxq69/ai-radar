# AI Radar

Search, filter, and compare AI startups using the public [FreeSerp](https://freeserp.ai/docs.php) API (`index=sites`, `ai_startups=1`).

## Why Netlify (not direct browser → FreeSerp)

FreeSerp returns **two** `Access-Control-Allow-Origin: *` headers. Chrome shows **200 OK** in Network, but blocks JavaScript from reading the body (`Failed to fetch`).

GitHub Pages cannot proxy requests. Netlify can: the browser calls **same-origin** `/api/freeserp`, and Netlify fetches FreeSerp server-side. No Cloudflare, no API key.

## Local development

```bash
npm install
npm run dev
```

Vite proxies `/api/freeserp` → FreeSerp locally.

## Deploy (Netlify)

1. Open [https://app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git** → select `boxq69/ai-radar`.
2. Build settings are already in `netlify.toml` (`npm run build`, publish `dist`).
3. Deploy. Your site URL will be like `https://<name>.netlify.app`.

That URL is the one that will load FreeSerp data correctly.

## API used

```text
GET /api/freeserp?index=sites&ai_startups=1&sort=went_live&order=desc
→ proxied to https://freeserp.ai/api.php
```
