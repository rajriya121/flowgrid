import type { Task } from "@/types";

/** Returns true when a task is not completed and its due date has passed. */
export function isOverdue(task: Task): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return task.status !== "done" && new Date(task.dueDate) < new Date(today);
}

/** Formats an ISO date string as a short readable date, e.g. "Apr 30". */
export function formatDueDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
