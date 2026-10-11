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
    const existing = await prisma.lifeContentType.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "LifeGraph content type not found." }, { status: 404 });
    }

    const body = await request.json();
    const type = await prisma.lifeContentType.update({
      where: { id },
      data: {
        slug: body.slug === undefined ? existing.slug : String(body.slug).trim().toLowerCase(),
        label: body.label === undefined ? existing.label : String(body.label).trim(),
        description: body.description === undefined ? existing.description : body.description ? String(body.description) : null,
        icon: body.icon === undefined ? existing.icon : body.icon ? String(body.icon) : null,
        color: body.color === undefined ? existing.color : body.color ? String(body.color) : null,
        fieldSchema: body.fieldSchema === undefined
          ? existing.fieldSchema
          : body.fieldSchema == null ? null : JSON.parse(JSON.stringify(body.fieldSchema)),
        isActive: body.isActive === undefined ? existing.isActive : Boolean(body.isActive),
        sortOrder: body.sortOrder === undefined ? existing.sortOrder : Number(body.sortOrder),
      },
    });

    return NextResponse.json(type);
  } catch (error) {
    console.error("Failed to update LifeGraph content type:", error);
    return NextResponse.json(
      { error: "Failed to update content type." },
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
  const type = await prisma.lifeContentType.findUnique({
    where: { id },
    include: { _count: { select: { entries: true } } },
  });

  if (!type) {
    return NextResponse.json({ error: "LifeGraph content type not found." }, { status: 404 });
  }
  if (type.isSystem) {
    return NextResponse.json({ error: "System content types cannot be deleted." }, { status: 409 });
  }
  if (type._count.entries > 0) {
    return NextResponse.json({ error: "Cannot delete a content type that has entries." }, { status: 409 });
  }

  await prisma.lifeContentType.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
