# Interactive Portfolio — Luis Bedoya Sandries

A master-detail portfolio: **1/3 sidebar** for project navigation, **2/3 live preview** that embeds each deployed project in-page via iframe, with a **Preview / Code toggle** that opens any public repo in VS Code for the Web.

## Architecture

| Concern | Choice |
| --- | --- |
| Hosting | Vercel (serverless edge network) |
| CI/CD | GitHub → Vercel preview deployments on every PR |
| Framework | Next.js (App Router) + Tailwind CSS |
| Content | `config/projects.json` — static, version-controlled, no CMS |
| Code view | `github1s.com` (microsoft/vscode web build; github.dev blocks framing) |
| Memory management | React `key`-bound iframe unmounting (see below) |

## Performance & memory strategy

Several showcased projects are computationally heavy — the Universal CS143 Notebook and the Java Data-Structure Visualizer boot a full Java toolchain (CheerpJ/WASM) in the browser, and the Code view boots the VS Code workbench. The portfolio keeps client-side CPU and memory in check by:

1. **One iframe, ever.** Only the selected project's current view is mounted; there is no hidden tab-stack of live documents.
2. **`key`-bound unmounting.** The iframe's React `key` is `${projectId}:${mode}:${instance}`. Switching projects, toggling Preview/Code, or hitting Reload changes the key, so React tears the old iframe out of the DOM and the browser garbage-collects that document's entire heap — WASM memory, Leaflet tiles, JVM state, VS Code workbench.
3. **Click-to-load facades.** Projects flagged `embed: "click"` in `config/projects.json` render a description card first; the WASM demo loads only on explicit user action. The Code view likewise only mounts when toggled.

## Repository structure

```
├── components/
│   ├── Sidebar.tsx         # 1/3 panel: project navigation
│   ├── LivePreview.tsx     # 2/3 panel: iframe lifecycle, Preview/Code toggle, error boundary
│   └── Layout.tsx          # Master-detail shell (responsive)
├── config/
│   ├── projects.json       # Single source of truth for portfolio content
│   └── types.ts            # Typed contract for the config
├── app/                    # Next.js App Router entry
└── vercel.json             # Security headers
```

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Adding a project

Edit `config/projects.json` — no code changes needed. Set `embed` to `"auto"` for lightweight demos, `"click"` for heavy ones (WASM/large bundles), or `"none"` for code-only projects. The Code toggle appears automatically whenever `repoUrl` points at a public GitHub repo.

## Rollback

Every commit is an immutable Vercel deployment. Bad deploy → Vercel Dashboard → Deployments → previous build → **Promote to Production**, then `git revert <hash>` to realign the repo.
