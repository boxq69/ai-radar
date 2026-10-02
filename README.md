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
```

For GitHub Pages (project site under `/<repo>/`):

```bash
BASE_PATH=/ai-search/ npm run build
```

Replace `ai-search` with your repository name if it differs.

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and publishes automatically.

The live URL will be:

`https://<username>.github.io/<repo>/`

## API

```text
GET https://freeserp.ai/api.php?index=sites&ai_startups=1&q=...&sort=went_live&order=desc
```

No API key required.
