import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label
        htmlFor={htmlFor}
        className="text-sm font-medium text-slate-300"
      >
        {label}
        {required && <span className="ml-1 text-rose-400">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
}
