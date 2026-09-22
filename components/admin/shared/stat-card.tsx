import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  accent?: "blue" | "emerald" | "amber" | "rose" | "violet" | "slate";
  description?: string;
}

const accentMap = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: "text-blue-400",
    value: "text-blue-300",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: "text-emerald-400",
    value: "text-emerald-300",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: "text-amber-400",
    value: "text-amber-300",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    icon: "text-rose-400",
    value: "text-rose-300",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    icon: "text-violet-400",
    value: "text-violet-300",
  },
  slate: {
    bg: "bg-slate-500/10",
    border: "border-slate-700",
    icon: "text-slate-400",
    value: "text-white",
  },
};

export function StatCard({ label, value, icon: Icon, accent = "slate", description }: StatCardProps) {
  const colors = accentMap[accent];

  return (
    <div
      className={cn(
        "rounded-xl border p-5 flex flex-col gap-3 transition-all duration-200",
        "bg-slate-900/80 backdrop-blur-sm",
        colors.border,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        {Icon && (
          <div className={cn("p-2 rounded-lg", colors.bg)}>
            <Icon className={cn("w-4 h-4", colors.icon)} />
          </div>
        )}
      </div>
      <p className={cn("text-3xl font-bold tracking-tight", colors.value)}>{value}</p>
      {description && <p className="text-xs text-slate-500">{description}</p>}
    </div>
  );
}
