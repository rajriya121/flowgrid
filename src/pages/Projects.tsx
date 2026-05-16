import { useState } from "react";
import { Plus, Search, LayoutGrid, List, MoreHorizontal, FolderPlus, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { AvatarStack } from "@/components/UserAvatar";
import { ProjectFormDialog } from "@/components/ProjectFormDialog";
import { ProjectCardSkeleton } from "../components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { useStore } from "@/context/AppContext";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";

export default function Projects() {
  const { projects, tasks, getMember, isAdmin, loading } = useStore();
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const getProjectStats = (projectId: string) => {
    const list = tasks.filter((t) => t.projectId === projectId);
    const done = list.filter((t) => t.status === "done").length;
    return { total: list.length, done, pct: list.length ? Math.round((done / list.length) * 100) : 0 };
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} projects across your workspace
          </p>
        </div>
        {isAdmin ? (
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-gradient-primary hover:opacity-90 text-white shadow-sm gap-1.5"
          >
            <Plus className="h-4 w-4" /> New project
          </Button>
        ) : (
          <Button variant="outline" disabled className="gap-1.5">
            <Lock className="h-3.5 w-3.5" />Admin only
          </Button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            className="pl-9 h-9 bg-secondary/50"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary">
          {(["grid", "list"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-label={`${v} view`}
              className={cn(
                "h-7 w-7 rounded-md flex items-center justify-center transition",
                view === v ? "bg-background shadow-sm" : "hover:bg-background/50"
              )}
            >
              {v === "grid" ? <LayoutGrid className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          title={query ? "No projects found" : "No projects yet"}
          description={query ? "Try a different search term." : "Create your first project to get started."}
          action={
            isAdmin && !query ? (
              <Button onClick={() => setDialogOpen(true)} className="bg-gradient-primary text-white gap-1.5">
                <Plus className="h-4 w-4" />New project
              </Button>
            ) : undefined
          }
        />
      ) : view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const s = getProjectStats(p.id);
            return (
              <Card key={p.id} className="p-5 hover:shadow-elevated transition-all cursor-pointer border-border/60 group animate-fade-in">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-br shadow-sm", p.color)} />
                  <button className="opacity-0 group-hover:opacity-100 transition h-7 w-7 rounded-md hover:bg-accent flex items-center justify-center">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition">{p.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{s.done}/{s.total}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <AvatarStack memberIds={p.memberIds} resolve={getMember} max={3} />
                  <StatusBadge variant={p.status} />
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Project</th>
                  <th className="text-left font-semibold px-5 py-3">Status</th>
                  <th className="text-left font-semibold px-5 py-3">Progress</th>
                  <th className="text-left font-semibold px-5 py-3">Members</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const s = getProjectStats(p.id);
                  return (
                    <tr key={p.id} className="border-t border-border hover:bg-secondary/30 cursor-pointer transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-8 w-8 rounded-md bg-gradient-to-br", p.color)} />
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge variant={p.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 max-w-[160px]">
                          <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div className="h-full bg-gradient-primary" style={{ width: `${s.pct}%` }} />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">{s.pct}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <AvatarStack memberIds={p.memberIds} resolve={getMember} max={4} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ProjectFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

