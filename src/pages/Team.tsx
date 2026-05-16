import { useState } from "react";
import {
  Plus, Mail, MoreHorizontal, Search, Shield, UserCog, Lock, Trash2, CheckCircle, Clock
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/UserAvatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Role, Member } from "@/types";

export default function Team() {
  const { members, teamMembers, isAdmin, inviteMember, acceptInvite, updateMemberRole, removeMember, currentUser } = useStore();
  const currentUserId = currentUser?.id;

  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [role, setRole] = useState<Role>("Member");

  // Map teamMembers to full member objects with team status
  const mappedTeam = teamMembers.map(tm => {
    const user = members.find(m => m.id === tm.userId);
    return {
      ...user,
      teamMemberId: tm.id,
      role: tm.role,
      status: tm.status,
    } as Member & { teamMemberId: string; status: "invited" | "accepted" };
  }).filter(m => m.id); // ensure user exists

  const filtered = mappedTeam.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase())
  );

  const activeMembers = filtered.filter(m => m.status === "accepted");
  const invitedMembers = filtered.filter(m => m.status === "invited");

  // Users not yet in the team
  const availableUsers = members.filter(m => !teamMembers.find(tm => tm.userId === m.id));

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Please select a user to invite");
      return;
    }
    inviteMember(selectedUserId, role);
    setDialogOpen(false);
    setSelectedUserId("");
    setRole("Member");
  };

  const teamStats = [
    { label: "Total members", value: activeMembers.length,                                      icon: UserCog },
    { label: "Admins",        value: activeMembers.filter((m) => m.role === "Admin").length,    icon: Shield },
    { label: "Pending Invites",value: invitedMembers.length,   icon: Clock },
  ];

  const renderTable = (data: typeof mappedTeam, title: string, count: number) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>
      <Card className="border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-5 py-3">Member</th>
                <th className="text-left font-semibold px-5 py-3">Role</th>
                <th className="text-left font-semibold px-5 py-3">Status</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {data.map((m) => (
                <tr key={m.teamMemberId} className="border-t border-border hover:bg-secondary/30 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar member={m} />
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {m.name}
                          {m.id === currentUserId && (
                            <span className="text-[10px] text-primary font-semibold px-1.5 py-0.5 rounded bg-accent">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {isAdmin && m.id !== currentUserId && m.status === "accepted" ? (
                      <Select
                        value={m.role}
                        onValueChange={(v) => {
                          updateMemberRole(m.id, v as Role);
                          toast.success("Role updated");
                        }}
                      >
                        <SelectTrigger className="h-7 w-[110px] text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        m.role === "Admin"
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-secondary text-secondary-foreground border-border"
                      )}>
                        {m.role === "Admin" && <Shield className="h-3 w-3" />} {m.role}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {m.status === "accepted" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-warning">
                        <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Invited
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {m.status === "invited" && m.id === currentUserId && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 gap-1 border-success text-success hover:bg-success hover:text-white"
                          onClick={() => acceptInvite(m.teamMemberId)}
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Accept
                        </Button>
                      )}
                      {isAdmin && m.id !== currentUserId && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-8 w-8 rounded-md hover:bg-accent flex items-center justify-center">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {m.status === "accepted" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => {
                                    updateMemberRole(m.id, m.role === "Admin" ? "Member" : "Admin");
                                    toast.success("Role updated");
                                  }}
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make {m.role === "Admin" ? "Member" : "Admin"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => removeMember(m.teamMemberId)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground text-sm">
                    No members found in this section.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage team members and their permissions.</p>
        </div>
        {isAdmin ? (
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-gradient-primary hover:opacity-90 text-white shadow-sm gap-1.5"
          >
            <Plus className="h-4 w-4" /> Invite member
          </Button>
        ) : (
          <Button variant="outline" disabled className="gap-1.5">
            <Lock className="h-3.5 w-3.5" />Admin only
          </Button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {teamStats.map((s) => (
          <Card key={s.label} className="p-5 border-border/60 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center">
              <s.icon className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search team members..."
          className="pl-9 h-10 bg-secondary/30"
        />
      </div>

      {/* Sections */}
      <div className="animate-fade-in">
        {invitedMembers.length > 0 && renderTable(invitedMembers, "Invited Members", invitedMembers.length)}
        {renderTable(activeMembers, "Active Members", activeMembers.length)}
      </div>

      {/* Invite dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite to Workspace</DialogTitle>
            <DialogDescription>Select an existing user to invite to the workspace.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Select User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user..." />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">No available users</div>
                  ) : (
                    availableUsers.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin — full workspace access</SelectItem>
                  <SelectItem value="Member">Member — can manage assigned tasks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!selectedUserId} className="bg-gradient-primary text-white gap-1.5">
                <Mail className="h-4 w-4" />Send invite
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
