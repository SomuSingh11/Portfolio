"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DesktopIcon from "./DesktopIcon";
import Window from "./Window";
import Taskbar from "./Taskbar";
import { useDesktopStore } from "@/lib/desktop-store";
import { WindowData, IconData } from "@/types/desktop";
import GuidanceModal from "../Utilities/GuidanceModal";

// Desktop Icons Configuration
const desktopIcons: IconData[] = [
  {
    id: "terminal",
    name: "Terminal",
    icon: "terminal1.svg",
    position: { x: 50, y: 50 },
  },
  {
    id: "projects",
    name: "Projects",
    icon: "folder.svg",
    position: { x: 50, y: 150 },
  },
  {
    id: "about",
    name: "About Me",
    icon: "about.svg",
    position: { x: 50, y: 250 },
  },
  {
    id: "skills",
    name: "Skills",
    icon: "skills.svg",
    position: { x: 50, y: 350 },
  },
  {
    id: "contact",
    name: "Contact",
    icon: "contact.svg",
    position: { x: 50, y: 450 },
  },
  {
    id: "github",
    name: "GitHub",
    icon: "githubIcon.svg",
    position: { x: 170, y: 52 },
  },
  {
    id: "resume",
    name: "Resume",
    icon: "resume2.svg",
    position: { x: 165, y: 150 },
  },
  {
    id: "hashnode",
    name: "Hashnode",
    icon: "hashnode-solid.svg",
    position: { x: 158, y: 247 },
  },
];

export default function Desktop() {
  const { windows, openWindow, closeWindow, focusWindow, minimizeWindow } =
    useDesktopStore();
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [showGuidance, setShowGuidance] = useState(false);

  // Wallpaper state
  const wallpapers = [
    "/wallpaper/ubuntu.jpg",
    "/wallpaper/ubuntu1.jpg",
    "/wallpaper/penguin.jpg",
    "/wallpaper/redHair.jpg",
    "/wallpaper/pain.jpg",
    "/wallpaper/goldFish.jpg",
    "/wallpaper/groot.jpg",
    "/wallpaper/windowsXp.jpg",
  ];
  const [wallpaperIndex, setWallpaperIndex] = useState(0);

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setContextMenu(null);
      // Click on empty desktop removes focus from all windows
      focusWindow(null);
    }
  };

  const handleDesktopRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleIconDoubleClick = (iconId: string) => {
    const iconConfig = desktopIcons.find((icon) => icon.id === iconId);
    if (!iconConfig) return;

    // Check if window is already open
    const existingWindow = windows.find((w) => w.id === iconId);
    if (existingWindow) {
      focusWindow(iconId);
      return;
    }

    // Create new window
    const newWindow: WindowData = {
      id: iconId,
      title: iconConfig.name,
      content: iconId,
      position: { x: 200 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 800, height: 600 },
      isMinimized: false,
      isMaximized: false,
      zIndex: windows.length + 1,
    };

    openWindow(newWindow);
  };

  const handleShowGuidance = () => {
    setShowGuidance(true);
    setContextMenu(null);
  };

  // Change wallpaper handler
  const handleChangeWallpaper = () => {
    setWallpaperIndex((prev) => (prev + 1) % wallpapers.length);
    setContextMenu(null);
  };

  const handleRefreshWallpaper = () => {
    setWallpaperIndex(0);
    setContextMenu(null);
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden relative"
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopRightClick}
      ref={constraintsRef}
    >
      {/* Wallpaper */}
      <AnimatePresence mode="wait">
        <motion.div
          key={wallpapers[wallpaperIndex]}
          initial={{ opacity: 0, filter: "blur(20px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url('${wallpapers[wallpaperIndex]}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* Desktop Icons */}
      {desktopIcons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          icon={icon}
          onDoubleClick={() => handleIconDoubleClick(icon.id)}
        />
      ))}

      {/* Windows */}
      <AnimatePresence>
        {windows.map((window) => (
          <Window
            key={window.id}
            window={window}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onFocus={() => focusWindow(window.id)}
            constraintsRef={constraintsRef}
          />
        ))}
      </AnimatePresence>

      {/* Context Menu */}
      {contextMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-2 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            className="w-full px-4 py-2 text-left text-white hover:cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={handleRefreshWallpaper}
          >
            🔄 Refresh Desktop
          </button>
          <button
            className="w-full px-4 py-2 text-left text-white hover:cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={handleChangeWallpaper}
          >
            🎨 Change Wallpaper
          </button>
          <button
            className="w-full px-4 py-2 text-left text-white hover:cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={handleShowGuidance}
          >
            ❓ codex-OS Guide
          </button>
        </motion.div>
      )}

      {/* Taskbar */}
      <Taskbar windows={windows} onWindowClick={focusWindow} />
      <GuidanceModal open={showGuidance} onOpenChange={setShowGuidance} />
    </div>
  );
}
