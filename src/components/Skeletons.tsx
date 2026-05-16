import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <Card className="p-5 border-border/60">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-4 w-10" />
      </div>
      <Skeleton className="h-7 w-16 mb-2" />
      <Skeleton className="h-3 w-24" />
    </Card>
  );
}

export function TaskCardSkeleton() {
  return (
    <Card className="p-3.5 border-border/60">
      <div className="flex items-center justify-between mb-2.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4 mb-3" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
    </Card>
  );
}

export function ProjectCardSkeleton() {
  return (
    <Card className="p-5 border-border/60">
      <Skeleton className="h-11 w-11 rounded-xl mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-5/6 mb-4" />
      <Skeleton className="h-1.5 w-full mb-4" />
      <div className="flex justify-between pt-3 border-t border-border">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </Card>
  );
}
