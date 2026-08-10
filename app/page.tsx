import Layout from "@/components/Layout";
import config from "@/config/projects.json";
import type { PortfolioConfig } from "@/config/types";

export default function Home() {
  return <Layout config={config as PortfolioConfig} />;
}
