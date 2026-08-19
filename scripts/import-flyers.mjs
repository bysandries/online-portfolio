/**
 * One-time importer for the luis.sandries.com "Flyers Cork Board" assets.
 *
 * Fetches the live FLYERS manifest, keeps the same 40 curated ranks the live
 * board shows, downloads each full-size + thumbnail webp pair into
 * public/designs/, and writes config/flyers.json with repo-local paths.
 *
 * Run from the repo root:  node scripts/import-flyers.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const ORIGIN = "https://luis.sandries.com";
// Mirrors the KEEP list hardcoded in the live site's inline script.
const KEEP = [
  1, 2, 6, 7, 10, 11, 13, 20, 24, 25, 26, 27, 29, 31, 32, 33, 42, 45, 50, 51,
  54, 57, 58, 61, 63, 66, 67, 69, 74, 76, 77, 78, 80, 81, 82, 84, 86, 87, 88,
  91,
];
const FEATURED_COUNT = 4; // rank is quality-ordered; lowest ranks are best

const root = new URL("..", import.meta.url).pathname;

const res = await fetch(`${ORIGIN}/assets/flyers.js`);
if (!res.ok) throw new Error(`manifest fetch failed: ${res.status}`);
const js = await res.text();
const jsonText = js.replace(/^\s*window\.FLYERS\s*=\s*/, "").replace(/;\s*$/, "");
const all = JSON.parse(jsonText);
const kept = all
  .filter((f) => KEEP.includes(f.rank))
  .sort((a, b) => a.rank - b.rank);
console.log(`manifest: ${all.length} entries, keeping ${kept.length}`);

// Remote paths are relative like "assets/img/SP26/<dir>/<file>.webp" and may
// contain characters needing URL-encoding; local names are rank-prefixed to
// avoid collisions between truncated/duplicate basenames.
const encodePath = (p) => p.split("/").map(encodeURIComponent).join("/");
const basenameOf = (p) => p.split("/").pop();

async function download(remoteRel, localRel) {
  const url = `${ORIGIN}/${encodePath(remoteRel)}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} for ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const abs = join(root, "public", localRel);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, buf);
  return buf.length;
}

const flyers = [];
let bytes = 0;
for (const [i, f] of kept.entries()) {
  const name = `${String(f.rank).padStart(2, "0")}-${basenameOf(f.full)}`;
  const image = `designs/${f.qc}/${name}`;
  const thumb = `designs/${f.qc}/thumb/${name}`;
  bytes += await download(f.full, image);
  bytes += await download(f.thumb, thumb);
  flyers.push({
    rank: f.rank,
    title: f.title,
    quarter: f.q,
    quarterCode: f.qc,
    score: f.score,
    note: f.note,
    image: `/${image}`,
    thumb: `/${thumb}`,
    ...(i < FEATURED_COUNT ? { featured: true } : {}),
  });
  process.stdout.write(`\r${i + 1}/${kept.length} downloaded`);
}
console.log(`\ntotal ${(bytes / 1024 / 1024).toFixed(1)} MB`);

await writeFile(
  join(root, "config", "flyers.json"),
  JSON.stringify({ flyers }, null, 2) + "\n",
);
console.log(`wrote config/flyers.json (${flyers.length} flyers)`);
