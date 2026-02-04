"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Bell,
  Plus,
  Menu,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Loader2,
  Command,
  ChevronDown,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { trpc } from "@/lib/api/client";
import { getInitials } from "@/lib/utils";
import { useState } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { data: user, isLoading } = trpc.user.me.useQuery();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-16 items-center justify-between border-b border-white/[0.04] bg-[#0a0a0a]/80 backdrop-blur-xl px-4 sm:px-6"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-lime/[0.02] via-transparent to-purple/[0.02] pointer-events-none" />

      {/* Mobile menu button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="lg:hidden relative p-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.04] transition-all"
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </motion.button>

      {/* Search */}
      <div className="hidden md:flex md:flex-1 md:max-w-md lg:max-w-lg">
        <motion.div
          className="relative w-full"
          animate={{
            scale: searchFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Search glow when focused */}
          <AnimatePresence>
            {searchFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -inset-1 bg-lime/10 rounded-2xl blur-xl"
              />
            )}
          </AnimatePresence>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search meetings, summaries..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-11 pr-20 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/30 focus:outline-none focus:border-lime/30 focus:bg-white/[0.05] transition-all text-sm"
            />
            {/* Keyboard shortcut indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] text-white/40 font-mono">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Status Badge - Desktop only */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime/5 border border-lime/10"
        >
          <div className="relative">
            <div className="w-1.5 h-1.5 rounded-full bg-lime" />
            <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-lime animate-ping" />
          </div>
          <span className="text-[10px] text-lime font-medium uppercase tracking-wider">AI Active</span>
        </motion.div>

        {/* New Meeting Button - Desktop */}
        <Link href="/meetings/new" className="hidden sm:block">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(202,255,75,0.25)" }}
            whileTap={{ scale: 0.98 }}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime text-ink font-semibold text-sm overflow-hidden group"
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
              animate={{ translateX: ["100%", "-100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            />
            <Plus className="h-4 w-4" />
            <span>New Meeting</span>
          </motion.button>
        </Link>

        {/* Mobile New Meeting Button */}
        <Link href="/meetings/new" className="sm:hidden" aria-label="New Meeting">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 rounded-xl bg-lime"
          >
            <Plus className="h-5 w-5 text-ink" />
          </motion.button>
        </Link>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05, rotate: 15 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.04] transition-all"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.04] transition-all"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {/* Notification badge */}
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime" />
          </span>
        </motion.button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-white/[0.04] transition-all group"
            >
              {/* Avatar */}
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-lime/50 to-purple/50 opacity-0 group-hover:opacity-100 blur transition-opacity" />
                {isLoading ? (
                  <div className="relative flex items-center justify-center h-9 w-9 rounded-full bg-white/[0.04]">
                    <Loader2 className="h-4 w-4 animate-spin text-lime" />
                  </div>
                ) : (
                  <Avatar className="relative h-9 w-9 ring-2 ring-white/[0.08] group-hover:ring-lime/30 transition-all">
                    <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-lime/20 to-purple/20 text-lime font-semibold text-sm">
                      {getInitials(user?.name || user?.email || "U")}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              {/* Name and dropdown indicator - Desktop only */}
              <div className="hidden lg:flex items-center gap-1">
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors max-w-[100px] truncate">
                  {user?.name?.split(" ")[0] || "User"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-white/40 group-hover:text-white/60 transition-colors" />
              </div>
            </motion.button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-64 bg-[#0d0d0d] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 p-2"
            align="end"
            sideOffset={8}
          >
            {/* User info header */}
            <div className="px-3 py-3 mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 ring-2 ring-lime/20">
                  <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-lime/20 to-purple/20 text-lime font-semibold">
                    {getInitials(user?.name || user?.email || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-white/50 truncate">{user?.email || ""}</p>
                </div>
              </div>

              {/* Plan badge */}
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Zap className="h-4 w-4 text-lime" />
                <span className="text-xs text-white/70">Free Plan</span>
                <Link href="/#pricing" className="ml-auto z-10">
                  <span className="text-[10px] text-lime font-medium hover:text-lime/80 transition-colors cursor-pointer">
                    Upgrade
                  </span>
                </Link>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-white/[0.06] mx-2" />

            <DropdownMenuItem
              className="px-3 py-2.5 cursor-pointer text-white/70 hover:text-white hover:bg-white/[0.04] rounded-xl mx-1 my-0.5 transition-colors focus:bg-white/[0.04] focus:text-white"
              onSelect={() => window.location.href = "/profile"}
            >
              <User className="mr-3 h-4 w-4 text-white/40" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              className="px-3 py-2.5 cursor-pointer text-white/70 hover:text-white hover:bg-white/[0.04] rounded-xl mx-1 my-0.5 transition-colors focus:bg-white/[0.04] focus:text-white"
              onSelect={() => window.location.href = "/settings"}
            >
              <Settings className="mr-3 h-4 w-4 text-white/40" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/[0.06] mx-2 my-2" />

            <DropdownMenuItem
              className="px-3 py-2.5 cursor-pointer text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl mx-1 my-0.5 transition-colors focus:bg-rose-500/10 focus:text-rose-300"
              onSelect={handleSignOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
