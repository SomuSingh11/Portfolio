import { WALLPAPERS } from "@/config/constants";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type FontFamily = "geist" | "mono" | "serif" | "fun";

export type AccentColor =
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "pink"
  | "red"
  | "cyan";

export type Appearance = "light" | "dark" | "system";

export type ClockFormat = "12h" | "24h";

export type AnimationSpeed = "full" | "reduced" | "none";

export type TerminalTheme =
  | "matrix" // green on black (default)
  | "dracula" // purple/pink on dark
  | "solarized" // warm amber
  | "white" // white on black
  | "cyberpunk"; // cyan/yellow neon

export interface Preferences {
  wallpaper: string;
  appearance: Appearance;
  accentColor: AccentColor;

  fontFamily: FontFamily;
  fontSize: "sm" | "base" | "lg";

  clockFormat: ClockFormat;
  animationSpeed: AnimationSpeed;
  showDesktopIcons: boolean;
  showBootScreen: boolean;

  terminalTheme: TerminalTheme;
  terminalFontSize: "sm" | "base" | "lg";

  reduceMotion: boolean;
  highContrast: boolean;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
export const DEFAULT_PREFERENCES: Preferences = {
  wallpaper: WALLPAPERS[0],
  appearance: "dark",
  accentColor: "blue",
  fontFamily: "geist",
  fontSize: "base",
  clockFormat: "24h",
  animationSpeed: "full",
  showDesktopIcons: true,
  showBootScreen: true,
  terminalTheme: "matrix",
  terminalFontSize: "base",
  reduceMotion: false,
  highContrast: false,
};

// ─── Config maps ──────────────────────────────────────────────────────────────

export const FONT_CONFIG: Record<
  FontFamily,
  {
    label: string;
    description: string;
    cssVar: string;
    preview: string;
  }
> = {
  geist: {
    label: "Geist",
    description: "Clean & modern — the default",
    cssVar: "var(--font-geist-sans)",
    preview: "Hello, World",
  },
  mono: {
    label: "Mono",
    description: "Monospaced — feels like a terminal",
    cssVar: "var(--font-geist-mono)",
    preview: "Hello, World",
  },
  serif: {
    label: "Serif",
    description: "Editorial & refined",
    cssVar: "Georgia, serif",
    preview: "Hello, World",
  },
  fun: {
    label: "Fun",
    description: "Playful & expressive",
    cssVar: "'Comic Sans MS', cursive",
    preview: "Hello, World",
  },
};

export const ACCENT_CONFIG: Record<
  AccentColor,
  {
    label: string;
    hsl: string;
    tailwind: string;
    hex: string;
  }
> = {
  blue: {
    label: "Ocean Blue",
    hsl: "217 91% 60%",
    tailwind: "bg-blue-500",
    hex: "#3B82F6",
  },
  purple: {
    label: "Deep Purple",
    hsl: "271 81% 66%",
    tailwind: "bg-purple-500",
    hex: "#A855F7",
  },
  green: {
    label: "Matrix Green",
    hsl: "142 71% 45%",
    tailwind: "bg-green-500",
    hex: "#22C55E",
  },
  orange: {
    label: "Sunset Orange",
    hsl: "25 95% 53%",
    tailwind: "bg-orange-500",
    hex: "#F97316",
  },
  pink: {
    label: "Hot Pink",
    hsl: "330 81% 60%",
    tailwind: "bg-pink-500",
    hex: "#EC4899",
  },
  red: {
    label: "Alert Red",
    hsl: "0 84% 60%",
    tailwind: "bg-red-500",
    hex: "#EF4444",
  },
  cyan: {
    label: "Cyberpunk Cyan",
    hsl: "189 94% 43%",
    tailwind: "bg-cyan-500",
    hex: "#06B6D4",
  },
};

export const TERMINAL_THEME_CONFIG: Record<
  TerminalTheme,
  {
    label: string;
    bg: string;
    text: string;
    prompt: string;
    description: string;
  }
> = {
  matrix: {
    label: "Matrix",
    bg: "#000000",
    text: "#00FF41",
    prompt: "#00FF41",
    description: "Classic green on black",
  },
  dracula: {
    label: "Dracula",
    bg: "#282a36",
    text: "#f8f8f2",
    prompt: "#bd93f9",
    description: "Purple-tinted dark theme",
  },
  solarized: {
    label: "Solarized",
    bg: "#002b36",
    text: "#839496",
    prompt: "#b58900",
    description: "Easy on the eyes",
  },
  white: {
    label: "Snow",
    bg: "#0d0d0d",
    text: "#e0e0e0",
    prompt: "#e0e0e0",
    description: "Crisp white on dark",
  },
  cyberpunk: {
    label: "Cyberpunk",
    bg: "#0a0a0f",
    text: "#00ffff",
    prompt: "#ffff00",
    description: "Neon cyan and yellow",
  },
};

// ─── CSS application ──────────────────────────────────────────────────────────

export function applyPreferencesToDOM(prefs: Preferences) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Font
  root.style.setProperty("--app-font", FONT_CONFIG[prefs.fontFamily].cssVar);

  // Accent color
  root.style.setProperty("--accent-hsl", ACCENT_CONFIG[prefs.accentColor].hsl);
  root.style.setProperty("--accent-hex", ACCENT_CONFIG[prefs.accentColor].hex);

  // Font size scale
  const sizeMap = { sm: "14px", base: "16px", lg: "18px" };
  root.style.setProperty("--app-font-size", sizeMap[prefs.fontSize]);

  // Appearance
  if (prefs.appearance === "light") {
    root.classList.add("light-mode");
  } else {
    root.classList.remove("light-mode");
  }

  // Animation speed
  if (prefs.animationSpeed === "none" || prefs.reduceMotion) {
    root.style.setProperty("--animation-duration", "0ms");
    root.style.setProperty("--transition-duration", "0ms");
  } else if (prefs.animationSpeed === "reduced") {
    root.style.setProperty("--animation-duration", "150ms");
    root.style.setProperty("--transition-duration", "100ms");
  } else {
    root.style.setProperty("--animation-duration", "300ms");
    root.style.setProperty("--transition-duration", "200ms");
  }

  // Terminal theme
  const t = TERMINAL_THEME_CONFIG[prefs.terminalTheme];
  root.style.setProperty("--terminal-bg", t.bg);
  root.style.setProperty("--terminal-text", t.text);
  root.style.setProperty("--terminal-prompt", t.prompt);
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface PreferencesContextType {
  prefs: Preferences;
  set: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  reset: () => void;
  // Preview wallpaper without saving
  previewWallpaper: string | null;
  setPreviewWallpaper: (url: string | null) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "orbitos-preferences";

function loadFromStorage(): Preferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [previewWallpaper, setPreviewWallpaper] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    setPrefs(stored);
    applyPreferencesToDOM(stored);
    setMounted(true);
  }, []);

  const set = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      setPrefs((prev) => {
        const next = { ...prev, [key]: value };
        // Persist
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
        // Apply to DOM immediately
        applyPreferencesToDOM(next);
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setPrefs(DEFAULT_PREFERENCES);
    applyPreferencesToDOM(DEFAULT_PREFERENCES);
  }, []);

  return (
    <PreferencesContext.Provider
      value={{ prefs, set, reset, previewWallpaper, setPreviewWallpaper }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx)
    throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}
