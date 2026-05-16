import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12 px-6 border-2 border-dashed border-border rounded-xl", className)}>
      <div className="mx-auto h-12 w-12 rounded-2xl bg-accent flex items-center justify-center mb-3">
        <Icon className="h-5 w-5 text-accent-foreground" />
      </div>
      <h3 className="font-semibold text-sm">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
