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

## API

```text
GET https://freeserp.ai/api.php?index=sites&ai_startups=1&q=...&sort=went_live&order=desc
```

No API key required.
