"use client";

/**
 * Taskbar Component (Desktop Window Manager UI)
 *
 * This file is responsible for rendering the taskbar at the bottom of the screen,
 * similar to an operating system (Windows/macOS/Linux).
 *
 * Responsibilities:
 * - Displays all currently open windows as clickable items
 * - Differentiates between:
 *    • Active/visible windows (shown as full buttons)
 *    • Minimized windows (shown as compact restore buttons)
 * - Allows window interactions:
 *    • Focus window (bring to front)
 *    • Close window
 *    • Restore minimized window
 * - Renders a "Start" button (GifWindow) for launcher/menu interaction
 * - Displays system tray icons (WiFi, Volume, Battery)
 * - Shows real-time clock and date using `useCurrentTime` hook
 * - Applies animations for window items using framer-motion
 *
 * Architecture Insight:
 * - This acts like the "process manager" of the desktop
 * - Works with global state (`useDesktopStore`) which manages window data
 * - Each taskbar item represents a running application (window instance)
 *
 * Flow:
 * Window opened → added to store → appears in taskbar
 * Window minimized → moved to minimized section
 * Window clicked → focusWindow() → brought to front
 */

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BatteryFull, Volume2, Wifi, X } from "lucide-react";
import type { WindowData, AppId } from "@/types/desktop";
import { APP_META, ANIMATION_PRESETS } from "@/config/constants";
import { useCurrentTime } from "@/hooks/ui/useCurrentTime";
import GifWindow from "@/components/Utilities/GifWindow";

interface TaskbarProps {
  windows: WindowData[];
  onWindowClick: (windowId: AppId) => void;
  onWindowClose: (windowId: AppId) => void;
  onWindowMinimize: (windowId: AppId) => void;
}

export default function Taskbar({
  windows,
  onWindowClick,
  onWindowClose,
}: TaskbarProps) {
  const currentTime = useCurrentTime();

  const visibleWindows = windows.filter((w) => w.windowState !== "minimized");
  const minimizedWindows = windows.filter((w) => w.windowState === "minimized");

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-14 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-4 z-50"
      initial={{ y: "100%" }}
      animate={{ y: "0%" }}
      transition={ANIMATION_PRESETS.springSnappy}
    >
      {/* Start button / GIF */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <GifWindow />
      </motion.div>

      <div className="h-8 w-px bg-white/20 mx-3" />

      {/* Open Windows */}
      <div className="flex items-center space-x-1.5 flex-1 overflow-x-auto scrollbar-none">
        <AnimatePresence>
          {visibleWindows.map((win) => (
            <motion.div
              key={win.id}
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -10 }}
              transition={ANIMATION_PRESETS.springSnappy}
              className="flex items-center bg-gray-700/80 hover:bg-gray-600/80 rounded-md overflow-hidden group"
            >
              <button
                onClick={() => onWindowClick(win.id)}
                className="flex items-center space-x-2 px-3 py-1.5 text-white text-sm max-w-36"
                aria-label={`Focus ${win.title}`}
              >
                <Image
                  src={`/icons/mobile/${APP_META[win.id].icon}`}
                  alt={win.title}
                  width={18}
                  height={18}
                  className="flex-shrink-0"
                />
                <span className="truncate">{win.title}</span>
              </button>
              <button
                onClick={() => onWindowClose(win.id)}
                className="px-1.5 py-1.5 text-gray-400 hover:text-white hover:bg-red-600/80 opacity-0 group-hover:opacity-100 transition-all"
                aria-label={`Close ${win.title}`}
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}

          {/* Minimized windows shown differently */}
          {minimizedWindows.map((win) => (
            <motion.button
              key={`min-${win.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={ANIMATION_PRESETS.springSnappy}
              onClick={() => onWindowClick(win.id)}
              className="flex items-center space-x-1.5 px-2 py-1.5 text-white text-sm bg-gray-800/60 border border-gray-600/50 rounded-md opacity-60 hover:opacity-100 transition-opacity"
              title={`Restore ${win.title}`}
            >
              <Image
                src={`/icons/breeze/${APP_META[win.id].icon}`}
                alt={win.title}
                width={16}
                height={16}
              />
              <span className="text-xs text-gray-400 truncate max-w-20">
                {win.title}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* System Tray */}
      <div className="flex items-center space-x-3 ml-3 pl-3 border-l border-white/10">
        <div className="hidden sm:flex items-center space-x-2 text-gray-400">
          <Wifi
            size={15}
            className="hover:text-white transition-colors cursor-pointer"
          />
          <Volume2
            size={15}
            className="hover:text-white transition-colors cursor-pointer"
          />
          <BatteryFull
            size={15}
            className="hover:text-white transition-colors cursor-pointer"
          />
        </div>

        {/* Time & Date */}
        <div className="flex flex-col items-end">
          <span className="text-white text-xs font-semibold leading-none">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="text-gray-400 text-xs leading-none mt-0.5">
            {currentTime.toLocaleDateString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
