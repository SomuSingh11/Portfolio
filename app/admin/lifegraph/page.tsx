"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LifeGraphOverview } from "@/components/admin/lifegraph/lifegraph-overview";
import { EntriesTable, type EntryRow } from "@/components/admin/lifegraph/entries-table";
import { ClustersGrid, type ClusterRow } from "@/components/admin/lifegraph/clusters-grid";
import { RelationsList, type RelationRow } from "@/components/admin/lifegraph/relations-list";
import { ContentTypesGrid, type ContentTypeRow } from "@/components/admin/lifegraph/content-types-grid";
import { EntryFormDialog } from "@/components/admin/lifegraph/entry-form-dialog";
import { ClusterFormDialog } from "@/components/admin/lifegraph/cluster-form-dialog";
import { RelationFormDialog } from "@/components/admin/lifegraph/relation-form-dialog";
import { ContentTypeFormDialog } from "@/components/admin/lifegraph/content-type-form-dialog";
import { ConfirmDeleteDialog } from "@/components/admin/shared/confirm-delete-dialog";
import { Plus, ArrowLeft, BookOpen, Layers, GitBranch, Tag } from "lucide-react";
import toast from "react-hot-toast";

// Raw API shapes
interface RawCluster {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  color: string;
  sortOrder: number;
  published: boolean;
  imageMedia?: { secureUrl: string; width?: number | null; height?: number | null } | null;
  _count?: { entries: number; relationsFrom: number; relationsTo: number };
}

interface RawEntry {
  id: string;
  slug: string;
  externalKey?: string | null;
  title: string;
  status: "Draft" | "Published" | "Archived";
  occurredAt?: string | null;
  location?: string | null;
  sourceUrl?: string | null;
  content?: string | null;
  excerpt?: string | null;
  type: { slug: string; label: string; icon?: string | null; color?: string | null };
  clusters: Array<{ cluster: { slug: string; name: string } }>;
}

interface RawRelation {
  id: string;
  label?: string | null;
  weight: number;
  strength: number;
  color?: string | null;
  from: { slug: string; name: string };
  to: { slug: string; name: string };
}

function rawToEntryRow(e: RawEntry): EntryRow {
  return {
    id: e.id,
    slug: e.slug,
    externalKey: e.externalKey,
    title: e.title,
    status: e.status,
    occurredAt: e.occurredAt,
    location: e.location,
    sourceUrl: e.sourceUrl,
    content: e.content,
    excerpt: e.excerpt,
    type: e.type,
    clusterIds: e.clusters.map((ec) => ec.cluster.slug),
  };
}

function rawToRelationRow(r: RawRelation): RelationRow {
  return {
    id: r.id,
    source: r.from.slug,
    target: r.to.slug,
    label: r.label,
    weight: r.weight,
    strength: r.strength,
    color: r.color,
    fromName: r.from.name,
    toName: r.to.name,
  };
}

