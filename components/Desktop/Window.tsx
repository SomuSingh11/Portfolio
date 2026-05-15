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
 * - Manages window positioning via manual pointer-based drag on the title bar
 * - Clamps window position so it never fully leaves the viewport
 * - Applies animations for mount/unmount (open/close transitions)
 * - Maintains proper z-index stacking for overlapping windows
 * - Prevents minimized windows from rendering
 * - Wraps each window's content in an ErrorBoundary to isolate crashes
 *   (ensures one broken app doesn't crash the entire desktop)
 *
 * Architecture Insight:
 * This component acts like a single "window instance" in an OS-level window manager,
 * while the global store (useDesktopStore) acts as the window manager controlling state.
 */

import { useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
import Preferences from "@/components/Applications/Preferences";

// Minimum visible pixels of the title bar that must remain in-viewport
const MIN_VISIBLE_X = 100;
const TASKBAR_HEIGHT = 56; // h-14 = 3.5rem = 56px

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

export default function Window({ window: win, constraintsRef }: WindowProps) {
  const {
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    updateWindowPosition,
  } = useDesktopStore();

  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isMaximized = win.windowState === "maximized";
  const isMinimized = win.windowState === "minimized";

  // ─── Clamp helper ────────────────────────────────────────────────────────────
  const clampPosition = useCallback(
    (x: number, y: number) => {
      const vw = globalThis.innerWidth ?? 1920;
      const vh = globalThis.innerHeight ?? 1080;

      // Keep at least MIN_VISIBLE_X of the window on screen horizontally
      const clampedX = Math.max(
        -(win.size.width - MIN_VISIBLE_X),
        Math.min(x, vw - MIN_VISIBLE_X),
      );
      // Never above y=0, never below viewport minus taskbar
      const clampedY = Math.max(
        0,
        Math.min(y, vh - TASKBAR_HEIGHT - 40), // 40px = title bar height
      );
      return { x: clampedX, y: clampedY };
    },
    [win.size.width],
  );

  // ─── Pointer-based drag (title bar only) ─────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isMaximized) return;

      isDragging.current = true;
      dragOffset.current = {
        x: e.clientX - win.position.x,
        y: e.clientY - win.position.y,
      };

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      focusWindow(win.id);
    },
    [isMaximized, win.position.x, win.position.y, focusWindow, win.id],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;

      const rawX = e.clientX - dragOffset.current.x;
      const rawY = e.clientY - dragOffset.current.y;
      const clamped = clampPosition(rawX, rawY);

      updateWindowPosition(win.id, clamped);
    },
    [clampPosition, updateWindowPosition, win.id],
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // ─── Window actions ──────────────────────────────────────────────────────────
  const handleFocus = useCallback(() => {
    focusWindow(win.id);
  }, [focusWindow, win.id]);

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      closeWindow(win.id);
    },
    [closeWindow, win.id],
  );

  const handleMinimize = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      minimizeWindow(win.id);
    },
    [minimizeWindow, win.id],
  );

  const handleMaximizeToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isMaximized) {
        restoreWindow(win.id);
      } else {
        maximizeWindow(win.id);
      }
    },
    [isMaximized, maximizeWindow, restoreWindow, win.id],
  );

  if (isMinimized) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={win.id}
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 8 }}
        transition={ANIMATION_PRESETS.springGentle}
        className="absolute bg-gray-900 border border-gray-600 rounded-lg shadow-2xl overflow-hidden flex flex-col"
        style={{
          zIndex: win.zIndex,
          width: win.size.width,
          height: win.size.height,
          top: win.position.y,
          left: win.position.x,
          willChange: isDragging.current ? "top, left" : "auto",
        }}
        onClick={handleFocus}
      >
        {/* Title Bar — drag handle */}
        <div
          className={`h-10 flex-shrink-0 bg-gray-800 border-b border-gray-600 flex items-center justify-between px-4 select-none touch-none ${
            isMaximized
              ? "cursor-default"
              : "cursor-grab active:cursor-grabbing"
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Traffic lights */}
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1.5">
              <button
                onClick={handleClose}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors focus:outline-none focus:ring-1 focus:ring-red-300"
                aria-label="Close window"
              />
              <button
                onClick={handleMinimize}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-1 focus:ring-yellow-300"
                aria-label="Minimize window"
              />
              <button
                onClick={handleMaximizeToggle}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 transition-colors focus:outline-none focus:ring-1 focus:ring-green-300"
                aria-label={isMaximized ? "Restore window" : "Maximize window"}
              />
            </div>
          </div>

          <span className="text-white text-sm font-medium mr-2">
            {win.title}
          </span>

          {/* Spacer to balance the layout */}
          <div className="w-[52px]" />
        </div>

        {/* Content — wrapped in error boundary so one broken app can't crash the desktop */}
        <div className="flex-1 overflow-hidden min-h-0">
          <AppErrorBoundary appName={win.title}>
            <WindowContent appId={win.content} />
          </AppErrorBoundary>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
