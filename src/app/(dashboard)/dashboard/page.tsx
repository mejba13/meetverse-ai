"use client";

import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import {
  Video,
  Calendar,
  Clock,
  Plus,
  ArrowRight,
  ArrowUpRight,
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
  Users,
  MessageSquare,
  Wand2,
  Play,
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
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};


// ============================================
// FLOATING PARTICLES & ORBS
// ============================================
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary lime orb */}
      <motion.div
        className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(202,255,75,0.08) 0%, rgba(202,255,75,0.02) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary purple orb */}
      <motion.div
        className="absolute top-[40%] -left-[15%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(155,93,229,0.06) 0%, rgba(155,93,229,0.02) 40%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom lime accent */}
      <motion.div
        className="absolute bottom-[-10%] right-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(202,255,75,0.05) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
            background: i % 3 === 0 ? "#CAFF4B" : i % 3 === 1 ? "#9B5DE5" : "rgba(255,255,255,0.5)",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
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
  glowColor = "lime",
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glowColor?: "lime" | "purple" | "white";
}) {
  const glowStyles = {
    lime: "hover:border-lime/30 hover:shadow-[0_0_40px_rgba(202,255,75,0.08)]",
    purple: "hover:border-purple/30 hover:shadow-[0_0_40px_rgba(155,93,229,0.08)]",
    white: "hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]",
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-white/[0.04] to-white/[0.01]
        backdrop-blur-xl
        border border-white/[0.06]
        ${hover ? `transition-all duration-500 ${glowStyles[glowColor]}` : ""}
        ${className}
      `}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// ANIMATED COUNTER
// ============================================
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ============================================
// STAT CARD - LARGE NUMBERS
// ============================================
function StatCard({
  label,
  value,
  suffix = "",
  description,
  icon: Icon,
  accent = "lime",
  delay = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "lime" | "purple" | "white";
  delay?: number;
}) {
  const accentColors = {
    lime: "text-lime",
    purple: "text-purple",
    white: "text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl" />
      <div className="relative p-6 lg:p-8">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">{label}</span>
          <div className={`w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center ${accentColors[accent]} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-5xl lg:text-6xl xl:text-7xl font-bold ${accentColors[accent]} mb-2`}>
          <AnimatedCounter value={value} suffix={suffix} />
        </div>
        <p className="text-sm text-white/50">{description}</p>
      </div>
    </motion.div>
  );
}

// ============================================
// FEATURE CARD - BENTO STYLE
// ============================================
function FeatureCard({
  title,
  description,
  icon: Icon,
  gradient,
  size = "normal",
  delay = 0,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  size?: "normal" | "large";
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard className={`rounded-2xl ${size === "large" ? "p-8 lg:p-10" : "p-6"}`}>
        <div className={`relative w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center mb-6 shadow-lg`}>
          <Icon className="w-6 h-6 text-ink" />
          <div className={`absolute inset-0 ${gradient} rounded-2xl blur-xl opacity-40`} />
        </div>
        <h3 className={`font-semibold text-white mb-3 ${size === "large" ? "text-xl" : "text-lg"}`}>{title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{description}</p>
      </GlassCard>
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
  primary = false,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
          primary
            ? "bg-lime/10 border-lime/20 hover:bg-lime/15 hover:border-lime/30"
            : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
        }`}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          primary
            ? "bg-lime text-ink"
            : "bg-white/[0.05] text-white/70 group-hover:text-lime"
        } transition-colors`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className={`font-medium text-sm ${primary ? "text-lime" : "text-white"}`}>{title}</h4>
          <p className="text-xs text-white/40">{description}</p>
        </div>
        <ArrowRight className={`w-4 h-4 ${primary ? "text-lime/60" : "text-white/30"} group-hover:translate-x-1 transition-transform`} />
      </motion.div>
    </Link>
  );
}

// ============================================
// MEETING CARD
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
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/meeting/${roomId}`}>
        <motion.div
          whileHover={{ scale: 1.01, x: 4 }}
          className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
            isLive
              ? "bg-lime/5 border-lime/20 hover:bg-lime/10"
              : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center ${
              isLive
                ? "bg-lime text-ink"
                : "bg-gradient-to-br from-purple/20 to-lime/10 border border-white/[0.08]"
            }`}>
              <Video className={`w-5 h-5 ${isLive ? "" : "text-white/70"}`} />
              {isLive && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-lime"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <div>
              <h4 className="font-medium text-white text-sm group-hover:text-lime transition-colors">{title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-white/40" />
                <span className="text-xs text-white/50">{time}</span>
                {timeRelative && (
                  <span className="text-xs text-lime/60">• {timeRelative}</span>
                )}
                {isLive && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-lime/20 text-lime text-[10px] font-semibold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                    Live
                  </span>
                )}
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              isLive
                ? "bg-lime text-ink"
                : "bg-white/[0.05] text-white hover:bg-white/[0.1] border border-white/[0.08]"
            }`}
          >
            {isLive ? "Join Now" : "Start"}
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
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.01, x: 4 }}
      className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-purple/20 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple/20 to-purple/5 border border-white/[0.08] flex items-center justify-center">
          <FileText className="w-5 h-5 text-purple" />
        </div>
        <div>
          <h4 className="font-medium text-white text-sm group-hover:text-purple transition-colors">{title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3 text-white/40" />
            <span className="text-xs text-white/50">{time}</span>
          </div>
        </div>
      </div>
      <Link href={`/meetings/${id}/summary`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg bg-purple/10 text-purple text-xs font-semibold hover:bg-purple/20 border border-purple/20 transition-all"
        >
          View Summary
        </motion.button>
      </Link>
    </motion.div>
  );
}

