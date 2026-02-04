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
      title: "Q1 2025 Product Strategy Review",
      description: "Quarterly review of product roadmap and strategic initiatives",
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
      description: "Review customer feedback and support metrics",
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
      description: "Collaborative session to define new component patterns",
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
      description: "Monthly update for Series B investors",
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
      description: "Review of the v2.0 launch and lessons learned",
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
      description: "Weekly review of sales opportunities and forecasts",
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
      description: "Monthly team bonding and fun activities",
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
      description: "Technical planning for third-party integrations",
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
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardHover = {
  y: -4,
  transition: { duration: 0.3, ease: "easeOut" },
};

// ============================================
// GLASS CARD COMPONENT
// ============================================
function GlassCard({
  children,
  className = "",
  hover = true,
  glow = false,
  glowColor = "lime",
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glowColor?: "lime" | "purple" | "emerald";
}) {
  const glowStyles = {
    lime: "ring-1 ring-lime/20 shadow-[0_0_30px_rgba(202,255,75,0.08)]",
    purple: "ring-1 ring-purple/20 shadow-[0_0_30px_rgba(155,93,229,0.08)]",
    emerald: "ring-1 ring-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.12)]",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-[#111111]/80 backdrop-blur-xl",
        "border border-white/[0.06]",
        hover && "hover:border-lime/20 transition-all duration-400",
        glow && glowStyles[glowColor],
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================
// STATS CARD COMPONENT (Matching Screenshot)
// ============================================
function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  iconBg = "bg-lime/10",
  iconColor = "text-lime",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <GlassCard className="p-5 h-full">
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconBg)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
              {trend && (
                <Badge className="bg-lime/15 text-lime border-0 text-[10px] font-semibold px-1.5 py-0.5">
                  {trend}
                </Badge>
              )}
            </div>
            <p className="text-xs text-white/40 mt-0.5">{label}</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ============================================
// STATUS BADGE COMPONENT
// ============================================
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string; icon?: React.ReactNode }> = {
    SCHEDULED: {
      label: "Scheduled",
      className: "bg-lime/15 text-lime border-lime/20",
      icon: <Calendar className="w-3 h-3" />,
    },
    LIVE: {
      label: "Live Now",
      className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
      ),
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
  const { label, className, icon } = config[status] || config.SCHEDULED;

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium text-[11px] px-2 py-0.5 rounded-md", className)}>
      {icon}
      {label}
    </Badge>
  );
}

// ============================================
// AI BADGE COMPONENT
// ============================================
function AIBadge() {
  return (
    <Badge variant="outline" className="bg-purple/10 text-purple border-purple/20 gap-1 text-[11px] px-2 py-0.5 rounded-md">
      <Brain className="w-3 h-3" />
      AI
    </Badge>
  );
}

