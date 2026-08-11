import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The project explorer moved from / to /projects; keep old deep links
      // (education bookmarks, shared URLs) working. Query params pass through.
      {
        source: "/",
        has: [{ type: "query", key: "project" }],
        destination: "/projects",
        permanent: false,
      },
      // Legacy sandries.com (YOOtheme) URLs, for the domain cutover.
      { source: "/company", destination: "/about", permanent: true },
      { source: "/resume", destination: "/experience", permanent: true },
    ];
  },
};

export default nextConfig;
