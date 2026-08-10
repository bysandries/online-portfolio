/**
 * Embed strategy per project:
 * - "auto":  iframe mounts as soon as the project is selected (lightweight demos)
 * - "click": iframe mounts only after an explicit user action — reserved for
 *            computationally heavy demos (CheerpJ/WASM Java toolchains) so
 *            navigating the portfolio never pays their CPU/memory cost
 * - "none":  no live demo (CLI/system projects) — a detail card is shown instead
 */
export type EmbedMode = "auto" | "click" | "none";

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  category: string;
  demoUrl: string | null;
  repoUrl: string | null;
  embed: EmbedMode;
  /** Shown on the click-to-load facade, e.g. why the demo is deferred. */
  embedNote?: string;
}

export interface Category {
  id: string;
  label: string;
}

export interface Profile {
  name: string;
  headline: string;
  location: string;
  bio: string;
  credentials: string[];
  links: {
    github: string;
    linkedin: string;
    email: string;
    site: string;
  };
}

export interface PortfolioConfig {
  profile: Profile;
  categories: Category[];
  projects: Project[];
}
