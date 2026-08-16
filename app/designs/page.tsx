import type { Metadata } from "next";
import DesignGallery from "@/components/designs/DesignGallery";
import config from "@/config/flyers.json";
import type { FlyersConfig } from "@/config/types";

export const metadata: Metadata = {
  title: "Designs — Luis Bedoya Sandries",
  description:
    "A gallery of 40 flyer designs created for Edmonds College events and student clubs — Adobe Certified Professional work.",
};

export default function DesignsPage() {
  const { flyers } = config as FlyersConfig;

  return (
    <div className="h-full overflow-y-auto bg-canvas">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight">Designs</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Flyers designed for events and student clubs at Edmonds College —
          {" "}{flyers.length} favorites from three years of campus work. Click
          any card to view it full size.
        </p>
        <div className="mt-8">
          <DesignGallery flyers={flyers} />
        </div>
      </div>
    </div>
  );
}
