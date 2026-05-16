import type { Member, Project, Role, Task, TaskStatus } from "@/types";

// ─── State ────────────────────────────────────────────────────────────────────

export interface AppState {
  tasks: Task[];
  projects: Project[];
  members: Member[];
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export type AppAction =
  | { type: "ADD_TASK"; task: Task }
  | { type: "UPDATE_TASK"; id: string; patch: Partial<Task> }
  | { type: "DELETE_TASK"; id: string }
  | { type: "MOVE_TASK"; id: string; status: TaskStatus }
  | { type: "ADD_PROJECT"; project: Project }
  | { type: "ADD_MEMBER"; member: Member }
  | { type: "UPDATE_MEMBER_ROLE"; id: string; role: Role }
  | { type: "REMOVE_MEMBER"; id: string };

// ─── Reducer ──────────────────────────────────────────────────────────────────

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_TASK":
      return { ...state, tasks: [action.task, ...state.tasks] };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, ...action.patch } : t
        ),
      };

    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };

    case "MOVE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, status: action.status } : t
        ),
      };

    case "ADD_PROJECT":
      return { ...state, projects: [action.project, ...state.projects] };

    case "ADD_MEMBER":
      return { ...state, members: [...state.members, action.member] };

    case "UPDATE_MEMBER_ROLE":
      return {
        ...state,
        members: state.members.map((m) =>
          m.id === action.id ? { ...m, role: action.role } : m
        ),
      };

    case "REMOVE_MEMBER":
      return {
        ...state,
        members: state.members.filter((m) => m.id !== action.id),
      };

    default:
      return state;
  }
}
