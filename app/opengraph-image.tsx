import { renderOgImage } from "@/lib/og/template";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Luis Bedoya Sandries — Full-Stack & Cloud Developer. Interactive portfolio (sandriesOS).";

export default function Image() {
  return renderOgImage({
    eyebrow: "DESIGN · SOFTWARE · INNOVATION",
    title: "LUIS BEDOYA SANDRIES",
    subtitle: "FULL-STACK & CLOUD DEVELOPER · INTERACTIVE PORTFOLIO",
    titleSize: 64,
  });
}