export default function AdminLifeGraphPage() {
  const { status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<EntryRow[]>([]);
  const [clusters, setClusters] = useState<ClusterRow[]>([]);
  const [relations, setRelations] = useState<RelationRow[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentTypeRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Entry dialog state
  const [entryFormOpen, setEntryFormOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<EntryRow | null>(null);
  const [deleteEntry, setDeleteEntry] = useState<EntryRow | null>(null);
  const [deleteEntryOpen, setDeleteEntryOpen] = useState(false);

  // Cluster dialog state
  const [clusterFormOpen, setClusterFormOpen] = useState(false);
  const [editCluster, setEditCluster] = useState<ClusterRow | null>(null);
  const [deleteCluster, setDeleteCluster] = useState<ClusterRow | null>(null);
  const [deleteClusterOpen, setDeleteClusterOpen] = useState(false);

  // Relation dialog state
  const [relationFormOpen, setRelationFormOpen] = useState(false);
  const [editRelation, setEditRelation] = useState<RelationRow | null>(null);
  const [deleteRelation, setDeleteRelation] = useState<RelationRow | null>(null);
  const [deleteRelationOpen, setDeleteRelationOpen] = useState(false);

  // Content Type dialog state
  const [typeFormOpen, setTypeFormOpen] = useState(false);
  const [editType, setEditType] = useState<ContentTypeRow | null>(null);
  const [deleteType, setDeleteType] = useState<ContentTypeRow | null>(null);
  const [deleteTypeOpen, setDeleteTypeOpen] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [entriesRes, clustersRes, relationsRes, typesRes] = await Promise.all([
        fetch("/api/admin/lifegraph/entries", { cache: "no-store" }),
        fetch("/api/admin/lifegraph/clusters", { cache: "no-store" }),
        fetch("/api/admin/lifegraph/relations", { cache: "no-store" }),
        fetch("/api/admin/lifegraph/types", { cache: "no-store" }),
      ]);

      if ([entriesRes, clustersRes, relationsRes, typesRes].some((response) => response.status === 401)) {
        router.push("/admin/login");
        return;
      }

      if (!entriesRes.ok || !clustersRes.ok || !relationsRes.ok || !typesRes.ok) {
        throw new Error("Failed to load LifeGraph data");
      }

      const [rawEntries, rawClusters, rawRelations, rawTypes] = await Promise.all([
        entriesRes.json() as Promise<RawEntry[]>,
        clustersRes.json() as Promise<RawCluster[]>,
        relationsRes.json() as Promise<RawRelation[]>,
        typesRes.json() as Promise<ContentTypeRow[]>,
      ]);

      setEntries(rawEntries.map(rawToEntryRow));
      setClusters(rawClusters);
      setRelations(rawRelations.map(rawToRelationRow));
      setContentTypes(rawTypes);
    } catch {
      toast.error("Could not load LifeGraph data");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAll();
    }
  }, [status, fetchAll]);

  if (status === "unauthenticated") {
    router.push("/admin/login");
    return null;
  }

  // ── Entry handlers ─────────────────────────────────────────────────────────
  const openCreateEntry = () => { setEditEntry(null); setEntryFormOpen(true); };
  const openEditEntry = (entry: EntryRow) => { setEditEntry(entry); setEntryFormOpen(true); };
  const openDeleteEntry = (entry: EntryRow) => { setDeleteEntry(entry); setDeleteEntryOpen(true); };
  const handleDeleteEntry = async () => {
    if (!deleteEntry) return;
    const res = await fetch(`/api/admin/lifegraph/entries/${deleteEntry.id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete entry");
    toast.success("Entry deleted");
    await fetchAll();
  };

  // ── Cluster handlers ───────────────────────────────────────────────────────
  const openCreateCluster = () => { setEditCluster(null); setClusterFormOpen(true); };
  const openEditCluster = (cluster: ClusterRow) => { setEditCluster(cluster); setClusterFormOpen(true); };
  const openDeleteCluster = (cluster: ClusterRow) => { setDeleteCluster(cluster); setDeleteClusterOpen(true); };
  const handleDeleteCluster = async () => {
    if (!deleteCluster) return;
    const res = await fetch(`/api/admin/lifegraph/clusters/${deleteCluster.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to delete cluster");
    }
    toast.success("Cluster deleted");
    await fetchAll();
  };

  // ── Relation handlers ──────────────────────────────────────────────────────
  const openCreateRelation = () => { setEditRelation(null); setRelationFormOpen(true); };
  const openEditRelation = (relation: RelationRow) => { setEditRelation(relation); setRelationFormOpen(true); };
  const openDeleteRelation = (relation: RelationRow) => { setDeleteRelation(relation); setDeleteRelationOpen(true); };
  const handleDeleteRelation = async () => {
    if (!deleteRelation) return;
    const res = await fetch(`/api/admin/lifegraph/relations/${deleteRelation.id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete relation");
    toast.success("Relation deleted");
    await fetchAll();
  };

  // ── Content Type handlers ──────────────────────────────────────────────────
  const openCreateType = () => { setEditType(null); setTypeFormOpen(true); };
  const openEditType = (type: ContentTypeRow) => { setEditType(type); setTypeFormOpen(true); };
  const openDeleteType = (type: ContentTypeRow) => { setDeleteType(type); setDeleteTypeOpen(true); };
  const handleDeleteType = async () => {
    if (!deleteType) return;
    const res = await fetch(`/api/admin/lifegraph/types/${deleteType.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to delete content type");
    }
    toast.success("Content type deleted");
    await fetchAll();
  };

  const clusterOptionsForDialog = clusters.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    color: c.color,
  }));

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Admin dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-white">LifeGraph</h1>
          <p className="mt-1.5 text-slate-400">
            Manage entries, clusters, relationships, and content types in your LifeGraph.
          </p>
        </div>

        {/* Overview stats */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl bg-slate-800" />
            ))}
          </div>
        ) : (
          <LifeGraphOverview
            entries={entries}
            clusters={clusters}
            relationsCount={relations.length}
            contentTypesCount={contentTypes.length}
          />
        )}

        {/* Tabs */}
        <Tabs defaultValue="entries" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 h-auto">
            <TabsTrigger
              value="entries"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-400 gap-2 px-4 py-2"
            >
              <BookOpen className="w-4 h-4" />
              Entries
              <span className="ml-1 text-xs opacity-70">({entries.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="clusters"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 gap-2 px-4 py-2"
            >
              <Layers className="w-4 h-4" />
              Clusters
              <span className="ml-1 text-xs opacity-70">({clusters.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="relations"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-slate-400 gap-2 px-4 py-2"
            >
              <GitBranch className="w-4 h-4" />
              Relations
              <span className="ml-1 text-xs opacity-70">({relations.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="types"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-slate-400 gap-2 px-4 py-2"
            >
              <Tag className="w-4 h-4" />
              Content Types
              <span className="ml-1 text-xs opacity-70">({contentTypes.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* ── Entries Tab ───────────────────────────────────────── */}
          <TabsContent value="entries" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-200">All Entries</h2>
              <Button
                onClick={openCreateEntry}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                New Entry
              </Button>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl bg-slate-800" />
                ))}
              </div>
            ) : (
              <EntriesTable
                entries={entries}
                onEdit={openEditEntry}
                onDelete={openDeleteEntry}
              />
            )}
          </TabsContent>

          {/* ── Clusters Tab ──────────────────────────────────────── */}
          <TabsContent value="clusters" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-200">All Clusters</h2>
              <Button
                onClick={openCreateCluster}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                New Cluster
              </Button>
            </div>
            {loading ? (
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-36 rounded-xl bg-slate-800" />
                ))}
              </div>
            ) : (
              <ClustersGrid
                clusters={clusters}
                onEdit={openEditCluster}
                onDelete={openDeleteCluster}
              />
            )}
          </TabsContent>

          {/* ── Relations Tab ─────────────────────────────────────── */}
          <TabsContent value="relations" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-200">All Relations</h2>
              <Button
                onClick={openCreateRelation}
                className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                New Relation
              </Button>
            </div>
            {loading ? (
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-xl bg-slate-800" />
                ))}
              </div>
            ) : (
              <RelationsList
                relations={relations}
                onEdit={openEditRelation}
                onDelete={openDeleteRelation}
              />
            )}
          </TabsContent>

          {/* ── Content Types Tab ─────────────────────────────────── */}
          <TabsContent value="types" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-200">All Content Types</h2>
              <Button
                onClick={openCreateType}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                New Content Type
              </Button>
            </div>
            {loading ? (
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-36 rounded-xl bg-slate-800" />
                ))}
              </div>
            ) : (
              <ContentTypesGrid
                contentTypes={contentTypes}
                onEdit={openEditType}
                onDelete={openDeleteType}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Dialogs ──────────────────────────────────────────────── */}
      <EntryFormDialog
        open={entryFormOpen}
        onOpenChange={setEntryFormOpen}
        entry={editEntry}
        contentTypes={contentTypes}
        clusters={clusterOptionsForDialog}
        onSuccess={fetchAll}
      />
      <ConfirmDeleteDialog
        open={deleteEntryOpen}
        onOpenChange={setDeleteEntryOpen}
        title={`Delete entry "${deleteEntry?.title}"?`}
        description="This will permanently remove the entry from your LifeGraph."
        onConfirm={handleDeleteEntry}
      />

      <ClusterFormDialog
        open={clusterFormOpen}
        onOpenChange={setClusterFormOpen}
        cluster={editCluster}
        onSuccess={fetchAll}
      />
      <ConfirmDeleteDialog
        open={deleteClusterOpen}
        onOpenChange={setDeleteClusterOpen}
        title={`Delete cluster "${deleteCluster?.name}"?`}
        description="Clusters with entries cannot be deleted. Remove all entries first."
        onConfirm={handleDeleteCluster}
      />

      <RelationFormDialog
        open={relationFormOpen}
        onOpenChange={setRelationFormOpen}
        relation={editRelation}
        clusters={clusterOptionsForDialog}
        onSuccess={fetchAll}
      />
      <ConfirmDeleteDialog
        open={deleteRelationOpen}
        onOpenChange={setDeleteRelationOpen}
        title={`Delete this relation?`}
        description={`This will disconnect ${deleteRelation?.fromName ?? deleteRelation?.source} from ${deleteRelation?.toName ?? deleteRelation?.target}.`}
        onConfirm={handleDeleteRelation}
      />

      <ContentTypeFormDialog
        open={typeFormOpen}
        onOpenChange={setTypeFormOpen}
        contentType={editType}
        onSuccess={fetchAll}
      />
      <ConfirmDeleteDialog
        open={deleteTypeOpen}
        onOpenChange={setDeleteTypeOpen}
        title={`Delete content type "${deleteType?.label}"?`}
        description="Content types with existing entries cannot be deleted."
        onConfirm={handleDeleteType}
      />
    </main>
  );
}

