"use client";

import { useEffect, useState } from "react";
import ModeToggle from "@/components/ModeToggle";

/** Thin translucent top bar: brand + Info Only toggle left, links + clock right. */
export default function MenuBar() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="absolute inset-x-0 top-0 z-[500] flex h-7 items-center justify-between gap-3 border-b border-black/20 bg-[#101a2e]/80 px-3 text-[12px] text-ink backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-3">
        <span className="shrink-0 font-bold">
          Luis <span className="text-accent">Bedoya Sandries</span>
        </span>
        <span className="hidden text-muted sm:inline">sandriesOS</span>
        <ModeToggle mode="desktop" />
      </div>
      <div className="flex shrink-0 items-center gap-3 text-muted">
        <a href="https://github.com/bysandries" target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/sandries" target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
          LinkedIn
        </a>
        {now && <span className="hidden tabular-nums sm:inline">{now}</span>}
      </div>
    </header>
  );
}
