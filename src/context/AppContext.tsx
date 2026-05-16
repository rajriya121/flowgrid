import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Member, Project, Role, Task, TaskStatus, TeamMember } from "@/types";
import { toast } from "sonner";

// ─── Context shape ────────────────────────────────────────────────────────────

interface AppContextValue {
  loading: boolean;
  tasks: Task[];
  projects: Project[];
  members: Member[];
  teamMembers: TeamMember[];
  notifications: any[];
  currentUser: Member | null;
  isAdmin: boolean;
  canEditTask: (task: Task) => boolean;
  getMember: (id: string) => Member | undefined;
  getProject: (id: string) => Project | undefined;
  addTask: (data: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  addProject: (data: Omit<Project, "id">) => void;
  inviteMember: (userId: string, role: Role) => void;
  acceptInvite: (teamMemberId: string) => void;
  updateMemberRole: (id: string, role: Role) => void;
  removeMember: (id: string) => void;
  login: (data: any) => void;
  logout: () => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<Member | null>(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  // Auto-accept the current admin as a team member on first load is no longer needed locally.
  const isAdmin = currentUser?.role === "Admin";

  // Data fetching using React Query (only fetch if logged in)
  const enabled = !!currentUser;

  const { data: tasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => (await api.get("/tasks")).data,
    enabled,
  });

  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await api.get("/projects")).data,
    enabled,
  });

  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await api.get("/users")).data,
    enabled,
  });

  const { data: notifications = [], isLoading: loadingNotifs } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await api.get("/notifications")).data,
    enabled,
  });

  const { data: teamMembersRaw = [], isLoading: loadingTeamMembers } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: async () => (await api.get("/team-members")).data,
    enabled,
  });

  const loading = loadingTasks || loadingProjects || loadingMembers || loadingNotifs || loadingTeamMembers;

  const mappedTasks = useMemo(() => tasks.map((t: any) => ({ ...t, id: t._id })), [tasks]);
  const mappedProjects = useMemo(() => projects.map((p: any) => ({ ...p, id: p._id })), [projects]);
  const mappedMembers = useMemo(() => members.map((m: any) => ({ ...m, id: m._id })), [members]);
  const teamMembers = useMemo(() => teamMembersRaw.map((tm: any) => ({ ...tm, id: tm._id })), [teamMembersRaw]);

  // Helpers
  const getMember = (id: string) => mappedMembers.find((m: any) => m.id === id);
  const getProject = (id: string) => mappedProjects.find((p: any) => p.id === id);
  const canEditTask = (task: any) => isAdmin || task.assigneeId === currentUser?.id;

  // Auth actions
  const login = (userData: any) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
    queryClient.clear();
  };

  // Mutations
  const addTaskMutation = useMutation({
    mutationFn: (data: any) => api.post("/tasks", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: any }) => api.put(`/tasks/${id}`, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const addProjectMutation = useMutation({
    mutationFn: (data: any) => api.post("/projects", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const updateMemberRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) => api.put(`/users/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
  });

  const markNotifMutation = useMutation({
    mutationFn: (id: string) => api.put(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  // Team Membership Mutations
  const inviteMemberMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Role }) => api.post("/team-members", { userId, role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast.success("User invited successfully.");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to invite user");
    }
  });

  const acceptInviteMutation = useMutation({
    mutationFn: (id: string) => api.put(`/team-members/${id}/accept`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast.success("Invitation accepted!");
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/team-members/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast.success("Member removed from team.");
    },
  });

  const updateTeamMemberRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) => api.put(`/team-members/${id}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teamMembers"] }),
  });

  const value: AppContextValue = {
    loading: enabled ? loading : false,
    tasks: mappedTasks,
    projects: mappedProjects,
    members: mappedMembers,
    teamMembers,
    notifications,
    currentUser: currentUser ? { ...currentUser, id: (currentUser as any)._id || (currentUser as any).id } : null,
    isAdmin,
    canEditTask,
    getMember,
    getProject,
    addTask: (d) => addTaskMutation.mutate(d),
    updateTask: (id, patch) => updateTaskMutation.mutate({ id, patch }),
    deleteTask: (id) => deleteTaskMutation.mutate(id),
    moveTask: (id, status) => updateTaskMutation.mutate({ id, patch: { status } }),
    addProject: (d) => addProjectMutation.mutate(d),
    inviteMember: (userId, role) => inviteMemberMutation.mutate({ userId, role }),
    acceptInvite: (teamMemberId) => acceptInviteMutation.mutate(teamMemberId),
    updateMemberRole: (id, role) => {
      // Update global role in DB
      updateMemberRoleMutation.mutate({ id, role });
      // Update local team member role in DB as well
      const tm = teamMembers.find(t => t.userId === id);
      if (tm) {
        updateTeamMemberRoleMutation.mutate({ id: tm.id, role });
      }
    },
    removeMember: (teamMemberId) => removeMemberMutation.mutate(teamMemberId),
    login,
    logout,
    markNotificationRead: (id) => markNotifMutation.mutate(id),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useStore must be used inside AppStoreProvider");
  return ctx;
}

export function useTaskStats() {
  const { tasks } = useStore();
  return useMemo(() => {
    const today = new Date(new Date().toISOString().slice(0, 10));
    let completed = 0, pending = 0, overdue = 0;
    for (const t of tasks) {
      if (t.status === "done") completed++;
      else {
        pending++;
        if (new Date(t.dueDate) < today) overdue++;
      }
    }
    return { total: tasks.length, completed, pending, overdue };
  }, [tasks]);
}

export function useProjectProgress(projectId: string) {
  const { tasks } = useStore();
  return useMemo(() => {
    const list = tasks.filter((t) => t.projectId === projectId);
    const done = list.filter((t) => t.status === "done").length;
    return {
      total: list.length,
      completed: done,
      pct: list.length ? Math.round((done / list.length) * 100) : 0,
    };
  }, [tasks, projectId]);
}

export function useWeeklyTrend() {
  const { tasks } = useStore();
  return useMemo(() => {
    const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const iso = d.toISOString().slice(0, 10);
      return {
        day: DAY_LABELS[d.getDay()],
        completed: tasks.filter((t) => t.status === "done" && t.dueDate === iso).length,
        created: tasks.filter((t) => (t as any).createdAt?.startsWith(iso)).length,
      };
    });
  }, [tasks]);
}
