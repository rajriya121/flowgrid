import type { Member, Project, Task } from "@/types";

// ─── Members ──────────────────────────────────────────────────────────────────

export const initialMembers: Member[] = [
  { id: "1", name: "Alex Morgan",  email: "alex@team.app",   role: "Admin",  initials: "AM", color: "from-indigo-500 to-purple-500" },
  { id: "2", name: "Sarah Chen",   email: "sarah@team.app",  role: "Admin",  initials: "SC", color: "from-pink-500 to-rose-500" },
  { id: "3", name: "Marcus Lee",   email: "marcus@team.app", role: "Member", initials: "ML", color: "from-blue-500 to-cyan-500" },
  { id: "4", name: "Priya Patel",  email: "priya@team.app",  role: "Member", initials: "PP", color: "from-amber-500 to-orange-500" },
  { id: "5", name: "Jordan Kim",   email: "jordan@team.app", role: "Member", initials: "JK", color: "from-emerald-500 to-teal-500" },
  { id: "6", name: "Elena Rossi",  email: "elena@team.app",  role: "Member", initials: "ER", color: "from-fuchsia-500 to-pink-500" },
];

// ─── Projects ─────────────────────────────────────────────────────────────────

export const initialProjects: Project[] = [
  { id: "p1", name: "Mobile App Redesign",    description: "Complete overhaul of iOS and Android apps",       status: "active",    memberIds: ["1", "2", "3"],       color: "from-indigo-500 to-purple-500" },
  { id: "p2", name: "Q3 Marketing Campaign",  description: "Multi-channel campaign for product launch",       status: "active",    memberIds: ["2", "4", "6"],       color: "from-pink-500 to-rose-500" },
  { id: "p3", name: "API v2 Migration",        description: "Migrate legacy services to new API",              status: "active",    memberIds: ["3", "5"],            color: "from-blue-500 to-cyan-500" },
  { id: "p4", name: "Design System v3",        description: "Build unified component library",                 status: "on-hold",   memberIds: ["1", "6"],            color: "from-amber-500 to-orange-500" },
  { id: "p5", name: "Customer Onboarding",    description: "Streamline new user experience",                  status: "completed", memberIds: ["2", "4", "5"],       color: "from-emerald-500 to-teal-500" },
  { id: "p6", name: "Analytics Dashboard",    description: "Real-time metrics for stakeholders",              status: "active",    memberIds: ["3", "1", "5", "6"], color: "from-fuchsia-500 to-pink-500" },
];

// ─── Tasks ────────────────────────────────────────────────────────────────────

/** Returns a date offset by `n` days from today in ISO (yyyy-mm-dd) format. */
function day(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export const initialTasks: Task[] = [
  { id: "t1",  title: "Design login screen",        description: "Create high-fidelity mockups for the new login & signup pages.", status: "done",        priority: "high",   assigneeId: "1", dueDate: day(-5),  projectId: "p1", createdAt: day(-12) },
  { id: "t2",  title: "Set up CI/CD pipeline",       description: "GitHub Actions with preview deployments.",                       status: "in-progress", priority: "high",   assigneeId: "3", dueDate: day(2),   projectId: "p3", createdAt: day(-8)  },
  { id: "t3",  title: "Write API documentation",     description: "Document v2 endpoints with examples.",                           status: "todo",        priority: "medium", assigneeId: "5", dueDate: day(5),   projectId: "p3", createdAt: day(-3)  },
  { id: "t4",  title: "User research interviews",    description: "Talk to 8 customers about onboarding pain points.",               status: "in-progress", priority: "medium", assigneeId: "2", dueDate: day(-2),  projectId: "p1", createdAt: day(-10) },
  { id: "t5",  title: "Launch email campaign",       description: "Send launch announcement to subscriber list.",                   status: "todo",        priority: "high",   assigneeId: "4", dueDate: day(-1),  projectId: "p2", createdAt: day(-6)  },
  { id: "t6",  title: "Audit color tokens",          description: "Verify contrast ratios across themes.",                          status: "done",        priority: "low",    assigneeId: "6", dueDate: day(-9),  projectId: "p4", createdAt: day(-15) },
  { id: "t7",  title: "Build dashboard widgets",     description: "Charts, KPI cards, and activity feed.",                          status: "in-progress", priority: "high",   assigneeId: "1", dueDate: day(7),   projectId: "p6", createdAt: day(-4)  },
  { id: "t8",  title: "QA mobile checkout flow",     description: "Manual testing on iOS and Android.",                             status: "todo",        priority: "medium", assigneeId: "3", dueDate: day(3),   projectId: "p1", createdAt: day(-2)  },
  { id: "t9",  title: "Refactor auth middleware",    description: "Move to JWT with refresh tokens.",                               status: "done",        priority: "high",   assigneeId: "5", dueDate: day(-7),  projectId: "p3", createdAt: day(-14) },
  { id: "t10", title: "Social media assets",         description: "Instagram, LinkedIn, Twitter creative.",                         status: "todo",        priority: "low",    assigneeId: "6", dueDate: day(8),   projectId: "p2", createdAt: day(-1)  },
  { id: "t11", title: "Performance optimization",    description: "Lighthouse audit and fixes.",                                    status: "in-progress", priority: "medium", assigneeId: "3", dueDate: day(6),   projectId: "p6", createdAt: day(-5)  },
  { id: "t12", title: "Update onboarding flow",      description: "New 3-step welcome wizard.",                                     status: "done",        priority: "medium", assigneeId: "2", dueDate: day(-11), projectId: "p5", createdAt: day(-20) },
];
