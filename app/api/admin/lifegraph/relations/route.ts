import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function normalizedPair(first: string, second: string) {
  return [first, second].sort((a, b) => a.localeCompare(b)) as [string, string];
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const relations = await prisma.lifeClusterRelation.findMany({
    orderBy: { createdAt: "asc" },
    include: { from: true, to: true },
  });

  return NextResponse.json(relations);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const firstSlug = String(body.fromSlug ?? "").trim();
    const secondSlug = String(body.toSlug ?? "").trim();

    if (!firstSlug || !secondSlug || firstSlug === secondSlug) {
      return NextResponse.json(
        { error: "Two different cluster slugs are required." },
        { status: 400 },
      );
    }

    const clusters = await prisma.lifeCluster.findMany({
      where: { slug: { in: [firstSlug, secondSlug] } },
    });
    if (clusters.length !== 2) {
      return NextResponse.json({ error: "Both clusters must exist." }, { status: 400 });
    }

    const [fromSlug, toSlug] = normalizedPair(firstSlug, secondSlug);
    const from = clusters.find((cluster) => cluster.slug === fromSlug)!;
    const to = clusters.find((cluster) => cluster.slug === toSlug)!;

    const relation = await prisma.lifeClusterRelation.create({
      data: {
        fromId: from.id,
        toId: to.id,
        label: body.label ? String(body.label) : null,
        weight: Number(body.weight ?? 1),
        strength: Number(body.strength ?? 1),
        color: body.color ? String(body.color) : null,
        metadata: body.metadata == null ? undefined : JSON.parse(JSON.stringify(body.metadata)),
      },
      include: { from: true, to: true },
    });

    return NextResponse.json(relation, { status: 201 });
  } catch (error) {
    console.error("Failed to create LifeGraph relation:", error);
    return NextResponse.json(
      { error: "Failed to create LifeGraph relation. The pair may already exist." },
      { status: 409 },
    );
  }
}
