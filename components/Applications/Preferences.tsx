/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
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
import SidebarLayout from "@/components/Utilities/SidebarLayout";
import {
  usePreferences,
  FONT_CONFIG,
  ACCENT_CONFIG,
  TERMINAL_THEME_CONFIG,
  type FontFamily,
  type AccentColor,
  type TerminalTheme,
} from "@/store/preferences-store";
import { WALLPAPERS, PERSONAL_INFO } from "@/config/constants";

type Section =
  | "wallpaper"
  | "appearance"
  | "typography"
  | "terminal"
  | "desktop"
  | "accessibility"
  | "about";

const SECTIONS: Array<{
  id: Section;
  label: string;
  icon: React.ElementType;
  description: string;
}> = [
  {
    id: "wallpaper",
    label: "Wallpaper",
    icon: Monitor,
    description: "Desktop background",
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    description: "Colors & animations",
  },
  {
    id: "typography",
    label: "Typography",
    icon: Type,
    description: "Fonts & sizes",
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: TerminalIcon,
    description: "Terminal theme",
  },
  {
    id: "desktop",
    label: "Desktop",
    icon: Monitor,
    description: "Layout & clock",
  },
  {
    id: "accessibility",
    label: "Accessibility",
    icon: Accessibility,
    description: "Motion & contrast",
  },
  { id: "about", label: "About", icon: Info, description: "System info" },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────

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
    <div className="flex items-center justify-between gap-3 py-3.5 border-b border-gray-800/80 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white leading-tight">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
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
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-[hsl(var(--accent-hsl))]" : "bg-gray-700"}`}
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

function SegmentedControl({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-gray-700">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            value === o.value
              ? "bg-[hsl(var(--accent-hsl))] text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────
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
    <div className="space-y-4">
      <div
        className="w-full h-28 rounded-xl bg-cover bg-center border border-gray-700 transition-all duration-300"
        style={{ backgroundImage: `url('${active}')` }}
      />
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
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">Custom URL</p>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://..."
            value={customUrl}
            onChange={(e) => {
              setCustomUrl(e.target.value);
              setPreviewWallpaper(e.target.value || null);
            }}
            className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[hsl(var(--accent-hsl))] placeholder-gray-600 min-w-0"
          />
          <button
            onClick={handleApplyCustom}
            disabled={!customUrl.trim()}
            className="px-3 py-2 bg-[hsl(var(--accent-hsl))] text-white text-sm rounded-lg disabled:opacity-40 font-medium flex-shrink-0"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function AppearanceSection() {
  const { prefs, set } = usePreferences();
  return (
    <div className="space-y-1">
      <SettingRow
        label="Mode"
        description="Light mode applies a lighter color scheme"
      >
        <SegmentedControl
          value={prefs.appearance}
          onChange={(v) => set("appearance", v as any)}
          options={[
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
          ]}
        />
      </SettingRow>
      <SettingRow
        label="Accent Color"
        description="Buttons, highlights and interactive elements"
      >
        <div className="flex gap-2 flex-wrap justify-end max-w-[180px]">
          {(Object.entries(ACCENT_CONFIG) as [AccentColor, any][]).map(
            ([key, config]) => (
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
            ),
          )}
        </div>
      </SettingRow>
      <SettingRow label="Animation Speed">
        <SegmentedControl
          value={prefs.animationSpeed}
          onChange={(v) => set("animationSpeed", v as any)}
          options={[
            { value: "full", label: "Full" },
            { value: "reduced", label: "Less" },
            { value: "none", label: "Off" },
          ]}
        />
      </SettingRow>
    </div>
  );
}

function TypographySection() {
  const { prefs, set } = usePreferences();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {(Object.entries(FONT_CONFIG) as [FontFamily, any][]).map(
          ([key, config]) => (
            <button
              key={key}
              onClick={() => set("fontFamily", key)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                prefs.fontFamily === key
                  ? "border-[hsl(var(--accent-hsl))] bg-[hsl(var(--accent-hsl))]/10"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              <div className="text-left min-w-0">
                <p className="text-sm font-medium text-white">{config.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {config.description}
                </p>
              </div>
              <span
                className="text-base text-gray-300 ml-3 flex-shrink-0"
                style={{ fontFamily: config.cssVar }}
              >
                {config.preview}
              </span>
            </button>
          ),
        )}
      </div>
      <SettingRow label="Font Size">
        <SegmentedControl
          value={prefs.fontSize}
          onChange={(v) => set("fontSize", v as any)}
          options={[
            { value: "sm", label: "S" },
            { value: "base", label: "M" },
            { value: "lg", label: "L" },
          ]}
        />
      </SettingRow>
    </div>
  );
}

function TerminalSection() {
  const { prefs, set } = usePreferences();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {(Object.entries(TERMINAL_THEME_CONFIG) as [TerminalTheme, any][]).map(
          ([key, config]) => (
            <button
              key={key}
              onClick={() => set("terminalTheme", key)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                prefs.terminalTheme === key
                  ? "border-[hsl(var(--accent-hsl))] bg-[hsl(var(--accent-hsl))]/10"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              <div
                className="w-14 h-8 rounded flex-shrink-0 flex flex-col justify-center px-1.5 font-mono text-[7px] leading-tight overflow-hidden"
                style={{ backgroundColor: config.bg }}
              >
                <span style={{ color: config.prompt }}>somu@os:~$</span>
                <span style={{ color: config.text }}>hello world</span>
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{config.label}</p>
                <p className="text-xs text-gray-500 truncate">
                  {config.description}
                </p>
              </div>
              {prefs.terminalTheme === key && (
                <Check className="w-4 h-4 text-[hsl(var(--accent-hsl))] flex-shrink-0" />
              )}
            </button>
          ),
        )}
      </div>
      <div className="space-y-1">
        <SettingRow label="Terminal Font Size">
          <SegmentedControl
            value={prefs.terminalFontSize}
            onChange={(v) => set("terminalFontSize", v as any)}
            options={[
              { value: "sm", label: "S" },
              { value: "base", label: "M" },
              { value: "lg", label: "L" },
            ]}
          />
        </SettingRow>
        <SettingRow
          label="Boot Animation"
          description="Show boot sequence on open"
        >
          <Toggle
            value={prefs.showBootScreen}
            onChange={(v) => set("showBootScreen", v)}
          />
        </SettingRow>
      </div>
    </div>
  );
}

function DesktopSection() {
  const { prefs, set } = usePreferences();
  return (
    <div className="space-y-1">
      <SettingRow
        label="Desktop Icons"
        description="Show icons on the desktop surface"
      >
        <Toggle
          value={prefs.showDesktopIcons}
          onChange={(v) => set("showDesktopIcons", v)}
        />
      </SettingRow>
      <SettingRow label="Clock Format">
        <SegmentedControl
          value={prefs.clockFormat}
          onChange={(v) => set("clockFormat", v as any)}
          options={[
            { value: "12h", label: "12h" },
            { value: "24h", label: "24h" },
          ]}
        />
      </SettingRow>
    </div>
  );
}

function AccessibilitySection() {
  const { prefs, set } = usePreferences();
  return (
    <div className="space-y-1">
      <SettingRow
        label="Reduce Motion"
        description="Minimises animations throughout the OS"
      >
        <Toggle
          value={prefs.reduceMotion}
          onChange={(v) => set("reduceMotion", v)}
        />
      </SettingRow>
      <SettingRow
        label="High Contrast"
        description="Increases contrast for text and borders"
      >
        <Toggle
          value={prefs.highContrast}
          onChange={(v) => set("highContrast", v)}
        />
      </SettingRow>
    </div>
  );
}

function AboutSection({ onReset }: { onReset: () => void }) {
  const stack = [
    "Next.js 15",
    "React 19",
    "TypeScript",
    "Framer Motion",
    "TailwindCSS",
  ];
  return (
    <div className="space-y-4">
      <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PERSONAL_INFO.avatarUrl}
            alt="avatar"
            className="w-12 h-12 rounded-full border-2 border-gray-600 flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-white font-bold">OrbitOS</p>
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
        <div className="flex flex-wrap gap-1.5">
          {stack.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
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
      <div className="bg-red-900/10 border border-red-800/30 rounded-xl p-4">
        <p className="text-sm font-medium text-white mb-1">Reset to Defaults</p>
        <p className="text-xs text-gray-500 mb-3">
          Restores all settings to factory defaults.
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

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Preferences() {
  const { reset } = usePreferences();

  const renderSection = (id: string) => {
    switch (id as Section) {
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
      default:
        return null;
    }
  };

  return (
    <SidebarLayout
      title="System Preferences"
      nav={SECTIONS}
      renderSection={renderSection}
    />
  );
}
