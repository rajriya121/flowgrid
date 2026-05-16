import { useMemo, useState } from "react";
import {
  ListTodo, CheckCircle2, Clock, AlertTriangle,
  MoreHorizontal, Plus, Inbox,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { UserAvatar, AvatarStack } from "@/components/UserAvatar";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { TaskDetailSheet } from "@/components/TaskDetailSheet";
import { ProjectFormDialog } from "@/components/ProjectFormDialog";
import { StatCardSkeleton, TaskCardSkeleton } from "../components/Skeletons";
import { EmptyState } from "@/components/EmptyState";
import { useStore, useTaskStats, useWeeklyTrend } from "@/context/AppContext";
import { isOverdue, formatDueDate } from "@/utils/taskUtils";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { Task } from "@/types";

export default function Dashboard() {
  const { tasks, projects, currentUser, isAdmin, getMember, loading } = useStore();
  const stats = useTaskStats();
  const trendData = useWeeklyTrend();

  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Recent activity feed derived from tasks sorted by creation date
  const activity = useMemo(() => {
    return [...tasks]
      .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
      .slice(0, 6)
      .map((t) => {
        const member = getMember(t.assigneeId);
        const action =
          t.status === "done"
            ? "completed"
            : t.status === "in-progress"
            ? "is working on"
            : "created";
        return { id: t.id, user: member, action, target: t.title, time: t.createdAt };
      })
      .filter((a) => a.user);
  }, [tasks, getMember]);

  // Next upcoming incomplete tasks sorted by due date
  const dueSoon = useMemo(
    () =>
      [...tasks]
        .filter((t) => t.status !== "done")
        .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1))
        .slice(0, 5),
    [tasks]
  );

  const statCards = [
    { label: "Total Tasks", value: stats.total,     delta: "+12%",                                                 trend: "up"   as const, icon: ListTodo,      tone: "info"        as const },
    { label: "Completed",   value: stats.completed, delta: "+24%",                                                 trend: "up"   as const, icon: CheckCircle2,  tone: "success"     as const },
    { label: "Pending",     value: stats.pending,   delta: stats.pending === 0 ? "0" : "-4%",                     trend: "down" as const, icon: Clock,         tone: "warning"     as const },
    { label: "Overdue",     value: stats.overdue,   delta: stats.overdue > 0 ? `${stats.overdue}` : "0",          trend: stats.overdue > 0 ? "up" as const : "down" as const, icon: AlertTriangle, tone: "destructive" as const },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your operational summary for today.
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setNewProjectOpen(true)} className="gap-1.5">
              <Plus className="h-4 w-4" />Project
            </Button>
            <Button
              onClick={() => setNewTaskOpen(true)}
              className="bg-gradient-primary hover:opacity-90 text-white shadow-sm gap-1.5"
            >
              <Plus className="h-4 w-4" /> New task
            </Button>
          </div>
        )}
      </div>

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Chart + Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-border/60">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-semibold">Completion velocity</h3>
              <p className="text-xs text-muted-foreground mt-0.5">7-day rolling window</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" /> Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-info/60" /> Created
              </span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--info))" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(var(--info))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="created" stroke="hsl(var(--info))" strokeWidth={2} fill="url(#createdGrad)" />
                <Area type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#completedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border-border/60">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">Activity feed</h3>
          </div>
          <div className="space-y-4">
            {activity.length === 0 ? (
              <EmptyState icon={Inbox} title="No activity yet" description="Recent task changes will show up here." />
            ) : (
              activity.map((a) => (
                <div key={a.id} className="flex gap-3">
                  {a.user && <UserAvatar member={a.user} size="sm" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">
                      <span className="font-semibold">{a.user?.name.split(" ")[0]}</span>
                      <span className="text-muted-foreground"> {a.action} </span>
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{formatDueDate(a.time)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Active projects + Due soon */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-border/60">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">Active projects</h3>
          </div>
          <div className="space-y-3">
            {projects
              .filter((p) => p.status === "active")
              .slice(0, 4)
              .map((p) => {
                const projTasks = tasks.filter((t) => t.projectId === p.id);
                const done = projTasks.filter((t) => t.status === "done").length;
                const pct = projTasks.length ? Math.round((done / projTasks.length) * 100) : 0;
                return (
                  <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition cursor-pointer">
                    <div className={cn("h-10 w-10 rounded-lg bg-gradient-to-br shrink-0", p.color)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="font-medium text-sm truncate">{p.name}</p>
                        <span className="text-xs text-muted-foreground font-medium ml-2">{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <AvatarStack memberIds={p.memberIds} resolve={getMember} max={3} />
                  </div>
                );
              })}
          </div>
        </Card>

        <Card className="p-6 border-border/60">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">Upcoming deadlines</h3>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <TaskCardSkeleton key={i} />)
            ) : dueSoon.length === 0 ? (
              <EmptyState icon={CheckCircle2} title="All caught up!" description="No upcoming tasks." />
            ) : (
              dueSoon.map((t) => {
                const assignee = getMember(t.assigneeId);
                const overdue = isOverdue(t);
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTask(t)}
                    className="w-full flex items-center gap-3 group text-left"
                  >
                    {assignee && <UserAvatar member={assignee} size="sm" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition">
                        {t.title}
                      </p>
                      <p className={cn("text-[11px]", overdue ? "text-destructive font-medium" : "text-muted-foreground")}>
                        {overdue ? "Overdue · " : "Due "}{formatDueDate(t.dueDate)}
                      </p>
                    </div>
                    <StatusBadge variant={overdue ? "overdue" : t.priority} />
                  </button>
                );
              })
            )}
          </div>
        </Card>
      </div>

      <TaskFormDialog open={newTaskOpen} onOpenChange={setNewTaskOpen} />
      <ProjectFormDialog open={newProjectOpen} onOpenChange={setNewProjectOpen} />
      <TaskDetailSheet task={activeTask} open={!!activeTask} onOpenChange={(o) => !o && setActiveTask(null)} />
    </div>
  );
}

