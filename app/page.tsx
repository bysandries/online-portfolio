import { Suspense } from "react";
import Layout from "@/components/Layout";
import config from "@/config/projects.json";
import type { PortfolioConfig } from "@/config/types";

export default function Home() {
  return (
    <Suspense>
      <Layout config={config as PortfolioConfig} />
    </Suspense>
  );
}
