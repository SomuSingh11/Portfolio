"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconData } from "@/types/desktop";

interface DesktopIconProps {
  icon: IconData;
  onDoubleClick: () => void;
}

export default function DesktopIcon({ icon, onDoubleClick }: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(true);
    setTimeout(() => setIsSelected(false), 2000);
  };

  return (
    <motion.div
      className={`absolute cursor-pointer select-none ${
        isSelected ? "bg-blue-500/30" : ""
      } rounded-lg p-2 transition-colors`}
      style={{
        left: icon.position.x,
        top: icon.position.y,
      }}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex flex-col items-center space-y-1">
        <div className="text-4xl">{icon.icon}</div>
        <span className="text-white text-sm font-medium text-center drop-shadow-lg">
          {icon.name}
        </span>
      </div>
    </motion.div>
  );
}
