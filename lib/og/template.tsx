import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Shared Open Graph card in the site's pixel × neumorphism system: navy
 * panel, gold pixel corners, Silkscreen type, and an XP bar. Every route's
 * opengraph-image.tsx renders through this so link previews stay on-brand.
 *
 * CENTER-WEIGHTED on purpose: LinkedIn's Featured module center-crops wide
 * images to a square, so all content stays inside the middle 630px column.
 * Corner pixels and panel edges are sacrificial decoration.
 */

const GOLD = "#f4c430";
const GOLD_SOFT = "#ecd383";
const GREEN = "#3ecf72";
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
  titleSize = 54,
  width = 1200,
  height = 630,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Smaller for long titles (blog posts). */
  titleSize?: number;
  width?: number;
  height?: number;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#081c2b",
          padding: 36,
          fontFamily: "Silkscreen",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0d2536",
            border: "2px solid #1d4059",
            borderRadius: 22,
            padding: "0 40px",
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
              fontSize: 22,
              fontWeight: 400,
              color: GREEN,
              letterSpacing: 3,
              textAlign: "center",
              maxWidth: 600,
            }}
          >
            {eyebrow}
          </div>

          <div
            style={{
              marginTop: 20,
              fontSize: titleSize,
              fontWeight: 700,
              color: GOLD,
              lineHeight: 1.2,
              textAlign: "center",
              maxWidth: 620,
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 18,
              fontSize: 22,
              fontWeight: 400,
              color: MUTED,
              lineHeight: 1.55,
              textAlign: "center",
              maxWidth: 580,
            }}
          >
            {subtitle}
          </div>

          <div style={{ display: "flex", marginTop: 34, gap: 6 }}>
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: 24,
                  height: 16,
                  backgroundColor: i < 11 ? GOLD : "#1d4059",
                }}
              />
            ))}
          </div>

          <div
            style={{
              marginTop: 18,
              fontSize: 18,
              fontWeight: 400,
              color: GOLD_SOFT,
              textAlign: "center",
            }}
          >
            LUIS.SANDRIES.COM
          </div>
        </div>
      </div>
    ),
    { width, height, fonts: await loadFonts() },
  );
}
