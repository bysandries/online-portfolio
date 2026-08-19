"use client";

import { useRef, useState } from "react";
import FlyerCard from "@/components/corkboard/FlyerCard";
import Lightbox from "@/components/corkboard/Lightbox";
import type { FlyerItem } from "@/config/types";

const STORAGE_KEY = "corkboard-positions-v1";

/**
 * The pinboard: flyers flow in a wrapped row over a cork surface, each with a
 * seeded scatter. Drag to rearrange (persists locally), tap/click to open.
 */
export default function CorkBoard({ flyers }: { flyers: FlyerItem[] }) {
  const [open, setOpen] = useState<FlyerItem | null>(null);
  // Remounts every card with a cleared offset when the layout is reset.
  const [resetKey, setResetKey] = useState(0);
  const zCounter = useRef(10);
  const nextZ = () => ++zCounter.current;

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nothing to clear */
    }
    setResetKey((k) => k + 1);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted">
          Drag the flyers around — the board remembers your arrangement. Tap one
          to see it full size.
        </p>
        <button
          onClick={reset}
          className="shrink-0 rounded-md border border-edge bg-panel px-3 py-1.5 text-xs text-accent-soft transition-colors hover:border-accent hover:text-ink"
        >
          Reset layout
        </button>
      </div>

      <div className="cork-surface flex flex-wrap content-start justify-center gap-y-2 overflow-hidden rounded-xl border border-edge p-8 pt-10">
        {flyers.map((f) => (
          <FlyerCard
            key={`${f.rank}:${resetKey}`}
            flyer={f}
            onOpen={setOpen}
            nextZ={nextZ}
          />
        ))}
      </div>

      <Lightbox flyer={open} onClose={() => setOpen(null)} />
    </div>
  );
}
