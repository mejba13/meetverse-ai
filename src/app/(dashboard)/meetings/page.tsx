"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format, addDays, addHours, subDays, subHours } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Users,
  MoreVertical,
  Play,
  ExternalLink,
  Copy,
  Trash2,
  Search,
  TrendingUp,
  FileText,
  CheckCircle2,
  ArrowRight,
  Zap,
  Brain,
  BarChart3,
  Grid3X3,
  List,
  Mic,
  Globe,
  Star,
  MessageSquare,
  Command,
  Wand2,
  Radio,
  Target,
  LogIn,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// ============================================
// SEED DATA FOR TESTING
// ============================================
const seedMeetings = {
  upcoming: [
    {
      id: "1",
      title: "Q1 2026 Product Strategy Review",
      description: "Quarterly review of product roadmap and strategic initiatives for growth",
      status: "SCHEDULED",
      roomId: "prod-strategy-q1",
      scheduledStart: addDays(new Date(), 1).toISOString(),
      duration: 60,
      participants: [
        { name: "Sarah Chen", avatar: "SC", role: "Product Lead" },
        { name: "Mike Johnson", avatar: "MJ", role: "Engineering" },
        { name: "Emily Davis", avatar: "ED", role: "Design" },
        { name: "Alex Kim", avatar: "AK", role: "Marketing" },
      ],
      tags: ["Strategy", "Product"],
      hasAI: true,
      recurring: "weekly",
    },
    {
      id: "2",
      title: "Engineering Sprint Planning",
      description: "Plan sprint goals and assign tasks for the upcoming two weeks",
      status: "LIVE",
      roomId: "eng-sprint-planning",
      scheduledStart: new Date().toISOString(),
      actualStart: subHours(new Date(), 0.5).toISOString(),
      duration: 45,
      participants: [
        { name: "David Park", avatar: "DP", role: "Tech Lead" },
        { name: "Lisa Wang", avatar: "LW", role: "Backend" },
        { name: "Tom Brown", avatar: "TB", role: "Frontend" },
      ],
      tags: ["Engineering", "Sprint"],
      hasAI: true,
      liveTranscript: true,
      currentSpeaker: "David Park",
    },
    {
      id: "3",
      title: "Customer Success Weekly Sync",
      description: "Review customer feedback and support metrics for continuous improvement",
      status: "SCHEDULED",
      roomId: "cs-weekly-sync",
      scheduledStart: addHours(new Date(), 3).toISOString(),
      duration: 30,
      participants: [
        { name: "Rachel Green", avatar: "RG", role: "CS Manager" },
        { name: "James Wilson", avatar: "JW", role: "Support Lead" },
      ],
      tags: ["Customer Success"],
      hasAI: true,
    },
    {
      id: "4",
      title: "Design System Workshop",
      description: "Collaborative session to define new component patterns and guidelines",
      status: "SCHEDULED",
      roomId: "design-workshop",
      scheduledStart: addDays(new Date(), 2).toISOString(),
      duration: 90,
      participants: [
        { name: "Emily Davis", avatar: "ED", role: "Design Lead" },
        { name: "Chris Lee", avatar: "CL", role: "UI Designer" },
        { name: "Anna Smith", avatar: "AS", role: "UX Researcher" },
        { name: "Tom Brown", avatar: "TB", role: "Frontend" },
        { name: "Nina Patel", avatar: "NP", role: "Product" },
      ],
      tags: ["Design", "Workshop"],
      hasAI: true,
    },
    {
      id: "5",
      title: "Investor Update Call",
      description: "Monthly update for Series B investors on key metrics and progress",
      status: "SCHEDULED",
      roomId: "investor-update",
      scheduledStart: addDays(new Date(), 3).toISOString(),
      duration: 45,
      participants: [
        { name: "CEO John", avatar: "CJ", role: "CEO" },
        { name: "CFO Maria", avatar: "CM", role: "CFO" },
      ],
      tags: ["Investors", "Finance"],
      hasAI: true,
      isPrivate: true,
    },
  ],
  past: [
    {
      id: "6",
      title: "Product Launch Retrospective",
      description: "Review of the v2.0 launch and lessons learned across the team",
      status: "ENDED",
      roomId: "launch-retro",
      scheduledStart: subDays(new Date(), 2).toISOString(),
      actualStart: subDays(new Date(), 2).toISOString(),
      actualEnd: subDays(subHours(new Date(), 1), 2).toISOString(),
      duration: 60,
      participants: [
        { name: "Sarah Chen", avatar: "SC", role: "Product Lead" },
        { name: "Mike Johnson", avatar: "MJ", role: "Engineering" },
        { name: "Emily Davis", avatar: "ED", role: "Design" },
      ],
      tags: ["Product", "Retrospective"],
      hasAI: true,
      summary: {
        actionItems: 8,
        keyDecisions: 5,
        duration: "58 min",
        sentiment: "positive",
      },
    },
    {
      id: "7",
      title: "Sales Pipeline Review",
      description: "Weekly review of sales opportunities and quarterly forecasts",
      status: "ENDED",
      roomId: "sales-pipeline",
      scheduledStart: subDays(new Date(), 1).toISOString(),
      actualStart: subDays(new Date(), 1).toISOString(),
      actualEnd: subDays(subHours(new Date(), 0.5), 1).toISOString(),
      duration: 30,
      participants: [
        { name: "Mark Sales", avatar: "MS", role: "Sales Director" },
        { name: "Jenny Liu", avatar: "JL", role: "Account Exec" },
      ],
      tags: ["Sales"],
      hasAI: true,
      summary: {
        actionItems: 12,
        keyDecisions: 3,
        duration: "32 min",
        sentiment: "neutral",
      },
    },
    {
      id: "8",
      title: "Team Building Session",
      description: "Monthly team bonding and fun activities for better collaboration",
      status: "ENDED",
      roomId: "team-building",
      scheduledStart: subDays(new Date(), 5).toISOString(),
      actualStart: subDays(new Date(), 5).toISOString(),
      actualEnd: subDays(subHours(new Date(), 2), 5).toISOString(),
      duration: 120,
      participants: [
        { name: "Whole Team", avatar: "WT", role: "Everyone" },
      ],
      tags: ["Team", "Culture"],
      hasAI: false,
      summary: {
        actionItems: 0,
        keyDecisions: 0,
        duration: "1h 45min",
        sentiment: "positive",
      },
    },
    {
      id: "9",
      title: "API Integration Planning",
      description: "Technical planning for third-party integrations and partnerships",
      status: "CANCELLED",
      roomId: "api-planning",
      scheduledStart: subDays(new Date(), 3).toISOString(),
      duration: 45,
      participants: [
        { name: "Lisa Wang", avatar: "LW", role: "Backend" },
        { name: "External Dev", avatar: "ED", role: "Partner" },
      ],
      tags: ["Engineering", "Integration"],
      hasAI: true,
      cancelReason: "Rescheduled to next week",
    },
  ],
};

