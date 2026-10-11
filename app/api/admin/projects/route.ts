import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const statusMap = {
    Completed: "Completed",
    InProgress: "InProgress",
    HackathonFinalist: "HackathonFinalist",
} as const;

function normalizeStatus(value: unknown) {
    const status = String(value ?? "InProgress");
    if(status in statusMap) return status as keyof typeof statusMap;
    return "InProgress" as const;
}

function slugify(value: string) {
    return (
        value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") || "project"
    );
}

function asJsonArray(value: unknown) {
    if (Array.isArray(value)) return JSON.parse(JSON.stringify(value));
    return [];
}

function normalizeStringArray(value: unknown) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

async function resolveRelatedProjectSlugs(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) return [];

  const projectIds = value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0);

  if (projectIds.length === 0) return [];

  const related = await prisma.project.findMany({
    where: { sortOrder: { in: projectIds } },
    select: { slug: true },
  });

  return related.map((project) => project.slug);
}

export async function GET() {
    const session = await auth();
    if(!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
        orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const name = String(body.name ?? "").trim();

    if(!name) {
        return NextResponse.json(
            { error: "Project name is required" }, 
            { status: 400 }
        );
    }

    const slug = String(body.slug ?? slugify(name)).trim();
    const category = String(body.category ?? "General").trim();
    const description = String(body.description ?? "").trim();

    const project = await prisma.project.create({
        data: {
        slug,
        name,
        category,
        status: statusMap[normalizeStatus(body.status)],
        date: String(body.date ?? new Date().toISOString().slice(0, 10)),
        description,
        tagline: body.tagline ? String(body.tagline) : null,
        tech: normalizeStringArray(body.tech),
        demo: String(body.demo ?? ""),
        repo: String(body.repo ?? ""),
        published: body.published === true,
        sortOrder: Number(body.sortOrder ?? 0),
        media: asJsonArray(body.media),
        techGroups: asJsonArray(body.techGroups),
        featuresDeep: asJsonArray(body.featuresDeep),
        challenges: asJsonArray(body.challenges),
        results: asJsonArray(body.results),
        duration: body.duration ? String(body.duration) : null,
        teamSize: body.teamSize ? String(body.teamSize) : null,
        problem: body.problem ? String(body.problem) : null,
        solution: body.solution ? String(body.solution) : null,
        architectureDiagram: body.architectureDiagram
            ? String(body.architectureDiagram)
            : null,
        architectureDescription: body.architectureDescription
            ? String(body.architectureDescription)
            : null,
        myRole: body.myRole ? String(body.myRole) : null,
        contributions: normalizeStringArray(body.contributions),
        resultsDescription: body.resultsDescription
            ? String(body.resultsDescription)
            : null,
        learnings: body.learnings ? String(body.learnings) : "",
        futurePlans: body.futurePlans ? String(body.futurePlans) : null,
        relatedProjects: await resolveRelatedProjectSlugs(body.relatedProjects),
        },
    });

    return NextResponse.json(project, { status: 201 });
}