import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
    const existing = await prisma.lifeClusterRelation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "LifeGraph relation not found." }, { status: 404 });
    }

    const body = await request.json();
    const relation = await prisma.lifeClusterRelation.update({
      where: { id },
      data: {
        label: body.label === undefined ? existing.label : body.label ? String(body.label) : null,
        weight: body.weight === undefined ? existing.weight : Number(body.weight),
        strength: body.strength === undefined ? existing.strength : Number(body.strength),
        color: body.color === undefined ? existing.color : body.color ? String(body.color) : null,
        metadata: body.metadata === undefined
          ? existing.metadata
          : body.metadata == null ? null : JSON.parse(JSON.stringify(body.metadata)),
      },
      include: { from: true, to: true },
    });

    return NextResponse.json(relation);
  } catch (error) {
    console.error("Failed to update LifeGraph relation:", error);
    return NextResponse.json(
      { error: "Failed to update LifeGraph relation." },
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
  const relation = await prisma.lifeClusterRelation.findUnique({ where: { id } });
  if (!relation) {
    return NextResponse.json({ error: "LifeGraph relation not found." }, { status: 404 });
  }

  await prisma.lifeClusterRelation.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
