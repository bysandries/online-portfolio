"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ModeToggle from "@/components/ModeToggle";
import { MOBILE_UA } from "@/lib/ui-mode";

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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Framing/mode are only knowable post-mount; identical SSR + first
    // client render, then one intentional update. On / the header bows out
    // whenever the desktop overlay owns the viewport — mirroring the server
    // gate: explicit cookie wins, otherwise phones default to the info page.
    const cookie = document.cookie;
    const desktopShown = cookie.includes("ui-mode=info")
      ? false
      : cookie.includes("ui-mode=desktop") ||
        !MOBILE_UA.test(navigator.userAgent);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.self !== window.top || (pathname === "/" && desktopShown))
      setFramed(true);
  }, [pathname]);

  // Navigating away closes the burger dropdown.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [pathname]);

  // The Keystatic admin ships its own full-screen chrome.
  if (framed || pathname.startsWith("/keystatic")) return null;

  return (
    <header className="relative flex h-12 shrink-0 items-center justify-between gap-2 border-b border-edge bg-panel px-4 shadow-[0_6px_14px_rgba(2,9,16,.45)]">
      <div className="flex min-w-0 shrink items-center gap-3">
        <ModeToggle mode="info" />
        <Link
          href="/"
          className="shrink-0 font-pixel text-[11px] font-bold tracking-tight"
        >
          LUIS <span className="text-accent">SANDRIES</span>
        </Link>
      </div>

      {/* Full nav from sm up */}
      <nav
        // Items flow from the start inside the scroll container — right-aligned
        // overflow would clip the leading links behind an unreachable scroll edge.
        className="hidden items-center gap-1 overflow-x-auto whitespace-nowrap sm:flex"
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
                  ? "neo-inset font-medium text-accent"
                  : "text-muted hover:text-ink"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Burger from sm down */}
      <button
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-[5px] rounded-md text-ink sm:hidden"
      >
        {menuOpen ? (
          <span className="font-pixel text-sm leading-none">X</span>
        ) : (
          <>
            <span className="h-[3px] w-5 bg-ink" />
            <span className="h-[3px] w-5 bg-ink" />
            <span className="h-[3px] w-5 bg-ink" />
          </>
        )}
      </button>

      {menuOpen && (
        <nav
          aria-label="Site"
          className="absolute inset-x-0 top-full z-[600] flex flex-col border-b border-edge bg-panel py-2 shadow-[0_16px_34px_rgba(2,9,16,.55)] sm:hidden"
        >
          {NAV.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={`px-5 py-2.5 text-sm transition-colors ${
                  active ? "font-medium text-accent" : "text-muted hover:text-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
