import { useMemo, useState } from "react";
import { Plus, Filter, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KanbanColumn } from "@/components/KanbanColumn";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { TaskDetailSheet } from "@/components/TaskDetailSheet";
import { useStore } from "@/context/AppContext";
import { toast } from "sonner";
import type { Task, TaskStatus } from "@/types";

const COLUMNS: { id: TaskStatus; title: string; tone: string }[] = [
  { id: "todo",        title: "To Do",       tone: "bg-muted-foreground" },
  { id: "in-progress", title: "In Progress", tone: "bg-info" },
  { id: "done",        title: "Done",        tone: "bg-success" },
];

type FilterOption = "all" | "mine";

export default function Tasks() {
  const { tasks, moveTask, isAdmin, currentUser, canEditTask, loading } = useStore();
  const currentUserId = currentUser?.id;

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterOption>("all");

  const visibleTasks = useMemo(
    () => (filter === "mine" ? tasks.filter((t) => t.assigneeId === currentUserId) : tasks),
    [tasks, filter, currentUserId]
  );

  // ── Drag handlers ──────────────────────────────────────────────────────────

  const handleDragStart = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && !canEditTask(task)) {
      toast.error("You don't have permission to move this task");
      return;
    }
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, col: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(col);
  };

  const handleDrop = (col: TaskStatus) => {
    if (!draggedId) return;
    const task = tasks.find((t) => t.id === draggedId);
    if (!task || !canEditTask(task)) {
      setDraggedId(null);
      setDragOverCol(null);
      return;
    }
    if (task.status !== col) {
      moveTask(draggedId, col);
      const colTitle = COLUMNS.find((c) => c.id === col)?.title;
      toast.success(`Moved to ${colTitle}`);
    }
    setDraggedId(null);
    setDragOverCol(null);
  };

  const openNewTask = (status: TaskStatus = "todo") => {
    if (!isAdmin) {
      toast.error("Only Admins can create tasks");
      return;
    }
    setDefaultStatus(status);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop to update status.{" "}
            {visibleTasks.length}{" "}
            {filter === "mine" ? "assigned to you" : "tasks total"}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as FilterOption)}>
            <SelectTrigger className="h-9 w-[160px] gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tasks</SelectItem>
              <SelectItem value="mine">My tasks</SelectItem>
            </SelectContent>
          </Select>

          {isAdmin ? (
            <Button
              onClick={() => openNewTask("todo")}
              className="bg-gradient-primary hover:opacity-90 text-white shadow-sm gap-1.5"
            >
              <Plus className="h-4 w-4" /> New task
            </Button>
          ) : (
            <Button variant="outline" disabled className="gap-1.5">
              <Lock className="h-3.5 w-3.5" />Admin only
            </Button>
          )}
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid md:grid-cols-3 gap-4 flex-1 min-h-0">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={visibleTasks.filter((t) => t.status === col.id)}
            loading={loading}
            isAdmin={isAdmin}
            isDragOver={dragOverCol === col.id}
            draggedId={draggedId}
            canEditTask={canEditTask}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={() => handleDrop(col.id)}
            onAddClick={() => openNewTask(col.id)}
            onTaskClick={setActiveTask}
            onDragStart={handleDragStart}
            onDragEnd={() => { setDraggedId(null); setDragOverCol(null); }}
          />
        ))}
      </div>

      <TaskFormDialog open={modalOpen} onOpenChange={setModalOpen} defaultStatus={defaultStatus} />
      <TaskDetailSheet task={activeTask} open={!!activeTask} onOpenChange={(o) => !o && setActiveTask(null)} />
    </div>
  );
}
