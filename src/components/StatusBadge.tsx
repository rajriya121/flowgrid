import { cn } from "@/lib/utils";
import type { Priority, TaskStatus, ProjectStatus } from "@/types";

const badgeStyles: Record<string, string> = {
  // Priority
  low:         "bg-info/10 text-info border-info/20",
  medium:      "bg-warning/10 text-warning border-warning/20",
  high:        "bg-destructive/10 text-destructive border-destructive/20",
  // Task status
  todo:        "bg-muted text-muted-foreground border-border",
  "in-progress": "bg-info/10 text-info border-info/20",
  done:        "bg-success/10 text-success border-success/20",
  // Project status
  active:      "bg-success/10 text-success border-success/20",
  "on-hold":   "bg-warning/10 text-warning border-warning/20",
  completed:   "bg-muted text-muted-foreground border-border",
  // Misc
  overdue:     "bg-destructive/10 text-destructive border-destructive/20",
  pending:     "bg-warning/10 text-warning border-warning/20",
};

const dotStyles: Record<string, string> = {
  low:           "bg-info",
  "in-progress": "bg-info",
  medium:        "bg-warning",
  "on-hold":     "bg-warning",
  pending:       "bg-warning",
  high:          "bg-destructive",
  overdue:       "bg-destructive",
  done:          "bg-success",
  active:        "bg-success",
  todo:          "bg-muted-foreground",
  completed:     "bg-muted-foreground",
};

const displayLabels: Record<string, string> = {
  "in-progress": "In Progress",
  "on-hold":     "On Hold",
  todo:          "To Do",
};

interface StatusBadgeProps {
  variant: Priority | TaskStatus | ProjectStatus | "overdue" | "pending";
  className?: string;
  children?: React.ReactNode;
}

export function StatusBadge({ variant, className, children }: StatusBadgeProps) {
  const label =
    children ??
    displayLabels[variant] ??
    variant.charAt(0).toUpperCase() + variant.slice(1);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        badgeStyles[variant],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[variant])} />
      {label}
    </span>
  );
}
