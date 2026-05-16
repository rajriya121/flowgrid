import { Calendar, MessageSquare, Paperclip, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { UserAvatar } from "@/components/UserAvatar";
import { useStore } from "@/context/AppContext";
import { formatDueDate, isOverdue } from "@/utils/taskUtils";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  draggable?: boolean;
  isDragging?: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function TaskCard({
  task,
  draggable,
  isDragging,
  onClick,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  const { getMember, getProject } = useStore();
  const assignee = getMember(task.assigneeId);
  const project = getProject(task.projectId);
  const overdue = isOverdue(task);

  return (
    <Card
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "p-3.5 bg-card hover:shadow-elegant transition border-border/60 group",
        draggable && "cursor-grab active:cursor-grabbing",
        onClick && "cursor-pointer",
        isDragging && "opacity-40 rotate-1"
      )}
    >
      {/* Project label + priority */}
      <div className="flex items-start justify-between mb-2.5 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {project && (
            <div className={cn("h-2 w-2 rounded-full bg-gradient-to-br shrink-0", project.color)} />
          )}
          <span className="text-[11px] text-muted-foreground font-medium truncate">
            {project?.name}
          </span>
        </div>
        <StatusBadge variant={task.priority} />
      </div>

      <h4 className="font-medium text-sm leading-snug mb-3">{task.title}</h4>

      {/* Footer: due date + meta + assignee */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className={cn("flex items-center gap-1", overdue && "text-destructive font-medium")}>
            {overdue ? (
              <AlertTriangle className="h-3 w-3" />
            ) : (
              <Calendar className="h-3 w-3" />
            )}
            {formatDueDate(task.dueDate)}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />2
          </span>
          <span className="flex items-center gap-1">
            <Paperclip className="h-3 w-3" />1
          </span>
        </div>
        {assignee && <UserAvatar member={assignee} size="sm" />}
      </div>
    </Card>
  );
}
