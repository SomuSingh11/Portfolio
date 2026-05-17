"use client";

/**
 * 🖥️ Desktop Component (Main OS Surface)
 *
 * This file represents the main desktop environment of the application.
 * It acts as the root UI layer where all windows, icons, and system interactions live.
 *
 * Responsibilities:
 * - Renders desktop wallpaper with smooth transitions
 * - Displays desktop icons and handles double-click to open apps
 * - Renders all active windows (managed by global state)
 * - Handles right-click context menu (refresh, change wallpaper, help)
 * - Manages focus behavior (clicking desktop unfocuses windows)
 * - Provides drag constraints for windows (via constraintsRef)
 * - Renders taskbar and integrates with window actions (focus, minimize, close)
 * - Controls global UI elements like guidance modal
 *
 * ────────────────────────────────────────────────────────────────
 * 🏗️ Architecture Insight
 *
 * - This component acts like the "Desktop layer" of an operating system
 * - Each <Window /> is like an application instance
 * - The store (useDesktopStore) acts as the window manager
 * - Taskbar acts as process manager / quick switch UI
 *
 * Flow:
 * Desktop Icon → openWindow() → state updates → Window renders → UI updates
 */

import { useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DesktopIcon from "./DesktopIcon";
import Window from "./Window";
import Taskbar from "./Taskbar";
import { useDesktopStore } from "@/store/desktop-store";
import { usePreferences } from "@/store/preferences-store";
import { DESKTOP_ICON_LAYOUT, ANIMATION_PRESETS } from "@/config/constants";
import type { AppId } from "@/types/desktop";
import GuidanceModal from "@/components/Utilities/GuidanceModal";



export default function Desktop() {
  const { windows, openWindow, closeWindow, focusWindow, minimizeWindow } =
    useDesktopStore();
  const { prefs, previewWallpaper } = usePreferences();

  const constraintsRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showGuidance, setShowGuidance] = useState(false);

  // Active wallpaper — preview takes priority over saved
  const activeWallpaper = previewWallpaper ?? prefs.wallpaper;

  const handleDesktopClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setContextMenu(null);
        focusWindow(null);
      }
    },
    [focusWindow],
  );

  const handleDesktopRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const handleIconDoubleClick = useCallback(
    (appId: AppId) => {
      openWindow(appId);
      setContextMenu(null);
    },
    [openWindow],
  );

  const handleOpenPreferences = useCallback(() => {
    openWindow("preferences");
    setContextMenu(null);
  }, [openWindow]);

  const handleShowGuidance = useCallback(() => {
    setShowGuidance(true);
    setContextMenu(null);
  }, []);

  return (
    <motion.div
      className="h-screen w-screen overflow-hidden relative"
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopRightClick}
      ref={constraintsRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Wallpaper — crossfades when changed from Preferences */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeWallpaper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={ANIMATION_PRESETS.fadeSlow}
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url('${activeWallpaper}')` }}
        />
      </AnimatePresence>

      {/* Desktop Icons */}
      {prefs.showDesktopIcons &&
        DESKTOP_ICON_LAYOUT.map((iconConfig, index) => (
          <DesktopIcon
            key={iconConfig.id}
            iconId={iconConfig.id}
            position={iconConfig.position}
            onDoubleClick={() => handleIconDoubleClick(iconConfig.id)}
            index={index}
          />
        ))}

      {/* Windows */}
      <AnimatePresence>
        {windows.map((win) => (
          <Window key={win.id} window={win} constraintsRef={constraintsRef} />
        ))}
      </AnimatePresence>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={ANIMATION_PRESETS.fadeFast}
            className="absolute bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl py-1 z-50 min-w-44"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            {[
              { label: "⚙️ Preferences", action: handleOpenPreferences },
              { label: "❓ OrbitOS Guide", action: handleShowGuidance },
            ].map(({ label, action }) => (
              <button
                key={label}
                className="w-full px-4 py-2 text-left text-white text-sm hover:bg-gray-700 transition-colors"
                onClick={action}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        onWindowClick={focusWindow}
        onWindowClose={closeWindow}
        onWindowMinimize={minimizeWindow}
      />

      <GuidanceModal open={showGuidance} onOpenChange={setShowGuidance} />
    </motion.div>
  );
}
