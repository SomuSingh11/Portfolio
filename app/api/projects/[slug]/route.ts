import { NextResponse } from "next/server";

import { getPublishedProjectBySlug } from "@/lib/project-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const project = await getPublishedProjectBySlug(slug);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to load published project", error);
    return NextResponse.json(
      { error: "Failed to load project" },
      { status: 500 },
    );
  }
}
