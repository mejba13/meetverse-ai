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
  Sparkles,
} from "lucide-react";

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
    <aside className={cn("flex flex-col border-r border-white/[0.06] bg-white dark:bg-ink h-full", className)}>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 dark:border-white/[0.06] px-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gold to-amber-500 blur-lg opacity-40" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold via-amber-400 to-gold shadow-lg shadow-gold/20">
            <Video className="h-4 w-4 text-ink" />
          </div>
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
          MeetVerse <span className="bg-gradient-to-r from-gold to-amber-400 bg-clip-text text-transparent">AI</span>
        </span>
      </div>

      {/* Quick Action - New Meeting Button */}
      <div className="p-4">
        <Link href="/meetings/new" onClick={handleClick}>
          <button className="w-full relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl overflow-hidden group transition-all duration-300">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold via-amber-500 to-gold bg-[length:200%_auto] animate-gradient" />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/50 to-amber-500/50 blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
            <Plus className="h-4 w-4 text-ink relative z-10" />
            <span className="font-semibold text-sm text-ink relative z-10">New Meeting</span>
          </button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
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
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-gold/15 to-amber-500/10 text-gold border border-gold/20"
                    : "text-gray-600 dark:text-silver/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04]"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-gold")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="my-4 border-t border-gray-200 dark:border-white/[0.06]" />

        <div className="space-y-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleClick}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-gold/15 to-amber-500/10 text-gold border border-gold/20"
                    : "text-gray-600 dark:text-silver/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04]"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-gold")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Upgrade Card */}
        <div className="mt-auto pb-4">
          <div className="relative overflow-hidden rounded-xl border border-gold/20 p-4">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-amber-500/5 to-violet-500/10" />
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-gold" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Upgrade to Pro</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-silver/70">
                Get unlimited meetings and full AI features
              </p>
              <Link
                href="/#pricing"
                onClick={handleClick}
                className="mt-3 inline-flex items-center text-sm font-medium text-brand-500 dark:text-gold hover:text-brand-400 dark:hover:text-gold/80 transition-colors"
              >
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
