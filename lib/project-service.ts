import "server-only";

import { prisma } from "@/lib/db";

export type MediaType = "image" | "gif" | "video" | "youtube";

export interface MediaItem {
  type: MediaType;
  src: string;
  alt?: string;
  poster?: string;
}

export interface TechGroup {
  category: string;
  items: string[];
}

export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  media?: MediaItem;
}

export interface Challenge {
  title: string;
  problem: string;
  solution: string;
}

export interface Result {
  metric: string;
  label: string;
  icon?: string;
}

export type ProjectStatus = "Completed" | "In Progress" | "Hackathon Finalist";

export type ProjectRecord = {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: ProjectStatus;
  date: string;
  description: string;
  tagline: string | null;
  tech: string[];
  demo: string;
  repo: string;
  published: boolean;
  sortOrder: number;
  media: MediaItem[];
  techGroups?: TechGroup[];
  featuresDeep?: FeatureCard[];
  challenges?: Challenge[];
  results?: Result[];
  duration?: string | null;
  teamSize?: string | null;
  problem?: string | null;
  solution?: string | null;
  architectureDiagram?: string | null;
  architectureDescription?: string | null;
  myRole?: string | null;
  contributions?: string[];
  resultsDescription?: string | null;
  learnings?: string | null;
  futurePlans?: string | null;
  relatedProjects?: string[];
};

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(String);
      }
    } catch {
      // ignore malformed JSON and fall back to comma splitting
    }

    return trimmed
      .replace(/[\[\]"']+/g, "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeMedia(value: unknown): MediaItem[] {
  return asArray(value)
    .map((item) => {
      const media = item as Record<string, unknown>;
      const rawType = typeof media.type === "string" ? media.type : "image";
      const type: MediaType = rawType === "gif" || rawType === "video" || rawType === "youtube"
        ? rawType
        : "image";

      return {
        type,
        src: typeof media.src === "string" ? media.src : "",
        alt: typeof media.alt === "string" ? media.alt : undefined,
        poster: typeof media.poster === "string" ? media.poster : undefined,
      };
    })
    .filter((item) => Boolean(item.src));
}

function normalizeProject(project: any): ProjectRecord {
  const status = project.status;

  return {
    id: String(project.id),
    slug: String(project.slug),
    name: String(project.name),
    category: String(project.category),
    status:
      status === "Completed"
        ? "Completed"
        : status === "InProgress"
          ? "In Progress"
          : status === "HackathonFinalist"
            ? "Hackathon Finalist"
            : "In Progress",
    date: String(project.date ?? ""),
    description: String(project.description ?? ""),
    tagline: project.tagline ?? null,
    tech: normalizeStringArray(project.tech),
    demo: String(project.demo ?? ""),
    repo: String(project.repo ?? ""),
    published: Boolean(project.published),
    sortOrder: Number(project.sortOrder ?? 0),
    media: normalizeMedia(project.media),
    techGroups: asArray(project.techGroups) as TechGroup[],
    featuresDeep: asArray(project.featuresDeep) as FeatureCard[],
    challenges: asArray(project.challenges) as Challenge[],
    results: asArray(project.results) as Result[],
    duration: project.duration ?? null,
    teamSize: project.teamSize ?? null,
    problem: project.problem ?? null,
    solution: project.solution ?? null,
    architectureDiagram: project.architectureDiagram ?? null,
    architectureDescription: project.architectureDescription ?? null,
    myRole: project.myRole ?? null,
    contributions: normalizeStringArray(project.contributions),
    resultsDescription: project.resultsDescription ?? null,
    learnings: project.learnings ?? null,
    futurePlans: typeof project.futurePlans === "string" ? project.futurePlans : project.futurePlans ?? null,
    relatedProjects: normalizeStringArray(project.relatedProjects),
  };
}

export async function getPublishedProjects() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  return projects.map(normalizeProject);
}

export async function getPublishedProjectBySlug(slug: string) {
  const project = await prisma.project.findFirst({
    where: {
      slug,
      published: true,
    },
  });

  if (!project) return null;
  return normalizeProject(project);
}
