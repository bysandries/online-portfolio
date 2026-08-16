import { renderOgImage } from "@/lib/og/template";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Projects — live in-page demos by Luis Bedoya Sandries.";

export default function Image() {
  return renderOgImage({
    eyebrow: "LUIS BEDOYA SANDRIES",
    title: "PROJECTS",
    subtitle: "FULL-STACK WORK WITH LIVE IN-PAGE DEMOS — HOUSING SEARCH, JAVA NOTEBOOK, VISUALIZERS",
  });
}
