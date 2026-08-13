# Figma ⇄ Code sync contract

The design system lives in two places that must stay in lockstep:

- **Figma**: the "sandries.com Design System" file (imported from
  `sandries-design-system.svg` + `figma-tokens.json` via Tokens Studio)
- **Code**: this repo — tokens in `app/globals.css`, idioms in components

When the design changes in Figma, apply it here. When it changes here,
re-export to `figma-tokens.json` and re-import in Tokens Studio.

## Token → code map

| Tokens Studio token | CSS variable (`app/globals.css`) | Tailwind utility |
| --- | --- | --- |
| `color.canvas` | `--canvas` | `bg-canvas` |
| `color.panel` | `--panel` | `bg-panel` |
| `color.panel-raised` | `--panel-raised` | `bg-panel-raised` |
| `color.edge` | `--edge` | `border-edge` |
| `color.ink` | `--ink` | `text-ink` |
| `color.muted` | `--muted` | `text-muted` |
| `color.accent` | `--accent` | `text-accent` / `bg-accent` |
| `color.accent-hover` | `--accent-hover` | `hover:bg-accent-hover` |
| `color.accent-soft` | `--accent-soft` | `text-accent-soft` |
| `color.cork` | `.cork-surface` background-color | (component class) |
| `color.pin-red*` | `.cork-pin` radial-gradient stops | (component class) |
| `color.scrim` | `Lightbox.tsx` `backdrop:bg-[rgba(20,14,8,.92)]` | arbitrary value |
| `color.lightbox-caption*` | `Lightbox.tsx` text colors | arbitrary values |
| `fontFamilies.sans` / `mono` | `--font-geist-sans` / `--font-geist-mono` (`app/layout.tsx` next/font) | `font-sans` / `font-mono` |
| `borderRadius.card` (12) | — | `rounded-xl` |
| `borderRadius.control` (6) | — | `rounded-md` |
| `borderRadius.tag` (4) | — | `rounded` |
| `borderRadius.polaroid` (2) | — | `rounded-[2px]` (FlyerCard) |
| `boxShadow.polaroid*` | `FlyerCard.tsx` `shadow-[…]` arbitrary values | arbitrary values |
| `boxShadow.cork-inset` | `.cork-surface` box-shadow | (component class) |

## Typography map

| Token | Where used in code |
| --- | --- |
| `typography.display` | `app/page.tsx` hero `text-4xl sm:text-5xl font-bold tracking-tight` |
| `typography.h1` | page titles `text-2xl font-bold tracking-tight` |
| `typography.h2` | blog `h2` map in `app/blog/[slug]/page.tsx` |
| `typography.section-label` | `text-[11px] font-semibold uppercase tracking-widest text-muted` |
| `typography.card-title` | `text-sm font-semibold leading-snug` |
| `typography.body` | `text-sm leading-relaxed` |
| `typography.caption` | `text-xs leading-relaxed text-muted` |
| `typography.chip` | `font-mono text-[11px] text-accent-soft` |
| `typography.tag` | `font-mono text-[10px]` on `bg-panel-raised` |

## Component anatomy → files

| Figma frame | Code |
| --- | --- |
| Buttons / chips / nav | `app/page.tsx` (hero CTAs), `components/Header.tsx` |
| Project / blog / section cards | `app/page.tsx`, `app/blog/page.tsx` |
| Site header | `components/Header.tsx` |
| Cork board, polaroid, pin | `components/corkboard/*`, `.cork-surface`/`.cork-pin` in `app/globals.css` |
| Lightbox | `components/corkboard/Lightbox.tsx` |
| Blog prose styles | `components` map in `app/blog/[slug]/page.tsx` |

## Workflow

1. Edit in Figma (tokens via Tokens Studio, or restyle frames directly).
2. Tell Claude what changed — a Figma link to the frame/component is enough
   once the Figma MCP is authenticated (`/mcp` → figma → sign in).
3. Claude reads the node via MCP, maps it through the tables above, edits
   `globals.css` / components, and verifies with `npm run build` + a visual
   pass at localhost.
4. Color-only changes are single-line edits in `:root` — every utility
   inherits them; component-shape changes follow the anatomy table.
