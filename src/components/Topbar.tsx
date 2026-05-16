import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Bell, Sun, Moon, Plus, ChevronDown,
  LogOut, User, Settings as SettingsIcon, Shield, UserCog,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubContent,
  DropdownMenuSubTrigger, DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import { UserAvatar } from "@/components/UserAvatar";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { useStore } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { currentUser, notifications, markNotificationRead, logout, isAdmin } = useStore();
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6">
      <SidebarTrigger className="hover:bg-accent rounded-md" />

      {/* Search bar */}
      <div className="hidden md:flex items-center relative max-w-md w-full">
        <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
        <Input
          placeholder="Search projects, tasks, people..."
          className="pl-9 h-9 bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:border-border"
        />
        <kbd className="hidden lg:inline-flex absolute right-3 text-[10px] font-mono bg-background border border-border rounded px-1.5 py-0.5 text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="flex-1" />

      {/* Quick-add task (admin only) */}
      {isAdmin && (
        <Button
          size="sm"
          className="h-9 hidden sm:inline-flex bg-gradient-primary hover:opacity-90 text-white shadow-sm gap-1.5"
          onClick={() => setNewTaskOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      )}

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 relative" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            {notifications.some((n: any) => !n.read) && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full ring-2 ring-background" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0">
          <div className="p-3 border-b border-border font-semibold text-sm">Notifications</div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
            ) : (
              notifications.map((notif: any) => (
                <div 
                  key={notif._id} 
                  className={cn("p-3 text-sm border-b border-border hover:bg-accent cursor-pointer transition", !notif.read && "bg-primary/5")}
                  onClick={() => !notif.read && markNotificationRead(notif._id)}
                >
                  {notif.message}
                </div>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-accent transition">
            <UserAvatar member={currentUser} size="sm" />
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{currentUser?.name}</span>
              <span className="text-xs text-muted-foreground font-normal flex items-center gap-1">
                {currentUser?.role === "Admin" && <Shield className="h-3 w-3" />}
                {currentUser?.role}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <User className="h-4 w-4 mr-2" />Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <SettingsIcon className="h-4 w-4 mr-2" />Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => { logout(); navigate("/login"); }}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TaskFormDialog open={newTaskOpen} onOpenChange={setNewTaskOpen} />
    </header>
  );
}
