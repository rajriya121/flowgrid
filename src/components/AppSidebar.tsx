import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, ListTodo, Users, Settings, CheckSquare2, Sparkles,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

const MAIN_NAV = [
  { title: "Dashboard", url: "/",         icon: LayoutDashboard },
  { title: "Projects",  url: "/projects", icon: FolderKanban },
  { title: "Tasks",     url: "/tasks",    icon: ListTodo },
  { title: "Team",      url: "/team",     icon: Users },
];

const ACCOUNT_NAV = [
  { title: "Settings", url: "/settings", icon: Settings },
];

const NAV_BUTTON_CLASSES = cn(
  "h-9 rounded-lg font-medium transition-all",
  "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm",
  "hover:bg-sidebar-accent/50"
);

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  const renderNavItems = (items: typeof MAIN_NAV) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild isActive={isActive(item.url)} className={NAV_BUTTON_CLASSES}>
          <NavLink to={item.url} end={item.url === "/"}>
            <item.icon className="h-4 w-4" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Logo */}
      <SidebarHeader className="border-b border-sidebar-border">
        <div className={cn("flex items-center gap-2.5 px-2 py-2", collapsed && "justify-center px-0")}>
          <Logo className={cn("shrink-0", collapsed ? "h-8 w-8" : "h-9 w-9")} />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-sm tracking-tight text-primary">FLOWGRID</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Enterprise Workflow</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
              Workspace
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(MAIN_NAV)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
              Account
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(ACCOUNT_NAV)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Upgrade prompt */}
      {!collapsed && (
        <SidebarFooter className="border-t border-sidebar-border p-3">
          <div className="rounded-xl bg-gradient-soft p-3 border border-sidebar-border">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-2 leading-snug">
              Unlock enterprise-grade analytics, automations, and priority support.
            </p>
            <button className="w-full text-xs font-semibold py-1.5 rounded-md bg-gradient-primary text-white hover:opacity-90 transition shadow-sm">
              Upgrade
            </button>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
