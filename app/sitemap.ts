import type { MetadataRoute } from "next";

const BASE = "https://sandries.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/projects", "/designs", "/experience", "/education", "/about"].map(
    (path) => ({
      url: `${BASE}${path}`,
      changeFrequency: "monthly",
      priority: path === "/" ? 1 : 0.7,
    }),
  );
}
