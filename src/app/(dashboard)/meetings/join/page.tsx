"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  LogIn,
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// ANIMATION VARIANTS
// ============================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
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
  },
  {
    id: "2",
    title: "Product Strategy Review",
    roomId: "prod-strategy-q1",
    lastJoined: "Yesterday",
    participants: 12,
    isLive: false,
  },
  {
    id: "3",
    title: "Design System Workshop",
    roomId: "design-workshop",
    lastJoined: "3 days ago",
    participants: 5,
    isLive: false,
  },
];

// ============================================
// FEATURES DATA
// ============================================
const features = [
  {
    icon: Mic,
    title: "Live Transcription",
    description: "Real-time speech-to-text in 100+ languages",
    iconBg: "bg-lime/10",
    iconColor: "text-lime",
  },
  {
    icon: Brain,
    title: "AI Co-Pilot",
    description: "Smart suggestions and meeting insights",
    iconBg: "bg-purple/10",
    iconColor: "text-purple",
  },
  {
    icon: Shield,
    title: "End-to-End Encryption",
    description: "Enterprise-grade security for all meetings",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
  },
];

// ============================================
// GLASS CARD COMPONENT
// ============================================
function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-[#111111]/80 backdrop-blur-xl",
        "border border-white/[0.06]",
        hover && "hover:border-lime/20 transition-all duration-400",
        className
      )}
    >
      {children}
    </div>
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

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      setError("Please enter a meeting code or link");
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

      // Remove any protocol prefix if pasted
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
  };

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
      variants={containerVariants}
      className="min-h-screen text-white"
    >
      {/* Back Button */}
      <motion.div variants={itemVariants} className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left Column - Join Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="absolute inset-0 bg-lime/30 blur-2xl rounded-full" />
              <div className="relative w-14 h-14 rounded-2xl bg-lime flex items-center justify-center shadow-xl shadow-lime/25">
                <LogIn className="w-7 h-7 text-ink" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Join a Meeting
              </h1>
              <p className="text-white/40 text-sm mt-0.5">
                Enter your meeting code or paste the invite link
              </p>
            </div>
          </motion.div>

          {/* Join Form Card */}
          <motion.div variants={itemVariants}>
            <GlassCard
              className={cn(
                "transition-all duration-500",
                isFocused && "border-lime/30 shadow-[0_0_40px_rgba(202,255,75,0.08)]"
              )}
            >
              <div className="p-6 sm:p-8 space-y-6">
                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="rounded-xl bg-red-500/10 border border-red-500/20 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-400">Unable to Join</p>
                          <p className="text-sm text-red-400/70 mt-0.5">{error}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <LinkIcon className="w-4 h-4 text-lime" />
                    <span>Meeting Code or Invite Link</span>
                  </div>

                  <div className="relative group">
                    {/* Input glow */}
                    <div
                      className={cn(
                        "absolute -inset-1 rounded-2xl bg-lime/10 blur-xl opacity-0 transition-opacity duration-500",
                        isFocused && "opacity-100"
                      )}
                    />
                    <div className="relative flex items-center">
                      <div className="absolute left-4 flex items-center pointer-events-none">
                        <Hash className="w-5 h-5 text-white/30" />
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
                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-lime/40 focus:bg-white/[0.05] transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Supports meeting codes, full URLs, and invite links</span>
                  </div>
                </div>

                {/* Join Button */}
                <motion.button
                  whileHover={{ scale: 1.01, boxShadow: "0 0 40px rgba(202,255,75,0.25)" }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleJoin}
                  disabled={!roomCode.trim() || isJoining}
                  className={cn(
                    "w-full h-14 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300",
                    "bg-lime text-ink",
                    "shadow-lg shadow-lime/20",
                    "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  )}
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Connecting to meeting...
                    </>
                  ) : (
                    <>
                      <Video className="h-5 w-5" />
                      Join Meeting
                      <ArrowRight className="h-5 w-5 ml-1" />
                    </>
                  )}
                </motion.button>

                {/* Alternative Actions */}
                <div className="flex items-center justify-center gap-6 pt-2">
                  <Link
                    href="/meetings/new"
                    className="text-sm text-lime hover:text-lime/80 transition-colors flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4" />
                    Start instant meeting
                  </Link>
                  <span className="text-white/20">|</span>
                  <Link
                    href="/meetings/schedule"
                    className="text-sm text-purple hover:text-purple/80 transition-colors flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule for later
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Features Row */}
          <motion.div variants={containerVariants} className="grid sm:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <GlassCard className="p-4 h-full">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        feature.iconBg
                      )}
                    >
                      <feature.icon className={cn("w-5 h-5", feature.iconColor)} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{feature.title}</h3>
                      <p className="text-xs text-white/40 mt-0.5 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-2 space-y-5">
          {/* Recent Meetings */}
          <motion.div variants={itemVariants}>
            <GlassCard hover={false}>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-5 h-5 text-lime" />
                  <h2 className="text-base font-semibold text-white">Recent Meetings</h2>
                </div>

                <div className="space-y-3">
                  {recentMeetings.map((meeting) => (
                    <motion.div
                      key={meeting.id}
                      whileHover={{ x: 2 }}
                      className="group p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-lime/20 hover:bg-white/[0.04] transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-white truncate group-hover:text-lime transition-colors">
                              {meeting.title}
                            </h3>
                            {meeting.isLive && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 py-0 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Live
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-white/40">
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
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              copyLink(meeting.roomId, meeting.id);
                            }}
                            className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors"
                          >
                            {copiedId === meeting.id ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => quickJoin(meeting.roomId)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all",
                              meeting.isLive
                                ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                                : "bg-white/[0.06] hover:bg-white/[0.1] text-white/80 hover:text-white border border-white/[0.08]"
                            )}
                          >
                            {meeting.isLive ? "Join" : "Rejoin"}
                            <ArrowRight className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Pro Tips */}
          <motion.div variants={itemVariants}>
            <GlassCard hover={false}>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-lime" />
                  <h3 className="text-base font-semibold text-white">Pro Tips</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Paste any meeting link format - we'll extract the code",
                    "Test your camera and mic before joining",
                    "Enable AI transcription for automatic notes",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Meeting Features */}
          <motion.div variants={itemVariants}>
            <GlassCard hover={false} className="overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-lime/[0.03] via-transparent to-purple/[0.03]" />
              <div className="relative p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-purple" />
                  <span className="text-base font-semibold text-white">AI Meeting Features</span>
                  <Badge className="bg-lime/15 text-lime border-lime/20 text-[10px] ml-auto">
                    Included
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: MessageSquare, label: "Live Captions" },
                    { icon: Sparkles, label: "Smart Summary" },
                    { icon: Globe, label: "100+ Languages" },
                    { icon: Star, label: "Action Items" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-sm text-white/50"
                    >
                      <item.icon className="w-4 h-4 text-lime" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
