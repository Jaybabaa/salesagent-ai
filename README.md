# SalesAgent AI

An AI sales agent for small businesses: a chat widget that answers visitor questions 24/7, captures leads, books appointments, follows up automatically, and recommends products. This repository contains the full landing page, a scripted demo of the chat widget, and a lead-capture form.

## Live example

The site is deployed to GitHub Pages: https://jaybabaa.github.io/salesagent-ai/

Try the chat widget ("Try the demo") and the waitlist form on the live site.

## Repo structure

```
src/
  routes/            # TanStack Start routes: __root.tsx (HTML shell), index.tsx (landing page)
  components/
    DemoChat.tsx     # scripted demo chat widget (hotel scenario, fully client-side)
    WaitlistForm.tsx # lead-capture form (client-side only — see "Connecting your own services")
  styles/app.css     # Tailwind entrypoint + base styles
  db.ts              # optional server-side database helper (reads DATABASE_URL; unused until you wire it)
  router.tsx         # app router
vite.config.ts       # Vite/TanStack Start config; base switches to /salesagent-ai/ when GH_PAGES=1
package.json         # scripts: dev, build, static-export, start, publish, go-live
publish.sh           # build + serve on port 3000 (bun run publish)
static-export.ts     # renders the site to static HTML for GitHub Pages
serve.ts             # production server (port 3000)
go-live.sh           # one-shot Vercel deployment (needs VERCEL_TOKEN)
vercel-entry.ts      # Vercel Build Output API entry point
build-vercel.sh      # assembles the .vercel/output bundle
```

## How it works today

- The **demo chat** (`src/components/DemoChat.tsx`) is a self-contained, scripted conversation — a fictional "Oceanview Grand Hotel" scenario that demonstrates answering a visitor, capturing a lead (name + email), booking, and recommending an upgrade. It makes **no network calls and no backend requests**: there is no live AI wired in yet.
- The **waitlist form** (`src/components/WaitlistForm.tsx`) runs entirely in the browser. It validates input and shows a success state, but **explicitly does not send or store anything** — a `TODO(server)` comment marks exactly where server-side wiring belongs.

## Prerequisites

- [bun](https://bun.sh) (Node.js is pulled in by bun; nothing else is required)

## Run locally / preview

```bash
bun install
bun run publish
```

`bun run publish` (via `publish.sh`) installs dependencies, builds the site, and starts the production server on **port 3000** — open http://localhost:3000.

For development with hot reload: `bun run dev`.

## Deploy options

### GitHub Pages

The site is a TanStack Start app, so the Pages build bakes in the `/salesagent-ai/` base path (see `vite.config.ts`), renders the HTML shell once, and publishes the static output:

```bash
GH_PAGES=1 bun run build && bun run static-export
```

Then publish the contents of `dist/client` to the `gh-pages` branch — Pages is configured with the legacy `gh-pages` branch source, which is how the live Pages URL above is deployed. Re-run the build and push `dist/client` to update the site. (If you prefer push-to-publish automation, a `.github/workflows/deploy-pages.yml` workflow can be added — it needs a GitHub token with the `workflow` scope.)

### Vercel

The repo ships a ready-made Vercel setup (`go-live.sh`, `vercel-entry.ts`, `build-vercel.sh`) using the Vercel Build Output API. From the repo root:

```bash
VERCEL_TOKEN=<your-token> bun run go-live
```

This builds the bundle and deploys it, printing the live URL. `DATABASE_URL` is also accepted as an optional env var. (Running the script directly requires a Vercel account and token.)

## Connecting your own services

**This codebase contains no credentials, API keys, or third-party secrets** — nothing is pre-wired to any external service. For a real deployment, the new owner plugs in their own:

- **Database** — the waitlist form's `TODO(server)` comment in `src/components/WaitlistForm.tsx` shows exactly where to add a `POST` (e.g. to `/api/waitlist`). `src/db.ts` provides a ready server-side helper that reads `DATABASE_URL` (Neon serverless Postgres over HTTP) for use in a `createServerFn()` handler or an `src/routes/api/*` route. Until a database is connected, the site builds and serves fine — queries only fail if you actually run them.
- **Payments** — the pricing section on the landing page (`src/routes/index.tsx`) is marketing copy only. When you're ready to take money, wire in real checkout (e.g. Stripe) and point the pricing buttons at it.
- **Email & domain** — no email service is configured; add one for notifications/follow-ups when you wire the backend. Point your own domain at the deployed site (CNAME for Pages, custom domain on Vercel) and you're live under your own brand.

## Built with

TanStack Start, React, Vite, Tailwind CSS. No license is applied to this repository.
