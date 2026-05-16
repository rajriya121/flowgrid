import { Sun, Moon, Bell, Shield, User as UserIcon, Monitor } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ThemeProvider";
import { UserAvatar } from "@/components/UserAvatar";
import { useStore } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NOTIFICATION_PREFS = [
  { label: "Email notifications",  desc: "Get notified when something needs your attention." },
  { label: "Task assignments",     desc: "Notify me when a task is assigned to me." },
  { label: "Weekly digest",        desc: "Send me a summary of activity every Monday." },
  { label: "Mentions",             desc: "Notify me when someone @mentions me." },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { currentUser } = useStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your profile, notification preferences, and workspace behavior.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-secondary/60">
          <TabsTrigger value="profile"       className="gap-1.5"><UserIcon className="h-3.5 w-3.5" />Profile</TabsTrigger>
          <TabsTrigger value="appearance"    className="gap-1.5"><Monitor className="h-3.5 w-3.5" />Appearance</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" />Notifications</TabsTrigger>
          <TabsTrigger value="security"      className="gap-1.5"><Shield className="h-3.5 w-3.5" />Security</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6 border-border/60">
            <h3 className="font-semibold mb-1">Profile information</h3>
            <p className="text-xs text-muted-foreground mb-6">Keep your professional information up to date.</p>

            <div className="flex items-center gap-5 pb-6 border-b border-border">
              <UserAvatar member={currentUser} size="lg" />
              <div>
                <Button variant="outline" size="sm">Upload new photo</Button>
                <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated"); }}
              className="grid sm:grid-cols-2 gap-4 pt-6"
            >
              <div className="space-y-1.5">
                <Label htmlFor="profile-name">Full name</Label>
                <Input id="profile-name" defaultValue={currentUser.name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-role">Role</Label>
                <Input id="profile-role" defaultValue={currentUser.role} disabled />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" type="email" defaultValue={currentUser.email} />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <Button variant="outline" type="button">Cancel</Button>
                <Button type="submit" className="bg-gradient-primary text-white">Save changes</Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <Card className="p-6 border-border/60">
            <h3 className="font-semibold mb-1">Appearance</h3>
            <p className="text-xs text-muted-foreground mb-6">Customize the visual appearance of your FlowGrid workspace.</p>

            <Label className="mb-3 block">Theme</Label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {[
                { id: "light", label: "Light", icon: Sun },
                { id: "dark",  label: "Dark",  icon: Moon },
              ].map((t) => {
                const Icon = t.icon;
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as "light" | "dark")}
                    className={cn(
                      "p-4 rounded-xl border-2 transition flex flex-col items-center gap-2",
                      active
                        ? "border-primary bg-accent shadow-sm"
                        : "border-border hover:border-border/80 hover:bg-secondary/50"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="p-6 border-border/60 space-y-4">
            <h3 className="font-semibold">Notifications</h3>
            {NOTIFICATION_PREFS.map((n, i) => (
              <div
                key={n.label}
                className={cn("flex items-center justify-between py-3", i > 0 && "border-t border-border")}
              >
                <div>
                  <p className="font-medium text-sm">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <Switch defaultChecked={i < 2} />
              </div>
            ))}
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card className="p-6 border-border/60 space-y-5">
            <div>
              <h3 className="font-semibold">Password</h3>
              <p className="text-xs text-muted-foreground">Last updated 3 months ago</p>
            </div>
            <Button variant="outline">Change password</Button>
            <div className="border-t border-border pt-5 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
              </div>
              <Switch />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
