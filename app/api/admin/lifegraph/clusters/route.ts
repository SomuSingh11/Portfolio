import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || "cluster";
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

    const cluster = await prisma.lifeCluster.create({
      data: {
        slug: String(body.slug ?? slugify(name)).trim(),
        name,
        description: body.description ? String(body.description) : null,
        color: String(body.color ?? "#4FA8A0"),
        sortOrder: Number(body.sortOrder ?? 0),
        published: body.published !== false,
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
