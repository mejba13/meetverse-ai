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
  Sparkles,
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
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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
// AURORA BACKGROUND
// ============================================
function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Primary aurora orb - gold */}
      <motion.div
        className="absolute -top-[30%] -left-[15%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full"
        style={{
          background: "conic-gradient(from 180deg, rgba(20,33,61,0.6), rgba(252,161,17,0.12), rgba(20,33,61,0.4), rgba(252,161,17,0.06), rgba(20,33,61,0.6))",
          filter: "blur(140px)",
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />

      {/* Secondary orb - navy/gold blend */}
      <motion.div
        className="absolute top-[15%] right-[-20%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(252,161,17,0.08) 0%, rgba(20,33,61,0.25) 50%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom accent */}
      <motion.div
        className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(252,161,17,0.06) 0%, rgba(20,33,61,0.15) 60%, transparent 80%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(252,161,17,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(252,161,17,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

// ============================================
// GLASS CARD COMPONENT
// ============================================
function GlassCard({
  children,
  className = "",
  hover = true,
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.02]",
        "backdrop-blur-2xl",
        "border border-white/[0.08]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        hover && "hover:border-gold/30 hover:shadow-[0_8px_40px_rgba(252,161,17,0.08)] transition-all duration-500",
        glow && "ring-1 ring-gold/20",
        className
      )}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />
      {children}
    </div>
  );
}

// ============================================
// STATUS BADGE COMPONENT
// ============================================
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string; icon?: React.ReactNode }> = {
    SCHEDULED: {
      label: "Scheduled",
      className: "bg-gold/10 text-gold border-gold/30",
      icon: <Calendar className="w-3 h-3" />,
    },
    LIVE: {
      label: "Live Now",
      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
      icon: <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />,
    },
    ENDED: {
      label: "Completed",
      className: "bg-white/5 text-silver/70 border-white/10",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-500/10 text-red-400 border-red-500/30",
      icon: <Trash2 className="w-3 h-3" />,
    },
  };
  const { label, className, icon } = config[status] || config.SCHEDULED;

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium text-xs px-2.5 py-1", className)}>
      {icon}
      {label}
    </Badge>
  );
}

