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
  if (status in statusMap) return status as keyof typeof statusMap;
  return "InProgress" as const;
}

function asJsonArray(value: unknown) {
  if (Array.isArray(value)) {
    return JSON.parse(JSON.stringify(value));
  }
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

export async function GET(
    _req: NextRequest,
    {params}: {params: Promise<{id: string}>}
) {
    const session = await auth();
    if(!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id },
    });
    if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id } = await params;

  const existing = await prisma.project.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const status = normalizeStatus(body.status ?? existing.status);

  const project = await prisma.project.update({
    where: { id },
    data: {
      slug: body.slug ? String(body.slug) : existing.slug,
      name: body.name ? String(body.name).trim() : existing.name,
      category: body.category ? String(body.category) : existing.category,
      status: statusMap[status],
      date: body.date ? String(body.date) : existing.date,
      description:
        body.description !== undefined
          ? String(body.description)
          : existing.description,
      tagline:
        body.tagline !== undefined
          ? body.tagline
            ? String(body.tagline)
            : null
          : existing.tagline,
      tech:
        body.tech !== undefined
          ? normalizeStringArray(body.tech)
          : existing.tech,
      demo: body.demo !== undefined ? String(body.demo) : existing.demo,
      repo: body.repo !== undefined ? String(body.repo) : existing.repo,
      published:
        body.published !== undefined
          ? Boolean(body.published)
          : existing.published,
      sortOrder:
        body.sortOrder !== undefined
          ? Number(body.sortOrder)
          : existing.sortOrder,
      media:
        body.media !== undefined
          ? asJsonArray(body.media)
          : existing.media ?? [],
      techGroups:
        body.techGroups !== undefined
          ? asJsonArray(body.techGroups)
          : existing.techGroups ?? [],
      featuresDeep:
        body.featuresDeep !== undefined
          ? asJsonArray(body.featuresDeep)
          : existing.featuresDeep ?? [],
      challenges:
        body.challenges !== undefined
          ? asJsonArray(body.challenges)
          : existing.challenges ?? [],
      results:
        body.results !== undefined ? asJsonArray(body.results) : existing.results ?? [],
      duration:
        body.duration !== undefined
          ? body.duration
            ? String(body.duration)
            : null
          : existing.duration,
      teamSize:
        body.teamSize !== undefined
          ? body.teamSize
            ? String(body.teamSize)
            : null
          : existing.teamSize,
      problem:
        body.problem !== undefined
          ? body.problem
            ? String(body.problem)
            : null
          : existing.problem,
      solution:
        body.solution !== undefined
          ? body.solution
            ? String(body.solution)
            : null
          : existing.solution,
      architectureDiagram:
        body.architectureDiagram !== undefined
          ? body.architectureDiagram
            ? String(body.architectureDiagram)
            : null
          : existing.architectureDiagram,
      architectureDescription:
        body.architectureDescription !== undefined
          ? body.architectureDescription
            ? String(body.architectureDescription)
            : null
          : existing.architectureDescription,
      myRole:
        body.myRole !== undefined
          ? body.myRole
            ? String(body.myRole)
            : null
          : existing.myRole,
      contributions:
        body.contributions !== undefined
          ? normalizeStringArray(body.contributions)
          : existing.contributions,
      resultsDescription:
        body.resultsDescription !== undefined
          ? body.resultsDescription
            ? String(body.resultsDescription)
            : null
          : existing.resultsDescription,
      learnings:
        body.learnings !== undefined
          ? String(body.learnings)
          : existing.learnings,
      futurePlans:
        body.futurePlans !== undefined
          ? body.futurePlans
            ? String(body.futurePlans)
            : null
          : existing.futurePlans,
      relatedProjects:
        body.relatedProjects !== undefined
          ? await resolveRelatedProjectSlugs(body.relatedProjects)
          : existing.relatedProjects,
    },
  });

  return NextResponse.json(project);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.project.delete({ where: { id } });

  return NextResponse.json({ success: true });
}