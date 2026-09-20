import { LifeEntryStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

function slugify(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || "entry";
}

function asStringArray(value: unknown) {
    if (!Array.isArray(value)) return [];
    return value.map(String).map((item) => item.trim()).filter(Boolean);
}

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

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const title = String(body.title ?? "").trim();
        const typeSlug = String(body.typeSlug ?? "").trim();
        const clusterSlugs = asStringArray(body.clusterSlugs);

        if (!title || !typeSlug || clusterSlugs.length === 0) {
            return NextResponse.json(
                { error: "title, typeSlug, and at least one clusterSlug are required." },
                { status: 400 },
            );
        }

        const [contentType, clusters] = await Promise.all([
            prisma.lifeContentType.findUnique({ where: { slug: typeSlug, isActive: true } }),
            prisma.lifeCluster.findMany({ where: { slug: { in: clusterSlugs } } }),
        ]);

        if (!contentType) {
            return NextResponse.json({ error: `Unknown content type: ${typeSlug}` }, { status: 400 });
        }

        if (clusters.length !== new Set(clusterSlugs).size) {
            return NextResponse.json({ error: "One or more cluster slugs are invalid." }, { status: 400 });
        }

        const slug = String(body.slug ?? slugify(title)).trim();
        const externalKey = body.externalKey ? String(body.externalKey).trim() : null;
        const occurredAt = body.occurredAt ? new Date(String(body.occurredAt)) : null;

        if (occurredAt && Number.isNaN(occurredAt.getTime())) {
            return NextResponse.json({ error: "occurredAt must be a valid date." }, { status: 400 });
        }

        const entry = await prisma.lifeEntry.create({
            data: {
                externalKey,
                slug,
                typeId: contentType.id,
                title,
                content: body.content ? String(body.content) : null,
                excerpt: body.excerpt ? String(body.excerpt) : null,
                occurredAt,
                location: body.location ? String(body.location) : null,
                sourceUrl: body.sourceUrl ? String(body.sourceUrl) : null,
                status: LifeEntryStatus.Draft,
                metadata: body.metadata == null ? undefined : JSON.parse(JSON.stringify(body.metadata)),
                clusters: {
                    create: clusters.map((cluster, index) => ({
                        clusterId: cluster.id,
                        isPrimary: index === 0,
                        sortOrder: index,
                    })),
                },
            },
            include: {
                type: true,
                clusters: { include: { cluster: true } },
            },
        });

        return NextResponse.json(entry, { status: 201 });
    } catch (error) {
        console.error("Failed to create LifeGraph entry:", error);
        return NextResponse.json(
            { error: "Failed to create LifeGraph entry." },
            { status: 500 },
        );
    }
}