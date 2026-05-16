import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const toneClasses: Record<string, string> = {
  info:        "bg-info/10 text-info",
  success:     "bg-success/10 text-success",
  warning:     "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

interface StatCardProps {
  label: string;
  value: number;
  delta: string;
  trend: "up" | "down";
  icon: LucideIcon;
  tone: "info" | "success" | "warning" | "destructive";
}

export function StatCard({ label, value, delta, trend, icon: Icon, tone }: StatCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  // For destructive metrics (overdue), "down" is actually positive
  const isPositive = tone === "destructive" ? trend === "down" : trend === "up";

  return (
    <Card className="p-5 hover:shadow-elegant transition-all border-border/60 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", toneClasses[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={cn(
          "inline-flex items-center gap-0.5 text-xs font-semibold",
          isPositive ? "text-success" : "text-destructive"
        )}>
          <TrendIcon className="h-3 w-3" />
          {delta}
        </span>
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </div>
    </Card>
  );
}
