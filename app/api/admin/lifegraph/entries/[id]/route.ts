import { LifeEntryStatus } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(String).map((item) => item.trim()).filter(Boolean))];
}

function normalizeStatus(value: unknown) {
  const status = String(value ?? LifeEntryStatus.Draft);
  return Object.values(LifeEntryStatus).includes(status as LifeEntryStatus)
    ? (status as LifeEntryStatus)
    : null;
}

function serializeMetadata(value: unknown) {
  return value == null ? null : JSON.parse(JSON.stringify(value));
}

async function findEntry(id: string) {
  return prisma.lifeEntry.findFirst({
    where: {
      OR: [{ id }, { externalKey: id }],
    },
    include: {
      type: true,
      clusters: {
        include: { cluster: true },
        orderBy: { sortOrder: "asc" },
      },
      media: {
        include: { media: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const entry = await findEntry(id);

  if (!entry) {
    return NextResponse.json({ error: "LifeGraph entry not found." }, { status: 404 });
  }

  return NextResponse.json(entry);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const existing = await findEntry(id);

    if (!existing) {
      return NextResponse.json({ error: "LifeGraph entry not found." }, { status: 404 });
    }

    const typeSlug = body.typeSlug === undefined ? existing.type.slug : String(body.typeSlug).trim();
    const type = await prisma.lifeContentType.findUnique({ where: { slug: typeSlug } });
    if (!type || !type.isActive) {
      return NextResponse.json({ error: `Unknown content type: ${typeSlug}` }, { status: 400 });
    }

    const clusterSlugs = body.clusterSlugs === undefined
      ? null
      : asStringArray(body.clusterSlugs);
    let clusters = null;

    if (clusterSlugs) {
      if (clusterSlugs.length === 0) {
        return NextResponse.json({ error: "At least one cluster is required." }, { status: 400 });
      }
      clusters = await prisma.lifeCluster.findMany({
        where: { slug: { in: clusterSlugs } },
      });
      if (clusters.length !== clusterSlugs.length) {
        return NextResponse.json({ error: "One or more cluster slugs are invalid." }, { status: 400 });
      }
    }

    const status = body.status === undefined
      ? existing.status
      : normalizeStatus(body.status);
    if (!status) {
      return NextResponse.json({ error: "Invalid entry status." }, { status: 400 });
    }

    const occurredAt = body.occurredAt === undefined
      ? existing.occurredAt
      : body.occurredAt
        ? new Date(String(body.occurredAt))
        : null;
    if (occurredAt && Number.isNaN(occurredAt.getTime())) {
      return NextResponse.json({ error: "occurredAt must be a valid date." }, { status: 400 });
    }

    const entry = await prisma.$transaction(async (transaction) => {
      if (clusters) {
        await transaction.lifeEntryCluster.deleteMany({ where: { entryId: existing.id } });
      }

      return transaction.lifeEntry.update({
        where: { id: existing.id },
        data: {
          externalKey: body.externalKey === undefined ? existing.externalKey : body.externalKey ? String(body.externalKey).trim() : null,
          slug: body.slug === undefined ? existing.slug : String(body.slug).trim(),
          typeId: type.id,
          title: body.title === undefined ? existing.title : String(body.title).trim(),
          content: body.content === undefined ? existing.content : body.content ? String(body.content) : null,
          excerpt: body.excerpt === undefined ? existing.excerpt : body.excerpt ? String(body.excerpt) : null,
          occurredAt,
          location: body.location === undefined ? existing.location : body.location ? String(body.location) : null,
          sourceUrl: body.sourceUrl === undefined ? existing.sourceUrl : body.sourceUrl ? String(body.sourceUrl) : null,
          status,
          metadata: body.metadata === undefined ? existing.metadata : serializeMetadata(body.metadata),
          clusters: clusters
            ? {
                create: clusters.map((cluster, index) => ({
                  clusterId: cluster.id,
                  isPrimary: index === 0,
                  sortOrder: index,
                })),
              }
            : undefined,
        },
        include: {
          type: true,
          clusters: { include: { cluster: true } },
          media: { include: { media: true } },
        },
      });
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Failed to update LifeGraph entry:", error);
    return NextResponse.json(
      { error: "Failed to update LifeGraph entry." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await findEntry(id);
  if (!existing) {
    return NextResponse.json({ error: "LifeGraph entry not found." }, { status: 404 });
  }

  await prisma.lifeEntry.delete({ where: { id: existing.id } });
  return NextResponse.json({ success: true });
}
