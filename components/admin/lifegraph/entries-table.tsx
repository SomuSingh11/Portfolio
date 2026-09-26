"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export interface EntryRow {
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
  metadata?: Record<string, unknown> | null;
  type: { slug: string; label: string; icon?: string | null; color?: string | null };
  clusterIds: string[];
  // Used for edit form
  typeSlug?: string;
  clusterSlugs?: string[];
}

const statusConfig: Record<
  EntryRow["status"],
  { label: string; className: string }
> = {
  Published: { label: "Published", className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25" },
  Draft: { label: "Draft", className: "bg-amber-500/15 text-amber-300 border-amber-500/25" },
  Archived: { label: "Archived", className: "bg-slate-700/50 text-slate-400 border-slate-600" },
};

interface EntriesTableProps {
  entries: EntryRow[];
  onEdit: (entry: EntryRow) => void;
  onDelete: (entry: EntryRow) => void;
}

export function EntriesTable({ entries, onEdit, onDelete }: EntriesTableProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center">
        <p className="text-slate-500 text-sm">No entries yet. Create your first one above.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900">
              <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Title</th>
              <th className="text-left px-4 py-3.5 text-slate-400 font-medium">Type</th>
              <th className="text-left px-4 py-3.5 text-slate-400 font-medium">Clusters</th>
              <th className="text-left px-4 py-3.5 text-slate-400 font-medium">Status</th>
              <th className="text-left px-4 py-3.5 text-slate-400 font-medium">Date</th>
              <th className="text-right px-5 py-3.5 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {entries.map((entry) => {
              const { label, className } = statusConfig[entry.status];
              const date = entry.occurredAt
                ? new Date(entry.occurredAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                : "—";
              return (
                <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{entry.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">{entry.slug}</p>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={
                        entry.type.color
                          ? {
                              color: entry.type.color,
                              borderColor: `${entry.type.color}40`,
                              backgroundColor: `${entry.type.color}15`,
                            }
                          : undefined
                      }
                    >
                      {entry.type.icon && <span className="mr-1">{entry.type.icon}</span>}
                      {entry.type.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {entry.clusterIds.slice(0, 3).map((slug) => (
                        <Badge key={slug} variant="outline" className="text-xs bg-blue-500/10 text-blue-300 border-blue-500/25">
                          {slug}
                        </Badge>
                      ))}
                      {entry.clusterIds.length > 3 && (
                        <span className="text-xs text-slate-500">+{entry.clusterIds.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className={className}>{label}</Badge>
                  </td>
                  <td className="px-4 py-4 text-slate-400 text-sm">{date}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" onClick={() => onEdit(entry)} className="h-8 px-3 text-slate-400 hover:text-white hover:bg-slate-700">
                        <Pencil className="w-3.5 h-3.5 mr-1" />Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onDelete(entry)} className="h-8 px-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
