/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Zap,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  GraduationCap,
  Layers,
  Heart,
  Radio,
  User,
  ChevronRight,
  ArrowLeft,
  Code2,
  Globe,
  Server,
  BrainCircuit,
  Cpu,
  Wrench,
  Gamepad2,
  Tv2,
  Music2,
  BookOpen,
} from "lucide-react";
import { BIO, EDUCATION, STACK, INTERESTS, NOW } from "@/data/about";

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionId = "bio" | "education" | "stack" | "interests" | "now";

interface NavItem {
  id: SectionId;
  label: string;
  description: string;
  icon: React.ElementType;
}

// ─── Nav config (same shape as Preferences SECTIONS) ─────────────────────────

const NAV: NavItem[] = [
  { id: "bio", label: "Bio", description: "Who I am", icon: User },
  {
    id: "education",
    label: "Education",
    description: "Academic background",
    icon: GraduationCap,
  },
  {
    id: "stack",
    label: "Stack",
    description: "Tools & technologies",
    icon: Layers,
  },
  {
    id: "interests",
    label: "Interests",
    description: "Games, anime & music",
    icon: Heart,
  },
  { id: "now", label: "Now", description: "What I'm up to", icon: Radio },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Languages: Code2,
  Frontend: Globe,
  Backend: Server,
  "AI / ML": BrainCircuit,
  Embedded: Cpu,
  Tools: Wrench,
};

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  hashnode: ExternalLink,
  mail: Mail,
};

// ─── Shared animation (same values as Preferences) ───────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};
const pageTransition = { duration: 0.15 };

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-white mb-4">{children}</h2>
  );
}

function Divider() {
  return <div className="border-b border-gray-800/80" />;
}

// ─── Bio Section ──────────────────────────────────────────────────────────────

