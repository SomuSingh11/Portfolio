"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Monitor,
  Type,
  Terminal as TerminalIcon,
  Accessibility,
  Info,
  RotateCcw,
  Check,
} from "lucide-react";
import {
  usePreferences,
  FONT_CONFIG,
  ACCENT_CONFIG,
  TERMINAL_THEME_CONFIG,
  DEFAULT_PREFERENCES,
  type FontFamily,
  type AccentColor,
  type TerminalTheme,
} from "@/store/preferences-store";
import { WALLPAPERS } from "@/config/constants";
import { PERSONAL_INFO } from "@/config/constants";

// ─── Sidebar nav ──────────────────────────────────────────────────────────────
type Section =
  | "wallpaper"
  | "appearance"
  | "typography"
  | "terminal"
  | "desktop"
  | "accessibility"
  | "about";

const SECTIONS: Array<{ id: Section; label: string; icon: React.ElementType }> =
  [
    { id: "wallpaper", label: "Wallpaper", icon: Monitor },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "typography", label: "Typography", icon: Type },
    { id: "terminal", label: "Terminal", icon: TerminalIcon },
    { id: "desktop", label: "Desktop", icon: Monitor },
    { id: "accessibility", label: "Accessibility", icon: Accessibility },
    { id: "about", label: "About", icon: Info },
  ];

// ─── Reusable UI pieces ───────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-white mb-5">{children}</h2>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-gray-800 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${
        value ? "bg-[hsl(var(--accent-hsl))]" : "bg-gray-700"
      }`}
      role="switch"
      aria-checked={value}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
        animate={{ x: value ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ─── Wallpaper section ────────────────────────────────────────────────────────
function WallpaperSection() {
  const { prefs, set, previewWallpaper, setPreviewWallpaper } =
    usePreferences();
  const [customUrl, setCustomUrl] = useState("");

  const active = previewWallpaper ?? prefs.wallpaper;

  const handleApplyCustom = useCallback(() => {
    if (!customUrl.trim()) return;
    set("wallpaper", customUrl.trim());
    setPreviewWallpaper(null);
    setCustomUrl("");
  }, [customUrl, set, setPreviewWallpaper]);

  return (
    <div className="space-y-5">
      <SectionTitle>Wallpaper</SectionTitle>

      {/* Preview strip */}
      <div
        className="w-full h-32 rounded-xl bg-cover bg-center border border-gray-700 transition-all duration-300"
        style={{ backgroundImage: `url('${active}')` }}
      />

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2">
        {WALLPAPERS.map((w) => (
          <button
            key={w}
            onMouseEnter={() => setPreviewWallpaper(w)}
            onMouseLeave={() => setPreviewWallpaper(null)}
            onClick={() => {
              set("wallpaper", w);
              setPreviewWallpaper(null);
            }}
            className={`relative aspect-video rounded-lg bg-cover bg-center border-2 transition-all overflow-hidden ${
              prefs.wallpaper === w
                ? "border-[hsl(var(--accent-hsl))] scale-105"
                : "border-transparent hover:border-gray-500"
            }`}
            style={{ backgroundImage: `url('${w}')` }}
          >
            {prefs.wallpaper === w && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Custom URL */}
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">
          Custom wallpaper URL
        </p>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://..."
            value={customUrl}
            onChange={(e) => {
              setCustomUrl(e.target.value);
              if (e.target.value) setPreviewWallpaper(e.target.value);
              else setPreviewWallpaper(null);
            }}
            className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 placeholder-gray-600"
          />
          <button
            onClick={handleApplyCustom}
            disabled={!customUrl.trim()}
            className="px-3 py-1.5 bg-[hsl(var(--accent-hsl))] text-white text-sm rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity font-medium"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Appearance section ───────────────────────────────────────────────────────
function AppearanceSection() {
  const { prefs, set } = usePreferences();

  return (
    <div className="space-y-1">
      <SectionTitle>Appearance</SectionTitle>

      <SettingRow
        label="Mode"
        description="Light mode applies a lighter color scheme throughout"
      >
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          {(["dark", "light"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => set("appearance", mode)}
              className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                prefs.appearance === mode
                  ? "bg-[hsl(var(--accent-hsl))] text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </SettingRow>

      <SettingRow
        label="Accent Color"
        description="Applied to buttons, highlights, and interactive elements"
      >
        <div className="flex gap-2 flex-wrap justify-end">
          {(
            Object.entries(ACCENT_CONFIG) as [
              AccentColor,
              (typeof ACCENT_CONFIG)[AccentColor],
            ][]
          ).map(([key, config]) => (
            <button
              key={key}
              onClick={() => set("accentColor", key)}
              title={config.label}
              className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                prefs.accentColor === key
                  ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110"
                  : ""
              }`}
              style={{ backgroundColor: config.hex }}
            />
          ))}
        </div>
      </SettingRow>

      <SettingRow
        label="Animation Speed"
        description="Controls transition and animation duration"
      >
        <Select
          value={prefs.animationSpeed}
          onChange={(v) =>
            set("animationSpeed", v as typeof prefs.animationSpeed)
          }
          options={[
            { value: "full", label: "Full" },
            { value: "reduced", label: "Reduced" },
            { value: "none", label: "None" },
          ]}
        />
      </SettingRow>
    </div>
  );
}

