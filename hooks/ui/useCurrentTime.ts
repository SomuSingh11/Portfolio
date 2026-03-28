import { useEffect, useState } from "react";

// ─── useCurrentTime ────────────────────────────────────────────────────────────
export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return currentTime;
}
