"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export interface ClusterRow {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  color: string;
  sortOrder: number;
  published: boolean;
  imageMedia?: { secureUrl: string; width?: number | null; height?: number | null } | null;
  imageUrl?: string | null;
  _count?: { entries: number };
}

interface ClustersGridProps {
  clusters: ClusterRow[];
  onEdit: (cluster: ClusterRow) => void;
  onDelete: (cluster: ClusterRow) => void;
}

export function ClustersGrid({ clusters, onEdit, onDelete }: ClustersGridProps) {
  if (clusters.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center">
        <p className="text-slate-500 text-sm">No clusters yet. Create your first one above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {clusters.map((cluster) => {
        const imgUrl = cluster.imageMedia?.secureUrl || cluster.imageUrl;
        return (
          <div
            key={cluster.id}
            className="group relative rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-all duration-200"
          >
            {/* Color accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl opacity-80"
              style={{ backgroundColor: cluster.color }}
            />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={cluster.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700 flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-offset-2 ring-offset-slate-900"
                    style={{ backgroundColor: cluster.color, borderColor: cluster.color }}
                  />
                )}
                <div>
                  <p className="font-semibold text-white">{cluster.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{cluster.slug}</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  cluster.published
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs"
                    : "bg-slate-700/50 text-slate-400 border-slate-600 text-xs"
                }
              >
                {cluster.published ? "Published" : "Draft"}
              </Badge>
            </div>

            {cluster.description && (
              <p className="mt-3 text-sm text-slate-400 line-clamp-2">{cluster.description}</p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                {cluster._count && (
                  <span>{cluster._count.entries} {cluster._count.entries === 1 ? "entry" : "entries"}</span>
                )}
                <span>Order: {cluster.sortOrder}</span>
              </div>
              <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(cluster)}
                  className="h-7 px-2.5 text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(cluster)}
                  className="h-7 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
