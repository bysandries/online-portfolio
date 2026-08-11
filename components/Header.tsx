"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/education", label: "Education" },
  { href: "/about", label: "About Me" },
] as const;

export default function Header() {
  const pathname = usePathname();

  // The Keystatic admin ships its own full-screen chrome.
  if (pathname.startsWith("/keystatic")) return null;

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-edge bg-panel px-4">
      <Link href="/" className="hidden shrink-0 text-sm font-bold tracking-tight sm:block">
        Luis <span className="text-accent">Bedoya Sandries</span>
      </Link>
      <nav
        className="flex w-full items-center gap-1 overflow-x-auto whitespace-nowrap sm:w-auto sm:justify-end"
        aria-label="Site"
      >
        {NAV.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-panel-raised font-medium text-accent"
                  : "text-muted hover:text-ink"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
