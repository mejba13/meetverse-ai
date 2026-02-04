"use client";

import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useState, useEffect } from "react";
import {
  Video,
  Calendar,
  Clock,
  CheckSquare,
  Plus,
  ArrowRight,
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
  Activity,
} from "lucide-react";
import { trpc } from "@/lib/api/client";

// ============================================
// ANIMATION VARIANTS - Premium staggered reveals
// ============================================
const orchestratedReveal = {
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
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleReveal = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// FLOATING ORBS - Premium aurora effect
// ============================================
function DashboardOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary aurora gradient - Navy/Gold palette */}
      <motion.div
        className="absolute -top-[30%] -left-[15%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full"
        style={{
          background: "conic-gradient(from 180deg, rgba(20,33,61,0.5), rgba(252,163,17,0.12), rgba(20,33,61,0.3), rgba(252,163,17,0.08), rgba(20,33,61,0.5))",
          filter: "blur(120px)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />

      {/* Secondary orb - Gold accent glow */}
      <motion.div
        className="absolute top-[10%] right-[-20%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(252,163,17,0.15) 0%, rgba(20,33,61,0.25) 50%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, 20, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom accent orb */}
      <motion.div
        className="absolute bottom-[-15%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(20,33,61,0.2) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating gold particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold/30"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Noise texture for depth */}
      <div
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

// ============================================
// GLASS CARD COMPONENT - Premium glassmorphism
// ============================================
function GlassCard({
  children,
  className = "",
  hover = true,
  glow = false,
  glowColor = "gold",
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glowColor?: "gold" | "brand" | "emerald" | "violet";
}) {
  const glowColors = {
    gold: "shadow-gold/15 hover:shadow-gold/25",
    brand: "shadow-brand-500/15 hover:shadow-brand-500/25",
    emerald: "shadow-emerald-500/15 hover:shadow-emerald-500/25",
    violet: "shadow-violet-500/15 hover:shadow-violet-500/25",
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-white/[0.07] to-white/[0.02]
        backdrop-blur-2xl
        border border-white/[0.08]
        ${hover ? "hover:border-gold/20 hover:bg-white/[0.05] transition-all duration-500" : ""}
        ${glow ? `shadow-2xl ${glowColors[glowColor]}` : ""}
        ${className}
      `}
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Inner highlight gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-violet-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ============================================
// MAGNETIC BUTTON COMPONENT
// ============================================
function MagneticButton({
  children,
  className = "",
  href
}: {
  children: React.ReactNode;
  className?: string;
  href?: string
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

// ============================================
// GRADIENT TEXT COMPONENT
// ============================================
function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10 bg-gradient-to-r from-gold via-amber-400 to-gold bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
        {children}
      </span>
    </span>
  );
}

// ============================================
// LIVE ACTIVITY FEED DATA
// ============================================
const liveActivities = [
  { name: "Marketing Team", action: "completed standup meeting", time: "just now", icon: "🎯" },
  { name: "Product Review", action: "AI generated 12 action items", time: "2m ago", icon: "✨" },
  { name: "Sales Call", action: "transcript ready for review", time: "5m ago", icon: "📝" },
  { name: "Engineering Sync", action: "summary emailed to team", time: "8m ago", icon: "🚀" },
];

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
export default function DashboardPage() {
  const { data: user } = trpc.user.me.useQuery();
  const { data: meetingsData, isLoading: meetingsLoading } = trpc.meeting.list.useQuery({
    limit: 10,
  });

  const [activityIndex, setActivityIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Live activity rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % liveActivities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for subtle spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-ink text-white overflow-hidden selection:bg-gold/30">
      {/* ============================================ */}
      {/* IMMERSIVE BACKGROUND */}
      {/* ============================================ */}
      <div className="fixed inset-0 -z-10">
        <DashboardOrbs />

        {/* Mouse-following spotlight */}
        <div
          className="pointer-events-none fixed inset-0 transition-opacity duration-700"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(252,163,17,0.04), transparent 50%)`,
          }}
        />
      </div>

      {/* ============================================ */}
      {/* LIVE ACTIVITY TOAST */}
      {/* ============================================ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activityIndex}
          initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-50 hidden xl:block"
        >
          <GlassCard className="px-5 py-4 rounded-2xl" hover={false}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">{liveActivities[activityIndex].icon}</span>
                <div className="text-sm">
                  <span className="font-semibold text-white">{liveActivities[activityIndex].name}</span>
                  <span className="text-silver/60"> {liveActivities[activityIndex].action}</span>
                </div>
              </div>
              <span className="text-xs text-silver/40 ml-2">{liveActivities[activityIndex].time}</span>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 space-y-8 pb-12 px-1">
        {/* ============================================ */}
        {/* HERO WELCOME SECTION */}
        {/* ============================================ */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={orchestratedReveal}
          className="relative pt-2"
        >
          {/* Welcome Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <motion.div variants={fadeInUp} className="space-y-4">
              {/* Greeting Badge with Live indicator */}
              <motion.div
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-gold/15 to-amber-500/10 border border-gold/25 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
                  </span>
                  <Sparkles className="w-4 h-4 text-gold" />
                </div>
                <span className="text-sm text-gold font-medium">{greeting}</span>
                <span className="text-xs text-silver/40">•</span>
                <span className="text-xs text-silver/60">AI Co-Pilot Active</span>
              </motion.div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                <span className="text-white">Welcome back</span>
                {firstName && (
                  <>
                    <span className="text-white">, </span>
                    <GradientText>{firstName}</GradientText>
                  </>
                )}
                <span className="text-white">!</span>
              </h1>

              {/* Subheadline */}
              <p className="text-silver/70 text-lg sm:text-xl max-w-2xl leading-relaxed">
                Your AI-powered meeting command center. Start collaborating, capture insights,
                and <span className="text-white font-medium">drive results</span> with intelligent automation.
              </p>
            </motion.div>

            {/* Quick Action Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              <MagneticButton href="/meetings/schedule">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-silver hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium text-sm">Schedule</span>
                </motion.button>
              </MagneticButton>

              <MagneticButton href="/meetings/new">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="relative flex items-center gap-2.5 px-6 py-3.5 rounded-xl overflow-hidden group"
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gold via-amber-500 to-gold bg-[length:200%_auto] animate-gradient" />
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gold/50 to-amber-500/50 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <Plus className="w-4 h-4 text-ink relative z-10" />
                  <span className="font-semibold text-sm text-ink relative z-10">New Meeting</span>
                </motion.button>
              </MagneticButton>
            </motion.div>
          </div>

          {/* ============================================ */}
          {/* PREMIUM STATS GRID */}
          {/* ============================================ */}
          <motion.div
            variants={orchestratedReveal}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatsCard
              title="Total Meetings"
              value={meetingsLoading ? "-" : String(totalMeetings)}
              description="All time hosted"
              icon={Video}
              gradient="from-brand-500 to-violet-500"
              iconGlow="brand"
              loading={meetingsLoading}
              index={0}
            />
            <StatsCard
              title="Live Now"
              value={meetingsLoading ? "-" : String(liveMeetings)}
              description="Active sessions"
              icon={Activity}
              gradient="from-emerald-400 to-green-500"
              iconGlow="emerald"
              loading={meetingsLoading}
              highlight={liveMeetings > 0}
              pulse={liveMeetings > 0}
              index={1}
            />
            <StatsCard
              title="Upcoming"
              value={meetingsLoading ? "-" : String(upcomingMeetings.length)}
              description="Scheduled meetings"
              icon={Calendar}
              gradient="from-violet-500 to-purple-600"
              iconGlow="violet"
              loading={meetingsLoading}
              index={2}
            />
            <StatsCard
              title="Completed"
              value={meetingsLoading ? "-" : String(pastMeetings.length)}
              description="This week"
              icon={CheckSquare}
              gradient="from-gold to-amber-500"
              iconGlow="gold"
              loading={meetingsLoading}
              index={3}
            />
          </motion.div>
        </motion.section>

        {/* ============================================ */}
        {/* MAIN CONTENT GRID */}
        {/* ============================================ */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Meetings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Meetings Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard className="p-6 rounded-2xl" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-violet-500 blur-xl opacity-50" />
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">Upcoming Meetings</h2>
                      <p className="text-sm text-silver/60">Your scheduled sessions</p>
                    </div>
                  </div>
                  <Link href="/meetings" className="group flex items-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors font-medium">
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
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03]">
                          <Skeleton className="h-14 w-14 rounded-xl bg-white/5" />
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
                      description="Schedule a meeting or start an instant session to collaborate with your team"
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

            {/* Recent Meetings Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard className="p-6 rounded-2xl" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 blur-xl opacity-50" />
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">Recent Meetings</h2>
                      <p className="text-sm text-silver/60">Review past sessions with AI summaries</p>
                    </div>
                  </div>
                  <Link href="/meetings" className="group flex items-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors font-medium">
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
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03]">
                          <Skeleton className="h-14 w-14 rounded-xl bg-white/5" />
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
                      description="Your completed meetings will appear here with AI-generated summaries and action items"
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard className="p-6 rounded-2xl" hover={false}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold to-amber-500 blur-xl opacity-50" />
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-lg">
                      <Zap className="w-5 h-5 text-ink" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
                    <p className="text-sm text-silver/60">Start collaborating instantly</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <QuickActionButton
                    href="/meetings/new"
                    icon={Video}
                    title="Start Instant Meeting"
                    description="Create and join a meeting now"
                    gradient="from-brand-500 to-violet-500"
                  />
                  <QuickActionButton
                    href="/meetings/schedule"
                    icon={Calendar}
                    title="Schedule Meeting"
                    description="Plan a meeting for later"
                    gradient="from-violet-500 to-purple-600"
                  />
                  <QuickActionButton
                    href="/meetings/join"
                    icon={LogIn}
                    title="Join Meeting"
                    description="Enter with meeting code"
                    gradient="from-emerald-400 to-green-500"
                  />
                </div>
              </GlassCard>
            </motion.div>

            {/* AI Features Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative rounded-2xl overflow-hidden">
                {/* Premium gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-gold/10 to-navy/90" />
                <div className="absolute inset-0 bg-ink/60 backdrop-blur-xl" />

                {/* Animated glow orbs */}
                <motion.div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gold/20 blur-3xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-violet-500/20 blur-3xl"
                  animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />

                <div className="relative p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-gold to-amber-500 blur-xl"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-gold via-amber-400 to-gold flex items-center justify-center shadow-lg shadow-gold/30">
                        <Brain className="w-5 h-5 text-ink" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">AI Features</h2>
                      <p className="text-sm text-gold">Powered by advanced AI</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <AIFeatureItem
                      icon={Mic}
                      title="Smart Transcription"
                      description="Real-time in 100+ languages"
                      gradient="from-brand-500 to-violet-500"
                    />
                    <AIFeatureItem
                      icon={Target}
                      title="Action Items"
                      description="Auto-extract from conversations"
                      gradient="from-violet-500 to-purple-600"
                    />
                    <AIFeatureItem
                      icon={FileText}
                      title="Meeting Summaries"
                      description="AI briefs after each call"
                      gradient="from-gold to-amber-500"
                    />
                    <AIFeatureItem
                      icon={BarChart3}
                      title="Engagement Analytics"
                      description="Participation insights"
                      gradient="from-emerald-400 to-green-500"
                    />
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gold" />
                        <span className="text-xs text-silver/60">Enterprise-grade security</span>
                      </div>
                      <Link href="/settings" className="text-xs text-gold hover:text-gold/80 transition-colors font-medium">
                        Manage features →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Meeting Insights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard className="p-6 rounded-2xl" hover={false}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-500 blur-xl opacity-50" />
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Insights</h2>
                    <p className="text-sm text-silver/60">Your meeting analytics</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <InsightItem
                    label="Avg. Meeting Duration"
                    value="45 min"
                    trend="-5% vs last week"
                    trendUp={true}
                  />
                  <InsightItem
                    label="AI Notes Generated"
                    value={totalMeetings > 0 ? `${totalMeetings}` : "0"}
                    trend="This month"
                  />
                  <InsightItem
                    label="Time Saved"
                    value="2.5 hrs"
                    trend="+12% this week"
                    trendUp={true}
                  />
                </div>

                <Link href="/meetings" className="block mt-5">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-silver hover:text-white hover:bg-white/[0.08] transition-all duration-300 text-sm font-medium"
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
// STATS CARD COMPONENT - Premium design
// ============================================
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
  iconGlow,
  loading,
  highlight,
  pulse,
  index,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconGlow: "gold" | "brand" | "emerald" | "violet";
  loading?: boolean;
  highlight?: boolean;
  pulse?: boolean;
  index: number;
}) {
  const glowColors = {
    gold: "shadow-gold/40",
    brand: "shadow-brand-500/40",
    emerald: "shadow-emerald-500/40",
    violet: "shadow-violet-500/40",
  };

  return (
    <motion.div
      variants={scaleReveal}
      custom={index}
    >
      <GlassCard
        className={`p-5 rounded-2xl ${highlight ? "border-emerald-500/30" : ""}`}
        glow={highlight}
        glowColor={highlight ? "emerald" : iconGlow}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-silver/60 font-medium uppercase tracking-wider">{title}</p>
            {loading ? (
              <Skeleton className="h-9 w-16 bg-white/5" />
            ) : (
              <motion.p
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 200 }}
                className={`text-4xl font-bold ${highlight ? "text-emerald-400" : "text-white"}`}
              >
                {value}
              </motion.p>
            )}
            <p className="text-xs text-silver/50">{description}</p>
          </div>
          <div className="relative">
            {/* Glow effect behind icon */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} blur-xl opacity-50`} />
            {pulse && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-emerald-500"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${glowColors[iconGlow]}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
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
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/meeting/${roomId}`}>
        <motion.div
          whileHover={{ scale: 1.01, x: 4 }}
          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
            isLive
              ? "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15"
              : "border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              isLive
                ? "bg-gradient-to-br from-emerald-400 to-green-500"
                : "bg-gradient-to-br from-brand-500/20 to-violet-500/20 border border-white/10"
            }`}>
              <Video className={`w-5 h-5 ${isLive ? "text-white" : "text-brand-400"}`} />
            </div>
            <div>
              <h3 className="font-medium text-white text-sm">{title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-silver/50" />
                <span className="text-xs text-silver/60">{time}</span>
                {timeRelative && (
                  <span className="text-xs text-gold/60">• {timeRelative}</span>
                )}
                {isLive && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
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
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isLive
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                : "bg-white/[0.05] text-white hover:bg-white/[0.1] border border-white/10"
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
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.01, x: 4 }}
      className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="font-medium text-white text-sm">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3 text-silver/50" />
            <span className="text-xs text-silver/60">{time}</span>
          </div>
        </div>
      </div>
      <Link href={`/meetings/${id}/summary`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2.5 rounded-xl bg-violet-500/20 text-violet-400 text-xs font-semibold hover:bg-violet-500/30 transition-all"
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
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.03] hover:border-gold/20 hover:bg-white/[0.05] transition-all duration-300 cursor-pointer group"
      >
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} blur-lg opacity-40 group-hover:opacity-60 transition-opacity`} />
          <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-white text-sm group-hover:text-gold transition-colors">{title}</h3>
          <p className="text-xs text-silver/60">{description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-silver/40 group-hover:text-gold group-hover:translate-x-1 transition-all" />
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
    <motion.div
      className="flex items-center gap-4 group"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-white group-hover:text-gold transition-colors">{title}</h4>
        <p className="text-xs text-silver/60">{description}</p>
      </div>
    </motion.div>
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
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-sm text-silver/60">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-white">{value}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          trendUp === undefined
            ? "text-silver/50 bg-white/5"
            : trendUp
            ? "text-emerald-400 bg-emerald-500/15"
            : "text-rose-400 bg-rose-500/15"
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 blur-2xl rounded-full" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10">
          <Icon className="w-8 h-8 text-silver/50" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-silver/60 max-w-sm mb-8">{description}</p>
      {actions && (
        <div className="flex gap-3">
          {actions.map((action) => (
            <Link key={action.label} href={action.href}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  action.primary
                    ? "bg-gradient-to-r from-gold to-amber-500 text-ink shadow-lg shadow-gold/25 hover:shadow-gold/40"
                    : "bg-white/[0.05] text-silver hover:text-white hover:bg-white/[0.08] border border-white/10"
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
