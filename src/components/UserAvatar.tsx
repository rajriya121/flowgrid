import { cn } from "@/lib/utils";
import type { Member } from "@/types";

const sizeClasses = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
} as const;

interface UserAvatarProps {
  member: Member;
  size?: keyof typeof sizeClasses;
  className?: string;
}

export function UserAvatar({ member, size = "md", className }: UserAvatarProps) {
  return (
    <div
      title={member.name}
      className={cn(
        "rounded-full bg-gradient-to-br flex items-center justify-center",
        "text-white font-semibold ring-2 ring-background shrink-0",
        member.color,
        sizeClasses[size],
        className
      )}
    >
      {member.initials}
    </div>
  );
}

interface AvatarStackProps {
  members?: Member[];
  memberIds?: string[];
  resolve?: (id: string) => Member | undefined;
  max?: number;
}

export function AvatarStack({ members, memberIds, resolve, max = 3 }: AvatarStackProps) {
  const list: Member[] =
    members ??
    (memberIds && resolve
      ? (memberIds.map(resolve).filter(Boolean) as Member[])
      : []);

  const visible = list.slice(0, max);
  const overflow = list.length - visible.length;

  return (
    <div className="flex -space-x-2">
      {visible.map((m) => (
        <UserAvatar key={m.id} member={m} size="sm" />
      ))}
      {overflow > 0 && (
        <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-semibold ring-2 ring-background">
          +{overflow}
        </div>
      )}
    </div>
  );
}