const BioSection = memo(function BioSection() {
  return (
    <div className="space-y-4">
      {/* Profile card */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={BIO.avatar}
              alt={BIO.name}
              className="w-14 h-14 rounded-full border-2 border-gray-600 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(BIO.name)}&background=1f2937&color=ffffff&size=56&bold=true`;
              }}
            />
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-gray-900" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-white font-bold text-base leading-tight">
              {BIO.name}
            </p>
            <p className="text-[hsl(var(--accent-hsl))] text-xs mt-0.5 leading-snug">
              {BIO.tagline}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 text-gray-500 text-xs">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span>{BIO.location}</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {BIO.badges.map((b) => (
            <span
              key={b.label}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
              style={{
                background:
                  b.color === "yellow"
                    ? "rgba(234,179,8,0.12)"
                    : "hsl(var(--accent-hsl) / 0.12)",
                color:
                  b.color === "yellow" ? "#fbbf24" : "hsl(var(--accent-hsl))",
                border: `1px solid ${b.color === "yellow" ? "rgba(234,179,8,0.25)" : "hsl(var(--accent-hsl) / 0.25)"}`,
              }}
            >
              <Zap className="w-3 h-3" />
              {b.label}
            </span>
          ))}
        </div>

        {/* Socials */}
        <div className="flex flex-wrap gap-2 pt-1">
          {BIO.socials.map((s) => {
            const Icon = SOCIAL_ICONS[s.icon] ?? ExternalLink;
            return (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs rounded-lg transition-colors font-medium"
              >
                <Icon className="w-3.5 h-3.5" />
                {s.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Open to work */}
      <div className="flex items-center gap-3 px-4 py-3 bg-green-900/15 border border-green-800/30 rounded-xl">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
        <p className="text-green-400 text-sm">
          {BIO.status} — feel free to reach out
        </p>
      </div>
    </div>
  );
});

// ─── Education Section ────────────────────────────────────────────────────────

const EducationSection = memo(function EducationSection() {
  return (
    <div className="space-y-4">
      <div className="relative ml-2">
        {/* Timeline spine */}
        <div className="absolute left-0 top-2 bottom-2 w-px bg-gray-700" />

        <div className="space-y-3 pl-6">
          {EDUCATION.map((edu, i) => (
            <div key={edu.id} className="relative">
              {/* Dot */}
              <span
                className="absolute top-3 w-2.5 h-2.5 rounded-full border-2 flex-shrink-0"
                style={{
                  background: i === 0 ? "hsl(var(--accent-hsl))" : "#1f2937",
                  borderColor: i === 0 ? "hsl(var(--accent-hsl))" : "#374151",
                  left: "-0.85rem",
                  boxShadow:
                    i === 0 ? "0 0 8px hsl(var(--accent-hsl) / 0.45)" : "none",
                }}
              />

              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3.5 hover:border-gray-600 transition-colors">
                <p className="text-white text-sm font-semibold">{edu.degree}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {edu.institution}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-[hsl(var(--accent-hsl))]/10 text-[hsl(var(--accent-hsl))]">
                    {edu.year}
                  </span>
                  <span className="text-gray-500 text-xs">{edu.grade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ─── Stack Section ────────────────────────────────────────────────────────────

const StackSection = memo(function StackSection() {
  return (
    <div className="space-y-5">
      {STACK.map((group) => {
        const Icon = CATEGORY_ICONS[group.category] ?? Layers;
        return (
          <div key={group.category}>
            <div className="flex items-center gap-2 mb-2.5">
              <Icon className="w-3.5 h-3.5 text-[hsl(var(--accent-hsl))]" />
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                {group.category}
              </span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 bg-gray-800 border border-gray-700 hover:border-gray-600 hover:text-white text-gray-300 text-xs rounded-lg transition-colors cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
});

// ─── Interests Section ────────────────────────────────────────────────────────

function HScroll({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex gap-3 overflow-x-auto pb-2"
      style={{ scrollbarWidth: "none" }}
    >
      {children}
    </div>
  );
}

const InterestsSection = memo(function InterestsSection() {
  return (
    <div className="space-y-6">
      {/* Games */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Gamepad2 className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
            Games Completed
          </span>
        </div>
        <HScroll>
          {INTERESTS.games.map((g) => (
            <div key={g.name} className="flex-shrink-0 w-24 group">
              <div className="w-24 h-32 rounded-xl overflow-hidden border border-gray-700 group-hover:border-gray-500 transition-colors">
                <img
                  src={g.image}
                  alt={g.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://placehold.co/96x128/1f2937/6b7280?text=${encodeURIComponent(g.name.slice(0, 2))}`;
                  }}
                />
              </div>
              <p className="text-xs mt-1.5 text-center text-gray-500 leading-tight">
                {g.name}
              </p>
            </div>
          ))}
        </HScroll>
      </div>

      <Divider />

      {/* Anime */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Tv2 className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
            Anime Logged
          </span>
        </div>
        <HScroll>
          {INTERESTS.anime.map((a) => (
            <div key={a.name} className="flex-shrink-0 w-20 group">
              <div className="w-20 h-28 rounded-xl overflow-hidden border border-gray-700 group-hover:border-gray-500 transition-colors">
                <img
                  src={a.image}
                  alt={a.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://placehold.co/80x112/1f2937/6b7280?text=${encodeURIComponent(a.name.slice(0, 2))}`;
                  }}
                />
              </div>
              <p className="text-xs mt-1.5 text-center text-gray-500 leading-tight">
                {a.name}
              </p>
            </div>
          ))}
        </HScroll>
      </div>

      <Divider />

      {/* Music */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Music2 className="w-3.5 h-3.5 text-green-400" />
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
            Current Rotation
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {INTERESTS.music.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 bg-gray-800/60 border border-gray-700 hover:border-gray-600 rounded-xl transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
                <img
                  src={s.image}
                  alt={s.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://placehold.co/36x36/1f2937/6b7280?text=♪`;
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-semibold truncate group-hover:text-[hsl(var(--accent-hsl))] transition-colors">
                  {s.name}
                </p>
                <p className="text-gray-500 text-xs truncate">{s.artist}</p>
              </div>
              <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-[hsl(var(--accent-hsl))] flex-shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
});

// ─── Now Section ──────────────────────────────────────────────────────────────

const NowSection = memo(function NowSection() {
  const items = [
    {
      icon: Cpu,
      label: "Building",
      value: NOW.building,
      colorClass: "text-[hsl(var(--accent-hsl))]",
      bgClass: "bg-[hsl(var(--accent-hsl))]/5",
      borderClass: "border-[hsl(var(--accent-hsl))]/20",
    },
    {
      icon: Tv2,
      label: "Watching",
      value: NOW.watching,
      colorClass: "text-red-400",
      bgClass: "bg-red-900/10",
      borderClass: "border-red-800/25",
    },
    {
      icon: Music2,
      label: "Listening",
      value: NOW.listening,
      colorClass: "text-green-400",
      bgClass: "bg-green-900/10",
      borderClass: "border-green-800/25",
    },
    {
      icon: BookOpen,
      label: "Reading",
      value: NOW.reading,
      colorClass: "text-violet-400",
      bgClass: "bg-violet-900/10",
      borderClass: "border-violet-800/25",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-600 -mt-2 font-mono">
        what i&apos;m up to right now
      </p>

      <div className="space-y-2.5">
        {items.map(
          ({ icon: Icon, label, value, colorClass, bgClass, borderClass }) => (
            <div
              key={label}
              className={`flex items-start gap-3.5 p-4 rounded-xl border ${bgClass} ${borderClass}`}
            >
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colorClass}`} />
              <div>
                <p
                  className={`text-[10px] font-semibold uppercase tracking-widest mb-1 opacity-80 ${colorClass}`}
                >
                  {label}
                </p>
                <p className="text-white text-sm leading-snug">{value}</p>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
});

// ─── Section renderer ─────────────────────────────────────────────────────────

function renderSection(id: SectionId) {
  switch (id) {
    case "bio":
      return <BioSection />;
    case "education":
      return <EducationSection />;
    case "stack":
      return <StackSection />;
    case "interests":
      return <InterestsSection />;
    case "now":
      return <NowSection />;
  }
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function About() {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback((id: SectionId) => {
    setActiveSection(id);
    contentRef.current?.scrollTo({ top: 0 });
  }, []);

  const handleBack = useCallback(() => setActiveSection(null), []);

  return (
    <div className="h-full bg-gray-900 text-white flex overflow-hidden">
      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP  —  sidebar + content  (pixel-matches Preferences layout)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex h-full w-full overflow-hidden">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0 bg-gray-800/40 border-r border-gray-700/60 flex flex-col py-3">
          <p className="px-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-2">
            About Me
          </p>

          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleSelect(id)}
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
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto min-w-0 min-h-0 flex justify-center"
        >
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {activeSection ? (
                <motion.div
                  key={activeSection}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  className="p-6 w-full"
                >
                  {renderSection(activeSection)}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center p-8"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-500 text-sm">
                      Select a section to explore
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE  —  list → detail drill-down  (mirrors Preferences exactly)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex md:hidden h-full w-full flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {!activeSection ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
              className="flex-1 overflow-y-auto"
            >
              <div className="px-4 pt-4 pb-2 border-b border-gray-800">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  About Me
                </p>
              </div>
              <div className="py-2">
                {NAV.map(({ id, label, description, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleSelect(id)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-800/60 transition-colors border-b border-gray-800/50 last:border-0"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[hsl(var(--accent-hsl))]" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-white">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.18 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Back header — identical to Preferences */}
              <div className="flex-shrink-0 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-[hsl(var(--accent-hsl))] text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  About Me
                </button>
                <span className="text-white text-sm font-semibold ml-auto">
                  {NAV.find((n) => n.id === activeSection)?.label}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {renderSection(activeSection)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
