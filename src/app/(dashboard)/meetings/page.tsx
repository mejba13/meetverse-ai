"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format, addDays, addHours, subDays, subHours } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// STATUS BADGE COMPONENT
// ============================================
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string; icon?: React.ReactNode }> = {
    SCHEDULED: {
      label: "Scheduled",
      className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      icon: <Calendar className="w-3 h-3" />,
    },
    LIVE: {
      label: "Live Now",
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse",
      icon: <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />,
    },
    ENDED: {
      label: "Completed",
      className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
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
    <Badge variant="outline" className={cn("gap-1.5 font-medium", className)}>
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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <Card className={cn(
        "relative overflow-hidden border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-sm",
        "hover:border-white/[0.15] hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300",
        isLive && "border-emerald-500/30 shadow-lg shadow-emerald-500/10",
        isCancelled && "opacity-60"
      )}>
        {/* Live indicator glow */}
        {isLive && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
        )}

        {/* Top gradient line */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-[2px]",
          isLive ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400" :
          isCancelled ? "bg-gradient-to-r from-red-500/50 to-transparent" :
          "bg-gradient-to-r from-cyan-500/50 via-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        )} />

        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={meeting.status} />
                {meeting.hasAI && (
                  <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/20 gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI
                  </Badge>
                )}
                {(meeting as typeof seedMeetings.upcoming[0]).recurring && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Weekly
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg text-white truncate group-hover:text-cyan-400 transition-colors">
                {meeting.title}
              </h3>
              <p className="text-sm text-white/50 line-clamp-1 mt-1">
                {meeting.description}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-white/10">
                <DropdownMenuItem onClick={copyMeetingLink} className="text-white/70 hover:text-white focus:text-white">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-white/70 hover:text-white focus:text-white">
                  <Link href={`/meeting/${meeting.roomId}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in New Tab
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="text-red-400 hover:text-red-300 focus:text-red-300">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancel Meeting
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Live Meeting Info */}
          {isLive && 'currentSpeaker' in meeting && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="text-xs text-emerald-400 font-medium">Currently Speaking</p>
                  <p className="text-sm text-white">{meeting.currentSpeaker}</p>
                </div>
              </div>
            </div>
          )}

          {/* Meeting Details */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                {meeting.scheduledStart && format(new Date(meeting.scheduledStart), "MMM d, yyyy")}
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-400" />
                {meeting.scheduledStart && format(new Date(meeting.scheduledStart), "h:mm a")}
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{meeting.duration} minutes</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {meeting.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-md bg-white/5 text-white/50 border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Participants */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {meeting.participants.slice(0, 4).map((p, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-xs font-medium text-white border-2 border-[#0d0d1a] ring-0"
                    title={p.name}
                  >
                    {p.avatar}
                  </div>
                ))}
                {meeting.participants.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-white/60 border-2 border-[#0d0d1a]">
                    +{meeting.participants.length - 4}
                  </div>
                )}
              </div>
              <span className="ml-3 text-sm text-white/40">
                {meeting.participants.length} participant{meeting.participants.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Past Meeting Summary */}
          {isPast && pastMeeting.summary && (
            <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-cyan-400">{pastMeeting.summary.actionItems}</p>
                  <p className="text-xs text-white/40">Action Items</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-violet-400">{pastMeeting.summary.keyDecisions}</p>
                  <p className="text-xs text-white/40">Decisions</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-400">{pastMeeting.summary.duration}</p>
                  <p className="text-xs text-white/40">Duration</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {!isCancelled && (
            <Button
              asChild
              className={cn(
                "w-full font-medium transition-all duration-300",
                isLive
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/25"
                  : isPast
                  ? "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  : "bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white shadow-lg shadow-cyan-500/20"
              )}
            >
              <Link href={isPast ? `/meetings/${meeting.id}/summary` : `/meeting/${meeting.roomId}`}>
                {isLive ? (
                  <>
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    Join Live Meeting
                  </>
                ) : isPast ? (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    View Summary & Transcript
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Meeting
                  </>
                )}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          )}

          {isCancelled && (
            <div className="text-center py-2 text-sm text-white/40">
              {(meeting as typeof seedMeetings.past[0]).cancelReason || "This meeting was cancelled"}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================
// STATS CARD COMPONENT
// ============================================
function StatsCard({ icon: Icon, label, value, trend, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-sm hover:border-white/[0.15] transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              color
            )}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/50">{label}</p>
            </div>
            {trend && (
              <Badge className="ml-auto bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                {trend}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
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
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Meetings</h1>
              {liveMeetings > 0 && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse">
                  {liveMeetings} Live
                </Badge>
              )}
            </div>
            <p className="text-white/50">
              Manage your AI-powered video meetings with real-time transcription and smart insights
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
              <Link href="/meetings/schedule">
                <Calendar className="mr-2 h-4 w-4 text-cyan-400" />
                Schedule
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white shadow-lg shadow-cyan-500/25">
              <Link href="/meetings/new">
                <Plus className="mr-2 h-4 w-4" />
                New Meeting
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            icon={Video}
            label="Upcoming Meetings"
            value={upcomingMeetings.length}
            color="bg-gradient-to-br from-cyan-500 to-cyan-600"
          />
          <StatsCard
            icon={Users}
            label="Total Participants"
            value={totalParticipants}
            color="bg-gradient-to-br from-violet-500 to-violet-600"
          />
          <StatsCard
            icon={Brain}
            label="AI-Powered Meetings"
            value={aiEnabledMeetings}
            trend="+23%"
            color="bg-gradient-to-br from-amber-500 to-orange-600"
          />
          <StatsCard
            icon={BarChart3}
            label="Hours This Week"
            value="12.5"
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
        </motion.div>

        {/* Filters & Search */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
          {/* Tabs */}
          <div className="flex p-1 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === "upcoming"
                  ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              Upcoming ({upcomingMeetings.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === "past"
                  ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              Past ({pastMeetings.length})
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search meetings, participants, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20"
            />
          </div>

          {/* View Toggle */}
          <div className="flex p-1 rounded-lg bg-white/[0.03] border border-white/[0.08]">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "grid" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "list" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
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
                <Card className="border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center mb-6">
                      {activeTab === "upcoming" ? (
                        <Video className="w-10 h-10 text-cyan-400" />
                      ) : (
                        <Clock className="w-10 h-10 text-violet-400" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {searchQuery
                        ? "No meetings found"
                        : activeTab === "upcoming"
                        ? "No upcoming meetings"
                        : "No past meetings"}
                    </h3>
                    <p className="text-white/50 text-center max-w-sm mb-6">
                      {searchQuery
                        ? "Try adjusting your search terms"
                        : activeTab === "upcoming"
                        ? "Schedule a meeting or start an instant meeting to get started"
                        : "Your completed meetings will appear here with AI-generated summaries"}
                    </p>
                    {!searchQuery && activeTab === "upcoming" && (
                      <div className="flex gap-3">
                        <Button variant="outline" asChild className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
                          <Link href="/meetings/schedule">Schedule Meeting</Link>
                        </Button>
                        <Button asChild className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white">
                          <Link href="/meetings/new">Start Now</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
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

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="border-white/[0.08] bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-purple-500/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">AI Meeting Assistant</h3>
                    <p className="text-sm text-white/50">
                      Get real-time transcription, smart summaries, and action item detection
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
                    <Globe className="mr-2 h-4 w-4 text-cyan-400" />
                    100+ Languages
                  </Button>
                  <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
                    <MessageSquare className="mr-2 h-4 w-4 text-violet-400" />
                    Live Captions
                  </Button>
                  <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
                    <Star className="mr-2 h-4 w-4 text-amber-400" />
                    99% Accuracy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
