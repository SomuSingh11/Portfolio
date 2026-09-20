import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function jsonValue(value: unknown) {
  return value == null ? null : JSON.parse(JSON.stringify(value));
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.lifeGraphSettings.findUnique({
    where: { id: "default" },
    include: { customSvgMedia: true },
  });

  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = await prisma.lifeGraphSettings.upsert({
      where: { id: "default" },
      update: {
        defaultZoom: body.defaultZoom === undefined ? undefined : Number(body.defaultZoom),
        clusterSpacing: body.clusterSpacing === undefined ? undefined : Number(body.clusterSpacing),
        entrySpacing: body.entrySpacing === undefined ? undefined : Number(body.entrySpacing),
        backgroundColor: body.backgroundColor === undefined ? undefined : body.backgroundColor ? String(body.backgroundColor) : null,
        edgeColor: body.edgeColor === undefined ? undefined : body.edgeColor ? String(body.edgeColor) : null,
        nodeStyle: body.nodeStyle === undefined ? undefined : jsonValue(body.nodeStyle),
        edgeStyle: body.edgeStyle === undefined ? undefined : jsonValue(body.edgeStyle),
        customSvgMediaId: body.customSvgMediaId === undefined
          ? undefined
          : body.customSvgMediaId ? String(body.customSvgMediaId) : null,
      },
      create: {
        id: "default",
        defaultZoom: Number(body.defaultZoom ?? 1),
        clusterSpacing: Number(body.clusterSpacing ?? 130),
        entrySpacing: Number(body.entrySpacing ?? 46),
        backgroundColor: body.backgroundColor ? String(body.backgroundColor) : null,
        edgeColor: body.edgeColor ? String(body.edgeColor) : null,
        nodeStyle: jsonValue(body.nodeStyle),
        edgeStyle: jsonValue(body.edgeStyle),
        customSvgMediaId: body.customSvgMediaId ? String(body.customSvgMediaId) : null,
      },
      include: { customSvgMedia: true },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to update LifeGraph settings:", error);
    return NextResponse.json(
      { error: "Failed to update LifeGraph settings." },
      { status: 400 },
    );
  }
}