// ============================================
// ANIMATION VARIANTS
// ============================================
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// FLOATING ORBS
// ============================================
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-[15%] -right-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(202,255,75,0.06) 0%, rgba(202,255,75,0.015) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[55%] -left-[12%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(155,93,229,0.06) 0%, rgba(155,93,229,0.015) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `linear-gradient(rgba(202,255,75,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(202,255,75,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

function PulsingDot({ color = "bg-[#CAFF4B]" }: { color?: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-50", color)} />
      <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", color)} />
    </span>
  );
}

// ============================================
// STATUS CONFIG
// ============================================
const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  SCHEDULED: {
    label: "Scheduled",
    className: "bg-[#CAFF4B]/10 text-[#CAFF4B] border-[#CAFF4B]/20",
    icon: <Calendar className="w-3 h-3" />,
  },
  LIVE: {
    label: "Live Now",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    icon: <PulsingDot color="bg-emerald-400" />,
  },
  ENDED: {
    label: "Completed",
    className: "bg-white/5 text-white/50 border-white/10",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: <Trash2 className="w-3 h-3" />,
  },
};

// ============================================
// MEETING CARD COMPONENT
// ============================================
function MeetingCard({
  meeting,
  isPast = false,
  viewMode = "grid",
}: {
  meeting: (typeof seedMeetings.upcoming)[0] | (typeof seedMeetings.past)[0];
  isPast?: boolean;
  viewMode?: "grid" | "list";
}) {
  const isLive = meeting.status === "LIVE";
  const isCancelled = meeting.status === "CANCELLED";
  const pastMeeting = meeting as (typeof seedMeetings.past)[0];
  const upcomingMeeting = meeting as (typeof seedMeetings.upcoming)[0];
  const status = statusConfig[meeting.status] || statusConfig.SCHEDULED;

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${meeting.roomId}`);
  };

  const avatarColors = [
    "from-[#CAFF4B] to-emerald-400",
    "from-[#9B5DE5] to-violet-400",
    "from-cyan-400 to-blue-400",
    "from-amber-400 to-orange-400",
    "from-rose-400 to-pink-400",
  ];

  if (viewMode === "list") {
    return (
      <motion.div variants={fadeInUp} whileHover={{ y: -2 }} className="group">
        <div
          className={cn(
            "relative rounded-2xl overflow-hidden transition-all duration-400",
            "bg-[#111111]/80 backdrop-blur-xl border border-white/[0.05]",
            "hover:border-[#CAFF4B]/20",
            isLive && "border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.08)]",
            isCancelled && "opacity-50"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#CAFF4B]/[0.01] via-transparent to-[#9B5DE5]/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative p-5 flex items-center gap-5">
            {/* Time Column */}
            <div className="hidden sm:flex flex-col items-center text-center w-16 flex-shrink-0">
              <span className="text-2xl font-bold text-white">{format(new Date(meeting.scheduledStart), "HH:mm")}</span>
              <span className="text-[10px] text-white/30 mt-0.5">{format(new Date(meeting.scheduledStart), "MMM d")}</span>
            </div>

            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={cn("gap-1 text-[10px] px-2 py-0 rounded-md font-semibold", status.className)}>
                  {status.icon}
                  {status.label}
                </Badge>
                {meeting.hasAI && (
                  <Badge variant="outline" className="bg-[#9B5DE5]/10 text-[#9B5DE5] border-[#9B5DE5]/20 gap-1 text-[10px] px-2 py-0 rounded-md">
                    <Brain className="w-2.5 h-2.5" />
                    AI
                  </Badge>
                )}
              </div>
              <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#CAFF4B] transition-colors">
                {meeting.title}
              </h3>
              <p className="text-xs text-white/35 truncate mt-0.5">{meeting.description}</p>
            </div>

            {/* Participants */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <div className="flex -space-x-2">
                {meeting.participants.slice(0, 3).map((p, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-[#111] bg-gradient-to-br text-white",
                      avatarColors[i % avatarColors.length]
                    )}
                  >
                    {p.avatar}
                  </div>
                ))}
              </div>
              <span className="text-[11px] text-white/30">{meeting.participants.length}</span>
            </div>

            {/* Duration */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-white/30 flex-shrink-0">
              <Clock className="w-3 h-3" />
              {meeting.duration}m
            </div>

            {/* Action */}
            {!isCancelled && (
              <Link href={isPast ? `/meetings/${meeting.id}/summary` : `/meeting/${meeting.roomId}`} className="flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all",
                    isLive
                      ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                      : isPast
                      ? "bg-white/[0.05] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/[0.06]"
                      : "bg-[#CAFF4B]/10 hover:bg-[#CAFF4B] text-[#CAFF4B] hover:text-[#0a0a0a] border border-[#CAFF4B]/20 hover:border-[#CAFF4B]"
                  )}
                >
                  {isLive ? "Join" : isPast ? "Summary" : "Start"}
                  <ArrowRight className="w-3 h-3" />
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view card
  return (
    <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="group h-full">
      <div
        className={cn(
          "relative h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-400",
          "bg-[#111111]/80 backdrop-blur-xl border border-white/[0.05]",
          "hover:border-[#CAFF4B]/20",
          isLive && "border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.1)]",
          isCancelled && "opacity-50"
        )}
      >
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#CAFF4B]/[0.015] via-transparent to-[#9B5DE5]/[0.015] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Live indicator bar */}
        {isLive && (
          <div className="h-[2px] bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" />
        )}

        <div className="relative p-5 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={cn("gap-1.5 font-semibold text-[10px] px-2 py-0.5 rounded-md", status.className)}>
                {status.icon}
                {status.label}
              </Badge>
              {meeting.hasAI && (
                <Badge variant="outline" className="bg-[#9B5DE5]/10 text-[#9B5DE5] border-[#9B5DE5]/20 gap-1 text-[10px] px-2 py-0.5 rounded-md">
                  <Brain className="w-3 h-3" />
                  AI
                </Badge>
              )}
              {upcomingMeeting.recurring && (
                <Badge variant="outline" className="bg-[#CAFF4B]/10 text-[#CAFF4B] border-[#CAFF4B]/20 gap-1 text-[10px] px-2 py-0.5 rounded-md">
                  <TrendingUp className="w-3 h-3" />
                  Weekly
                </Badge>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/[0.05] transition-all opacity-0 group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#111] backdrop-blur-xl border-white/[0.08] rounded-xl">
                <DropdownMenuItem onClick={copyMeetingLink} className="text-white/70 hover:text-white hover:bg-white/[0.05] cursor-pointer">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-white/70 hover:text-white hover:bg-white/[0.05] cursor-pointer">
                  <Link href={`/meeting/${meeting.roomId}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in New Tab
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancel Meeting
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title & Description */}
          <h3 className="font-bold text-white text-[15px] mb-1.5 line-clamp-1 group-hover:text-[#CAFF4B] transition-colors">
            {meeting.title}
          </h3>
          <p className="text-xs text-white/35 line-clamp-2 mb-4 leading-relaxed">
            {meeting.description}
          </p>

          {/* Currently Speaking (Live) */}
          {isLive && "currentSpeaker" in meeting && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-emerald-500/20">
                    {meeting.participants[0]?.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#111] flex items-center justify-center border border-emerald-500/30">
                    <Mic className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Speaking</p>
                  <p className="text-sm text-white font-semibold">{meeting.currentSpeaker}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-emerald-400 rounded-full"
                      animate={{ height: [4, 12 + Math.random() * 8, 4] }}
                      transition={{ duration: 0.5 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Meeting Details */}
          <div className="flex items-center gap-3 text-xs text-white/40 mb-3.5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#CAFF4B]/50" />
              {format(new Date(meeting.scheduledStart), "MMM d, yyyy")}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/15" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#9B5DE5]/50" />
              {format(new Date(meeting.scheduledStart), "h:mm a")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/30 mb-4">
            <Zap className="w-3 h-3" />
            <span>{meeting.duration} minutes</span>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex -space-x-2">
              {meeting.participants.slice(0, 4).map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#111] bg-gradient-to-br text-white shadow-sm",
                    avatarColors[i % avatarColors.length]
                  )}
                  title={p.name}
                >
                  {p.avatar}
                </motion.div>
              ))}
              {meeting.participants.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] font-semibold text-white/50 border-2 border-[#111]">
                  +{meeting.participants.length - 4}
                </div>
              )}
            </div>
            <span className="text-[11px] text-white/30">
              {meeting.participants.length} participant{meeting.participants.length !== 1 && "s"}
            </span>
          </div>

          {/* Past Meeting Summary */}
          {isPast && pastMeeting.summary && (
            <div className="mb-5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-[#CAFF4B]">{pastMeeting.summary.actionItems}</p>
                  <p className="text-[10px] text-white/25">Actions</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-[#9B5DE5]">{pastMeeting.summary.keyDecisions}</p>
                  <p className="text-[10px] text-white/25">Decisions</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white/60">{pastMeeting.summary.duration}</p>
                  <p className="text-[10px] text-white/25">Duration</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1" />

          {/* Action Button */}
          {!isCancelled ? (
            <Link href={isPast ? `/meetings/${meeting.id}/summary` : `/meeting/${meeting.roomId}`}>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-between transition-all duration-300",
                  isLive
                    ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                    : isPast
                    ? "bg-white/[0.03] hover:bg-white/[0.06] text-white/60 hover:text-white border border-white/[0.06]"
                    : "bg-[#CAFF4B]/[0.08] hover:bg-[#CAFF4B] text-[#CAFF4B] hover:text-[#0a0a0a] border border-[#CAFF4B]/20 hover:border-[#CAFF4B]"
                )}
              >
                <span className="flex items-center gap-2">
                  {isLive ? (
                    <><Radio className="h-4 w-4" /> Join Live Meeting</>
                  ) : isPast ? (
                    <><FileText className="h-4 w-4" /> View Summary &amp; Notes</>
                  ) : (
                    <><Play className="h-4 w-4" /> Start Meeting</>
                  )}
                </span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          ) : (
            <div className="py-3 text-center text-xs text-white/25">
              {pastMeeting.cancelReason || "This meeting was cancelled"}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN MEETINGS PAGE
// ============================================
export default function MeetingsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const upcomingMeetings = seedMeetings.upcoming;
  const pastMeetings = seedMeetings.past;

  const filteredMeetings = useMemo(() => {
    const meetings = activeTab === "upcoming" ? upcomingMeetings : pastMeetings;
    if (!searchQuery) return meetings;
    return meetings.filter(
      (m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeTab, searchQuery, upcomingMeetings, pastMeetings]);

  const liveMeetings = upcomingMeetings.filter((m) => m.status === "LIVE").length;
  const totalParticipants = upcomingMeetings.reduce((acc, m) => acc + m.participants.length, 0);
  const aiEnabledMeetings = [...upcomingMeetings, ...pastMeetings].filter((m) => m.hasAI).length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative min-h-[calc(100vh-120px)] text-white -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 px-4 sm:px-6 pt-4 sm:pt-6"
    >
      <FloatingOrbs />
      <GridPattern />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* ================================================
            HERO HEADER
            ================================================ */}
        <motion.div variants={fadeInUp}>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CAFF4B]/[0.08] border border-[#CAFF4B]/20 mb-5"
                whileHover={{ scale: 1.02 }}
              >
                <PulsingDot />
                <span className="text-[11px] font-semibold text-[#CAFF4B] tracking-wide uppercase">
                  Meeting Command Center
                </span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
                <span className="text-white">Your </span>
                <span className="bg-gradient-to-r from-[#CAFF4B] via-[#9EF01A] to-[#CAFF4B] bg-clip-text text-transparent">
                  Meetings
                </span>
              </h1>
              <p className="text-base text-white/35 max-w-lg leading-relaxed">
                Manage, schedule, and review AI-powered video meetings with
                real-time transcription, smart summaries, and actionable insights
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/meetings/join">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="font-medium text-sm">Join</span>
                </motion.button>
              </Link>
              <Link href="/meetings/schedule">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium text-sm">Schedule</span>
                </motion.button>
              </Link>
              <Link href="/meetings/new">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(202,255,75,0.25)" }}
                  whileTap={{ scale: 0.97 }}
                  className="relative flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#CAFF4B] to-[#9EF01A] text-[#0a0a0a] font-bold text-sm overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ translateX: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                  />
                  <Plus className="h-4 w-4" />
                  <span>New Meeting</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ================================================
            STATS ROW
            ================================================ */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Video,
              value: upcomingMeetings.length,
              label: "Upcoming Meetings",
              gradient: "from-[#CAFF4B] to-emerald-400",
              iconBg: "bg-[#CAFF4B]/10",
            },
            {
              icon: Users,
              value: totalParticipants,
              label: "Total Participants",
              gradient: "from-[#9B5DE5] to-violet-400",
              iconBg: "bg-[#9B5DE5]/10",
            },
            {
              icon: Brain,
              value: aiEnabledMeetings,
              label: "AI-Powered Meetings",
              gradient: "from-cyan-400 to-blue-400",
              iconBg: "bg-cyan-400/10",
              trend: "+23%",
            },
            {
              icon: BarChart3,
              value: "12.5",
              label: "Hours This Week",
              gradient: "from-amber-400 to-orange-400",
              iconBg: "bg-amber-400/10",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ y: -3, scale: 1.02 }}
              className="group relative rounded-2xl bg-[#111111]/80 backdrop-blur-xl border border-white/[0.05] hover:border-[#CAFF4B]/15 transition-all duration-400 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#CAFF4B]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-5">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.iconBg)}>
                    <stat.icon className={cn("w-5 h-5 bg-gradient-to-br bg-clip-text", stat.gradient)} style={{ color: "inherit" }} />
                    <stat.icon className="w-5 h-5 text-[#CAFF4B]/80 absolute" style={{ display: "none" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                      {stat.trend && (
                        <Badge className="bg-[#CAFF4B]/10 text-[#CAFF4B] border-0 text-[10px] font-bold px-1.5 py-0">
                          {stat.trend}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-white/30 mt-0.5">{stat.label}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ================================================
            LIVE MEETING BANNER (if any live)
            ================================================ */}
        {liveMeetings > 0 && (
          <motion.div variants={fadeInUp}>
            <div className="relative rounded-2xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" />
              <div className="bg-emerald-500/[0.05] backdrop-blur-xl border-x border-b border-emerald-500/20 rounded-b-2xl p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 bg-emerald-500/30 rounded-xl blur-xl"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div className="relative w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Radio className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-base font-bold text-white">Live Meeting in Progress</h3>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] animate-pulse">
                          {liveMeetings} Active
                        </Badge>
                      </div>
                      <p className="text-sm text-white/40">
                        <span className="font-medium text-emerald-400">Engineering Sprint Planning</span> — David Park is speaking
                      </p>
                    </div>
                  </div>
                  <Link href="/meeting/eng-sprint-planning">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                    >
                      <Radio className="w-4 h-4" />
                      Join Now
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================
            FILTERS & SEARCH
            ================================================ */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
          {/* Tabs */}
          <div className="flex p-1 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            {(["upcoming", "past"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 capitalize",
                  activeTab === tab
                    ? "bg-[#CAFF4B] text-[#0a0a0a] shadow-md shadow-[#CAFF4B]/10"
                    : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                )}
              >
                {tab} ({tab === "upcoming" ? upcomingMeetings.length : pastMeetings.length})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-lg group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 group-focus-within:text-[#CAFF4B] transition-colors" />
            <input
              type="text"
              placeholder="Search meetings, participants, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-16 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-white/25 focus:outline-none focus:border-[#CAFF4B]/30 focus:bg-white/[0.04] transition-all text-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/30 font-mono">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex p-1 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            {([
              { mode: "grid" as const, icon: Grid3X3 },
              { mode: "list" as const, icon: List },
            ]).map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "p-2.5 rounded-lg transition-all",
                  viewMode === mode ? "bg-[#CAFF4B]/15 text-[#CAFF4B]" : "text-white/30 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* ================================================
            MEETINGS GRID / LIST
            ================================================ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${viewMode}`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={staggerContainer}
            className={cn(
              viewMode === "grid"
                ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                : "space-y-3 max-w-5xl"
            )}
          >
            {filteredMeetings.length === 0 ? (
              <motion.div variants={fadeInUp} className="col-span-full">
                <div className="relative rounded-2xl bg-[#111111]/80 backdrop-blur-xl border border-white/[0.05] overflow-hidden">
                  <div className="flex flex-col items-center justify-center py-20 px-6">
                    <motion.div
                      className="relative mb-6"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#CAFF4B]/20 to-[#9B5DE5]/20 blur-3xl rounded-full" />
                      <div className="relative w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.06]">
                        {activeTab === "upcoming" ? (
                          <Video className="w-10 h-10 text-[#CAFF4B]/40" />
                        ) : (
                          <Clock className="w-10 h-10 text-[#9B5DE5]/40" />
                        )}
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {searchQuery ? "No meetings found" : activeTab === "upcoming" ? "No upcoming meetings" : "No past meetings"}
                    </h3>
                    <p className="text-white/35 text-center max-w-sm mb-6 text-sm leading-relaxed">
                      {searchQuery
                        ? "Try adjusting your search terms or create a new meeting"
                        : activeTab === "upcoming"
                        ? "Schedule a meeting or start an instant one to get started with AI-powered collaboration"
                        : "Your completed meetings will appear here with AI-generated summaries"}
                    </p>
                    {!searchQuery && activeTab === "upcoming" && (
                      <div className="flex gap-3">
                        <Link href="/meetings/schedule">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06] transition-all text-sm font-medium"
                          >
                            Schedule
                          </motion.button>
                        </Link>
                        <Link href="/meetings/new">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-5 py-2.5 rounded-xl bg-[#CAFF4B] text-[#0a0a0a] font-bold text-sm"
                          >
                            Start Now
                          </motion.button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              filteredMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  isPast={activeTab === "past"}
                  viewMode={viewMode}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* ================================================
            AI FEATURES BANNER
            ================================================ */}
        <motion.div variants={fadeInUp} className="pb-6">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-[#CAFF4B] via-[#9B5DE5] to-[#CAFF4B]" />
            <div className="bg-[#111111]/90 backdrop-blur-xl border-x border-b border-white/[0.05] rounded-b-3xl p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <motion.div
                    className="relative flex-shrink-0"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 bg-[#9B5DE5]/30 blur-xl rounded-full" />
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9B5DE5] to-violet-600 flex items-center justify-center shadow-xl shadow-[#9B5DE5]/25">
                      <Wand2 className="w-7 h-7 text-white" />
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">AI Meeting Intelligence</h3>
                    <p className="text-sm text-white/35 max-w-md leading-relaxed">
                      Every meeting powered by real-time transcription, smart summaries,
                      action item detection, and multilingual support
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { icon: Globe, label: "100+ Languages", color: "text-[#CAFF4B]" },
                    { icon: MessageSquare, label: "Live Captions", color: "text-[#9B5DE5]" },
                    { icon: Target, label: "Action Items", color: "text-amber-400" },
                    { icon: Star, label: "99% Accuracy", color: "text-emerald-400" },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] transition-all"
                    >
                      <feature.icon className={cn("h-3.5 w-3.5", feature.color)} />
                      <span className="text-xs text-white/50 font-medium">{feature.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
