import { renderOgImage } from "@/lib/og/template";

/**
 * 1080×1080 version of the home share card, for platforms that want a square
 * upload (e.g. a custom LinkedIn Featured thumbnail). Not referenced by any
 * metadata — download it from /og-square and upload wherever needed.
 */
export async function GET() {
  return renderOgImage({
    eyebrow: "DESIGN · SOFTWARE · INNOVATION",
    title: "LUIS BEDOYA SANDRIES",
    subtitle: "FULL-STACK & CLOUD DEVELOPER · INTERACTIVE PORTFOLIO",
    titleSize: 62,
    width: 1080,
    height: 1080,
  });
}
