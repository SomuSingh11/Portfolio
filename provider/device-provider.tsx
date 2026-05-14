"use client";

import { createContext, useContext } from "react";
import { useIsMobile } from "@/hooks/ui/useIsMobile";

// ─── Context ──────────────────────────────────────────────────────────────────
interface DeviceContextProps {
  isMobile: boolean;
}

const DeviceContext = createContext<DeviceContextProps | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <DeviceContext.Provider value={{ isMobile }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
}
