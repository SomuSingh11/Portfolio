"use client";

import { StatCard } from "@/components/admin/shared/stat-card";
import { BookOpen, CheckCircle, FileText, Layers, GitBranch, Circle } from "lucide-react";

interface Entry {
  status: string;
}

interface Cluster {
  published: boolean;
}

interface LifeGraphOverviewProps {
  entries: Entry[];
  clusters: Cluster[];
  relationsCount: number;
  contentTypesCount: number;
}

export function LifeGraphOverview({
  entries,
  clusters,
  relationsCount,
  contentTypesCount,
}: LifeGraphOverviewProps) {
  const totalEntries = entries.length;
  const publishedEntries = entries.filter((e) => e.status === "Published").length;
  const draftEntries = entries.filter((e) => e.status === "Draft").length;
  const totalClusters = clusters.length;
  const publishedClusters = clusters.filter((c) => c.published).length;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <StatCard label="Total Entries" value={totalEntries} icon={BookOpen} accent="emerald" />
      <StatCard label="Published" value={publishedEntries} icon={CheckCircle} accent="emerald" />
      <StatCard label="Drafts" value={draftEntries} icon={FileText} accent="amber" />
      <StatCard label="Clusters" value={totalClusters} icon={Layers} accent="blue" />
      <StatCard label="Pub. Clusters" value={publishedClusters} icon={Circle} accent="blue" />
      <StatCard label="Relations" value={relationsCount} icon={GitBranch} accent="violet" />
    </div>
  );
}
