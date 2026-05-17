"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Calendar,
  Users,
  Clock,
  Lightbulb,
  Wrench,
  Star,
  Trophy,
  BookOpen,
  Rocket,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Eye,
  LayoutGrid,
  Wifi,
  Film,
  Activity,
  Moon,
  Monitor,
  Smile,
  Database,
  Zap,
  Pointer,
  Layers,
  MessageSquare,
  Shield,
  Video,
  Mail,
  Paperclip,
  Edit,
  Hash,
  Smartphone,
  Cpu,
  Mic,
  Tv,
  Linkedin,
  Music,
  MapPin,
  TerminalIcon,
  BookOpenText,
} from "lucide-react";
import type {
  Project,
  Challenge,
  FeatureCard,
  Result,
  TechGroup,
} from "@/data/projects";
import projects from "@/data/projects";
import Link from "next/link";
import MediaCarousel from "../Utilities/MediaCarousal";

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = memo(function Section({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
});

const Divider = () => <div className="border-t border-gray-800" />;

// ─── Icon Mapping ─────────────────────────────────────────────────────────────
export const LUCIDE_ICONS: Record<string, React.ElementType> = {
  eye: Eye,
  apps: LayoutGrid,
  lightbulb: Lightbulb,
  wifi: Wifi,
  film: Film,
  clock: Clock,
  activity: Activity,
  moon: Moon,
  monitor: Monitor,
  smile: Smile,
  database: Database,
  zap: Zap,
  "hand-pointer": Pointer,
  layers: Layers,
  "message-square": MessageSquare,
  shield: Shield,
  video: Video,
  mail: Mail,
  paperclip: Paperclip,
  edit: Edit,
  hash: Hash,
  smartphone: Smartphone,
  cpu: Cpu,
  mic: Mic,
  github: Github,
  linkedin: Linkedin,
  tv: Tv,
  music: Music,
  book: BookOpen,
  terminal: TerminalIcon,
  trophy: Trophy,
  "map-pin": MapPin,
  external: ExternalLink,
  hashnode: BookOpenText,
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<Project["status"], string> = {
  Completed: "bg-green-600/20 text-green-400 border-green-600/30",
  "In Progress": "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  "Hackathon Finalist": "bg-blue-600/20 text-blue-400 border-blue-600/30",
};

// ─── Tech stack grouped ───────────────────────────────────────────────────────
function TechGroupsSection({ groups }: { groups: TechGroup[] }) {
  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group.category}>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            {group.category}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <span
                key={item}
                className="px-2.5 py-1 bg-gray-800 text-gray-300 rounded-md text-xs font-medium border border-gray-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Flat tech badges fallback
function TechBadges({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t}
          className="px-2.5 py-1 bg-blue-600/10 text-blue-400 rounded-md text-xs font-medium border border-blue-600/20"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

// ─── Feature cards ────────────────────────────────────────────────────────────
function FeatureCards({ features }: { features: FeatureCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {features.map((f) => {
        const isLucideIcon = f.icon && f.icon in LUCIDE_ICONS;
        const IconComponent = isLucideIcon ? LUCIDE_ICONS[f.icon] : null;

        return (
          <div
            key={f.title}
            className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              {IconComponent ? (
                <IconComponent className="w-5 h-5 text-blue-400" />
              ) : (
                <span className="text-xl">{f.icon}</span>
              )}
              <h4 className="text-sm font-semibold text-white leading-tight">
                {f.title}
              </h4>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              {f.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Challenge accordion ──────────────────────────────────────────────────────
function ChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
      <div className="p-4 space-y-3">
        <h4 className="text-sm font-semibold text-white flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
          {challenge.title}
        </h4>
        <div className="space-y-2 pl-6">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-1">
              Problem
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              {challenge.problem}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-green-600 font-medium mb-1">
              Solution
            </p>
            <p className="text-gray-300 text-xs leading-relaxed flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
              {challenge.solution}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Results metrics ─────────────────────────────────────────────────────────

function ResultCards({ results }: { results: Result[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {results.map((r) => {
        const isLucideIcon = r.icon && r.icon in LUCIDE_ICONS;
        const IconComponent = isLucideIcon ? LUCIDE_ICONS[r.icon!] : null;

        return (
          <div
            key={r.metric}
            className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-4 text-center"
          >
            {r.icon && (
              <div className="flex justify-center mb-1">
                {IconComponent ? (
                  <IconComponent className="w-6 h-6 text-blue-400" />
                ) : (
                  <span className="text-2xl">{r.icon}</span>
                )}
              </div>
            )}
            <div className="text-xl font-bold text-white">{r.metric}</div>
            <div className="text-[11px] text-gray-400 mt-0.5 leading-tight">
              {r.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Related project card ─────────────────────────────────────────────────────
function RelatedCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block bg-gray-800/60 border border-gray-700 rounded-xl p-4 hover:border-blue-500/50 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
            {project.name}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {project.category}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-0.5" />
      </div>
      {project.tagline && (
        <p className="text-xs text-gray-400 mt-2 line-clamp-2">
          {project.tagline}
        </p>
      )}
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface ProjectDetailProps {
  project: Project;
  /** If true, renders with standalone page chrome (navbar etc) */
  standalone?: boolean;
}

export default function ProjectDetail({
  project,
  standalone = false,
}: ProjectDetailProps) {
  const related =
    project.relatedProjects
      ?.map((id) => projects.find((p) => p.id === id))
      .filter((p): p is Project => !!p) ?? [];

  return (
    <div
      className={`${standalone ? "min-h-screen bg-gray-950" : "h-full overflow-y-auto"} text-white`}
    >
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Status + category */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[project.status]}`}
            >
              {project.status}
            </span>
            <span className="text-gray-500 text-xs">{project.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            {project.name}
          </h1>

          {/* Tagline */}
          {project.tagline && (
            <p className="text-gray-400 text-base leading-relaxed">
              {project.tagline}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {project.date}
            </span>
            {project.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {project.duration}
              </span>
            )}
            {project.teamSize && (
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {project.teamSize}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Demo
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                Source Code
              </a>
            )}
            {standalone && (
              <Link
                href="/"
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors ml-auto"
              >
                ← Portfolio
              </Link>
            )}
          </div>
        </motion.div>

        {/* ── Media carousel ── */}
        {project.media.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <MediaCarousel items={project.media} projectName={project.name} />
          </motion.div>
        )}

        <Divider />

        {/* ── Problem & Solution ── */}
        {(project.problem || project.solution) && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.problem && (
                <Section icon={AlertCircle} title="The Problem" delay={0.15}>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {project.problem}
                  </p>
                </Section>
              )}
              {project.solution && (
                <Section icon={Lightbulb} title="The Solution" delay={0.2}>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {project.solution}
                  </p>
                </Section>
              )}
            </div>
            <Divider />
          </>
        )}

        {/* ── Tech Stack ── */}
        <Section icon={Wrench} title="Tech Stack" delay={0.22}>
          {project.techGroups ? (
            <TechGroupsSection groups={project.techGroups} />
          ) : (
            <TechBadges items={project.tech} />
          )}
        </Section>

        <Divider />

        {/* ── Architecture ── */}
        {(project.architectureDiagram || project.architectureDescription) && (
          <>
            <Section icon={Wrench} title="Architecture" delay={0.24}>
              {project.architectureDiagram && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.architectureDiagram}
                  alt="Architecture diagram"
                  className="w-full rounded-xl border border-gray-700"
                  loading="lazy"
                />
              )}
              {project.architectureDescription && (
                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.architectureDescription}
                </p>
              )}
            </Section>
            <Divider />
          </>
        )}

        {/* ── Features Deep Dive ── */}
        {project.featuresDeep && project.featuresDeep.length > 0 && (
          <>
            <Section icon={Star} title="Key Features" delay={0.26}>
              <FeatureCards features={project.featuresDeep} />
            </Section>
            <Divider />
          </>
        )}

        {/* ── My Role ── */}
        {(project.myRole ||
          (project.contributions && project.contributions.length > 0)) && (
          <>
            <Section icon={Users} title="My Role" delay={0.28}>
              {project.myRole && (
                <p className="text-gray-400 text-sm leading-relaxed">
                  {project.myRole}
                </p>
              )}
              {project.contributions && project.contributions.length > 0 && (
                <ul className="space-y-2 mt-3">
                  {project.contributions.map((c) => (
                    <li
                      key={c}
                      className="flex items-start gap-2 text-sm text-gray-300"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </Section>
            <Divider />
          </>
        )}

        {/* ── Challenges ── */}
        {project.challenges && project.challenges.length > 0 && (
          <>
            <Section
              icon={AlertCircle}
              title="Challenges & Solutions"
              delay={0.3}
            >
              <div className="space-y-3">
                {project.challenges.map((c) => (
                  <ChallengeCard key={c.title} challenge={c} />
                ))}
              </div>
            </Section>
            <Divider />
          </>
        )}

        {/* ── Results ── */}
        {(project.results || project.resultsDescription) && (
          <>
            <Section icon={Trophy} title="Results & Impact" delay={0.32}>
              {project.results && <ResultCards results={project.results} />}
              {project.resultsDescription && (
                <p className="text-gray-400 text-sm leading-relaxed mt-3">
                  {project.resultsDescription}
                </p>
              )}
            </Section>
            <Divider />
          </>
        )}

        {/* ── Learnings ── */}
        {project.learnings && (
          <>
            <Section icon={BookOpen} title="What I Learned" delay={0.34}>
              <p className="text-gray-400 text-sm leading-relaxed">
                {project.learnings}
              </p>
            </Section>
            <Divider />
          </>
        )}

        {/* ── Future Plans ── */}
        {project.futurePlans && (
          <>
            <Section icon={Rocket} title="What's Next" delay={0.36}>
              <p className="text-gray-400 text-sm leading-relaxed">
                {project.futurePlans}
              </p>
            </Section>
            <Divider />
          </>
        )}

        {/* ── Related Projects ── */}
        {related.length > 0 && (
          <Section icon={ArrowRight} title="Related Projects" delay={0.38}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((p) => (
                <RelatedCard key={p.id} project={p} />
              ))}
            </div>
          </Section>
        )}

        {/* Bottom padding for mobile */}
        <div className="h-6" />
      </div>
    </div>
  );
}