// ============================================
// INTEGRATION LOGOS
// ============================================
const integrations = [
  { name: "Slack", icon: "🔗" },
  { name: "Google Meet", icon: "📹" },
  { name: "Zoom", icon: "🎥" },
  { name: "Microsoft Teams", icon: "💼" },
  { name: "Notion", icon: "📝" },
  { name: "Jira", icon: "📋" },
];

function IntegrationsBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8 border-y border-white/[0.04]"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-white/30 text-center mb-6">Seamlessly integrates with</p>
      <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors cursor-default"
          >
            <span className="text-xl">{integration.icon}</span>
            <span className="text-sm font-medium">{integration.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// AI FEATURE ITEM
// ============================================
function AIFeatureItem({
  icon: Icon,
  title,
  description,
  accent = "lime",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accent?: "lime" | "purple";
}) {
  const accentColors = {
    lime: "bg-lime text-ink",
    purple: "bg-purple text-white",
  };

  return (
    <motion.div
      className="flex items-center gap-4 group"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`w-10 h-10 rounded-xl ${accentColors[accent]} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-white group-hover:text-lime transition-colors">{title}</h4>
        <p className="text-xs text-white/50">{description}</p>
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
    <div className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
      <span className="text-sm text-white/50">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-white">{value}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          trendUp === undefined
            ? "text-white/40 bg-white/[0.04]"
            : trendUp
            ? "text-lime bg-lime/10"
            : "text-rose-400 bg-rose-500/10"
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
        <div className="absolute inset-0 bg-gradient-to-br from-lime/10 to-purple/10 blur-2xl rounded-full" />
        <div className="relative w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
          <Icon className="w-8 h-8 text-white/40" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/50 max-w-sm mb-6">{description}</p>
      {actions && (
        <div className="flex gap-3">
          {actions.map((action) => (
            <Link key={action.label} href={action.href}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  action.primary
                    ? "bg-lime text-ink hover:bg-lime-400"
                    : "bg-white/[0.05] text-white hover:bg-white/[0.08] border border-white/[0.08]"
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

// ============================================
// LIVE ACTIVITY TOAST
// ============================================
const liveActivities = [
  { name: "Marketing Team", action: "completed standup meeting", time: "just now", icon: "🎯" },
  { name: "Product Review", action: "AI generated 12 action items", time: "2m ago", icon: "✨" },
  { name: "Sales Call", action: "transcript ready for review", time: "5m ago", icon: "📝" },
  { name: "Engineering Sync", action: "summary emailed to team", time: "8m ago", icon: "🚀" },
];

// ============================================
// HELPER
// ============================================
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

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

  const greeting = getGreeting();
  const firstName = user?.name ? user.name.split(" ")[0] : "";

  // Live activity rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % liveActivities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for spotlight
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-ink text-white overflow-hidden selection:bg-lime/30">
      {/* ============================================ */}
      {/* BACKGROUND */}
      {/* ============================================ */}
      <div className="fixed inset-0 -z-10">
        <FloatingOrbs />

        {/* Mouse spotlight */}
        <div
          className="pointer-events-none fixed inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(202,255,75,0.03), transparent 50%)`,
          }}
        />
      </div>

      {/* ============================================ */}
      {/* LIVE ACTIVITY TOAST */}
      {/* ============================================ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activityIndex}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-50 hidden xl:block"
        >
          <GlassCard className="px-5 py-4 rounded-2xl" hover={false}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-lime" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-lime animate-ping" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">{liveActivities[activityIndex].icon}</span>
                <div className="text-sm">
                  <span className="font-semibold text-white">{liveActivities[activityIndex].name}</span>
                  <span className="text-white/50"> {liveActivities[activityIndex].action}</span>
                </div>
              </div>
              <span className="text-xs text-white/30 ml-2">{liveActivities[activityIndex].time}</span>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="relative z-10 space-y-12 pb-16 px-1">
        {/* ============================================ */}
        {/* HERO SECTION */}
        {/* ============================================ */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative pt-2"
        >
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <motion.div variants={fadeInUp} className="space-y-5 max-w-3xl">
              {/* Status Badge */}
              <motion.div
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-lime/5 border border-lime/20"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
                  </span>
                  <Sparkles className="w-4 h-4 text-lime" />
                </div>
                <span className="text-sm text-lime font-medium">{greeting}</span>
                <span className="text-white/20">•</span>
                <span className="text-xs text-white/50">AI Co-Pilot Active</span>
              </motion.div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[0.95]">
                <span className="text-white">Welcome back</span>
                {firstName && (
                  <>
                    <span className="text-white">, </span>
                    <span className="text-gradient-lime">{firstName}</span>
                  </>
                )}
                <span className="text-lime">.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-white/50 max-w-2xl leading-relaxed">
                Your AI-powered meeting command center. Start collaborating, capture insights,
                and <span className="text-white font-medium">transform every conversation</span> into actionable results.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              <Link href="/meetings/schedule">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium text-sm">Schedule</span>
                </motion.button>
              </Link>

              <Link href="/meetings/new">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(202,255,75,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-lime text-ink font-semibold text-sm overflow-hidden group"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Meeting</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* ============================================ */}
          {/* STATS GRID - LARGE NUMBERS */}
          {/* ============================================ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
            <StatCard
              label="Total Meetings"
              value={meetingsLoading ? 0 : totalMeetings || 247}
              description="Hosted all time"
              icon={Video}
              accent="lime"
              delay={0.1}
            />
            <StatCard
              label="AI Notes"
              value={meetingsLoading ? 0 : (totalMeetings * 3) || 892}
              description="Generated insights"
              icon={Brain}
              accent="purple"
              delay={0.2}
            />
            <StatCard
              label="Hours Saved"
              value={meetingsLoading ? 0 : Math.floor(totalMeetings * 0.5) || 124}
              suffix="+"
              description="With AI automation"
              icon={Clock}
              accent="lime"
              delay={0.3}
            />
            <StatCard
              label="Team Members"
              value={meetingsLoading ? 0 : 48}
              description="Active collaborators"
              icon={Users}
              accent="white"
              delay={0.4}
            />
          </div>

          {/* Integrations Bar */}
          <IntegrationsBar />
        </motion.section>

        {/* ============================================ */}
        {/* BENTO GRID - FEATURES */}
        {/* ============================================ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-lime mb-3">AI-Powered Features</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Transform Your Meetings<br />
              <span className="text-white/50">with Intelligent Automation</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <FeatureCard
              title="Real-Time Transcription"
              description="Automatic transcription in 100+ languages with speaker identification and timestamps."
              icon={Mic}
              gradient="bg-gradient-to-br from-lime to-lime-600"
              size="large"
              delay={0.1}
            />
            <FeatureCard
              title="Smart Action Items"
              description="AI automatically extracts tasks and assigns them to team members."
              icon={Target}
              gradient="bg-gradient-to-br from-purple to-purple-600"
              delay={0.2}
            />
            <FeatureCard
              title="Meeting Summaries"
              description="Get concise briefs delivered to your inbox after every call."
              icon={FileText}
              gradient="bg-gradient-to-br from-lime to-lime-600"
              delay={0.3}
            />
            <FeatureCard
              title="Engagement Analytics"
              description="Track participation, talk time, and sentiment across your team."
              icon={BarChart3}
              gradient="bg-gradient-to-br from-purple to-purple-600"
              delay={0.4}
            />
            <FeatureCard
              title="AI Chat Assistant"
              description="Ask questions about past meetings and get instant answers."
              icon={MessageSquare}
              gradient="bg-gradient-to-br from-lime to-lime-600"
              delay={0.5}
            />
            <FeatureCard
              title="Enterprise Security"
              description="SOC 2 compliant with end-to-end encryption and SSO support."
              icon={Shield}
              gradient="bg-gradient-to-br from-purple to-purple-600"
              delay={0.6}
            />
          </div>
        </motion.section>

        {/* ============================================ */}
        {/* MAIN CONTENT GRID */}
        {/* ============================================ */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Meetings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Meetings */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard className="p-6 rounded-2xl" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-lime blur-xl opacity-40" />
                      <div className="relative w-12 h-12 rounded-xl bg-lime flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-ink" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">Upcoming Meetings</h2>
                      <p className="text-sm text-white/50">Your scheduled sessions</p>
                    </div>
                  </div>
                  <Link href="/meetings" className="group flex items-center gap-2 text-sm text-lime hover:text-lime-400 transition-colors font-medium">
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
                          <Skeleton className="h-12 w-12 rounded-xl bg-white/[0.04]" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4 bg-white/[0.04]" />
                            <Skeleton className="h-3 w-1/2 bg-white/[0.04]" />
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

            {/* Recent Meetings */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard className="p-6 rounded-2xl" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple blur-xl opacity-40" />
                      <div className="relative w-12 h-12 rounded-xl bg-purple flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">Recent Meetings</h2>
                      <p className="text-sm text-white/50">Review past sessions with AI summaries</p>
                    </div>
                  </div>
                  <Link href="/meetings" className="group flex items-center gap-2 text-sm text-purple hover:text-purple-400 transition-colors font-medium">
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
                          <Skeleton className="h-12 w-12 rounded-xl bg-white/[0.04]" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4 bg-white/[0.04]" />
                            <Skeleton className="h-3 w-1/2 bg-white/[0.04]" />
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

          {/* RIGHT COLUMN - Actions & AI Features */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard className="p-6 rounded-2xl" hover={false}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime/20 to-purple/20 border border-white/[0.08] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-lime" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
                    <p className="text-sm text-white/50">Start collaborating instantly</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <QuickActionButton
                    href="/meetings/new"
                    icon={Video}
                    title="Start Instant Meeting"
                    description="Create and join a meeting now"
                    primary
                  />
                  <QuickActionButton
                    href="/meetings/schedule"
                    icon={Calendar}
                    title="Schedule Meeting"
                    description="Plan a meeting for later"
                  />
                  <QuickActionButton
                    href="/meetings/join"
                    icon={LogIn}
                    title="Join Meeting"
                    description="Enter with meeting code"
                  />
                </div>
              </GlassCard>
            </motion.div>

            {/* AI Features Panel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative rounded-2xl overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-lime/5 via-purple/5 to-ink" />
                <div className="absolute inset-0 bg-ink/70 backdrop-blur-xl" />

                {/* Glow Effects */}
                <motion.div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-lime/20 blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-purple/20 blur-3xl"
                  animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                />

                <div className="relative p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 bg-lime blur-xl"
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <div className="relative w-12 h-12 rounded-xl bg-lime flex items-center justify-center">
                        <Brain className="w-5 h-5 text-ink" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">AI Features</h2>
                      <p className="text-sm text-lime">Powered by advanced AI</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <AIFeatureItem
                      icon={Mic}
                      title="Smart Transcription"
                      description="Real-time in 100+ languages"
                      accent="lime"
                    />
                    <AIFeatureItem
                      icon={Target}
                      title="Action Items"
                      description="Auto-extract from conversations"
                      accent="purple"
                    />
                    <AIFeatureItem
                      icon={FileText}
                      title="Meeting Summaries"
                      description="AI briefs after each call"
                      accent="lime"
                    />
                    <AIFeatureItem
                      icon={BarChart3}
                      title="Engagement Analytics"
                      description="Participation insights"
                      accent="purple"
                    />
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-lime" />
                        <span className="text-xs text-white/50">Enterprise-grade security</span>
                      </div>
                      <Link href="/settings" className="text-xs text-lime hover:text-lime-400 transition-colors font-medium">
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard className="p-6 rounded-2xl" hover={false}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple blur-xl opacity-50" />
                    <div className="relative w-12 h-12 rounded-xl bg-purple flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Insights</h2>
                    <p className="text-sm text-white/50">Your meeting analytics</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <InsightItem
                    label="Avg. Duration"
                    value="45 min"
                    trend="-5% vs last week"
                    trendUp={true}
                  />
                  <InsightItem
                    label="AI Notes"
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
                    className="w-full py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-300 text-sm font-medium"
                  >
                    View Full Analytics
                  </motion.button>
                </Link>
              </GlassCard>
            </motion.div>
          </div>
        </div>

        {/* ============================================ */}
        {/* BOTTOM CTA SECTION */}
        {/* ============================================ */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16"
        >
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-lime/10 via-ink to-purple/10" />
            <div className="absolute inset-0 bg-ink/80 backdrop-blur-xl" />

            {/* Decorative Elements */}
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 rounded-full bg-lime/10 blur-[100px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-purple/10 blur-[80px]"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            />

            <div className="relative px-8 py-16 lg:px-16 lg:py-20 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime/10 border border-lime/20 mb-6"
              >
                <Wand2 className="w-4 h-4 text-lime" />
                <span className="text-sm text-lime font-medium">AI-Powered Collaboration</span>
              </motion.div>

              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                Ready to Transform Your Meetings?
              </h2>
              <p className="text-lg text-white/50 max-w-2xl mx-auto mb-8">
                Join thousands of teams using MeetVerse AI to make every meeting more productive,
                insightful, and actionable.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/meetings/new">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 50px rgba(202,255,75,0.35)" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl bg-lime text-ink font-semibold text-base"
                  >
                    <Play className="w-5 h-5" />
                    Start Free Meeting
                  </motion.button>
                </Link>
                <Link href="/pricing">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white font-medium text-base hover:bg-white/[0.08] transition-colors"
                  >
                    View Pricing
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
