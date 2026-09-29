# Inker Robotics — Next.js Website

This is the Next.js 14 (App Router) version of the Inker Robotics site, built for **SEO and AEO (Answer Engine Optimisation)**.

The original static HTML site lives in the project root (`index.html`, `robotics.html`, …) and continues to work without any build step. This `nextjs/` folder is the production source that you'll deploy.

---

## What's inside

```
nextjs/
├── app/
│   ├── layout.js         Root layout — global metadata, Organization JSON-LD, font loading, nav, footer
│   ├── page.js           Homepage (/)
│   ├── globals.css       Full design system + page-specific styles
│   ├── sitemap.js        Auto-generated /sitemap.xml
│   ├── robots.js         /robots.txt with allow-lists for major AI crawlers
│   ├── robotics/page.js
│   ├── ai-solutions/page.js
│   ├── roboparks/page.js
│   ├── edutech/page.js
│   ├── careers/page.js
│   ├── about/page.js
│   └── contact/page.js
├── components/
│   ├── Nav.js            Sticky nav with desktop dropdowns (client component)
│   ├── Footer.js
│   ├── JsonLd.js         Safe <script type="application/ld+json"> helper
│   └── Counter.js        Animated stat counters (client, IntersectionObserver)
├── public/
│   ├── logo.png
│   ├── hero-bg.mp4       Hero background video (already optimised: preload="metadata")
│   └── llms.txt          AEO discovery file for LLMs / answer engines
├── package.json
├── next.config.mjs
└── jsconfig.json
```

---

## Quick start

You need **Node.js 18.17 or newer** installed.

```bash
cd nextjs
npm install
npm run dev
```

Open <http://localhost:3000>. Edit any `app/**/page.js` file and the page hot-reloads.

### Production build

```bash
npm run build
npm start          # serves the production build on port 3000
```

### Deploy

The fastest path is **Vercel** (the maker of Next.js):

1. Push this folder to a GitHub repo.
2. Import the repo on <https://vercel.com>.
3. Set the `NEXT_PUBLIC_SITE_URL` environment variable to your production domain (e.g. `https://inkerrobotics.com`).
4. Done — Vercel handles HTTPS, CDN, image optimisation, and serverless rendering automatically.

Any host that supports Node.js 18+ works (Netlify, Render, AWS, GCP, your own VPS). For static-only hosting, run `npm run build` then `npx next export` (note: dynamic features will be limited).

---

## SEO setup — what was added

Every page is **server-rendered** so crawlers receive fully-built HTML on the first request. This is the single biggest reason Next.js was chosen over a plain React SPA.

### Per-page metadata

Each `page.js` exports a `metadata` object that Next.js compiles into `<head>` tags:

- `title` — Unique, descriptive, keyword-rich (≤ 60 chars where possible)
- `description` — A clear 150-character summary used in search snippets
- `alternates.canonical` — The canonical URL for that route
- `openGraph` — Open Graph tags for Facebook/LinkedIn link previews
- `twitter` — Twitter/X card metadata
- Global `robots` directive in `layout.js` for `max-image-preview`, `max-snippet: -1`

### Sitemap

`app/sitemap.js` generates `/sitemap.xml` at build time with all 8 routes, last-modified dates, change frequencies, and priorities.

### Robots

`app/robots.js` generates `/robots.txt` allowing all crawlers, plus **explicit allow-listing of AI crawlers** (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, OAI-SearchBot, etc.). Many companies forget this — AI engines respect these directives.

### Structured data (JSON-LD)

Server-rendered into every page so engines can parse the site's entities:

- **`Organization` + `WebSite`** — emitted globally from the root layout
- **`WebPage`** — per page
- **`BreadcrumbList`** — per page (helps Google show breadcrumbs in results)
- **`FAQPage`** on the homepage with five vetted Q&As (these trigger rich-result FAQ snippets)
- **`AboutPage` / `ContactPage`** — for the About and Contact pages
- **`OfferCatalog`** with nested `Service` items — for Robotics, AI Solutions, and EduTech (these surface in product/service results)
- **`Project`** schema — for RoboParks

### Image + asset optimisation

- The logo uses `next/image` for automatic responsive variants
- The hero video uses `preload="metadata"` so only ~100 KB of header data downloads on first paint
- Mobile viewports skip the video entirely (fallback gradient shown) to save cellular bandwidth

---

## AEO setup — what was added

AEO (Answer Engine Optimisation) is about being **citable and retrievable by AI search** — ChatGPT search, Perplexity, Gemini, Claude search, Bing Copilot, etc. The techniques overlap with SEO but emphasise structured, declarative, citable content.

### `/llms.txt`

A plain-text site summary at `public/llms.txt`. AI engines increasingly look for this file to understand a site quickly. It contains:

- A one-paragraph "what is this site" statement
- Bullet-point summaries of each vertical (Robotics, AI, RoboParks, EduTech)
- Impact stats (numbers AI engines love to quote)
- Mission, vision
- Page-to-purpose map
- Citation guidance

### FAQ schema

The homepage carries a `FAQPage` JSON-LD block answering the five most common questions an AI engine would ask about Inker Robotics. This is the single highest-leverage AEO addition — answer engines often paraphrase these directly.

### Clear semantic HTML

Pages use exactly one `<h1>`, hierarchical `<h2>`/`<h3>`/`<h4>`, semantic `<main>`/`<section>`/`<article>`/`<nav>`/`<footer>`. No content is locked behind interactive state.

### Stable canonical URLs

Each page declares its canonical via `alternates.canonical`. Engines that crawl multiple URL variants will collapse them.

### AI-crawler allow-list

Already covered above in the robots section — also belongs here.

---

## Customising

### Change the site URL

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` (dev) or your host's env vars (prod):

```
NEXT_PUBLIC_SITE_URL=https://inkerrobotics.com
```

This flows into `metadataBase`, the sitemap, robots.txt, and every JSON-LD block.

### Edit metadata

Open any `app/**/page.js`. Each page exports a `metadata` object at the top — edit the title, description, and OG tags there. Changes apply on next build.

### Edit FAQ answers

The FAQ JSON-LD is in `app/page.js`. Find the `jsonLd` constant and edit the `FAQPage.mainEntity` array.

### Add an OG image

Drop a 1200×630 PNG at `public/og.png`. Already referenced in `layout.js` metadata.

### Replace newspaper / video placeholders

The Media section on Home, EduTech, and About pages uses placeholder SVG newspaper clippings. Replace each `<div className="media-visual">` with an `<img src="...">` of the real clipping or a real video thumbnail. The structure is in the page JSX.

---

## Notes

- All `<a href="/...">` internal links currently use plain anchor tags (full page reload on navigation). To enable client-side routing without reload, replace with `<Link>` from `next/link`. The current setup is SEO-equivalent and works fine.
- The original static HTML files in the project root (`index.html`, etc.) are **not part of this Next.js build**. They can be deleted once you've verified the Next.js version is live.
- The `_partials/` folder (if present) contains intermediate conversion artifacts and can be safely deleted.
