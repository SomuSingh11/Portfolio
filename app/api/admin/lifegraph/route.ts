import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [contentTypes, clusters, entries, relations, settings] = await Promise.all([
            prisma.lifeContentType.findMany({
                orderBy: { sortOrder: "asc" },
            }),
            prisma.lifeCluster.findMany({
                orderBy: {
                    sortOrder: "asc",
                },
                include: {
                    imageMedia: true,
                },
            }),
            prisma.lifeEntry.findMany({
                orderBy: [
                    {
                        occurredAt: "desc"
                    },
                    {
                        createdAt: "desc"
                    },
                ],
                include: {
                    type: true,

                    clusters: {
                        include: {
                            cluster: true
                        }, 
                        orderBy: {
                            sortOrder: "asc"
                        },
                    },

                    media: {
                        orderBy: {
                            sortOrder: "asc"
                        },
                        include: {
                            media: true
                        },
                    },
                },
            }),

            prisma.lifeClusterRelation.findMany({
                orderBy: {
                    createdAt: "asc"
                },
                include: {
                    from: true,
                    to: true,
                },
            }),

            prisma.lifeGraphSettings.findUnique({
                where: { id: "default" },
                include: {
                    customSvgMedia: true,
                },
            }),
        ]);

        return NextResponse.json({
            contentTypes: contentTypes.map((contentType) => ({
                id: contentType.id,
                slug: contentType.slug,
                label: contentType.label,
                description: contentType.description,
                icon: contentType.icon,
                color: contentType.color,
                fieldSchema: contentType.fieldSchema,
                isSystem: contentType.isSystem,
                isActive: contentType.isActive,
                sortOrder: contentType.sortOrder,
            })),
            clusters: clusters.map((cluster) => ({
                id: cluster.slug,
                name: cluster.name,
                description: cluster.description,
                color: cluster.color,
                sortOrder: cluster.sortOrder,
                published: cluster.published,

                image: cluster.imageMedia ? {
                    url: cluster.imageMedia.secureUrl,
                    altText: cluster.imageMedia.altText,
                } : null,
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
                status: entry.status,

                clusterIds: entry.clusters.map(
                (entryCluster) => entryCluster.cluster.slug,
                ),

                media: entry.media.map((entryMedia) => ({
                role: entryMedia.role,
                url: entryMedia.media.secureUrl,
                altText: entryMedia.media.altText,
                width: entryMedia.media.width,
                height: entryMedia.media.height,
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
        console.error("Failed to load admin LifeGraph data:", error);
        return NextResponse.json(
            { error: "Failed to load LifeGraph data." },
            { status: 500 },
        );
    }
}