"use client";

import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Video,
  Calendar,
  Clock,
  CheckSquare,
  Plus,
  ArrowRight,
  Play,
  LogIn,
  Sparkles,
  Brain,
  Zap,
  TrendingUp,
  FileText,
  Target,
  Mic,
  BarChart3,
  Shield,
} from "lucide-react";
import { trpc } from "@/lib/api/client";

// ============================================
// ANIMATION VARIANTS
// ============================================
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// FLOATING BACKGROUND ORBS
// ============================================
function DashboardOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-[30%] -right-[20%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, rgba(168,85,247,0.04) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[20%] -left-[15%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, rgba(6,182,212,0.03) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
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
    <motion.div
      className={`
        relative rounded-2xl overflow-hidden
        bg-white/[0.03] backdrop-blur-xl
        border border-white/[0.08]
        ${hover ? "transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-xl hover:shadow-cyan-500/5" : ""}
        ${glow ? "shadow-[0_0_30px_rgba(6,182,212,0.1)]" : ""}
        ${className}
      `}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// GRADIENT TEXT
// ============================================
function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-cyan-400 via-violet-400 to-purple-400 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

// ============================================
// MAIN DASHBOARD
// ============================================
export default function DashboardPage() {
  const { data: user } = trpc.user.me.useQuery();
  const { data: meetingsData, isLoading: meetingsLoading } = trpc.meeting.list.useQuery({
    limit: 10,
  });

  const upcomingMeetings = meetingsData?.meetings.filter(
    (m) => m.status === "SCHEDULED" || m.status === "LIVE"
  ).slice(0, 4) || [];

  const pastMeetings = meetingsData?.meetings.filter(
    (m) => m.status === "ENDED"
  ).slice(0, 4) || [];

  const totalMeetings = meetingsData?.meetings.length || 0;
  const liveMeetings = meetingsData?.meetings.filter(m => m.status === "LIVE").length || 0;

  const greeting = getGreeting();
  const firstName = user?.name ? user.name.split(" ")[0] : "";

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <DashboardOrbs />

      {/* Main Content */}
      <div className="relative z-10 space-y-8 pb-8">
        {/* ============================================ */}
        {/* HERO WELCOME SECTION */}
        {/* ============================================ */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative"
        >
          {/* Welcome Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <motion.div variants={fadeInUp} className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs text-cyan-400 font-medium">{greeting}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                <span className="text-white">Welcome back</span>
                {firstName && (
                  <>
                    <span className="text-white">, </span>
                    <GradientText>{firstName}</GradientText>
                  </>
                )}
                <span className="text-white">!</span>
              </h1>
              <p className="text-white/50 text-base sm:text-lg max-w-xl">
                Your AI-powered meeting command center. Start collaborating, capture insights, and drive results.
              </p>
            </motion.div>

            {/* Quick Action Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              <Link href="/meetings/schedule">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium text-sm">Schedule</span>
                </motion.button>
              </Link>
              <Link href="/meetings/new">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(6,182,212,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Meeting</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* ============================================ */}
          {/* STATS GRID */}
          {/* ============================================ */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatsCard
              title="Total Meetings"
              value={meetingsLoading ? "-" : String(totalMeetings)}
              description="All time"
              icon={Video}
              gradient="from-cyan-500 to-cyan-600"
              loading={meetingsLoading}
            />
            <StatsCard
              title="Live Now"
              value={meetingsLoading ? "-" : String(liveMeetings)}
              description="Active sessions"
              icon={Play}
              gradient="from-emerald-500 to-green-600"
              loading={meetingsLoading}
              highlight={liveMeetings > 0}
              pulse={liveMeetings > 0}
            />
            <StatsCard
              title="Upcoming"
              value={meetingsLoading ? "-" : String(upcomingMeetings.length)}
              description="Scheduled"
              icon={Calendar}
              gradient="from-violet-500 to-purple-600"
              loading={meetingsLoading}
            />
            <StatsCard
              title="Completed"
              value={meetingsLoading ? "-" : String(pastMeetings.length)}
              description="This week"
              icon={CheckSquare}
              gradient="from-amber-500 to-orange-600"
              loading={meetingsLoading}
            />
          </motion.div>
        </motion.section>

        {/* ============================================ */}
        {/* MAIN CONTENT GRID */}
        {/* ============================================ */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Meetings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Meetings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Upcoming Meetings</h2>
                      <p className="text-xs text-white/40">Your scheduled sessions</p>
                    </div>
                  </div>
                  <Link href="/meetings" className="group flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                    View all
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <AnimatePresence mode="wait">
                  {meetingsLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02]">
                          <Skeleton className="h-12 w-12 rounded-xl bg-white/5" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4 bg-white/5" />
                            <Skeleton className="h-3 w-1/2 bg-white/5" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : upcomingMeetings.length === 0 ? (
                    <EmptyState
                      icon={Video}
                      title="No upcoming meetings"
                      description="Schedule a meeting or start an instant session"
                      actions={[
                        { label: "Schedule", href: "/meetings/schedule", primary: false },
                        { label: "Start Now", href: "/meetings/new", primary: true },
                      ]}
                    />
                  ) : (
                    <motion.div
                      key="meetings"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      {upcomingMeetings.map((meeting, index) => (
                        <MeetingCard
                          key={meeting.id}
                          title={meeting.title}
                          time={meeting.scheduledStart
                            ? format(new Date(meeting.scheduledStart), "MMM d, h:mm a")
                            : "Not scheduled"
                          }
                          timeRelative={meeting.scheduledStart
                            ? formatDistanceToNow(new Date(meeting.scheduledStart), { addSuffix: true })
                            : undefined
                          }
                          roomId={meeting.roomId}
                          isLive={meeting.status === "LIVE"}
                          index={index}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>

            {/* Recent Meetings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Recent Meetings</h2>
                      <p className="text-xs text-white/40">Review past sessions</p>
                    </div>
                  </div>
                  <Link href="/meetings" className="group flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                    View all
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <AnimatePresence mode="wait">
                  {meetingsLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02]">
                          <Skeleton className="h-12 w-12 rounded-xl bg-white/5" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4 bg-white/5" />
                            <Skeleton className="h-3 w-1/2 bg-white/5" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : pastMeetings.length === 0 ? (
                    <EmptyState
                      icon={Clock}
                      title="No recent meetings"
                      description="Your completed meetings will appear here with AI summaries"
                    />
                  ) : (
                    <motion.div
                      key="meetings"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      {pastMeetings.map((meeting, index) => (
                        <RecentMeetingCard
                          key={meeting.id}
                          id={meeting.id}
                          title={meeting.title}
                          time={meeting.actualStart
                            ? format(new Date(meeting.actualStart), "MMM d, h:mm a")
                            : "Completed"
                          }
                          index={index}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - Quick Actions & AI Features */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                    <p className="text-xs text-white/40">Start collaborating</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <QuickActionButton
                    href="/meetings/new"
                    icon={Video}
                    title="Start Instant Meeting"
                    description="Create a meeting now"
                    gradient="from-cyan-500 to-cyan-600"
                  />
                  <QuickActionButton
                    href="/meetings/schedule"
                    icon={Calendar}
                    title="Schedule Meeting"
                    description="Plan for later"
                    gradient="from-violet-500 to-purple-600"
                  />
                  <QuickActionButton
                    href="/meetings/join"
                    icon={LogIn}
                    title="Join Meeting"
                    description="Enter meeting code"
                    gradient="from-emerald-500 to-green-600"
                  />
                </div>
              </GlassCard>
            </motion.div>

            {/* AI Features Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <div className="relative rounded-2xl overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-violet-500/15 to-purple-500/20" />
                <div className="absolute inset-0 bg-[#030014]/80 backdrop-blur-xl" />

                {/* Animated Glow */}
                <motion.div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-500/20 blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="relative p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">AI Features</h2>
                      <p className="text-xs text-cyan-400">Powered by advanced AI</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <AIFeatureItem
                      icon={Mic}
                      title="Smart Transcription"
                      description="Real-time transcription in 100+ languages"
                      gradient="from-cyan-500 to-cyan-600"
                    />
                    <AIFeatureItem
                      icon={Target}
                      title="Action Items"
                      description="Auto-extract tasks from conversations"
                      gradient="from-violet-500 to-purple-600"
                    />
                    <AIFeatureItem
                      icon={FileText}
                      title="Meeting Summaries"
                      description="AI-generated briefs after each call"
                      gradient="from-amber-500 to-orange-600"
                    />
                    <AIFeatureItem
                      icon={BarChart3}
                      title="Engagement Analytics"
                      description="Insights on participation & sentiment"
                      gradient="from-emerald-500 to-green-600"
                    />
                  </div>

                  {/* Pro Badge */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-white/60">Enterprise-grade security</span>
                      </div>
                      <Link href="/settings" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                        Manage features →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Meeting Insights Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="p-6" hover={false}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Insights</h2>
                    <p className="text-xs text-white/40">Your meeting analytics</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <InsightItem
                    label="Avg. Meeting Duration"
                    value="45 min"
                    trend="+5%"
                    trendUp={false}
                  />
                  <InsightItem
                    label="AI Notes Generated"
                    value={totalMeetings > 0 ? `${totalMeetings}` : "0"}
                    trend="This month"
                  />
                  <InsightItem
                    label="Time Saved"
                    value="2.5 hrs"
                    trend="Weekly"
                    trendUp={true}
                  />
                </div>

                <Link href="/meetings" className="block mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium"
                  >
                    View Full Analytics
                  </motion.button>
                </Link>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ============================================
// STATS CARD COMPONENT
// ============================================
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
  loading,
  highlight,
  pulse,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  loading?: boolean;
  highlight?: boolean;
  pulse?: boolean;
}) {
  return (
    <motion.div variants={fadeInUp}>
      <GlassCard
        className={`p-5 ${highlight ? "border-emerald-500/30 shadow-emerald-500/10" : ""}`}
        glow={highlight}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-white/50 font-medium">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-16 bg-white/5" />
            ) : (
              <motion.p
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-3xl font-bold ${highlight ? "text-emerald-400" : "text-white"}`}
              >
                {value}
              </motion.p>
            )}
            <p className="text-[10px] text-white/40">{description}</p>
          </div>
          <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            {pulse && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-emerald-500"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <Icon className="w-6 h-6 text-white relative z-10" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ============================================
// MEETING CARD COMPONENT
// ============================================
function MeetingCard({
  title,
  time,
  timeRelative,
  roomId,
  isLive,
  index,
}: {
  title: string;
  time: string;
  timeRelative?: string;
  roomId: string;
  isLive?: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/meeting/${roomId}`}>
        <motion.div
          whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
            isLive
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-white/5 bg-white/[0.02] hover:border-white/10"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isLive
                ? "bg-gradient-to-br from-emerald-500 to-green-600"
                : "bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-white/10"
            }`}>
              <Video className={`w-5 h-5 ${isLive ? "text-white" : "text-cyan-400"}`} />
            </div>
            <div>
              <h3 className="font-medium text-white text-sm">{title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock className="w-3 h-3 text-white/40" />
                <span className="text-xs text-white/40">{time}</span>
                {timeRelative && (
                  <span className="text-xs text-cyan-400/60">• {timeRelative}</span>
                )}
                {isLive && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                )}
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              isLive
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isLive ? "Join" : "Start"}
          </motion.button>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ============================================
// RECENT MEETING CARD
// ============================================
function RecentMeetingCard({
  id,
  title,
  time,
  index,
}: {
  id: string;
  title: string;
  time: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
      className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="font-medium text-white text-sm">{title}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <Clock className="w-3 h-3 text-white/40" />
            <span className="text-xs text-white/40">{time}</span>
          </div>
        </div>
      </div>
      <Link href={`/meetings/${id}/summary`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg bg-violet-500/10 text-violet-400 text-xs font-medium hover:bg-violet-500/20 transition-all"
        >
          View Summary
        </motion.button>
      </Link>
    </motion.div>
  );
}

// ============================================
// QUICK ACTION BUTTON
// ============================================
function QuickActionButton({
  href,
  icon: Icon,
  title,
  description,
  gradient,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-300 cursor-pointer group"
      >
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-white text-sm group-hover:text-cyan-400 transition-colors">{title}</h3>
          <p className="text-xs text-white/40">{description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
      </motion.div>
    </Link>
  );
}

// ============================================
// AI FEATURE ITEM
// ============================================
function AIFeatureItem({
  icon: Icon,
  title,
  description,
  gradient,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="flex items-start gap-3 group">
      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{title}</h4>
        <p className="text-xs text-white/40">{description}</p>
      </div>
    </div>
  );
}

// ============================================
// INSIGHT ITEM
// ============================================
function InsightItem({
  label,
  value,
  trend,
  trendUp,
}: {
  label: string;
  value: string;
  trend: string;
  trendUp?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-xs text-white/50">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-white">{value}</span>
        <span className={`text-[10px] ${
          trendUp === undefined
            ? "text-white/30"
            : trendUp
            ? "text-emerald-400"
            : "text-amber-400"
        }`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================
function EmptyState({
  icon: Icon,
  title,
  description,
  actions,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actions?: { label: string; href: string; primary: boolean }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-white/30" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-white/40 max-w-xs mb-6">{description}</p>
      {actions && (
        <div className="flex gap-3">
          {actions.map((action) => (
            <Link key={action.label} href={action.href}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  action.primary
                    ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/25"
                    : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {action.label}
              </motion.button>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
