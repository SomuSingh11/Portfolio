"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { AppId } from "@/types/desktop";
import { APP_META } from "@/config/constants";

interface DesktopIconProps {
  iconId: AppId;
  position: { x: number; y: number };
  onDoubleClick: () => void;
  index?: number;
}

export default function DesktopIcon({
  iconId,
  position,
  onDoubleClick,
  index = 0,
}: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false);
  const meta = APP_META[iconId];

  const handleClick = useCallback(() => {
    setIsSelected(true);
    const timer = setTimeout(() => setIsSelected(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onDoubleClick();
      }
    },
    [onDoubleClick],
  );

  return (
    <motion.div
      className={`absolute cursor-pointer select-none rounded-lg p-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
        isSelected ? "bg-blue-500/30" : "hover:bg-white/10"
      }`}
      style={{ left: position.x, top: position.y }}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.35,
        delay: 0.15 + index * 0.06,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${meta.title}`}
    >
      <div className="flex flex-col items-center space-y-1 w-16">
        <Image
          src={`/icons/mobile/${meta.icon}`}
          alt={`${meta.title} icon`}
          width={46}
          height={46}
          className="drop-shadow-lg"
        />
        <span className="text-white text-xs font-medium text-center leading-tight drop-shadow-lg line-clamp-2">
          {meta.title}
        </span>
      </div>
    </motion.div>
  );
}

