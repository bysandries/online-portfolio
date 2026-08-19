/**
 * Minimalist line-icon set for the dock and desktop shortcuts — one visual
 * language (1.7px rounded strokes on the tile tint) instead of mixed emoji.
 */
const ICONS = {
  folder: (
    <path d="M3.5 6.5a2 2 0 0 1 2-2h3.8l2 2.2h7.2a2 2 0 0 1 2 2v9.8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
  ),
  pen: (
    <>
      <path d="M12.5 20h8" />
      <path d="M16.7 3.8a2.2 2.2 0 0 1 3.1 3.1L8.3 18.4 4 19.5l1.1-4.3z" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3.5" y="8" width="17" height="11.5" rx="2" />
      <path d="M9 8V6.2A2.2 2.2 0 0 1 11.2 4h1.6A2.2 2.2 0 0 1 15 6.2V8" />
    </>
  ),
  cap: (
    <>
      <path d="M12 4.5 2.5 9l9.5 4.5L21.5 9z" />
      <path d="M6.5 11.7v4c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8v-4" />
      <path d="M21.5 9v4.5" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8.2" r="3.7" />
      <path d="M4.5 19.5c.8-3.2 3.9-4.8 7.5-4.8s6.7 1.6 7.5 4.8" />
    </>
  ),
  house: (
    <>
      <path d="M4 11.2 12 4.5l8 6.7" />
      <path d="M6 9.8v9.7h12V9.8" />
      <path d="M10 19.5v-4.6h4v4.6" />
    </>
  ),
  mug: (
    <>
      <path d="M5 9h11v5.5A4.5 4.5 0 0 1 11.5 19h-2A4.5 4.5 0 0 1 5 14.5z" />
      <path d="M16 10h1.8a2.6 2.6 0 0 1 0 5.2H16" />
      <path d="M8.5 6.5v-2M12.5 6.5v-2" />
    </>
  ),
  tree: (
    <>
      <circle cx="12" cy="5.5" r="2.3" />
      <circle cx="5.8" cy="17.5" r="2.3" />
      <circle cx="18.2" cy="17.5" r="2.3" />
      <path d="M10.9 7.4 6.9 15.5M13.1 7.4l4 8.1" />
    </>
  ),
  spark: (
    <path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" />
  ),
} as const;

export type AppIconName = keyof typeof ICONS;

export default function AppIcon({ name, size = 22 }: { name: AppIconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  );
}
