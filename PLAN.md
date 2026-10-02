# AI Radar — Site Plan

## Goal
Help founders, product managers, and indie hackers discover newly live AI products quickly. The app queries FreeSerp Main (`index=sites`) with `ai_startups=1` to focus on genuine AI-product niches.

## Audience
- Founders researching competitors in a niche
- Investors and scouts scanning fresh AI launches
- Builders looking for inspiration by category or stack

## Product
**AI Radar** — search, niche filters, and side-by-side comparison for AI startups indexed by FreeSerp.

## Pages & structure
| Section | Purpose |
| --- | --- |
| **Search** | Query, niche chips, DR / date / sort filters, result list |
| **Compare** | Side-by-side table for up to 3 selected sites |
| **Plan** | Goal, audience, and information architecture |

## Data source
- Endpoint: `https://freeserp.ai/api.php`
- Index: `sites`
- Filter: `ai_startups=1`
- Docs: [freeserp.ai/docs.php](https://freeserp.ai/docs.php)

## Tech
- Vite + vanilla JavaScript
- Static deploy on GitHub Pages
- Browser `fetch` to FreeSerp (CORS-open, no API key)
