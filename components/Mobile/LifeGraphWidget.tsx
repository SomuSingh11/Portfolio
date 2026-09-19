"use client";

import { motion } from "framer-motion";
import LifeGraph from "@/components/Applications/LifeGraph";
import type { AppId } from "@/types/desktop";

interface LifeGraphWidgetProps {
  onOpenApp: (id: AppId) => void;
}

export default function LifeGraphWidget({ onOpenApp }: LifeGraphWidgetProps) {
  return (
    <div className="relative top-1 w-full px-5 mt-4 mb-3 flex-shrink-0">
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="relative block w-full h-[230px] overflow-hidden rounded-3xl border border-white/15 bg-black/35 text-left text-white shadow-2xl backdrop-blur-md"
      >
        <LifeGraph preview onPreviewOpen={() => onOpenApp("lifegraph")} />
      </motion.div>
    </div>
  );
}
