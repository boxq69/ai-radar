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
# or:
npm run build:gh
```

## Deploy to GitHub Pages

1. Push to `main` — GitHub Actions builds and deploys automatically.
2. In **Settings → Pages**:
   - **Source:** GitHub Actions
3. Open: https://boxq69.github.io/ai-radar/

If an old deploy is still visible, hard-refresh (Cmd+Shift+R).

## API

```text
GET https://freeserp.ai/api.php?index=sites&ai_startups=1&q=...&sort=went_live&order=desc
```

No API key. The app calls FreeSerp directly from the browser.
