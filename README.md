# OpenBon

Open source photo frames for campaigns, events, and communities. Create a frame, share a link, and let anyone add their photo for free.

- No watermark, no ads, no paid-only features
- Participants' photos are processed 100% in the browser and never uploaded
- No tracking (just one anonymous "used N times" counter per campaign)
- No account needed for participants; creators get a share link and an edit key

## Stack

Next.js (App Router) on Cloudflare Workers via [OpenNext](https://opennext.js.org/cloudflare),
Cloudflare D1 for the database, Cloudflare R2 for frame storage.

## Run locally

```bash
npm install
npx wrangler d1 migrations apply openbon --local
npm run dev
```

Open http://localhost:3000.

## Deploy to Cloudflare

```bash
npx wrangler d1 create openbon          # copy the database_id into wrangler.jsonc
npx wrangler r2 bucket create openbon-frames
npx wrangler d1 migrations apply openbon --remote
npm run deploy
```

Optional variables (set at build time). Copy `.env.example` to `.env.local` and fill in what you need:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_DONATE_URL` | Donation link (Ko-fi, GitHub Sponsors, Saweria, ...). The button is hidden when empty. |
| `NEXT_PUBLIC_SITE_URL` | Public origin, e.g. `https://openbon.my.id`. Used for canonical URLs, sitemap, and social previews. Set this in production. |
| `NEXT_PUBLIC_REPO_URL` | Repository link shown in the footer. |

## Moderation

- Every campaign has a **Report** button. A campaign is hidden automatically after 5 reports.
- Creators can delete their campaign with the edit key at `/manage/<slug>`.
- To hide one manually: `npx wrangler d1 execute openbon --remote --command "UPDATE campaigns SET hidden = 1 WHERE slug = 'xxx'"`.
- Consider adding a rate-limiting rule in the Cloudflare dashboard (WAF) for `POST /api/campaigns`.

## Limits

- Frames: PNG, 200-2048 px, up to 2 MB each, up to 10 frames per campaign.
- Visibility: public (listed on Explore) or anyone with the link.

## License

AGPL-3.0, see `LICENSE`.
