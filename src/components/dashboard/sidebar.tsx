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
    <aside className={cn("flex flex-col border-r border-white/10 dark:border-navy/50 bg-white dark:bg-navy h-full", className)}>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-white/10 dark:border-white/5 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-gradient-to-br from-brand-500 to-brand-600 shadow-sm">
          <Video className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-white">MeetVerse AI</span>
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

        <div className="my-4 border-t border-white/10 dark:border-white/5" />

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
          <div className="bg-gradient-to-br from-brand-500/10 via-brand-500/5 to-violet-500/10 dark:from-gold/10 dark:via-gold/5 dark:to-amber-500/10 border border-brand-500/20 dark:border-gold/20 rounded-[4px] p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Upgrade to Pro</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-silver">
              Get unlimited meetings and full AI features
            </p>
            <Link
              href="/#pricing"
              onClick={handleClick}
              className="mt-3 inline-flex items-center text-sm font-medium text-brand-500 dark:text-gold hover:text-brand-400 dark:hover:text-gold/80 hover:underline"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}
