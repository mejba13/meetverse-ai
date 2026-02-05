"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Video,
  Users,
  Shield,
  Sparkles,
  Clock,
  Mic,
  Globe,
  Zap,
  CheckCircle2,
  ArrowRight,
  Link as LinkIcon,
  Hash,
  History,
  Star,
  Brain,
  MessageSquare,
  Copy,
  Calendar,
  Lightbulb,
  Monitor,
  Wifi,
  Lock,
  Radio,
  Activity,
  BarChart3,
  Eye,
  ChevronRight,
  Wand2,
  Scan,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// ANIMATION VARIANTS
// ============================================
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// RECENT MEETINGS DATA
// ============================================
const recentMeetings = [
  {
    id: "1",
    title: "Engineering Sprint Planning",
    roomId: "eng-sprint-planning",
    lastJoined: "2 hours ago",
    participants: 8,
    isLive: true,
    host: "Sarah Chen",
    avatar: "SC",
    color: "from-[#CAFF4B] to-emerald-400",
  },
  {
    id: "2",
    title: "Product Strategy Review",
    roomId: "prod-strategy-q1",
    lastJoined: "Yesterday",
    participants: 12,
    isLive: false,
    host: "Marcus Johnson",
    avatar: "MJ",
    color: "from-[#9B5DE5] to-violet-400",
  },
  {
    id: "3",
    title: "Design System Workshop",
    roomId: "design-workshop",
    lastJoined: "3 days ago",
    participants: 5,
    isLive: false,
    host: "Alex Rivera",
    avatar: "AR",
    color: "from-cyan-400 to-blue-400",
  },
  {
    id: "4",
    title: "Client Onboarding Call",
    roomId: "client-onboarding",
    lastJoined: "5 days ago",
    participants: 4,
    isLive: false,
    host: "Emily Taylor",
    avatar: "ET",
    color: "from-amber-400 to-orange-400",
  },
];

// ============================================
// QUICK ACCESS FEATURES
// ============================================
const aiCapabilities = [
  {
    icon: Brain,
    title: "AI Meeting Co-Pilot",
    description: "Intelligent suggestions, real-time context analysis & smart follow-ups",
    gradient: "from-[#9B5DE5] to-violet-600",
    stats: "40% faster decisions",
  },
  {
    icon: Mic,
    title: "Live Transcription",
    description: "Speech-to-text in 100+ languages with speaker identification",
    gradient: "from-[#CAFF4B] to-emerald-400",
    stats: "99.2% accuracy",
  },
  {
    icon: Shield,
    title: "Zero-Trust Security",
    description: "End-to-end encryption, SOC 2 compliant & GDPR ready",
    gradient: "from-cyan-400 to-blue-500",
    stats: "Enterprise-grade",
  },
  {
    icon: Wand2,
    title: "Smart Summaries",
    description: "Auto-generated meeting notes, action items & key decisions",
    gradient: "from-amber-400 to-orange-500",
    stats: "Save 2hrs/week",
  },
];

// ============================================
// HOW IT WORKS STEPS
// ============================================
const howItWorks = [
  {
    step: "01",
    title: "Paste Your Code",
    description: "Enter meeting code, paste a link, or scan a QR code",
    icon: Scan,
  },
  {
    step: "02",
    title: "Preview & Setup",
    description: "Test camera, mic, and select your AI features",
    icon: Monitor,
  },
  {
    step: "03",
    title: "Join Instantly",
    description: "Connect in under 2 seconds with enterprise reliability",
    icon: Zap,
  },
];

// ============================================
// TRUST METRICS
// ============================================
const trustMetrics = [
  { value: "99.99%", label: "Uptime SLA", icon: Activity },
  { value: "<80ms", label: "Avg Latency", icon: Wifi },
  { value: "256-bit", label: "Encryption", icon: Lock },
  { value: "50K+", label: "Daily Users", icon: Users },
];

