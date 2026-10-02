# AI Radar

Search, filter, and compare AI startups using the public [FreeSerp](https://freeserp.ai/docs.php) API (`index=sites`, `ai_startups=1`).

## Features

- Full-text search with niche chips and filters (DR, live date, sort)
- Result list with summaries, Domain Rating, and stack signals
- Compare up to three sites side by side
- Site plan (goal, audience, structure)

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
# or explicitly:
npm run build:gh
```

## Deploy to GitHub Pages

1. Push to `main` — Actions builds the app and publishes the `gh-pages` branch.
2. In the repo open **Settings → Pages**:
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages` / `/ (root)`
3. Open: https://boxq69.github.io/ai-radar/

If you see a blank page, Pages is still serving `main` (source files). Switch the branch to `gh-pages`.

## API

```text
GET https://freeserp.ai/api.php?index=sites&ai_startups=1&q=...&sort=went_live&order=desc
```

No API key required.