// ============================================
// MEETING CARD COMPONENT (Matching Screenshot)
// ============================================
function MeetingCard({
  meeting,
  isPast = false,
}: {
  meeting: typeof seedMeetings.upcoming[0] | typeof seedMeetings.past[0];
  isPast?: boolean;
}) {
  const isLive = meeting.status === "LIVE";
  const isCancelled = meeting.status === "CANCELLED";
  const pastMeeting = meeting as typeof seedMeetings.past[0];

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${meeting.roomId}`);
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={cardHover}
      className="group h-full"
    >
      <GlassCard
        className={cn(
          "h-full flex flex-col",
          isLive && "border-emerald-500/40",
          isCancelled && "opacity-60"
        )}
        glow={isLive}
        glowColor="emerald"
      >
        {/* Card Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Header Badges */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={meeting.status} />
              {meeting.hasAI && <AIBadge />}
              {(meeting as typeof seedMeetings.upcoming[0]).recurring && (
                <Badge variant="outline" className="bg-lime/10 text-lime border-lime/20 gap-1 text-[11px] px-2 py-0.5 rounded-md">
                  <TrendingUp className="w-3 h-3" />
                  Weekly
                </Badge>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-colors opacity-0 group-hover:opacity-100">
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
          <h3 className="font-semibold text-white text-base mb-1.5 line-clamp-1 group-hover:text-lime transition-colors">
            {meeting.title}
          </h3>
          <p className="text-sm text-white/40 line-clamp-1 mb-4">
            {meeting.description}
          </p>

          {/* Live Meeting - Currently Speaking */}
          {isLive && "currentSpeaker" in meeting && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime/80 to-lime flex items-center justify-center text-ink text-sm font-bold shadow-lg shadow-lime/20">
                    {meeting.participants[0]?.avatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#111] flex items-center justify-center">
                    <Mic className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Currently Speaking</p>
                  <p className="text-sm text-white font-medium">{meeting.currentSpeaker}</p>
                </div>
              </div>
            </div>
          )}

          {/* Meeting Details */}
          <div className="space-y-2.5 mb-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <Calendar className="w-3.5 h-3.5 text-lime/70" />
                <span>{format(new Date(meeting.scheduledStart), "MMM d, yyyy")}</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="w-3.5 h-3.5 text-purple/70" />
                <span>{format(new Date(meeting.scheduledStart), "h:mm a")}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Zap className="w-3.5 h-3.5 text-white/40" />
              <span>{meeting.duration} minutes</span>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-2">
              {meeting.participants.slice(0, 4).map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#111] shadow-sm",
                    i === 0 && "bg-gradient-to-br from-lime to-lime/80 text-ink",
                    i === 1 && "bg-gradient-to-br from-purple to-purple/80 text-white",
                    i === 2 && "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white",
                    i >= 3 && "bg-gradient-to-br from-amber-400 to-amber-500 text-ink"
                  )}
                  title={p.name}
                >
                  {p.avatar}
                </motion.div>
              ))}
              {meeting.participants.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-[10px] font-semibold text-white/60 border-2 border-[#111]">
                  +{meeting.participants.length - 4}
                </div>
              )}
            </div>
            <span className="text-xs text-white/40">
              {meeting.participants.length} participant{meeting.participants.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Past Meeting Summary */}
          {isPast && pastMeeting.summary && (
            <div className="mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-lime">{pastMeeting.summary.actionItems}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">Actions</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple">{pastMeeting.summary.keyDecisions}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">Decisions</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white/70">{pastMeeting.summary.duration}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">Duration</p>
                </div>
              </div>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action Button */}
          {!isCancelled && (
            <Link href={isPast ? `/meetings/${meeting.id}/summary` : `/meeting/${meeting.roomId}`}>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300",
                  isLive
                    ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25"
                    : isPast
                    ? "bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.06]"
                    : "bg-lime/10 hover:bg-lime text-lime hover:text-ink border border-lime/20 hover:border-lime"
                )}
              >
                {isLive ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    Join Live Meeting
                  </>
                ) : isPast ? (
                  <>
                    <FileText className="h-4 w-4" />
                    View Summary
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start Meeting
                  </>
                )}
                <ArrowRight className="h-4 w-4 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </motion.button>
            </Link>
          )}

          {isCancelled && (
            <div className="text-center py-2.5 text-xs text-white/30">
              {pastMeeting.cancelReason || "This meeting was cancelled"}
            </div>
          )}
        </div>
      </GlassCard>
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

  // Use seed data
  const upcomingMeetings = seedMeetings.upcoming;
  const pastMeetings = seedMeetings.past;

  // Filter meetings based on search
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

  // Calculate stats
  const liveMeetings = upcomingMeetings.filter((m) => m.status === "LIVE").length;
  const totalParticipants = upcomingMeetings.reduce((acc, m) => acc + m.participants.length, 0);
  const aiEnabledMeetings = [...upcomingMeetings, ...pastMeetings].filter((m) => m.hasAI).length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen text-white space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex items-center gap-4">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="absolute inset-0 bg-lime/30 blur-2xl rounded-full" />
            <div className="relative w-14 h-14 rounded-2xl bg-lime flex items-center justify-center shadow-xl shadow-lime/25">
              <Video className="w-7 h-7 text-ink" />
            </div>
          </motion.div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Meetings</h1>
              {liveMeetings > 0 && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[11px] font-semibold animate-pulse">
                  {liveMeetings} Live
                </Badge>
              )}
            </div>
            <p className="text-white/40 text-sm mt-0.5">
              Manage your AI-powered video meetings with real-time transcription and smart insights
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/meetings/schedule">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
            >
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Schedule</span>
            </motion.button>
          </Link>
          <Link href="/meetings/new">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(202,255,75,0.25)" }}
              whileTap={{ scale: 0.98 }}
              className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime text-ink font-semibold overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full"
                animate={{ translateX: ["100%", "-100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4 }}
              />
              <Plus className="h-4 w-4" />
              <span>New Meeting</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Video}
          label="Upcoming Meetings"
          value={upcomingMeetings.length}
          iconBg="bg-lime/10"
          iconColor="text-lime"
        />
        <StatsCard
          icon={Users}
          label="Total Participants"
          value={totalParticipants}
          iconBg="bg-purple/10"
          iconColor="text-purple"
        />
        <StatsCard
          icon={Brain}
          label="AI-Powered Meetings"
          value={aiEnabledMeetings}
          trend="+23%"
          iconBg="bg-lime/10"
          iconColor="text-lime"
        />
        <StatsCard
          icon={BarChart3}
          label="Hours This Week"
          value="12.5"
          iconBg="bg-purple/10"
          iconColor="text-purple"
        />
      </div>

      {/* Filters & Search */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        {/* Tabs */}
        <div className="flex p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300",
              activeTab === "upcoming"
                ? "bg-lime text-ink shadow-md"
                : "text-white/50 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            Upcoming ({upcomingMeetings.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300",
              activeTab === "past"
                ? "bg-lime text-ink shadow-md"
                : "text-white/50 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            Past ({pastMeetings.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-lg group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-lime transition-colors" />
          <input
            type="text"
            placeholder="Search meetings, participants, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-16 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder:text-white/30 focus:outline-none focus:border-lime/30 focus:bg-white/[0.04] transition-all text-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] text-white/40 font-mono">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2.5 rounded-lg transition-all",
              viewMode === "grid" ? "bg-lime/15 text-lime" : "text-white/40 hover:text-white"
            )}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2.5 rounded-lg transition-all",
              viewMode === "list" ? "bg-lime/15 text-lime" : "text-white/40 hover:text-white"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Meetings Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          className={cn(
            "grid gap-5",
            viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 max-w-4xl"
          )}
        >
          {filteredMeetings.length === 0 ? (
            <motion.div variants={itemVariants} className="col-span-full">
              <GlassCard hover={false}>
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-lime/20 to-purple/20 blur-3xl rounded-full" />
                    <div className="relative w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.06]">
                      {activeTab === "upcoming" ? (
                        <Video className="w-10 h-10 text-lime/50" />
                      ) : (
                        <Clock className="w-10 h-10 text-purple/50" />
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {searchQuery
                      ? "No meetings found"
                      : activeTab === "upcoming"
                      ? "No upcoming meetings"
                      : "No past meetings"}
                  </h3>
                  <p className="text-white/40 text-center max-w-sm mb-6 text-sm">
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : activeTab === "upcoming"
                      ? "Schedule a meeting or start an instant meeting to get started"
                      : "Your completed meetings will appear here with AI-generated summaries"}
                  </p>
                  {!searchQuery && activeTab === "upcoming" && (
                    <div className="flex gap-3">
                      <Link href="/meetings/schedule">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.06] transition-all text-sm font-medium"
                        >
                          Schedule
                        </motion.button>
                      </Link>
                      <Link href="/meetings/new">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-5 py-2.5 rounded-xl bg-lime text-ink font-semibold text-sm"
                        >
                          Start Now
                        </motion.button>
                      </Link>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            filteredMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                isPast={activeTab === "past"}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* AI Features Banner */}
      <motion.div variants={itemVariants}>
        <GlassCard hover={false} className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-lime/[0.03] via-transparent to-purple/[0.03]" />
          <div className="relative p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <motion.div
                  className="relative"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-lime/30 blur-xl rounded-full" />
                  <div className="relative w-14 h-14 rounded-2xl bg-lime flex items-center justify-center shadow-xl shadow-lime/25">
                    <Wand2 className="w-7 h-7 text-ink" />
                  </div>
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-0.5">AI Meeting Assistant</h3>
                  <p className="text-sm text-white/40">
                    Real-time transcription, smart summaries, and action item detection
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Globe, label: "100+ Languages" },
                  { icon: MessageSquare, label: "Live Captions" },
                  { icon: Star, label: "99% Accuracy" },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-lime/20 transition-colors"
                  >
                    <feature.icon className="h-3.5 w-3.5 text-lime" />
                    <span className="text-xs text-white/60 font-medium">{feature.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
