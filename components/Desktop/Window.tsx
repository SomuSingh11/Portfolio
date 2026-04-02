"use client";

/**
 * Window Component (Desktop Window Manager)
 *
 * This file is responsible for rendering and controlling individual application windows
 * in the desktop environment.
 *
 * Responsibilities:
 * - Renders the correct application (Terminal, Projects, About, etc.) based on window content
 * - Handles window lifecycle actions:
 *    • Focus (bring to front)
 *    • Close
 *    • Minimize
 *    • Maximize / Restore
 * - Manages window positioning and drag behavior using framer-motion
 * - Applies animations for mount/unmount (open/close transitions)
 * - Maintains proper z-index stacking for overlapping windows
 * - Prevents minimized windows from rendering
 * - Wraps each window’s content in an ErrorBoundary to isolate crashes
 *   (ensures one broken app doesn’t crash the entire desktop)
 *
 * Architecture Insight:
 * This component acts like a single "window instance" in an OS-level window manager,
 * while the global store (useDesktopStore) acts as the window manager controlling state.
 */

import { useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Square, RotateCcw } from "lucide-react";
import type { WindowData } from "@/types/desktop";
import { useDesktopStore } from "@/store/desktop-store";
import { AppErrorBoundary } from "@/components/Utilities/ErrorBoundary";
import { ANIMATION_PRESETS } from "@/config/constants";

// Application components
import Terminal from "@/components/Applications/Terminal";
import Projects from "@/components/Applications/Projects";
import About from "@/components/Applications/About";
import Skills from "@/components/Applications/Skills";
import Contact from "@/components/Applications/Contact";
import GitHub from "@/components/Applications/GitHub";
import Resume from "@/components/Applications/Resume";
import HashNode from "@/components/Applications/HashNode";
import Preferences from "@/components/Applications/Preferences";

interface WindowProps {
  window: WindowData;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
}

function WindowContent({ appId }: { appId: WindowData["content"] }) {
  switch (appId) {
    case "terminal":
      return <Terminal />;
    case "projects":
      return <Projects />;
    case "about":
      return <About />;
    case "skills":
      return <Skills />;
    case "contact":
      return <Contact />;
    case "github":
      return <GitHub />;
    case "resume":
      return <Resume />;
    case "hashnode":
      return <HashNode />;
    case "preferences":
      return <Preferences />;
    default:
      return (
        <div className="p-4 text-white text-sm font-mono">
          App &quot;{appId}&quot; not found.
        </div>
      );
  }
}

export default function Window({ window, constraintsRef }: WindowProps) {
  const {
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    updateWindowPosition,
  } = useDesktopStore();

  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);
  const isMaximized = window.windowState === "maximized";
  const isMinimized = window.windowState === "minimized";

  const handleFocus = useCallback(() => {
    focusWindow(window.id);
  }, [focusWindow, window.id]);

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      closeWindow(window.id);
    },
    [closeWindow, window.id],
  );

  const handleMinimize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      minimizeWindow(window.id);
    },
    [minimizeWindow, window.id],
  );

  const handleMaximizeToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isMaximized) {
        restoreWindow(window.id);
      } else {
        maximizeWindow(window.id);
      }
    },
    [isMaximized, maximizeWindow, restoreWindow, window.id],
  );

  if (isMinimized) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={window.id}
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          x: window.position.x,
          // Don't animate position changes after initial mount
        }}
        exit={{ opacity: 0, scale: 0.92, y: 8 }}
        transition={ANIMATION_PRESETS.springGentle}
        className="absolute bg-gray-900 border border-gray-600 rounded-lg shadow-2xl overflow-hidden flex flex-col"
        style={{
          zIndex: window.zIndex,
          width: window.size.width,
          height: window.size.height,
          top: window.position.y,
          left: window.position.x,
        }}
        onClick={handleFocus}
        // Don't use framer-motion drag when maximized
        drag={!isMaximized}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragElastic={0}
        onDragStart={() => {
          dragStartPosition.current = { ...window.position };
        }}
        onDragEnd={(_, info) => {
          if (isMaximized) return;
          updateWindowPosition(window.id, {
            x: Math.max(0, window.position.x + info.offset.x),
            y: Math.max(0, window.position.y + info.offset.y),
          });
        }}
      >
        {/* Title Bar */}
        <div
          className={`h-10 flex-shrink-0 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4 select-none ${
            isMaximized
              ? "cursor-default"
              : "cursor-grab active:cursor-grabbing"
          }`}
        >
          {/* Traffic lights */}
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1.5">
              <button
                onClick={handleClose}
                className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors focus:outline-none focus:ring-1 focus:ring-red-300"
                aria-label="Close window"
              />
              <button
                onClick={handleMinimize}
                className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-1 focus:ring-yellow-300"
                aria-label="Minimize window"
              />
              <button
                onClick={handleMaximizeToggle}
                className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors focus:outline-none focus:ring-1 focus:ring-green-300"
                aria-label={isMaximized ? "Restore window" : "Maximize window"}
              />
            </div>
            <span className="text-white text-sm font-medium">
              {window.title}
            </span>
          </div>

          {/* Right-side controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleMinimize}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors focus:outline-none"
              aria-label="Minimize"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              onClick={handleMaximizeToggle}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors focus:outline-none"
              aria-label={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? (
                <RotateCcw className="w-3 h-3" />
              ) : (
                <Square className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-white hover:bg-red-600 rounded transition-colors focus:outline-none"
              aria-label="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Content — wrapped in error boundary so one broken app can't crash the desktop */}
        <div className="flex-1 overflow-hidden min-h-0">
          <AppErrorBoundary appName={window.title}>
            <WindowContent appId={window.content} />
          </AppErrorBoundary>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
