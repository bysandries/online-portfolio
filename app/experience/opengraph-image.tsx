import { renderOgImage } from "@/lib/og/template";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Experience — Luis Bedoya Sandries.";

export default function Image() {
  return renderOgImage({
    eyebrow: "LUIS BEDOYA SANDRIES",
    title: "EXPERIENCE",
    subtitle: "DESIGN · FINANCE AUTOMATION · IT — P&G, EDMONDS COLLEGE AND MORE",
  });
}
