import { useCallback, useRef } from "react";

// ─── useCommandHistory (Terminal) ─────────────────────────────────────────────
export function useCommandHistory(maxHistory = 50) {
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);

  const addToHistory = useCallback(
    (command: string) => {
      if (!command.trim()) return;
      // Don't add duplicate consecutive commands
      if (history.current[history.current.length - 1] === command) return;
      history.current = [...history.current.slice(-(maxHistory - 1)), command];
      historyIndex.current = -1;
    },
    [maxHistory],
  );

  const navigateHistory = useCallback(
    (direction: "up" | "down"): string | null => {
      const len = history.current.length;
      if (len === 0) return null;

      if (direction === "up") {
        historyIndex.current = Math.min(historyIndex.current + 1, len - 1);
      } else {
        historyIndex.current = Math.max(historyIndex.current - 1, -1);
      }

      if (historyIndex.current === -1) return "";
      return history.current[len - 1 - historyIndex.current] ?? null;
    },
    [],
  );

  const resetIndex = useCallback(() => {
    historyIndex.current = -1;
  }, []);

  return { addToHistory, navigateHistory, resetIndex };
}