// ============================================
// MEETING CARD COMPONENT
// ============================================
function MeetingCard({ meeting, isPast = false }: { meeting: typeof seedMeetings.upcoming[0] | typeof seedMeetings.past[0]; isPast?: boolean }) {
  const isLive = meeting.status === "LIVE";
  const isCancelled = meeting.status === "CANCELLED";
  const pastMeeting = meeting as typeof seedMeetings.past[0];

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${meeting.roomId}`);
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group"
    >
      <GlassCard
        className={cn(
          isLive && "border-emerald-500/40 shadow-[0_8px_40px_rgba(16,185,129,0.15)]",
          isCancelled && "opacity-50"
        )}
        glow={isLive}
      >
        {/* Live indicator glow */}
        {isLive && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        )}

        {/* Top gradient accent line */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-[2px]",
          isLive
            ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300"
            : isCancelled
            ? "bg-gradient-to-r from-red-500/50 to-transparent"
            : "bg-gradient-to-r from-gold via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        )} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <StatusBadge status={meeting.status} />
                {meeting.hasAI && (
                  <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/30 gap-1.5 text-xs px-2.5 py-1">
                    <Sparkles className="w-3 h-3" />
                    AI
                  </Badge>
                )}
                {(meeting as typeof seedMeetings.upcoming[0]).recurring && (
                  <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30 gap-1.5 text-xs px-2.5 py-1">
                    <TrendingUp className="w-3 h-3" />
                    Weekly
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg text-white truncate group-hover:text-gold transition-colors duration-300">
                {meeting.title}
              </h3>
              <p className="text-sm text-silver/70 line-clamp-1 mt-1.5">
                {meeting.description}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2.5 rounded-xl text-silver/50 hover:text-white hover:bg-white/[0.06] transition-all duration-200">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-ink/95 backdrop-blur-xl border-white/[0.08] rounded-xl shadow-2xl">
                <DropdownMenuItem onClick={copyMeetingLink} className="text-silver hover:text-white hover:bg-white/[0.06] rounded-lg mx-1 cursor-pointer">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-silver hover:text-white hover:bg-white/[0.06] rounded-lg mx-1 cursor-pointer">
                  <Link href={`/meeting/${meeting.roomId}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in New Tab
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg mx-1 cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancel Meeting
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Live Meeting Info */}
          {isLive && 'currentSpeaker' in meeting && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full" />
                </div>
                <div>
                  <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wide">Currently Speaking</p>
                  <p className="text-sm text-white font-medium">{meeting.currentSpeaker}</p>
                </div>
              </div>
            </div>
          )}

          {/* Meeting Details */}
          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-gold" />
                </div>
                <span className="text-white/90 font-medium">{meeting.scheduledStart && format(new Date(meeting.scheduledStart), "MMM d, yyyy")}</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <span className="text-white/90 font-medium">{meeting.scheduledStart && format(new Date(meeting.scheduledStart), "h:mm a")}</span>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2.5 text-sm">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="text-white/80">{meeting.duration} minutes</span>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <div className="flex -space-x-2.5">
                {meeting.participants.slice(0, 4).map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-gold via-amber-500 to-orange-500 flex items-center justify-center text-xs font-bold text-ink border-2 border-ink ring-0 shadow-lg"
                    title={p.name}
                  >
                    {p.avatar}
                  </motion.div>
                ))}
                {meeting.participants.length > 4 && (
                  <div className="w-9 h-9 rounded-full bg-white/[0.08] backdrop-blur-sm flex items-center justify-center text-xs font-semibold text-white/70 border-2 border-ink">
                    +{meeting.participants.length - 4}
                  </div>
                )}
              </div>
              <span className="ml-4 text-sm text-silver/70">
                {meeting.participants.length} participant{meeting.participants.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Past Meeting Summary */}
          {isPast && pastMeeting.summary && (
            <div className="mb-5 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-gold">{pastMeeting.summary.actionItems}</p>
                  <p className="text-xs text-silver/60 mt-1">Action Items</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-violet-400">{pastMeeting.summary.keyDecisions}</p>
                  <p className="text-xs text-silver/60 mt-1">Decisions</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-emerald-400">{pastMeeting.summary.duration}</p>
                  <p className="text-xs text-silver/60 mt-1">Duration</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {!isCancelled && (
            <Link href={isPast ? `/meetings/${meeting.id}/summary` : `/meeting/${meeting.roomId}`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full py-3.5 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-300",
                  isLive
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : isPast
                    ? "bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] hover:border-white/[0.15]"
                    : "bg-gradient-to-r from-gold via-amber-500 to-gold bg-[length:200%_auto] hover:bg-right text-ink shadow-lg shadow-gold/25"
                )}
              >
                {isLive ? (
                  <>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
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
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          )}

          {isCancelled && (
            <div className="text-center py-3 text-sm text-silver/40">
              {(meeting as typeof seedMeetings.past[0]).cancelReason || "This meeting was cancelled"}
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ============================================
// STATS CARD COMPONENT
// ============================================
function StatsCard({ icon: Icon, label, value, trend, gradient }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  gradient: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <GlassCard className="p-5">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
            gradient
          )}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
            <p className="text-xs text-silver/60 truncate">{label}</p>
          </div>
          {trend && (
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs font-semibold">
              {trend}
            </Badge>
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
    <div className="min-h-screen text-white">
      <AuroraBackground />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 space-y-8"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold to-amber-500 blur-xl opacity-60" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-gold via-amber-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-gold/30">
                  <Video className="w-7 h-7 text-ink" />
                </div>
              </motion.div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white tracking-tight">Meetings</h1>
                  {liveMeetings > 0 && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse text-xs font-semibold">
                      {liveMeetings} Live
                    </Badge>
                  )}
                </div>
                <p className="text-silver/70 text-sm mt-0.5">
                  Manage your AI-powered video meetings with real-time transcription and smart insights
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/meetings/schedule">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300"
              >
                <Calendar className="h-4 w-4 text-gold" />
                <span className="font-medium">Schedule</span>
              </motion.button>
            </Link>
            <Link href="/meetings/new">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(252,161,17,0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center gap-2.5 px-6 py-3 rounded-xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gold via-amber-500 to-gold bg-[length:200%_auto] animate-gradient" />
                <div className="absolute inset-0 bg-gradient-to-r from-gold/50 to-amber-500/50 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                <Plus className="h-4 w-4 text-ink relative z-10" />
                <span className="font-semibold text-ink relative z-10">New Meeting</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            icon={Video}
            label="Upcoming Meetings"
            value={upcomingMeetings.length}
            gradient="bg-gradient-to-br from-gold to-amber-600 shadow-gold/30"
          />
          <StatsCard
            icon={Users}
            label="Total Participants"
            value={totalParticipants}
            gradient="bg-gradient-to-br from-violet-500 to-violet-700 shadow-violet-500/30"
          />
          <StatsCard
            icon={Brain}
            label="AI-Powered Meetings"
            value={aiEnabledMeetings}
            trend="+23%"
            gradient="bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-cyan-500/30"
          />
          <StatsCard
            icon={BarChart3}
            label="Hours This Week"
            value="12.5"
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-500/30"
          />
        </motion.div>

        {/* Filters & Search */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
          {/* Tabs */}
          <div className="flex p-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300",
                activeTab === "upcoming"
                  ? "bg-gradient-to-r from-gold to-amber-500 text-ink shadow-lg shadow-gold/25"
                  : "text-silver/70 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              Upcoming ({upcomingMeetings.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={cn(
                "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300",
                activeTab === "past"
                  ? "bg-gradient-to-r from-gold to-amber-500 text-ink shadow-lg shadow-gold/25"
                  : "text-silver/70 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              Past ({pastMeetings.length})
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-silver/40 group-focus-within:text-gold transition-colors" />
            <input
              type="text"
              placeholder="Search meetings, participants, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-silver/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/30 transition-all text-sm backdrop-blur-sm"
            />
          </div>

          {/* View Toggle */}
          <div className="flex p-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2.5 rounded-lg transition-all",
                viewMode === "grid" ? "bg-white/[0.08] text-white shadow-sm" : "text-silver/50 hover:text-white"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2.5 rounded-lg transition-all",
                viewMode === "list" ? "bg-white/[0.08] text-white shadow-sm" : "text-silver/50 hover:text-white"
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
              <motion.div variants={scaleIn} className="col-span-full">
                <GlassCard hover={false}>
                  <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/30 to-violet-500/30 blur-3xl rounded-full" />
                      <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-gold/20 to-violet-500/20 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                        {activeTab === "upcoming" ? (
                          <Video className="w-12 h-12 text-gold" />
                        ) : (
                          <Clock className="w-12 h-12 text-violet-400" />
                        )}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {searchQuery
                        ? "No meetings found"
                        : activeTab === "upcoming"
                        ? "No upcoming meetings"
                        : "No past meetings"}
                    </h3>
                    <p className="text-silver/60 text-center max-w-md mb-8">
                      {searchQuery
                        ? "Try adjusting your search terms"
                        : activeTab === "upcoming"
                        ? "Schedule a meeting or start an instant meeting to get started"
                        : "Your completed meetings will appear here with AI-generated summaries"}
                    </p>
                    {!searchQuery && activeTab === "upcoming" && (
                      <div className="flex gap-4">
                        <Link href="/meetings/schedule">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] transition-all text-sm font-semibold"
                          >
                            Schedule Meeting
                          </motion.button>
                        </Link>
                        <Link href="/meetings/new">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-amber-500 text-ink font-semibold text-sm shadow-lg shadow-gold/25"
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
            <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-violet-500/5" />
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <motion.div
                    className="relative"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gold to-amber-500 blur-2xl opacity-50" />
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-gold via-amber-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-gold/40">
                      <Sparkles className="w-8 h-8 text-ink" />
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">AI Meeting Assistant</h3>
                    <p className="text-sm text-silver/70">
                      Get real-time transcription, smart summaries, and action item detection
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Globe, label: "100+ Languages", color: "text-gold" },
                    { icon: MessageSquare, label: "Live Captions", color: "text-violet-400" },
                    { icon: Star, label: "99% Accuracy", color: "text-amber-400" },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] transition-all"
                    >
                      <feature.icon className={cn("h-4 w-4", feature.color)} />
                      <span className="text-sm text-silver/80 font-medium">{feature.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
