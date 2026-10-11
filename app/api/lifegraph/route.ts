import { LifeEntryStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [clusters, entries, relations, settings] = await Promise.all([
      prisma.lifeCluster.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
        include: { imageMedia: true },
      }),
      prisma.lifeEntry.findMany({
        where: {
          status: LifeEntryStatus.Published,
          clusters: {
            some: {
              cluster: { published: true },
            },
          },
        },
        orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
        include: {
          type: true,
          clusters: {
            where: { cluster: { published: true } },
            include: { cluster: true },
            orderBy: { sortOrder: "asc" },
          },
          media: {
            orderBy: { sortOrder: "asc" },
            include: { media: true },
          },
        },
      }),
      prisma.lifeClusterRelation.findMany({
        where: {
          from: { published: true },
          to: { published: true },
        },
        orderBy: { createdAt: "asc" },
        include: { from: true, to: true },
      }),
      prisma.lifeGraphSettings.findUnique({
        where: { id: "default" },
        include: { customSvgMedia: true },
      }),
    ]);

    return NextResponse.json({
      clusters: clusters.map((cluster) => ({
        id: cluster.slug,
        name: cluster.name,
        description: cluster.description,
        color: cluster.color,
        sortOrder: cluster.sortOrder,
        image: cluster.imageMedia
          ? {
              url: cluster.imageMedia.secureUrl,
              altText: cluster.imageMedia.altText,
            }
          : null,
      })),
      entries: entries.map((entry) => ({
        id: entry.externalKey ?? entry.id,
        slug: entry.slug,
        type: {
          slug: entry.type.slug,
          label: entry.type.label,
          icon: entry.type.icon,
          color: entry.type.color,
        },
        title: entry.title,
        content: entry.content,
        excerpt: entry.excerpt,
        occurredAt: entry.occurredAt,
        location: entry.location,
        sourceUrl: entry.sourceUrl,
        metadata: entry.metadata,
        clusterIds: entry.clusters.map((mapping) => mapping.cluster.slug),
        media: entry.media.map((mapping) => ({
          role: mapping.role,
          url: mapping.media.secureUrl,
          altText: mapping.media.altText,
          width: mapping.media.width,
          height: mapping.media.height,
        })),
      })),
      relations: relations.map((relation) => ({
        id: relation.id,
        source: relation.from.slug,
        target: relation.to.slug,
        label: relation.label,
        weight: relation.weight,
        strength: relation.strength,
        color: relation.color,
      })),
      settings: settings
        ? {
            defaultZoom: settings.defaultZoom,
            clusterSpacing: settings.clusterSpacing,
            entrySpacing: settings.entrySpacing,
            backgroundColor: settings.backgroundColor,
            edgeColor: settings.edgeColor,
            nodeStyle: settings.nodeStyle,
            edgeStyle: settings.edgeStyle,
            customSvg: settings.customSvgMedia
              ? {
                  url: settings.customSvgMedia.secureUrl,
                  altText: settings.customSvgMedia.altText,
                }
              : null,
          }
        : null,
    });
  } catch (error) {
    console.error("Failed to load public LifeGraph data:", error);
    return NextResponse.json(
      { error: "Failed to load LifeGraph data." },
      { status: 500 },
    );
  }
}
