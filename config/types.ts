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
  /** Bullet points rendered on the detail card — used by coursework write-ups. */
  highlights?: string[];
}

export interface Category {
  id: string;
  label: string;
}

export interface Profile {
  name: string;
  headline: string;
  /** Short brand motif shown on the landing hero, e.g. "Design · Software · Innovation". */
  tagline?: string;
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

export interface ExperienceRole {
  role: string;
  org: string;
  location: string;
  period: string;
  note?: string;
  bullets: string[];
  tags?: string[];
}

export interface ExperienceConfig {
  intro: string;
  roles: ExperienceRole[];
  volunteer: ExperienceRole[];
}

export interface School {
  name: string;
  location: string;
  period: string;
  degrees: { title: string; status: string }[];
  details?: string[];
}

export interface CourseLink {
  course: string;
  description: string;
  /** Ids into projects.json — rendered as deep links to /projects?project=<id> */
  projectIds: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
}

export interface EducationConfig {
  summary: string;
  schools: School[];
  courseLinks: CourseLink[];
  certifications: Certification[];
}

export interface FlyerItem {
  /** Quality rank from the original curation — 1 is best; doubles as a stable id. */
  rank: number;
  title: string;
  /** e.g. "Spring 2026" */
  quarter: string;
  /** e.g. "SP26" */
  quarterCode: string;
  score: number;
  note: string;
  /** Public paths to the full-size and thumbnail webp. */
  image: string;
  thumb: string;
  /** Shown on the landing page's designs section. */
  featured?: boolean;
}

export interface FlyersConfig {
  flyers: FlyerItem[];
}

export interface AboutConfig {
  headline: string;
  paragraphs: string[];
  facts: { label: string; value: string }[];
  interests: string[];
}
