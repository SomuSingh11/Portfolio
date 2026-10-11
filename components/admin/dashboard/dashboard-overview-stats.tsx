"use client";

import { StatCard } from "@/components/admin/shared/stat-card";
import { FolderGit2, BookOpen, Layers, GitBranch, CheckCircle2, Star } from "lucide-react";

interface DashboardStatsProps {
  projectStats: {
    total: number;
    published: number;
    draft: number;
    featured: number;
  };
  lifegraphStats: {
    totalEntries: number;
    publishedEntries: number;
    draftEntries: number;
    totalClusters: number;
    totalRelations: number;
  };
}

export function DashboardOverviewStats({ projectStats, lifegraphStats }: DashboardStatsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">System Overview</h2>
        <span className="text-xs text-slate-500 font-mono">Live metrics</span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Total Projects"
          value={projectStats.total}
          icon={FolderGit2}
          accent="blue"
          description={`${projectStats.published} published`}
        />
        <StatCard
          label="Featured Projects"
          value={projectStats.featured}
          icon={Star}
          accent="amber"
          description="Promoted on home"
        />
        <StatCard
          label="LifeGraph Entries"
          value={lifegraphStats.totalEntries}
          icon={BookOpen}
          accent="emerald"
          description={`${lifegraphStats.publishedEntries} published`}
        />
        <StatCard
          label="Clusters"
          value={lifegraphStats.totalClusters}
          icon={Layers}
          accent="violet"
          description="Content categories"
        />
        <StatCard
          label="Graph Relations"
          value={lifegraphStats.totalRelations}
          icon={GitBranch}
          accent="rose"
          description="Connected nodes"
        />
        <StatCard
          label="Published Content"
          value={projectStats.published + lifegraphStats.publishedEntries}
          icon={CheckCircle2}
          accent="blue"
          description="Live items"
        />
      </div>
    </div>
  );
}
