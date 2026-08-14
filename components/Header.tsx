"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ModeToggle from "@/components/ModeToggle";

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/designs", label: "Designs" },
  { href: "/blog", label: "Blog" },
  { href: "/experience", label: "Experience" },
  { href: "/education", label: "Education" },
  { href: "/about", label: "About Me" },
] as const;

export default function Header() {
  const pathname = usePathname();
  // Pages opened inside a desktop window (same-origin iframe) drop their own
  // chrome — the window provides it. Detected post-mount to keep SSR stable.
  const [framed, setFramed] = useState(false);
  useEffect(() => {
    // Framing is only knowable post-mount; identical SSR + first client
    // render, then one intentional update when embedded.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.self !== window.top) setFramed(true);
  }, []);

  // The Keystatic admin ships its own full-screen chrome.
  if (framed || pathname.startsWith("/keystatic")) return null;

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-edge bg-panel px-4">
      <div className="flex shrink-0 items-center gap-3">
        <ModeToggle mode="info" />
        <Link href="/" className="hidden shrink-0 text-sm font-bold tracking-tight sm:block">
          Luis <span className="text-accent">Bedoya Sandries</span>
        </Link>
      </div>
      <nav
        // Items flow from the start inside the scroll container — right-aligned
        // overflow would clip the leading links behind an unreachable scroll edge.
        className="flex w-full items-center gap-1 overflow-x-auto whitespace-nowrap sm:w-auto"
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