// ============================================
// FLOATING ORBS
// ============================================
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-[15%] -right-[8%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(202,255,75,0.06) 0%, rgba(202,255,75,0.015) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[50%] -left-[12%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(155,93,229,0.06) 0%, rgba(155,93,229,0.015) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[20%] w-[30vw] h-[30vw] max-w-[350px] max-h-[350px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(202,255,75,0.04) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
    </div>
  );
}

// ============================================
// GRID PATTERN OVERLAY
// ============================================
function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(202,255,75,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(202,255,75,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/50" />
    </div>
  );
}

// ============================================
// ANIMATED CONNECTION LINE
// ============================================
function PulsingDot({ className = "" }: { className?: string }) {
  return (
    <span className={cn("relative flex h-2.5 w-2.5", className)}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CAFF4B] opacity-50" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#CAFF4B]" />
    </span>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function JoinMeetingPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState(0);

  // Auto-cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % aiCapabilities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleJoin = useCallback(async () => {
    if (!roomCode.trim()) {
      setError("Please enter a meeting code or invite link");
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      let roomId = roomCode.trim();

      // Handle full URLs
      if (roomId.includes("/meeting/")) {
        const match = roomId.match(/\/meeting\/([^/?]+)/);
        if (match) {
          roomId = match[1];
        }
      }

      // Remove any protocol prefix
      roomId = roomId.replace(/^https?:\/\//, "").replace(/^[^/]+\/meeting\//, "");

      // Validate room ID format
      if (!/^[a-zA-Z0-9-]+$/.test(roomId)) {
        throw new Error("Invalid meeting code format. Please check and try again.");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push(`/meeting/${roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join meeting");
      setIsJoining(false);
    }
  }, [roomCode, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isJoining && roomCode.trim()) {
      handleJoin();
    }
  };

  const quickJoin = (roomId: string) => {
    router.push(`/meeting/${roomId}`);
  };

  const copyLink = (roomId: string, meetingId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${roomId}`);
    setCopiedId(meetingId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative min-h-[calc(100vh-120px)] text-white -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 px-4 sm:px-6 pt-4 sm:pt-6"
    >
      <FloatingOrbs />
      <GridPattern />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ================================================
            HERO SECTION - Join Form with Dramatic Header
            ================================================ */}
        <motion.div variants={fadeInUp} className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#CAFF4B] transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </motion.div>

        {/* Hero Header */}
        <motion.div variants={fadeInUp} className="text-center mb-10">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CAFF4B]/[0.08] border border-[#CAFF4B]/20 mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <PulsingDot />
            <span className="text-xs font-medium text-[#CAFF4B] tracking-wide">
              AI-POWERED MEETING ROOM
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="text-white">Join Your </span>
            <span className="relative">
              <span className="bg-gradient-to-r from-[#CAFF4B] via-[#9EF01A] to-[#CAFF4B] bg-clip-text text-transparent">
                Meeting
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#CAFF4B] to-transparent rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </h1>
          <p className="text-lg text-white/40 max-w-xl mx-auto leading-relaxed">
            Enter your meeting code or paste an invite link to connect instantly
            with AI-powered transcription, smart summaries & real-time collaboration
          </p>
        </motion.div>

        {/* ================================================
            MAIN JOIN CARD - Centered, Dramatic
            ================================================ */}
        <motion.div variants={fadeInUp} className="max-w-2xl mx-auto mb-16">
          <div
            className={cn(
              "relative rounded-3xl overflow-hidden transition-all duration-700",
              isFocused && "shadow-[0_0_80px_rgba(202,255,75,0.1)]"
            )}
          >
            {/* Gradient top border */}
            <div className="h-[2px] bg-gradient-to-r from-[#CAFF4B] via-[#9B5DE5] to-[#CAFF4B]" />

            <div className="bg-[#111111]/90 backdrop-blur-2xl border-x border-b border-white/[0.06] rounded-b-3xl">
              <div className="p-8 sm:p-10 space-y-7">
                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -12, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -12, height: 0 }}
                      className="rounded-2xl bg-red-500/[0.08] border border-red-500/20 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-red-400">Unable to Join</p>
                          <p className="text-sm text-red-400/70 mt-0.5">{error}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <LinkIcon className="w-4 h-4 text-[#CAFF4B]" />
                      <span className="font-medium">Meeting Code or Invite Link</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400/70">
                      <Lock className="w-3 h-3" />
                      <span>Encrypted</span>
                    </div>
                  </div>

                  <div className="relative group">
                    {/* Animated glow behind input */}
                    <motion.div
                      className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#CAFF4B]/20 via-[#9B5DE5]/10 to-[#CAFF4B]/20 blur-xl"
                      animate={{
                        opacity: isFocused ? 0.6 : 0,
                      }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="relative flex items-center">
                      <div className="absolute left-5 flex items-center pointer-events-none">
                        <Hash
                          className={cn(
                            "w-5 h-5 transition-colors duration-300",
                            isFocused ? "text-[#CAFF4B]" : "text-white/25"
                          )}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="abc-xyz-123 or paste full meeting link"
                        value={roomCode}
                        onChange={(e) => {
                          setRoomCode(e.target.value);
                          setError(null);
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={handleKeyDown}
                        disabled={isJoining}
                        className={cn(
                          "w-full h-16 pl-14 pr-5 rounded-2xl text-lg font-medium",
                          "bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-white/25",
                          "focus:outline-none focus:border-[#CAFF4B]/40 focus:bg-white/[0.05]",
                          "transition-all duration-400 disabled:opacity-50"
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-white/35">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/70" />
                      Meeting codes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/70" />
                      Full URLs
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/70" />
                      Invite links
                    </span>
                  </div>
                </div>

                {/* Join Button */}
                <motion.button
                  whileHover={{
                    scale: 1.015,
                    boxShadow: "0 0 50px rgba(202,255,75,0.3)",
                  }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handleJoin}
                  disabled={!roomCode.trim() || isJoining}
                  className={cn(
                    "w-full h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300",
                    "bg-gradient-to-r from-[#CAFF4B] to-[#9EF01A] text-[#0a0a0a]",
                    "shadow-xl shadow-[#CAFF4B]/20",
                    "disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                  )}
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Connecting to meeting...</span>
                    </>
                  ) : (
                    <>
                      <Video className="h-5 w-5" />
                      <span>Join Meeting</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </motion.button>

                {/* Alternative Actions */}
                <div className="flex items-center justify-center gap-8">
                  <Link
                    href="/meetings/new"
                    className="text-sm text-[#CAFF4B] hover:text-[#d8ff7a] transition-colors flex items-center gap-2 group"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Start instant meeting</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                  <div className="h-4 w-px bg-white/[0.08]" />
                  <Link
                    href="/meetings/schedule"
                    className="text-sm text-[#9B5DE5] hover:text-[#b07ef0] transition-colors flex items-center gap-2 group"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule for later</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================================================
            TRUST METRICS BAR
            ================================================ */}
        <motion.div variants={fadeInUp} className="mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {trustMetrics.map((metric, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -2, scale: 1.02 }}
                className="relative group text-center p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#CAFF4B]/20 transition-all duration-400"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#CAFF4B]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <metric.icon className="w-5 h-5 text-[#CAFF4B]/60 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white tracking-tight">{metric.value}</div>
                  <div className="text-xs text-white/35 mt-0.5">{metric.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ================================================
            HOW IT WORKS + RECENT MEETINGS
            ================================================ */}
        <div className="grid lg:grid-cols-5 gap-8 mb-16">
          {/* How it works */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#9B5DE5]/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#9B5DE5]" />
              </div>
              <h2 className="text-lg font-bold text-white">How It Works</h2>
            </div>

            <div className="space-y-5">
              {howItWorks.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ x: 4 }}
                  className="group flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#CAFF4B]/10 to-[#9B5DE5]/10 border border-white/[0.06] flex items-center justify-center group-hover:border-[#CAFF4B]/30 group-hover:shadow-lg group-hover:shadow-[#CAFF4B]/5 transition-all duration-300">
                      <step.icon className="w-5 h-5 text-[#CAFF4B]" />
                    </div>
                    {i < howItWorks.length - 1 && (
                      <div className="w-px h-8 bg-gradient-to-b from-white/[0.08] to-transparent mt-2" />
                    )}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-[#CAFF4B]/50 tracking-widest">
                        STEP {step.step}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-[#CAFF4B] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-white/40 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pro Tips */}
            <motion.div variants={fadeInUp} className="mt-8">
              <div className="rounded-2xl bg-[#CAFF4B]/[0.03] border border-[#CAFF4B]/[0.08] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-[#CAFF4B]" />
                  <span className="text-sm font-semibold text-white">Pro Tips</span>
                </div>
                <ul className="space-y-2.5">
                  {[
                    "Paste any meeting link format — we auto-extract the code",
                    "Test your camera & mic in the preview before joining",
                    "Enable AI transcription for automatic meeting notes",
                    "Use keyboard shortcut Enter to join quickly",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-white/45 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#CAFF4B]/60 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>

          {/* Recent Meetings */}
          <motion.div variants={fadeInUp} className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#CAFF4B]/15 flex items-center justify-center">
                  <History className="w-4 h-4 text-[#CAFF4B]" />
                </div>
                <h2 className="text-lg font-bold text-white">Recent Meetings</h2>
              </div>
              <Link
                href="/meetings"
                className="text-xs text-white/30 hover:text-[#CAFF4B] transition-colors flex items-center gap-1"
              >
                View all
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentMeetings.map((meeting) => (
                <motion.div
                  key={meeting.id}
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="group relative rounded-2xl bg-[#111111]/80 backdrop-blur-xl border border-white/[0.05] hover:border-[#CAFF4B]/20 transition-all duration-400 overflow-hidden"
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#CAFF4B]/[0.02] via-transparent to-[#9B5DE5]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative p-4 flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-lg",
                        meeting.color
                      )}
                    >
                      {meeting.avatar}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#CAFF4B] transition-colors">
                          {meeting.title}
                        </h3>
                        {meeting.isLive && (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 text-[10px] px-2 py-0 flex items-center gap-1 animate-pulse">
                            <Radio className="w-2.5 h-2.5" />
                            Live
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/35">
                        <span>Hosted by {meeting.host}</span>
                        <span className="w-1 h-1 rounded-full bg-white/15" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {meeting.lastJoined}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {meeting.participants}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          copyLink(meeting.roomId, meeting.id);
                        }}
                        className="p-2 rounded-xl text-white/25 hover:text-white hover:bg-white/[0.06] transition-all"
                      >
                        {copiedId === meeting.id ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => quickJoin(meeting.roomId)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all",
                          meeting.isLive
                            ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                            : "bg-white/[0.05] hover:bg-[#CAFF4B]/10 text-white/70 hover:text-[#CAFF4B] border border-white/[0.08] hover:border-[#CAFF4B]/30"
                        )}
                      >
                        {meeting.isLive ? "Join Now" : "Rejoin"}
                        <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ================================================
            AI CAPABILITIES SHOWCASE
            ================================================ */}
        <motion.div variants={fadeInUp} className="mb-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#9B5DE5]/15 flex items-center justify-center">
                <Brain className="w-4 h-4 text-[#9B5DE5]" />
              </div>
              <h2 className="text-xl font-bold text-white">AI-Powered Meeting Intelligence</h2>
            </div>
            <p className="text-sm text-white/35 max-w-lg mx-auto">
              Every meeting you join comes with enterprise AI features that
              boost productivity and never miss a detail
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiCapabilities.map((feature, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -4, scale: 1.02 }}
                onHoverStart={() => setActiveFeature(i)}
                className={cn(
                  "group relative rounded-2xl overflow-hidden transition-all duration-500 cursor-default",
                  activeFeature === i
                    ? "bg-white/[0.04] border border-[#CAFF4B]/20 shadow-[0_0_30px_rgba(202,255,75,0.05)]"
                    : "bg-white/[0.015] border border-white/[0.05] hover:border-white/[0.1]"
                )}
              >
                {/* Active indicator glow */}
                {activeFeature === i && (
                  <motion.div
                    layoutId="activeFeatureGlow"
                    className="absolute inset-0 bg-gradient-to-b from-[#CAFF4B]/[0.03] to-transparent"
                    transition={{ duration: 0.4 }}
                  />
                )}

                <div className="relative p-6">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110",
                      feature.gradient
                    )}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5">{feature.title}</h3>
                  <p className="text-xs text-white/35 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#CAFF4B]/70">
                    <BarChart3 className="w-3 h-3" />
                    {feature.stats}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ================================================
            AI FEATURES INCLUDED BANNER
            ================================================ */}
        <motion.div variants={fadeInUp} className="mb-12">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-[#9B5DE5] via-[#CAFF4B] to-[#9B5DE5]" />
            <div className="bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border-x border-b border-white/[0.05] rounded-b-3xl p-8 sm:p-10">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Left - Text */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                    <Wand2 className="w-5 h-5 text-[#9B5DE5]" />
                    <Badge className="bg-[#9B5DE5]/15 text-[#9B5DE5] border-[#9B5DE5]/20 text-xs">
                      Included Free
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Every Meeting is AI-Enhanced
                  </h3>
                  <p className="text-sm text-white/40 max-w-md leading-relaxed">
                    From the moment you join, our AI works in the background — capturing
                    transcripts, identifying action items, and generating smart summaries
                    so you can focus on what matters.
                  </p>
                </div>

                {/* Right - Feature Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-shrink-0">
                  {[
                    { icon: MessageSquare, label: "Live Captions", color: "text-[#CAFF4B]" },
                    { icon: Brain, label: "Smart Summary", color: "text-[#9B5DE5]" },
                    { icon: Globe, label: "100+ Languages", color: "text-cyan-400" },
                    { icon: Star, label: "Action Items", color: "text-amber-400" },
                    { icon: Eye, label: "Sentiment", color: "text-rose-400" },
                    { icon: BarChart3, label: "Analytics", color: "text-emerald-400" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] transition-all"
                    >
                      <item.icon className={cn("w-4 h-4", item.color)} />
                      <span className="text-xs font-medium text-white/60">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================================================
            BOTTOM CTA
            ================================================ */}
        <motion.div variants={fadeInUp} className="text-center pb-8">
          <p className="text-sm text-white/25">
            Need help?{" "}
            <a href="#" className="text-[#CAFF4B] hover:text-[#d8ff7a] transition-colors">
              Contact support
            </a>{" "}
            or check our{" "}
            <a href="#" className="text-[#CAFF4B] hover:text-[#d8ff7a] transition-colors">
              documentation
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
