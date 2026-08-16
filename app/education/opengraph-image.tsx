import { renderOgImage } from "@/lib/og/template";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Education — Luis Bedoya Sandries at Edmonds College.";

export default function Image() {
  return renderOgImage({
    eyebrow: "LUIS BEDOYA SANDRIES",
    title: "EDUCATION",
    subtitle: "TWO AAS-T DEGREES · GPA 3.58 · EVERY COURSE, SYLLABUS BY SYLLABUS",
  });
}
