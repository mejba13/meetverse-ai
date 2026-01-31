"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Video,
  LayoutDashboard,
  Calendar,
  Settings,
  User,
  LogIn,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Meetings", href: "/meetings", icon: Video },
  { name: "Schedule", href: "/meetings/schedule", icon: Calendar },
  { name: "Join Meeting", href: "/meetings/join", icon: LogIn },
];

const secondaryNavigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const handleClick = () => {
    onNavigate?.();
  };

  return (
    <aside className={cn("flex flex-col border-r bg-card h-full", className)}>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
          <Video className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold">MeetVerse AI</span>
      </div>

      {/* Quick Action */}
      <div className="p-4">
        <Button className="w-full" asChild>
          <Link href="/meetings/new" onClick={handleClick}>
            <Plus className="mr-2 h-4 w-4" />
            New Meeting
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/meetings" && pathname?.startsWith(item.href + "/")) ||
              (item.href === "/meetings" && pathname === "/meetings");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleClick}
                className={cn(
                  "sidebar-item",
                  isActive && "sidebar-item-active"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="my-4 border-t" />

        <div className="space-y-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleClick}
                className={cn(
                  "sidebar-item",
                  isActive && "sidebar-item-active"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Upgrade Card */}
        <div className="mt-auto pb-4">
          <div className="rounded-xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 p-4">
            <h4 className="font-semibold">Upgrade to Pro</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Get unlimited meetings and full AI features
            </p>
            <Link
              href="/#pricing"
              onClick={handleClick}
              className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}
