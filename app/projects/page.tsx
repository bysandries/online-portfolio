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
  return (
    <Suspense>
      <Layout config={config as PortfolioConfig} />
    </Suspense>
  );
}
