"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import { DashboardOverviewStats } from "@/components/admin/dashboard/dashboard-overview-stats";
import { ModuleCards } from "@/components/admin/dashboard/module-cards";
import toast from "react-hot-toast";

interface ProjectData {
  id: string;
  published: boolean;
  featured: boolean;
}

interface EntryData {
  id: string;
  status: string;
}

export default function AdminDashboardPage() {
  const { status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [projectStats, setProjectStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0,
  });

  const [lifegraphStats, setLifegraphStats] = useState({
    totalEntries: 0,
    publishedEntries: 0,
    draftEntries: 0,
    totalClusters: 0,
    totalRelations: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectsRes, entriesRes, clustersRes, relationsRes] = await Promise.all([
        fetch("/api/admin/projects", { cache: "no-store" }),
        fetch("/api/admin/lifegraph/entries", { cache: "no-store" }),
        fetch("/api/admin/lifegraph/clusters", { cache: "no-store" }),
        fetch("/api/admin/lifegraph/relations", { cache: "no-store" }),
      ]);

      if (projectsRes.ok) {
        const projects: ProjectData[] = await projectsRes.json();
        setProjectStats({
          total: projects.length,
          published: projects.filter((p) => p.published).length,
          draft: projects.filter((p) => !p.published).length,
          featured: projects.filter((p) => p.featured).length,
        });
      }

      if (entriesRes.ok && clustersRes.ok && relationsRes.ok) {
        const entries: EntryData[] = await entriesRes.json();
        const clusters = await clustersRes.json();
        const relations = await relationsRes.json();

        setLifegraphStats({
          totalEntries: entries.length,
          publishedEntries: entries.filter((e) => e.status === "Published").length,
          draftEntries: entries.filter((e) => e.status === "Draft").length,
          totalClusters: Array.isArray(clusters) ? clusters.length : 0,
          totalRelations: Array.isArray(relations) ? relations.length : 0,
        });
      }
    } catch {
      toast.error("Could not fetch dashboard metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status, fetchDashboardData]);

  if (status === "unauthenticated") {
    router.push("/admin/login");
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">
        
        {/* Header */}
        <DashboardHeader />

        {/* Live Metrics Overview */}
        {loading || status === "loading" ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-40 bg-slate-900" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl bg-slate-900" />
              ))}
            </div>
          </div>
        ) : (
          <DashboardOverviewStats
            projectStats={projectStats}
            lifegraphStats={lifegraphStats}
          />
        )}

        {/* Modular Workspace Navigation Cards */}
        {loading || status === "loading" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl bg-slate-900" />
            ))}
          </div>
        ) : (
          <ModuleCards
            projectCount={projectStats.total}
            entryCount={lifegraphStats.totalEntries}
            clusterCount={lifegraphStats.totalClusters}
            relationCount={lifegraphStats.totalRelations}
          />
        )}

      </div>
    </main>
  );
}
