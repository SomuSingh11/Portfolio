import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function resolveImageMediaId(
  imageUrl?: string | null,
  width?: number | null,
  height?: number | null,
): Promise<string | null | undefined> {
  if (imageUrl === undefined) return undefined;
  const url = imageUrl?.trim();
  if (!url) return null;

  const isSvg = url.toLowerCase().endsWith(".svg") || url.toLowerCase().includes("svg");
  const media = await prisma.mediaAsset.upsert({
    where: {
      provider_publicId: { provider: "url", publicId: url },
    },
    create: {
      provider: "url",
      publicId: url,
      resourceType: isSvg ? "Svg" : "Image",
      secureUrl: url,
    },
    update: {
      secureUrl: url,
      width: width ?? undefined,
      height: height ?? undefined,
    },
  });

  return media.id;
}

async function resolveParentId(parentSlug?: string | null, currentId?: string) {
  if (!parentSlug) return null;
  let parent = await prisma.lifeCluster.findUnique({ where: { slug: parentSlug } });
  const selectedParentId = parent?.id ?? null;
  const visited = new Set<string>();

  while (parent) {
    if (parent.id === currentId || visited.has(parent.id)) return null;
    visited.add(parent.id);
    if (!parent.parentId) return selectedParentId;
    parent = await prisma.lifeCluster.findUnique({ where: { id: parent.parentId } });
  }

  return null;
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
  const cluster = await prisma.lifeCluster.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      imageMedia: true,
      parent: true,
      entries: {
        include: { entry: true },
        orderBy: { sortOrder: "asc" },
      },
      relationsFrom: { include: { to: true } },
      relationsTo: { include: { from: true } },
    },
  });

  if (!cluster) {
    return NextResponse.json({ error: "LifeGraph cluster not found." }, { status: 404 });
  }

  return NextResponse.json(cluster);
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
    const existing = await prisma.lifeCluster.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    if (!existing) {
      return NextResponse.json({ error: "LifeGraph cluster not found." }, { status: 404 });
    }

    const body = await request.json();
    const rawImageUrl = body.imageUrl ?? body.imageMediaUrl;
    const imageMediaId = await resolveImageMediaId(
      rawImageUrl,
      body.imageWidth === undefined ? undefined : body.imageWidth == null ? null : Number(body.imageWidth),
      body.imageHeight === undefined ? undefined : body.imageHeight == null ? null : Number(body.imageHeight),
    );
    const parentId = body.parentSlug === undefined
      ? undefined
      : await resolveParentId(body.parentSlug, existing.id);
    if (body.parentSlug && !parentId) {
      return NextResponse.json({ error: "Parent cluster was not found or is invalid." }, { status: 400 });
    }

    const cluster = await prisma.lifeCluster.update({
      where: { id: existing.id },
      data: {
        slug: body.slug === undefined ? existing.slug : String(body.slug).trim(),
        name: body.name === undefined ? existing.name : String(body.name).trim(),
        description: body.description === undefined
          ? existing.description
          : body.description ? String(body.description) : null,
        color: body.color === undefined ? existing.color : String(body.color),
        sortOrder: body.sortOrder === undefined ? existing.sortOrder : Number(body.sortOrder),
        published: body.published === undefined ? existing.published : Boolean(body.published),
        ...(parentId !== undefined && { parentId }),
        ...(imageMediaId !== undefined && { imageMediaId }),
      },
      include: {
        imageMedia: true,
      },
    });

    return NextResponse.json(cluster);
  } catch (error) {
    console.error("Failed to update LifeGraph cluster:", error);
    return NextResponse.json(
      { error: "Failed to update LifeGraph cluster." },
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
  const cluster = await prisma.lifeCluster.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { _count: { select: { entries: true, relationsFrom: true, relationsTo: true } } },
  });

  if (!cluster) {
    return NextResponse.json({ error: "LifeGraph cluster not found." }, { status: 404 });
  }

  if (cluster._count.entries > 0) {
    return NextResponse.json(
      { error: "Cannot delete a cluster that still contains entries." },
      { status: 409 },
    );
  }

  await prisma.lifeCluster.delete({ where: { id: cluster.id } });
  return NextResponse.json({ success: true });
}
