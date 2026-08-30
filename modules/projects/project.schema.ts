import { z } from "zod";

export const ProjectStatusSchema = z.enum([
  "Completed",
  "In Progress",
  "Hackathon Finalist",
]);

export const ProjectMediaSchema = z.object({
  type: z.enum(["image", "gif", "video", "youtube"]),
  src: z.string().min(1),
  alt: z.string().optional(),
  poster: z.string().optional(),
});

export const ProjectTechGroupSchema = z.object({
  category: z.string().min(1),
  items: z.array(z.string().min(1)),
});

export const ProjectFeatureSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  media: ProjectMediaSchema.optional(),
});

export const ProjectChallengeSchema = z.object({
  title: z.string().min(1),
  problem: z.string().min(1),
  solution: z.string().min(1),
});

export const ProjectResultSchema = z.object({
  metric: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().optional(),
});

export const ProjectSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  status: ProjectStatusSchema,
  date: z.string().min(1),
  description: z.string().min(1),
  tech: z.array(z.string().min(1)),
  demo: z.string().url().or(z.literal("")),
  repo: z.string().url().or(z.literal("")),
  media: z.array(ProjectMediaSchema).default([]),
  tagline: z.string().optional(),
  duration: z.string().optional(),
  teamSize: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  techGroups: z.array(ProjectTechGroupSchema).optional(),
  architectureDiagram: z.string().optional(),
  architectureDescription: z.string().optional(),
  featuresDeep: z.array(ProjectFeatureSchema).optional(),
  myRole: z.string().optional(),
  contributions: z.array(z.string()).optional(),
  challenges: z.array(ProjectChallengeSchema).optional(),
  results: z.array(ProjectResultSchema).optional(),
  resultsDescription: z.string().optional(),
  learnings: z.string().optional(),
  futurePlans: z.string().optional(),
  relatedProjects: z.array(z.number()).optional(),
  published: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;