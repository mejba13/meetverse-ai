"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
  Crown,
  ArrowRight,
  Brain,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
  { name: "Meetings", href: "/meetings", icon: Video, badge: null },
  { name: "Schedule", href: "/meetings/schedule", icon: Calendar, badge: null },
  { name: "Join Meeting", href: "/meetings/join", icon: LogIn, badge: null },
];

const secondaryNavigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

// Animated background orb for sidebar
function SidebarOrb() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-20 -left-20 w-40 h-40 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(202,255,75,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 -right-10 w-32 h-32 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(155,93,229,0.06) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}

// Navigation Item Component
function NavItem({
  item,
  isActive,
  onClick,
  index,
}: {
  item: { name: string; href: string; icon: React.ComponentType<{ className?: string }>; badge?: string | null };
  isActive: boolean;
  onClick?: () => void;
  index: number;
}) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={item.href} onClick={onClick}>
        <motion.div
          className={cn(
            "group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
            isActive
              ? "text-lime"
              : "text-white/50 hover:text-white"
          )}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Active indicator bar */}
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-lime rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Background glow for active state */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-lime/5 border border-lime/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Icon with glow on active */}
          <div className="relative z-10">
            {isActive && (
              <div className="absolute inset-0 bg-lime blur-lg opacity-30" />
            )}
            <Icon className={cn(
              "h-5 w-5 transition-colors duration-300 relative",
              isActive ? "text-lime" : "text-white/40 group-hover:text-white/70"
            )} />
          </div>

          <span className="relative z-10">{item.name}</span>

          {/* Badge */}
          {item.badge && (
            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-lime/10 text-lime border border-lime/20">
              {item.badge}
            </span>
          )}

          {/* Hover arrow */}
          <ChevronRight className={cn(
            "ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300",
            "group-hover:opacity-50 group-hover:translate-x-0",
            isActive && "opacity-0"
          )} />
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Secondary Nav Item
function SecondaryNavItem({
  item,
  isActive,
  onClick,
  index,
}: {
  item: { name: string; href: string; icon: React.ComponentType<{ className?: string }> };
  isActive: boolean;
  onClick?: () => void;
  index: number;
}) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={item.href} onClick={onClick}>
        <motion.div
          className={cn(
            "group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
            isActive
              ? "text-purple bg-purple/5 border border-purple/10"
              : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
          )}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon className={cn(
            "h-4 w-4 transition-colors",
            isActive ? "text-purple" : "text-white/30 group-hover:text-white/50"
          )} />
          <span>{item.name}</span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const handleClick = () => {
    onNavigate?.();
  };

  return (
    <aside className={cn(
      "relative flex flex-col h-full overflow-hidden",
      "bg-gradient-to-b from-[#0d0d0d] to-[#0a0a0a]",
      "border-r border-white/[0.04]",
      className
    )}>
      {/* Animated background */}
      <SidebarOrb />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-20 items-center gap-3 border-b border-white/[0.04] px-6"
      >
        <div className="relative group">
          {/* Logo glow */}
          <motion.div
            className="absolute inset-0 bg-lime rounded-xl blur-xl opacity-30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Logo container */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-lime shadow-lg shadow-lime/20 group-hover:shadow-lime/40 transition-shadow duration-300">
            <Video className="h-5 w-5 text-ink" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white tracking-tight">
            MeetVerse
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-lime font-medium">
            AI Platform
          </span>
        </div>
      </motion.div>

      {/* Quick Action - New Meeting Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative p-4"
      >
        <Link href="/meetings/new" onClick={handleClick}>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(202,255,75,0.25)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-lime text-ink font-semibold text-sm overflow-hidden group"
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
              animate={{ translateX: ["100%", "-100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <Plus className="h-4 w-4" />
            <span>New Meeting</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Main Navigation */}
      <nav className="relative flex-1 flex flex-col gap-1 px-3 py-2 overflow-y-auto scrollbar-hide">
        {/* Primary Navigation */}
        <div className="space-y-1">
          <p className="px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-white/30 font-medium">
            Main Menu
          </p>
          {navigation.map((item, index) => {
            const isActive = pathname === item.href ||
              (item.href !== "/meetings" && pathname?.startsWith(item.href + "/")) ||
              (item.href === "/meetings" && pathname === "/meetings");
            return (
              <NavItem
                key={item.name}
                item={item}
                isActive={isActive}
                onClick={handleClick}
                index={index}
              />
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 mx-4 border-t border-white/[0.04]" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          <p className="px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-white/30 font-medium">
            Account
          </p>
          {secondaryNavigation.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <SecondaryNavItem
                key={item.name}
                item={item}
                isActive={isActive}
                onClick={handleClick}
                index={index}
              />
            );
          })}
        </div>

        {/* Upgrade Card - Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-auto pt-4"
        >
          <div className="relative overflow-hidden rounded-2xl">
            {/* Card background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-lime/10 via-purple/5 to-ink" />
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-xl" />

            {/* Animated glow orbs */}
            <motion.div
              className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-lime/20 blur-2xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-5 -left-5 w-16 h-16 rounded-full bg-purple/20 blur-2xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />

            <div className="relative p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime/20">
                  <Crown className="h-4 w-4 text-lime" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Upgrade to Pro</h4>
                  <p className="text-[10px] text-white/40">Unlock all features</p>
                </div>
              </div>

              <p className="text-xs text-white/50 mb-4 leading-relaxed">
                Get unlimited meetings, full AI transcription, and advanced analytics.
              </p>

              <Link href="/#pricing" onClick={handleClick}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-xs font-medium hover:bg-white/[0.08] hover:border-lime/20 transition-all duration-300"
                >
                  <Sparkles className="h-3.5 w-3.5 text-lime" />
                  Learn More
                  <ArrowRight className="h-3.5 w-3.5" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* AI Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4 mb-2 px-4"
        >
          <div className="flex items-center gap-2 py-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-lime" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-lime animate-ping" />
            </div>
            <span className="text-[10px] text-white/40 uppercase tracking-wider">AI Online</span>
            <Brain className="h-3 w-3 text-lime/50 ml-auto" />
          </div>
        </motion.div>
      </nav>
    </aside>
  );
}
