import { LifeEntryStatus } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || "entry";
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(String).map((item) => item.trim()).filter(Boolean))];
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await prisma.lifeEntry.findMany({
    orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
    include: {
      type: true,
      clusters: { include: { cluster: true }, orderBy: { sortOrder: "asc" } },
      media: { include: { media: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const typeSlug = String(body.typeSlug ?? "").trim();
    const clusterSlugs = asStringArray(body.clusterSlugs);

    if (!title || !typeSlug || clusterSlugs.length === 0) {
      return NextResponse.json(
        { error: "title, typeSlug, and at least one clusterSlug are required." },
        { status: 400 },
      );
    }

    const [contentType, clusters] = await Promise.all([
      prisma.lifeContentType.findUnique({ where: { slug: typeSlug, isActive: true } }),
      prisma.lifeCluster.findMany({ where: { slug: { in: clusterSlugs } } }),
    ]);

    if (!contentType) {
      return NextResponse.json({ error: `Unknown content type: ${typeSlug}` }, { status: 400 });
    }
    if (clusters.length !== clusterSlugs.length) {
      return NextResponse.json({ error: "One or more cluster slugs are invalid." }, { status: 400 });
    }

    const occurredAt = body.occurredAt ? new Date(String(body.occurredAt)) : null;
    if (occurredAt && Number.isNaN(occurredAt.getTime())) {
      return NextResponse.json({ error: "occurredAt must be a valid date." }, { status: 400 });
    }

    const entry = await prisma.lifeEntry.create({
      data: {
        externalKey: body.externalKey ? String(body.externalKey).trim() : null,
        slug: String(body.slug ?? slugify(title)).trim(),
        typeId: contentType.id,
        title,
        content: body.content ? String(body.content) : null,
        excerpt: body.excerpt ? String(body.excerpt) : null,
        occurredAt,
        location: body.location ? String(body.location) : null,
        sourceUrl: body.sourceUrl ? String(body.sourceUrl) : null,
        status: LifeEntryStatus.Draft,
        metadata: body.metadata == null ? undefined : JSON.parse(JSON.stringify(body.metadata)),
        clusters: {
          create: clusters.map((cluster, index) => ({
            clusterId: cluster.id,
            isPrimary: index === 0,
            sortOrder: index,
          })),
        },
      },
      include: {
        type: true,
        clusters: { include: { cluster: true } },
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Failed to create LifeGraph entry:", error);
    return NextResponse.json(
      { error: "Failed to create LifeGraph entry." },
      { status: 500 },
    );
  }
}
