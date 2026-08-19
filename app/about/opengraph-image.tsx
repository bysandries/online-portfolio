import { renderOgImage } from "@/lib/og/template";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "About Luis Bedoya Sandries.";

export default function Image() {
  return renderOgImage({
    eyebrow: "LUIS BEDOYA SANDRIES",
    title: "ABOUT ME",
    subtitle: "THE LONGER STORY — BACKGROUND, VALUES, AND WHAT'S NEXT",
  });
}
