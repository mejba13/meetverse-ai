"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
} from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { trpc } from "@/lib/api/client";
import { getInitials } from "@/lib/utils";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { data: user, isLoading } = trpc.user.me.useQuery();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-ink px-4 sm:px-6">
      {/* Mobile menu button */}
      <button
        className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-silver/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all"
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="hidden md:flex md:w-96">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-silver/50" />
          <input
            type="text"
            placeholder="Search meetings, summaries..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-silver/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* New Meeting Button */}
        <Link href="/meetings/new" className="hidden sm:block">
          <button className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl overflow-hidden group transition-all duration-300">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold via-amber-500 to-gold bg-[length:200%_auto] animate-gradient" />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/50 to-amber-500/50 blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
            <Plus className="h-4 w-4 text-ink relative z-10" />
            <span className="font-semibold text-sm text-ink relative z-10">New Meeting</span>
          </button>
        </Link>

        {/* Mobile New Meeting Button */}
        <Link href="/meetings/new" className="sm:hidden" aria-label="New Meeting">
          <button className="relative p-2.5 rounded-xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-gold to-amber-500" />
            <Plus className="h-5 w-5 text-ink relative z-10" />
          </button>
        </Link>

        {/* Theme Toggle */}
        <button
          className="p-2.5 rounded-xl text-gray-600 dark:text-silver/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all relative"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl text-gray-600 dark:text-silver/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold shadow-lg shadow-gold/50" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-gold/30 transition-all overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-white/[0.04]">
                  <Loader2 className="h-5 w-5 animate-spin text-gold" />
                </div>
              ) : (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-gold/20 to-amber-500/20 text-gold font-semibold">
                    {getInitials(user?.name || user?.email || "U")}
                  </AvatarFallback>
                </Avatar>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white dark:bg-ink border border-gray-200 dark:border-white/[0.08] rounded-xl shadow-xl" align="end" forceMount>
            <DropdownMenuLabel className="font-normal px-4 py-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 dark:text-silver/60 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/[0.06]" />
            <DropdownMenuItem asChild className="px-4 py-2.5 cursor-pointer text-gray-700 dark:text-silver/80 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04] rounded-lg mx-2 my-1">
              <Link href="/profile">
                <User className="mr-3 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="px-4 py-2.5 cursor-pointer text-gray-700 dark:text-silver/80 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04] rounded-lg mx-2 my-1">
              <Link href="/settings">
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/[0.06]" />
            <DropdownMenuItem
              className="px-4 py-2.5 cursor-pointer text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg mx-2 my-1"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
