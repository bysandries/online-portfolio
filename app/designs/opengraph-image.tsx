import { renderOgImage } from "@/lib/og/template";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Designs — 40 flyers by Luis Bedoya Sandries.";

export default function Image() {
  return renderOgImage({
    eyebrow: "LUIS BEDOYA SANDRIES",
    title: "DESIGNS",
    subtitle: "40 FLYERS FOR EDMONDS COLLEGE EVENTS & STUDENT CLUBS — ADOBE CERTIFIED WORK",
  });
}
