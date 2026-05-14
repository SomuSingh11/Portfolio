"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { WindowData, AppId, WindowState } from "@/types/desktop";
import { WINDOW_DEFAULTS, APP_META } from "@/config/constants";

interface DesktopState {
  windows: WindowData[];
  openWindow: (appId: AppId) => void;
  closeWindow: (windowId: AppId) => void;
  focusWindow: (windowId: AppId | null) => void;
  minimizeWindow: (windowId: AppId) => void;
  maximizeWindow: (windowId: AppId) => void;
  restoreWindow: (windowId: AppId) => void;
  updateWindowPosition: (
    windowId: AppId,
    position: { x: number; y: number },
  ) => void;
  updateWindowSize: (
    windowId: AppId,
    size: { width: number; height: number },
  ) => void;
  isWindowOpen: (windowId: AppId) => boolean;
  getTopZIndex: () => number;
}

const DesktopContext = createContext<DesktopState | undefined>(undefined);

const computeZIndex = (index: number, total: number): number =>
  WINDOW_DEFAULTS.minZIndex + index;

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [focusOrder, setFocusOrder] = useState<AppId[]>([]);

  const getTopZIndex = useCallback(() => focusOrder.length, [focusOrder]);

  // Return updated windows
  const assignZIndexes = useCallback(
    (wins: WindowData[], order: AppId[]): WindowData[] =>
      wins.map((w) => ({
        ...w,
        zIndex: order.indexOf(w.id) + WINDOW_DEFAULTS.minZIndex,
      })),
    [],
  );

  const openWindow = useCallback((appId: AppId) => {
    setWindows((prev) => {
      const exists = prev.find((w) => w.id === appId);
      if (exists) {
        // Restore if minimized, just focus otherwise
        return prev.map((w) =>
          w.id === appId ? { ...w, windowState: "normal" as WindowState } : w,
        );
      }

      const openCount = prev.length;
      const newWindow: WindowData = {
        id: appId,
        title: APP_META[appId].title,
        content: appId,
        position: {
          x:
            WINDOW_DEFAULTS.initialX +
            openCount * WINDOW_DEFAULTS.offsetPerWindow,
          y:
            WINDOW_DEFAULTS.initialY +
            openCount * WINDOW_DEFAULTS.offsetPerWindow,
        },
        size: {
          width: WINDOW_DEFAULTS.width,
          height: WINDOW_DEFAULTS.height,
        },
        windowState: "normal",
        zIndex: openCount + WINDOW_DEFAULTS.minZIndex,
      };

      return [...prev, newWindow];
    });

    setFocusOrder((prev) => {
      const without = prev.filter((id) => id !== appId);
      return [...without, appId];
    });
  }, []);

  const closeWindow = useCallback((windowId: AppId) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));
    setFocusOrder((prev) => prev.filter((id) => id !== windowId));
  }, []);

  const focusWindow = useCallback(
    (windowId: AppId | null) => {
      if (!windowId) return;

      setFocusOrder((prev) => {
        const without = prev.filter((id) => id !== windowId);
        const newOrder = [...without, windowId];

        setWindows((wins) => assignZIndexes(wins, newOrder));
        return newOrder;
      });

      // Also restore if minimized
      setWindows((prev) =>
        prev.map((w) =>
          w.id === windowId && w.windowState === "minimized"
            ? { ...w, windowState: "normal" }
            : w,
        ),
      );
    },
    [assignZIndexes],
  );

  const minimizeWindow = useCallback((windowId: AppId) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId
          ? { ...w, windowState: "minimized" as WindowState }
          : w,
      ),
    );
  }, []);

  const maximizeWindow = useCallback((windowId: AppId) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId
          ? {
              ...w,
              windowState: "maximized" as WindowState,
              position: { x: 0, y: 0 },
              size: {
                width: globalThis.innerWidth ?? WINDOW_DEFAULTS.width,
                height: (globalThis.innerHeight ?? WINDOW_DEFAULTS.height) - 56,
              },
            }
          : w,
      ),
    );
  }, []);

  const restoreWindow = useCallback((windowId: AppId) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId
          ? {
              ...w,
              windowState: "normal" as WindowState,
              position: {
                x: WINDOW_DEFAULTS.initialX,
                y: WINDOW_DEFAULTS.initialY,
              },
              size: {
                width: WINDOW_DEFAULTS.width,
                height: WINDOW_DEFAULTS.height,
              },
            }
          : w,
      ),
    );
  }, []);

  const updateWindowPosition = useCallback(
    (windowId: AppId, position: { x: number; y: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, position } : w)),
      );
    },
    [],
  );

  const updateWindowSize = useCallback(
    (windowId: AppId, size: { width: number; height: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, size } : w)),
      );
    },
    [],
  );

  const isWindowOpen = useCallback(
    (windowId: AppId) => windows.some((w) => w.id === windowId),
    [windows],
  );

  const value: DesktopState = {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    updateWindowPosition,
    updateWindowSize,
    isWindowOpen,
    getTopZIndex,
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
