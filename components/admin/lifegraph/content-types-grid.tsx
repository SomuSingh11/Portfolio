"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Tag, ShieldAlert } from "lucide-react";

export interface FieldDefinition {
  name: string;
  label: string;
  type: "text" | "number" | "boolean" | "date" | "url";
  required?: boolean;
}

export interface ContentTypeRow {
  id: string;
  slug: string;
  label: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  fieldSchema?: { fields?: FieldDefinition[] } | null;
  isSystem: boolean;
  isActive: boolean;
  sortOrder: number;
  _count?: { entries: number };
}

interface ContentTypesGridProps {
  contentTypes: ContentTypeRow[];
  onEdit: (type: ContentTypeRow) => void;
  onDelete: (type: ContentTypeRow) => void;
}

export function ContentTypesGrid({ contentTypes, onEdit, onDelete }: ContentTypesGridProps) {
  if (contentTypes.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center">
        <p className="text-slate-500 text-sm">No content types found. Create your first one above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {contentTypes.map((type) => {
        const accentColor = type.color || "#F59E0B";
        const fields = type.fieldSchema?.fields ?? [];

        return (
          <div
            key={type.id}
            className="group relative rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-all duration-200"
          >
            {/* Color accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl opacity-80"
              style={{ backgroundColor: accentColor }}
            />

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm border flex-shrink-0"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    borderColor: `${accentColor}40`,
                    color: accentColor,
                  }}
                >
                  {type.icon ? (
                    <span className="text-base">{type.icon}</span>
                  ) : (
                    <Tag className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    {type.label}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">{type.slug}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                {type.isSystem && (
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/25 text-[10px]">
                    System
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={
                    type.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs"
                      : "bg-slate-700/50 text-slate-400 border-slate-600 text-xs"
                  }
                >
                  {type.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            {type.description && (
              <p className="mt-3 text-sm text-slate-400 line-clamp-2">{type.description}</p>
            )}

            {fields.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {fields.map((f) => (
                  <Badge
                    key={f.name}
                    variant="outline"
                    className="text-[10px] bg-slate-800 text-slate-300 border-slate-700 font-mono"
                  >
                    {f.name}: <span className="text-amber-400 ml-1">{f.type}</span>
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>
                  {type._count?.entries ?? 0}{" "}
                  {type._count?.entries === 1 ? "entry" : "entries"}
                </span>
                <span>{fields.length} {fields.length === 1 ? "field" : "fields"}</span>
              </div>

              <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(type)}
                  className="h-7 px-2.5 text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
                {type.isSystem ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled
                    title="System content types cannot be deleted"
                    className="h-7 px-2 text-slate-600 cursor-not-allowed opacity-50"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(type)}
                    className="h-7 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
