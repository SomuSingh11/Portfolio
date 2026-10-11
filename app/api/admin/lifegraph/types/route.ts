import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const types = await prisma.lifeContentType.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { entries: true } } },
  });

  return NextResponse.json(types);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug = String(body.slug ?? "").trim().toLowerCase();
    const label = String(body.label ?? "").trim();

    if (!slug || !label) {
      return NextResponse.json({ error: "slug and label are required." }, { status: 400 });
    }

    const type = await prisma.lifeContentType.create({
      data: {
        slug,
        label,
        description: body.description ? String(body.description) : null,
        icon: body.icon ? String(body.icon) : null,
        color: body.color ? String(body.color) : null,
        fieldSchema: body.fieldSchema == null ? undefined : JSON.parse(JSON.stringify(body.fieldSchema)),
        isSystem: false,
        isActive: body.isActive !== false,
        sortOrder: Number(body.sortOrder ?? 0),
      },
    });

    return NextResponse.json(type, { status: 201 });
  } catch (error) {
    console.error("Failed to create LifeGraph content type:", error);
    return NextResponse.json(
      { error: "Failed to create content type. The slug may already exist." },
      { status: 409 },
    );
  }
}
