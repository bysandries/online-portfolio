import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The OG-image routes read the Silkscreen .ttf files at request time via fs;
  // make sure they're traced into every serverless function bundle.
  outputFileTracingIncludes: {
    "/**": ["./lib/og/*.ttf"],
  },
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
      { source: "/designs-gallery", destination: "/designs", permanent: true },
      {
        source: "/blog/10-how-was-my-process-to-get-a-job-on-campus-with-a-visa-f1",
        destination: "/blog/on-campus-job-international-student",
        permanent: true,
      },
      {
        source: "/blog/18-automate-your-excel-tasks-and-save-time-with-knimes",
        destination: "/blog/automate-excel-knime",
        permanent: true,
      },
      {
        source: "/blog/11-mastering-p2p-process-flow-the-key-to-uninterrupted-cash-flow-in-companies",
        destination: "/blog/p2p-process-flow",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
