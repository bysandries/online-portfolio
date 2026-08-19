"use client";

import { useEffect, useRef } from "react";
import type { FlyerItem } from "@/config/types";

/** Full-screen flyer viewer on a native <dialog> — Esc and backdrop close. */
export default function Lightbox({
  flyer,
  onClose,
}: {
  flyer: FlyerItem | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (flyer && !dialog.open) dialog.showModal();
    if (!flyer && dialog.open) dialog.close();
  }, [flyer]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // Clicks on the dialog element itself (not its children) hit the backdrop area.
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto max-h-[92dvh] w-auto max-w-[92vw] bg-transparent p-0 backdrop:bg-[rgba(20,14,8,.92)]"
    >
      {flyer && (
        <div className="flex flex-col items-center gap-4 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={flyer.image}
            alt={flyer.title}
            className="max-h-[72dvh] max-w-full rounded object-contain shadow-[0_20px_60px_rgba(0,0,0,.6)]"
          />
          <div className="max-w-2xl text-center">
            <p className="text-sm font-semibold text-[#f3e9da]">{flyer.title}</p>
            <p className="mt-1 text-xs text-[#cbb89a]">
              {flyer.quarter} · Edmonds College
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-2 top-1 text-3xl leading-none text-white/90 transition-colors hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </dialog>
  );
}
