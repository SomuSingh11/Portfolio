import { NextResponse } from "next/server";

import { getPublishedProjects } from "@/lib/project-service";

export async function GET() {
  try {
    const projects = await getPublishedProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to load published projects", error);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 },
    );
  }
}
