// ─── Domain types ─────────────────────────────────────────────────────────────

export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in-progress" | "done";
export type ProjectStatus = "active" | "on-hold" | "completed";
export type Role = "Admin" | "Member";

// ─── Core entities ────────────────────────────────────────────────────────────

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
  color: string;
}

export interface TeamMember {
  id: string; // unique team membership id
  userId: string;
  projectId: string; // "workspace" for global team
  role: Role;
  status: "invited" | "accepted";
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  dueDate: string; // ISO yyyy-mm-dd
  projectId: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  memberIds: string[];
  color: string;
}
