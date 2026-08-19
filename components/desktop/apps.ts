import projectsConfig from "@/config/projects.json";
import type { PortfolioConfig } from "@/config/types";
import type { AppIconName } from "@/components/desktop/AppIcon";

export interface AppDef {
  id: string;
  /** Window + dock label */
  title: string;
  /** Tile glyph (minimalist line icon) */
  icon: AppIconName;
  /** Tile background (CSS gradient) */
  tint: string;
  /** iframe src */
  url: string;
  /** What the fake address bar shows */
  address: string;
  defaultSize: { w: number; h: number };
}

/** Bottom-dock apps — the site's sections, opened as same-origin windows.
 *  No Designs app: the designs ARE the desktop (all flyers pinned to the wall). */
export const DOCK_APPS: AppDef[] = [
  { id: "projects", title: "Projects", icon: "folder", tint: "linear-gradient(135deg,#1496cd,#0b5f8a)", url: "/projects", address: "sandries.com/projects", defaultSize: { w: 1080, h: 680 } },
  { id: "blog", title: "Blog", icon: "pen", tint: "linear-gradient(135deg,#7c5cd6,#4b3392)", url: "/blog", address: "sandries.com/blog", defaultSize: { w: 820, h: 640 } },
  { id: "experience", title: "Experience", icon: "briefcase", tint: "linear-gradient(135deg,#2f9e6e,#1c6647)", url: "/experience", address: "sandries.com/experience", defaultSize: { w: 820, h: 640 } },
  { id: "education", title: "Education", icon: "cap", tint: "linear-gradient(135deg,#d6712f,#94481a)", url: "/education", address: "sandries.com/education", defaultSize: { w: 820, h: 640 } },
  { id: "about", title: "About Me", icon: "person", tint: "linear-gradient(135deg,#5a7d9e,#33506d)", url: "/about", address: "sandries.com/about", defaultSize: { w: 820, h: 640 } },
];

const DEMO_ICONS: Record<string, AppIconName> = {
  "wa-housing": "house",
  "cs143-notebook": "mug",
  "java-visualizer": "tree",
};

/** Desktop shortcuts — featured project demos in fake-browser windows. */
export const DESKTOP_APPS: AppDef[] = (projectsConfig as PortfolioConfig).projects
  .filter((p) => p.category === "featured" && p.demoUrl && !p.hidden)
  .map((p) => ({
    id: `demo-${p.id}`,
    title: p.title,
    icon: DEMO_ICONS[p.id] ?? "spark",
    tint: "linear-gradient(135deg,#16233c,#0b1220)",
    url: p.demoUrl!,
    address: p.demoUrl!.replace(/^https?:\/\//, ""),
    defaultSize: { w: 1000, h: 660 },
  }));
