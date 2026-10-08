import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || "cluster";
}

async function resolveImageMediaId(
  imageUrl?: string | null,
  width?: number | null,
  height?: number | null,
): Promise<string | null> {
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

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clusters = await prisma.lifeCluster.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      imageMedia: true,
      _count: { select: { entries: true, relationsFrom: true, relationsTo: true } },
    },
  });

  return NextResponse.json(clusters);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    if (!name) {
      return NextResponse.json({ error: "Cluster name is required." }, { status: 400 });
    }

    const imageMediaId = await resolveImageMediaId(
      body.imageUrl ?? body.imageMediaUrl,
      body.imageWidth == null ? null : Number(body.imageWidth),
      body.imageHeight == null ? null : Number(body.imageHeight),
    );

    const cluster = await prisma.lifeCluster.create({
      data: {
        slug: String(body.slug ?? slugify(name)).trim(),
        name,
        description: body.description ? String(body.description) : null,
        color: String(body.color ?? "#4FA8A0"),
        sortOrder: Number(body.sortOrder ?? 0),
        published: body.published !== false,
        imageMediaId,
      },
      include: {
        imageMedia: true,
      },
    });

    return NextResponse.json(cluster, { status: 201 });
  } catch (error) {
    console.error("Failed to create LifeGraph cluster:", error);
    return NextResponse.json(
      { error: "Failed to create LifeGraph cluster." },
      { status: 500 },
    );
  }
}
