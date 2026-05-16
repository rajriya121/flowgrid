import { Plus, ListTodo } from "lucide-react";
import type { Task, TaskStatus } from "@/types";
import { TaskCard } from "@/components/TaskCard";
import { TaskCardSkeleton } from "./Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";

interface ColumnDef {
  id: TaskStatus;
  title: string;
  tone: string;
}

interface KanbanColumnProps {
  column: ColumnDef;
  tasks: Task[];
  loading: boolean;
  isAdmin: boolean;
  isDragOver: boolean;
  draggedId: string | null;
  canEditTask: (task: Task) => boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: () => void;
  onAddClick: () => void;
  onTaskClick: (task: Task) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

export function KanbanColumn({
  column,
  tasks,
  loading,
  isAdmin,
  isDragOver,
  draggedId,
  canEditTask,
  onDragOver,
  onDragLeave,
  onDrop,
  onAddClick,
  onTaskClick,
  onDragStart,
  onDragEnd,
}: KanbanColumnProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "rounded-xl bg-secondary/40 border border-border p-3 flex flex-col transition",
        isDragOver && "border-primary bg-accent/40 ring-2 ring-primary/20"
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", column.tone)} />
          <h3 className="font-semibold text-sm">{column.title}</h3>
          <span className="text-xs text-muted-foreground bg-background rounded-full px-2 py-0.5 font-medium">
            {tasks.length}
          </span>
        </div>
        {isAdmin && (
          <button
            onClick={onAddClick}
            className="h-6 w-6 rounded-md hover:bg-background flex items-center justify-center transition"
            title={`Add task to ${column.title}`}
            aria-label={`Add task to ${column.title}`}
          >
            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Task list */}
      <div className="space-y-2.5 overflow-y-auto flex-1 min-h-[200px]">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => <TaskCardSkeleton key={i} />)
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title="No tasks"
            description={
              column.id === "done"
                ? "Completed tasks land here."
                : "Drop tasks or click + to add."
            }
          />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              draggable={canEditTask(task)}
              isDragging={draggedId === task.id}
              onClick={() => onTaskClick(task)}
              onDragStart={() => onDragStart(task.id)}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
}

