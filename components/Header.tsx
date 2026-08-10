"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About Me" },
  { href: "/education", label: "Education" },
] as const;

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-edge bg-panel px-4">
      <Link href="/" className="hidden text-sm font-bold tracking-tight sm:block">
        Luis <span className="text-accent">Bedoya Sandries</span>
      </Link>
      <nav className="flex w-full items-center justify-around gap-1 sm:w-auto sm:justify-end" aria-label="Site">
        {NAV.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
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
