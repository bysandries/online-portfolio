import { Suspense } from "react";
import type { Metadata } from "next";
import Layout from "@/components/Layout";
import config from "@/config/projects.json";
import type { PortfolioConfig } from "@/config/types";

export const metadata: Metadata = {
  title: "Projects — Luis Bedoya Sandries",
  description:
    "Interactive project explorer with live, in-page demos — from a statewide affordable-housing search engine to an in-browser Java IDE running on WASM.",
};

export default function ProjectsPage() {
  // Hidden projects stay in the config (data, ids, write-ups intact) but are
  // filtered out of everything the explorer renders.
  const full = config as PortfolioConfig;
  const visible: PortfolioConfig = {
    ...full,
    projects: full.projects.filter((p) => !p.hidden),
  };
  return (
    <Suspense>
      <Layout config={visible} />
    </Suspense>
  );
}
