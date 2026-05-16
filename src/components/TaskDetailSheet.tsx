import { useState } from "react";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { UserAvatar } from "@/components/UserAvatar";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { useStore } from "@/context/AppContext";
import { formatDueDate, isOverdue } from "@/utils/taskUtils";
import { toast } from "sonner";
import {
  AlertTriangle, Calendar, Flag, Folder, Lock, Pencil, Trash2, User as UserIcon,
} from "lucide-react";
import type { Task, TaskStatus } from "@/types";

interface TaskDetailSheetProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailSheet({ task, open, onOpenChange }: TaskDetailSheetProps) {
  const { getMember, getProject, deleteTask, moveTask, canEditTask } = useStore();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!task) return null;

  const assignee = getMember(task.assigneeId);
  const project = getProject(task.projectId);
  const overdue = isOverdue(task);
  const editable = canEditTask(task);

  const handleDelete = () => {
    deleteTask(task.id);
    toast.success("Task deleted");
    setConfirmOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-2 mb-2">
              {project && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`h-2 w-2 rounded-full bg-gradient-to-br ${project.color}`} />
                  {project.name}
                </span>
              )}
            </div>
            <SheetTitle className="text-xl leading-snug pr-8">{task.title}</SheetTitle>
            <SheetDescription className="sr-only">Task details</SheetDescription>
          </SheetHeader>

          {overdue && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span className="font-medium">This task is overdue</span>
            </div>
          )}

          {!editable && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-muted text-muted-foreground text-xs border border-border">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span>You have view-only access. Only Admins or the assignee can edit.</span>
            </div>
          )}

          <div className="mt-6 space-y-5">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Description
              </h4>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {task.description || (
                  <span className="text-muted-foreground italic">No description provided.</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <DetailRow icon={UserIcon} label="Assignee">
                {assignee && (
                  <div className="flex items-center gap-2">
                    <UserAvatar member={assignee} size="sm" />
                    <span className="text-sm font-medium">{assignee.name.split(" ")[0]}</span>
                  </div>
                )}
              </DetailRow>

              <DetailRow icon={Calendar} label="Due date">
                <span className={`text-sm font-medium ${overdue ? "text-destructive" : ""}`}>
                  {formatDueDate(task.dueDate)}
                </span>
              </DetailRow>

              <DetailRow icon={Flag} label="Priority">
                <StatusBadge variant={task.priority} />
              </DetailRow>

              <DetailRow icon={Folder} label="Status">
                {editable ? (
                  <Select
                    value={task.status}
                    onValueChange={(v) => {
                      moveTask(task.id, v as TaskStatus);
                      toast.success("Status updated");
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <StatusBadge variant={task.status} />
                )}
              </DetailRow>
            </div>

            {editable && (
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 gap-1.5"
                  onClick={() => setConfirmOpen(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <TaskFormDialog open={editOpen} onOpenChange={setEditOpen} task={task} />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action can't be undone. The task will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Helper sub-component ─────────────────────────────────────────────────────

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      {children}
    </div>
  );
}
