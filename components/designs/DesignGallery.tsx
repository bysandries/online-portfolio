"use client";

import { useState } from "react";
import type { FlyerItem } from "@/config/types";
import Lightbox from "@/components/corkboard/Lightbox";

/**
 * The designs as a plain gallery — a uniform grid of image cards, nothing but
 * the artwork. Click a card to open the full-size flyer in the lightbox.
 */
export default function DesignGallery({ flyers }: { flyers: FlyerItem[] }) {
  const [open, setOpen] = useState<FlyerItem | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {flyers.map((f) => (
          <li key={f.image}>
            <button
              type="button"
              onClick={() => setOpen(f)}
              aria-label={`View ${f.title}`}
              className="group block w-full overflow-hidden rounded-lg border border-edge bg-panel transition-colors hover:border-accent focus-visible:border-accent focus-visible:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.thumb}
                alt={f.title}
                loading="lazy"
                className="aspect-[85/110] w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox flyer={open} onClose={() => setOpen(null)} />
    </>
  );
}
