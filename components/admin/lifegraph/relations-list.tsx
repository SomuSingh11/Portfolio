"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowLeftRight } from "lucide-react";

export interface RelationRow {
  id: string;
  source: string; // from cluster slug
  target: string; // to cluster slug
  label?: string | null;
  weight: number;
  strength: number;
  color?: string | null;
  // For display — cluster names
  fromName?: string;
  toName?: string;
}

interface RelationsListProps {
  relations: RelationRow[];
  onEdit: (relation: RelationRow) => void;
  onDelete: (relation: RelationRow) => void;
}

export function RelationsList({ relations, onEdit, onDelete }: RelationsListProps) {
  if (relations.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center">
        <p className="text-slate-500 text-sm">No relations yet. Connect clusters above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {relations.map((relation) => (
        <div
          key={relation.id}
          className="group relative rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3.5 hover:border-slate-700 transition-all duration-200"
        >
          {relation.color && (
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl opacity-70"
              style={{ backgroundColor: relation.color }}
            />
          )}

          {/* Cluster pair */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-white truncate">{relation.fromName ?? relation.source}</span>
            <ArrowLeftRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="font-medium text-white truncate">{relation.toName ?? relation.target}</span>
          </div>

          {relation.label && (
            <p className="mt-1.5 text-xs text-slate-400 italic">"{relation.label}"</p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-slate-800 text-slate-400 border-slate-700">
                w: {relation.weight}
              </Badge>
              <Badge variant="outline" className="text-xs bg-slate-800 text-slate-400 border-slate-700">
                s: {relation.strength}
              </Badge>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(relation)}
                className="h-7 px-2.5 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <Pencil className="w-3.5 h-3.5 mr-1" />Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(relation)}
                className="h-7 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
