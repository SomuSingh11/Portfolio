"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { WindowData } from "@/types/desktop";

interface DesktopState {
  windows: WindowData[];
  openWindow: (window: WindowData) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string | null) => void;
  minimizeWindow: (windowId: string) => void;
  updateWindow: (window: WindowData) => void;
}

const DesktopContext = createContext<DesktopState | undefined>(undefined);

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowData[]>([]);

  const openWindow = (newWindow: WindowData) => {
    setWindows((prev) => {
      // Check if window already exists
      const exists = prev.find((w) => w.id === newWindow.id);
      if (exists) {
        // Focus existing window
        return prev.map((w) =>
          w.id === newWindow.id
            ? {
                ...w,
                isMinimized: false,
                zIndex: Math.max(...prev.map((win) => win.zIndex)) + 1,
              }
            : w
        );
      }

      // Add new window
      return [
        ...prev,
        { ...newWindow, zIndex: Math.max(...prev.map((w) => w.zIndex), 0) + 1 },
      ];
    });
  };

  const closeWindow = (windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));
  };

  const focusWindow = (windowId: string | null) => {
    if (!windowId) {
      setWindows((prev) => prev.map((w) => ({ ...w, zIndex: w.zIndex })));
      return;
    }

    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex));
      return prev.map((w) =>
        w.id === windowId ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w
      );
    });
  };

  const minimizeWindow = (windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId ? { ...w, isMinimized: !w.isMinimized } : w
      )
    );
  };

  const updateWindow = (updatedWindow: WindowData) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === updatedWindow.id ? updatedWindow : w))
    );
  };

  const value = {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    updateWindow,
  };

  return (
    <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>
  );
}

export function useDesktopStore() {
  const context = useContext(DesktopContext);
  if (context === undefined) {
    throw new Error("useDesktopStore must be used within a DesktopProvider");
  }
  return context;
}