// ─── Typography section ───────────────────────────────────────────────────────
function TypographySection() {
  const { prefs, set } = usePreferences();

  return (
    <div className="space-y-1">
      <SectionTitle>Typography</SectionTitle>

      {/* Font family picker */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-400 mb-3">Font Family</p>
        <div className="space-y-2">
          {(
            Object.entries(FONT_CONFIG) as [
              FontFamily,
              (typeof FONT_CONFIG)[FontFamily],
            ][]
          ).map(([key, config]) => (
            <button
              key={key}
              onClick={() => set("fontFamily", key)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                prefs.fontFamily === key
                  ? "border-[hsl(var(--accent-hsl))] bg-[hsl(var(--accent-hsl))]/10"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              <div className="text-left">
                <p className="text-sm font-medium text-white">{config.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {config.description}
                </p>
              </div>
              <span
                className="text-lg text-gray-300 ml-4"
                style={{ fontFamily: config.cssVar }}
              >
                {config.preview}
              </span>
            </button>
          ))}
        </div>
      </div>

      <SettingRow
        label="Font Size"
        description="Base font size across the application"
      >
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          {(["sm", "base", "lg"] as const).map((size) => (
            <button
              key={size}
              onClick={() => set("fontSize", size)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                prefs.fontSize === size
                  ? "bg-[hsl(var(--accent-hsl))] text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {size === "sm" ? "Small" : size === "base" ? "Default" : "Large"}
            </button>
          ))}
        </div>
      </SettingRow>
    </div>
  );
}

// ─── Terminal section ─────────────────────────────────────────────────────────
function TerminalSection() {
  const { prefs, set } = usePreferences();

  return (
    <div className="space-y-1">
      <SectionTitle>Terminal</SectionTitle>

      {/* Theme picker */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-400 mb-3">Color Theme</p>
        <div className="space-y-2">
          {(
            Object.entries(TERMINAL_THEME_CONFIG) as [
              TerminalTheme,
              (typeof TERMINAL_THEME_CONFIG)[TerminalTheme],
            ][]
          ).map(([key, config]) => (
            <button
              key={key}
              onClick={() => set("terminalTheme", key)}
              className={`w-full flex items-center gap-4 p-3.5 rounded-xl border transition-colors ${
                prefs.terminalTheme === key
                  ? "border-[hsl(var(--accent-hsl))] bg-[hsl(var(--accent-hsl))]/10"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              {/* Preview */}
              <div
                className="w-16 h-9 rounded-md flex-shrink-0 flex flex-col justify-center px-2 font-mono text-[8px] leading-tight overflow-hidden"
                style={{ backgroundColor: config.bg }}
              >
                <span style={{ color: config.prompt }}>somu@os:~$</span>
                <span style={{ color: config.text }}>hello world</span>
              </div>

              <div className="text-left min-w-0">
                <p className="text-sm font-medium text-white">{config.label}</p>
                <p className="text-xs text-gray-500">{config.description}</p>
              </div>

              {prefs.terminalTheme === key && (
                <Check className="w-4 h-4 text-[hsl(var(--accent-hsl))] ml-auto flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      <SettingRow
        label="Terminal Font Size"
        description="Font size inside the terminal window"
      >
        <Select
          value={prefs.terminalFontSize}
          onChange={(v) =>
            set("terminalFontSize", v as typeof prefs.terminalFontSize)
          }
          options={[
            { value: "sm", label: "Small" },
            { value: "base", label: "Default" },
            { value: "lg", label: "Large" },
          ]}
        />
      </SettingRow>

      <SettingRow
        label="Boot Animation"
        description="Show the boot sequence when opening Terminal"
      >
        <Toggle
          value={prefs.showBootScreen}
          onChange={(v) => set("showBootScreen", v)}
        />
      </SettingRow>
    </div>
  );
}

// ─── Desktop section ──────────────────────────────────────────────────────────
function DesktopSection() {
  const { prefs, set } = usePreferences();

  return (
    <div className="space-y-1">
      <SectionTitle>Desktop</SectionTitle>

      <SettingRow
        label="Show Desktop Icons"
        description="Toggle visibility of icons on the desktop"
      >
        <Toggle
          value={prefs.showDesktopIcons}
          onChange={(v) => set("showDesktopIcons", v)}
        />
      </SettingRow>

      <SettingRow
        label="Clock Format"
        description="How time is displayed in the taskbar"
      >
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          {(["12h", "24h"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => set("clockFormat", fmt)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                prefs.clockFormat === fmt
                  ? "bg-[hsl(var(--accent-hsl))] text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </SettingRow>
    </div>
  );
}

// ─── Accessibility section ────────────────────────────────────────────────────
function AccessibilitySection() {
  const { prefs, set } = usePreferences();

  return (
    <div className="space-y-1">
      <SectionTitle>Accessibility</SectionTitle>

      <SettingRow
        label="Reduce Motion"
        description="Minimises animations and transitions throughout the OS"
      >
        <Toggle
          value={prefs.reduceMotion}
          onChange={(v) => set("reduceMotion", v)}
        />
      </SettingRow>

      <SettingRow
        label="High Contrast"
        description="Increases contrast for borders and text"
      >
        <Toggle
          value={prefs.highContrast}
          onChange={(v) => set("highContrast", v)}
        />
      </SettingRow>
    </div>
  );
}

// ─── About section ────────────────────────────────────────────────────────────
function AboutSection({ onReset }: { onReset: () => void }) {
  const stack = [
    "Next.js 15",
    "React 19",
    "TypeScript",
    "Framer Motion",
    "TailwindCSS",
    "Zustand",
  ];

  return (
    <div className="space-y-5">
      <SectionTitle>About This System</SectionTitle>

      <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PERSONAL_INFO.avatarUrl}
            alt="Somu Singh"
            className="w-14 h-14 rounded-full border-2 border-gray-600"
          />
          <div>
            <p className="text-white font-bold text-base">Codex OS</p>
            <p className="text-gray-400 text-xs">Version 1.0.0</p>
            <p className="text-gray-500 text-xs mt-0.5">
              Built by{" "}
              <a
                href="https://github.com/SomuSingh11"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[hsl(var(--accent-hsl))] hover:underline"
              >
                {PERSONAL_INFO.name}
              </a>
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Built With
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <a
            href="https://github.com/SomuSingh11"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors font-medium"
          >
            GitHub →
          </a>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="flex-1 text-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors font-medium"
          >
            Contact →
          </a>
        </div>
      </div>

      {/* Reset */}
      <div className="bg-red-900/10 border border-red-800/30 rounded-xl p-4">
        <p className="text-sm font-medium text-white mb-1">Reset to Defaults</p>
        <p className="text-xs text-gray-500 mb-3">
          Restores all preferences to their original values. This cannot be
          undone.
        </p>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-700/30 hover:bg-red-700/50 text-red-400 text-xs rounded-lg transition-colors font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All Preferences
        </button>
      </div>
    </div>
  );
}

// ─── Main Preferences app ─────────────────────────────────────────────────────
export default function Preferences() {
  const [activeSection, setActiveSection] = useState<Section>("wallpaper");
  const { reset } = usePreferences();

  const renderSection = () => {
    switch (activeSection) {
      case "wallpaper":
        return <WallpaperSection />;
      case "appearance":
        return <AppearanceSection />;
      case "typography":
        return <TypographySection />;
      case "terminal":
        return <TerminalSection />;
      case "desktop":
        return <DesktopSection />;
      case "accessibility":
        return <AccessibilitySection />;
      case "about":
        return <AboutSection onReset={reset} />;
    }
  };

  return (
    <div className="h-full bg-gray-900 text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-52 flex-shrink-0 bg-gray-800/50 border-r border-gray-700/60 flex flex-col py-3">
        <p className="px-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Preferences
        </p>
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors mx-2 rounded-lg ${
              activeSection === id
                ? "bg-[hsl(var(--accent-hsl))]/15 text-[hsl(var(--accent-hsl))]"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="p-6 max-w-xl"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
