"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { MobileAppConfig } from "@/config/mobileConfig";

interface AppIconProps {
  app: MobileAppConfig;
  onTap: (id: MobileAppConfig["id"]) => void;
  /** Framer layoutId for icon-to-app zoom transition */
  layoutId?: string;
  size?: "normal" | "dock";
  animationDelay?: number;
}

const AppIcon = memo(function AppIcon({
  app,
  onTap,
  layoutId,
  size = "normal",
  animationDelay = 0,
}: AppIconProps) {
  const iconSize = size === "dock" ? 58 : 52;
  const containerSize = size === "dock" ? "w-[58px]" : "w-[52px]";

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: animationDelay,
        type: "spring",
        stiffness: 400,
        damping: 28,
      }}
    >
      <motion.button
        layoutId={layoutId}
        className={`${containerSize} aspect-square rounded-[14px] overflow-hidden shadow-lg relative focus:outline-none`}
        style={{
          background: `linear-gradient(135deg, var(--from), var(--to))`,
        }}
        onTap={() => onTap(app.id)}
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        aria-label={`Open ${app.label}`}
      >
        {/* Gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${app.bgGradient}`}
        />

        {/* Subtle inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />

        {/* Icon image */}
        <div className="absolute inset-0 flex items-center justify-center p-2.5">
          <Image
            src={`/icons/breeze/${app.icon}`}
            alt={app.label}
            width={iconSize}
            height={iconSize}
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>

        {/* Badge */}
        {app.badgeCount && app.badgeCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center px-1 shadow-md">
            <span className="text-white text-[10px] font-bold">
              {app.badgeCount > 99 ? "99+" : app.badgeCount}
            </span>
          </div>
        )}
      </motion.button>

      {/* Label — only on home screen grid, not dock */}
      {size === "normal" && (
        <span className="mt-1.5 text-white text-[11px] font-medium text-center leading-tight drop-shadow-md max-w-[64px] truncate">
          {app.label}
        </span>
      )}
    </motion.div>
  );
});

export default AppIcon;
