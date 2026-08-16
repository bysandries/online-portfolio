import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Shared Open Graph card in the site's pixel × neumorphism system: navy
 * panel, gold pixel corners, Silkscreen type, and an XP bar. Every route's
 * opengraph-image.tsx renders through this so link previews stay on-brand.
 */

const GOLD = "#f4c430";
const GOLD_SOFT = "#ecd383";
const GREEN = "#3ecf72";
const INK = "#eef7fd";
const MUTED = "#8fb2c6";

async function loadFonts() {
  // Plain fs reads — the fetch(import.meta.url) asset pattern isn't available
  // in this runtime. next.config.ts traces lib/og/*.ttf into the bundle.
  const dir = join(process.cwd(), "lib", "og");
  const [bold, regular] = await Promise.all([
    readFile(join(dir, "Silkscreen-Bold.ttf")),
    readFile(join(dir, "Silkscreen-Regular.ttf")),
  ]);
  return [
    { name: "Silkscreen", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Silkscreen", data: regular, weight: 400 as const, style: "normal" as const },
  ];
}

const cornerPositions = [
  { left: 20, top: 20 },
  { right: 20, top: 20 },
  { left: 20, bottom: 20 },
  { right: 20, bottom: 20 },
];

export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
  titleSize = 76,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Smaller for long titles (blog posts). */
  titleSize?: number;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#081c2b",
          padding: 44,
          fontFamily: "Silkscreen",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#0d2536",
            border: "2px solid #1d4059",
            borderRadius: 22,
            padding: "0 76px",
            boxShadow: "14px 14px 40px #020910",
          }}
        >
          {cornerPositions.map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 16,
                height: 16,
                backgroundColor: GOLD,
                ...pos,
              }}
            />
          ))}

          <div
            style={{
              fontSize: 26,
              fontWeight: 400,
              color: GREEN,
              letterSpacing: 3,
            }}
          >
            {eyebrow}
          </div>

          <div
            style={{
              marginTop: 22,
              fontSize: titleSize,
              fontWeight: 700,
              color: GOLD,
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 22,
              fontSize: 27,
              fontWeight: 400,
              color: MUTED,
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </div>

          <div style={{ display: "flex", marginTop: 46, gap: 7 }}>
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: 27,
                  height: 18,
                  backgroundColor: i < 17 ? GOLD : "#1d4059",
                }}
              />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 18,
              fontSize: 21,
              fontWeight: 400,
            }}
          >
            <span style={{ color: GOLD_SOFT }}>LUIS.SANDRIES.COM</span>
            <span style={{ color: INK }}>SANDRIESOS</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: await loadFonts() },
  );
}
