"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
      staggerChildren: 0.1,
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
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Brain,
    title: "AI Co-Pilot",
    description: "Smart suggestions and meeting insights",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: Shield,
    title: "End-to-End Encryption",
    description: "Enterprise-grade security for all meetings",
    color: "from-emerald-500 to-emerald-600",
  },
];

// ============================================
// FLOATING PARTICLES
// ============================================
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
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

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      setError("Please enter a meeting code or link");
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      // Extract room ID from various formats
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

      // Validate room ID format (alphanumeric with hyphens)
      if (!/^[a-zA-Z0-9-]+$/.test(roomId)) {
        throw new Error("Invalid meeting code format. Please check and try again.");
      }

      // Simulate brief validation delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to the meeting room
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
    setRoomCode(roomId);
    router.push(`/meeting/${roomId}`);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px]" />
        <FloatingParticles />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl mx-auto"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants}>
          <Button
            variant="ghost"
            asChild
            className="text-white/50 hover:text-white hover:bg-white/5 mb-8"
          >
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Column - Join Form */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-4">
                <motion.div
                  className="relative"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-2xl blur-xl opacity-50" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                    <LogIn className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    Join a Meeting
                  </h1>
                  <p className="text-white/50 mt-1">
                    Enter your meeting code or paste the invite link
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Join Form Card */}
            <motion.div variants={scaleIn}>
              <Card className={cn(
                "relative overflow-hidden border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl",
                "transition-all duration-500",
                isFocused && "border-cyan-500/30 shadow-lg shadow-cyan-500/10"
              )}>
                {/* Top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-violet-500 to-purple-500" />

                <CardContent className="p-6 sm:p-8 space-y-6">
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
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <LinkIcon className="w-4 h-4 text-cyan-400" />
                      <span>Meeting Code or Invite Link</span>
                    </div>

                    <div className="relative group">
                      <div className={cn(
                        "absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-purple-500/20 blur-xl opacity-0 transition-opacity duration-500",
                        isFocused && "opacity-100"
                      )} />
                      <div className="relative flex items-center">
                        <div className="absolute left-4 flex items-center pointer-events-none">
                          <Hash className="w-5 h-5 text-white/30" />
                        </div>
                        <Input
                          id="roomCode"
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
                          className="h-14 pl-12 pr-4 text-lg bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Supports meeting codes, full URLs, and invite links</span>
                    </div>
                  </div>

                  {/* Join Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className={cn(
                        "w-full h-14 text-lg font-medium rounded-xl transition-all duration-300",
                        "bg-gradient-to-r from-cyan-500 via-violet-500 to-purple-500",
                        "hover:from-cyan-400 hover:via-violet-400 hover:to-purple-400",
                        "shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      onClick={handleJoin}
                      disabled={!roomCode.trim() || isJoining}
                    >
                      {isJoining ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Connecting to meeting...
                        </>
                      ) : (
                        <>
                          <Video className="mr-2 h-5 w-5" />
                          Join Meeting
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {/* Alternative Actions */}
                  <div className="flex items-center justify-center gap-6 pt-2">
                    <Link
                      href="/meetings/new"
                      className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                    >
                      <Zap className="w-4 h-4" />
                      Start instant meeting
                    </Link>
                    <span className="text-white/20">|</span>
                    <Link
                      href="/meetings/schedule"
                      className="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5"
                    >
                      <Clock className="w-4 h-4" />
                      Schedule for later
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features Row */}
            <motion.div variants={containerVariants} className="grid sm:grid-cols-3 gap-4">
              {features.map((feature, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          `bg-gradient-to-br ${feature.color}`
                        )}>
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white">{feature.title}</h3>
                          <p className="text-xs text-white/40 mt-0.5">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Recent Meetings */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-white/40" />
                <h2 className="text-lg font-semibold text-white">Recent Meetings</h2>
              </div>

              <div className="space-y-3">
                {recentMeetings.map((meeting, i) => (
                  <motion.div
                    key={meeting.id}
                    variants={itemVariants}
                    custom={i}
                    whileHover={{ x: 4 }}
                  >
                    <Card className="border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium text-white truncate group-hover:text-cyan-400 transition-colors">
                                {meeting.title}
                              </h3>
                              {meeting.isLive && (
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 py-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
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
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-white/40 hover:text-white hover:bg-white/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(`${window.location.origin}/meeting/${meeting.roomId}`);
                              }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className={cn(
                                "h-8 px-3 text-xs",
                                meeting.isLive
                                  ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                                  : "bg-white/10 hover:bg-white/20 text-white"
                              )}
                              onClick={() => quickJoin(meeting.roomId)}
                            >
                              {meeting.isLive ? "Join" : "Rejoin"}
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tips Card */}
            <motion.div variants={itemVariants}>
              <Card className="border-white/[0.06] bg-gradient-to-br from-cyan-500/5 via-violet-500/5 to-purple-500/5">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-2">Pro Tips</h3>
                      <ul className="space-y-2">
                        {[
                          "Paste any meeting link format - we'll extract the code",
                          "Test your camera and mic before joining",
                          "Enable AI transcription for automatic notes",
                        ].map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Features Promo */}
            <motion.div variants={itemVariants}>
              <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-purple-500/5 overflow-hidden">
                <CardContent className="p-5 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-5 h-5 text-violet-400" />
                      <span className="text-sm font-semibold text-white">AI Meeting Features</span>
                      <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-[10px]">
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
                        <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                          <item.icon className="w-3.5 h-3.5 text-violet-400" />
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
