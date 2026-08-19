# sandries.com — Luis Bedoya Sandries

The unified portfolio: dev projects with live in-page demos, a cork-board
design gallery, an MDX blog with a Keystatic admin, plus experience /
education / about pages. Built to replace the old YOOtheme sandries.com and
the separate luis.sandries.com flyer board with one site.

## Route map

| Route | What |
| --- | --- |
| `/` | Landing: hero, featured projects, featured designs, latest writing, contact |
| `/projects` | Master-detail explorer — 1/3 sidebar, 2/3 live iframe preview, Preview/Code toggle (`?project=<id>` deep links) |
| `/designs` | Cork board: 40 draggable pinned flyers, positions persist in localStorage, tap for lightbox |
| `/blog`, `/blog/[slug]` | MDX blog rendered via `next-mdx-remote-client/rsc` |
| `/keystatic` | Content admin (see below) |
| `/experience`, `/education`, `/about` | Resume-style pages |

## Architecture

| Concern | Choice |
| --- | --- |
| Hosting | Vercel (project `online-portfolio`), GitHub → Vercel CI/CD |
| Framework | Next.js App Router + Tailwind CSS v4 (CSS-first theme in `app/globals.css`) |
| Structured content | Typed JSON in `config/` (`projects.json`, `flyers.json`, `experience.json`, `education.json`, `about.json`) — contracts in `config/types.ts` |
| Blog content | `content/posts/*.mdx` (YAML frontmatter), read with `@keystatic/core/reader` |
| Code view | `github1s.com` (github.dev blocks framing) |
| Memory management | React `key`-bound iframe unmounting (see below) |

## Editing content

**Blog posts** — run `npm run dev`, open `http://localhost:3000/keystatic`,
and write in the admin UI. Entries are real files in `content/posts/`;
commit + push and Vercel deploys them. (Posts are plain MDX — you can also
edit the files directly.)

**Projects** — edit `config/projects.json`. Set `embed` to `"auto"` for
lightweight demos, `"click"` for heavy ones (WASM/large bundles), `"none"`
for code-only projects. The Code toggle appears whenever `repoUrl` is a
public GitHub repo. `category: "featured"` projects appear on the landing.

**Flyers** — edit `config/flyers.json`; drop the webp + thumb into
`public/designs/<QC>/[thumb/]`. `featured: true` flyers appear on the
landing. (`scripts/import-flyers.mjs` was the one-time importer from
luis.sandries.com.)

### Hosted admin (Keystatic GitHub mode) — currently OFF

The admin can also run on the deployed site, committing straight to GitHub.
It is gated behind env vars because of an open Keystatic bug on Next 16
(GitHub-storage admin renders blank —
[keystatic#1549](https://github.com/Thinkmill/keystatic/issues/1549)).
To attempt it **on a preview deployment first**:

1. `https://keystatic.com/docs/github-mode` — create the Keystatic GitHub
   App for `bysandries/online-portfolio`.
2. In Vercel → Settings → Environment Variables (Preview env only, at first):
   `KEYSTATIC_STORAGE=github`, `KEYSTATIC_GITHUB_CLIENT_ID`,
   `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` (random 32+ chars),
   `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
3. Open `/keystatic` on the preview URL. If it renders blank, the bug still
   stands: remove `KEYSTATIC_STORAGE` and keep using the local workflow.

## Performance & memory strategy

Several showcased projects boot a full Java toolchain (CheerpJ/WASM) or the
VS Code workbench in the browser. The portfolio keeps client-side CPU and
memory in check by:

1. **One iframe, ever.** Only the selected project's current view is mounted.
2. **`key`-bound unmounting.** The iframe's React `key` is
   `${projectId}:${mode}:${instance}` — switching projects/views tears the
   old document out so the browser GCs its heap (WASM memory, JVM state,
   VS Code workbench).
3. **Click-to-load facades.** `embed: "click"` projects render a card first;
   the heavy demo loads only on explicit user action.
4. **Lazy flyer thumbs.** The cork board renders 40 `loading="lazy"` webp
   thumbnails; the full-size image loads only in the lightbox.

## Development

```bash
npm install
npm run dev      # http://localhost:3000 (includes /keystatic admin)
npm run build    # production build — run before pushing
```

## Domain cutover checklist (sandries.com → this site)

1. Push to `main`, verify the production deployment on the Vercel URL.
2. Vercel → Project → Domains: add `sandries.com` (and `www`), follow the
   DNS instructions at the registrar (A/ALIAS + CNAME).
3. Verify legacy URLs 308-redirect on the apex: `/company` → `/about`,
   `/resume` → `/experience`, `/designs-gallery` → `/designs`, the three
   `/blog/<old-slug>` URLs, and `/?project=<id>` → `/projects?project=<id>`.
4. Point `luis.sandries.com` at `sandries.com/designs` (Netlify redirect)
   or retire it.
5. Submit `https://sandries.com/sitemap.xml` in Google Search Console.

## Rollback

Every commit is an immutable Vercel deployment. Bad deploy → Vercel
Dashboard → Deployments → previous build → **Promote to Production**, then
`git revert <hash>` to realign the repo.
