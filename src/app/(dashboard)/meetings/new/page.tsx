"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Video,
  Loader2,
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  Shield,
  Brain,
  Mic,
  Globe,
  Zap,
  Users,
  CheckCircle2,
  Play,
  Clock,
  Calendar,
  Lock,
  Wand2,
  Rocket,
  ArrowRight,
  Share2,
  MessageSquare,
  FileText,
} from "lucide-react";
import { trpc } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// ============================================
// MOCK DATA
// ============================================
const meetingOptions = [
  {
    id: "waitingRoom",
    icon: Shield,
    title: "Waiting Room",
    description: "Approve participants before they join",
    gradient: "from-emerald-500 to-green-600",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
  },
  {
    id: "recording",
    icon: Video,
    title: "Cloud Recording",
    description: "Auto-save meeting for later review",
    gradient: "from-rose-500 to-pink-600",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    badge: "PRO",
  },
  {
    id: "transcription",
    icon: Brain,
    title: "AI Transcription",
    description: "Real-time captions & smart summaries",
    gradient: "from-[#CAFF4B] to-[#9EF01A]",
    iconBg: "bg-[#CAFF4B]/10",
    iconColor: "text-[#CAFF4B]",
    badge: "AI",
    defaultOn: true,
  },
];

const includedFeatures = [
  { icon: Mic, text: "Real-time transcription", gradient: "from-[#CAFF4B] to-[#9EF01A]" },
  { icon: Brain, text: "AI meeting summaries", gradient: "from-[#9B5DE5] to-violet-600" },
  { icon: CheckCircle2, text: "Auto action items", gradient: "from-emerald-500 to-green-600" },
  { icon: Globe, text: "100+ languages", gradient: "from-cyan-500 to-blue-600" },
  { icon: Users, text: "Up to 500 participants", gradient: "from-amber-500 to-orange-600" },
  { icon: Lock, text: "End-to-end encryption", gradient: "from-rose-500 to-pink-600" },
];

const quickStats = [
  { value: "99.9%", label: "Uptime", icon: Zap },
  { value: "<100ms", label: "Latency", icon: Clock },
  { value: "50K+", label: "Daily meetings", icon: Users },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function NewMeetingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("Quick Meeting");
  const [copied, setCopied] = useState(false);
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState(true);

  const createMeeting = trpc.meeting.create.useMutation({
    onSuccess: (meeting) => {
      router.push(`/meeting/${meeting.roomId}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to create meeting",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartMeeting = () => {
    createMeeting.mutate({
      title,
      settings: {
        waitingRoom,
        recording,
        transcription,
      },
    });
  };

  const handleCopyLink = () => {
    if (createMeeting.data) {
      navigator.clipboard.writeText(
        `${window.location.origin}/meeting/${createMeeting.data.roomId}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link copied!",
        description: "Meeting link copied to clipboard.",
      });
    }
  };

  const getOptionState = (id: string) => {
    switch (id) {
      case "waitingRoom": return waitingRoom;
      case "recording": return recording;
      case "transcription": return transcription;
      default: return false;
    }
  };

  const setOptionState = (id: string, value: boolean) => {
    switch (id) {
      case "waitingRoom": setWaitingRoom(value); break;
      case "recording": setRecording(value); break;
      case "transcription": setTranscription(value); break;
    }
  };

  return (
    <div className="min-h-full relative pb-8">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-ink" />

        {/* Lime orb - top right */}
        <motion.div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
          style={{
            background: "conic-gradient(from 180deg, rgba(202,255,75,0.15), rgba(155,93,229,0.08), transparent, rgba(202,255,75,0.1))",
            filter: "blur(80px)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />

        {/* Purple orb - bottom left */}
        <motion.div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(155,93,229,0.2) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center glow */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(202,255,75,0.05) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(rgba(202,255,75,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(202,255,75,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.03] transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-3">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <motion.div
                className="relative w-20 h-20 mx-auto mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#CAFF4B] to-[#9B5DE5] rounded-2xl blur-xl opacity-50" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#CAFF4B] via-[#9EF01A] to-[#CAFF4B] flex items-center justify-center shadow-2xl shadow-[#CAFF4B]/30">
                  <Rocket className="w-10 h-10 text-black" />
                </div>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                <span className="text-white">Launch Your </span>
                <span className="bg-gradient-to-r from-[#CAFF4B] via-[#9B5DE5] to-[#CAFF4B] bg-clip-text text-transparent">
                  AI Meeting
                </span>
              </h1>
              <p className="text-white/50 max-w-md mx-auto">
                Start an instant meeting with real-time AI transcription, smart summaries, and powerful collaboration tools.
              </p>
            </motion.div>

            {/* Meeting Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] overflow-hidden"
            >
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#CAFF4B] via-[#9B5DE5] to-[#CAFF4B]" />

              <div className="p-6 sm:p-8">
                {/* Title Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Meeting Title
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Enter meeting title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-14 text-lg bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-[#CAFF4B]/50 focus:ring-[#CAFF4B]/20 rounded-xl pr-12"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Wand2 className="w-5 h-5 text-[#CAFF4B]/50" />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
                  <span className="text-xs text-white/30 font-medium uppercase tracking-wider">Meeting Options</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
                </div>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {meetingOptions.map((option, i) => {
                    const isChecked = getOptionState(option.id);
                    return (
                      <motion.div
                        key={option.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.05 }}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                          isChecked
                            ? "bg-[#CAFF4B]/5 border-[#CAFF4B]/20"
                            : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center transition-all",
                            isChecked
                              ? `bg-gradient-to-br ${option.gradient} shadow-lg`
                              : option.iconBg
                          )}>
                            <option.icon className={cn("w-5 h-5", isChecked ? "text-black" : option.iconColor)} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white text-sm">{option.title}</span>
                              {option.badge && (
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                                  option.badge === "AI"
                                    ? "bg-[#CAFF4B]/20 text-[#CAFF4B]"
                                    : "bg-[#9B5DE5]/20 text-[#9B5DE5]"
                                )}>
                                  {option.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/40 mt-0.5">{option.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={isChecked}
                          onCheckedChange={(value) => setOptionState(option.id, value)}
                          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#CAFF4B] data-[state=checked]:to-[#9EF01A]"
                        />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Start Button */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 50px rgba(202,255,75,0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartMeeting}
                    disabled={!title.trim() || createMeeting.isPending}
                    className="flex-1 flex items-center justify-center gap-3 h-14 rounded-xl bg-gradient-to-r from-[#CAFF4B] via-[#9EF01A] to-[#CAFF4B] bg-[length:200%_auto] text-black font-bold text-lg shadow-lg shadow-[#CAFF4B]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-right"
                    style={{ backgroundPosition: "0% center" }}
                  >
                    {createMeeting.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Room...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Start Meeting Now
                      </>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {createMeeting.data && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8, width: 0 }}
                        animate={{ opacity: 1, scale: 1, width: "auto" }}
                        exit={{ opacity: 0, scale: 0.8, width: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyLink}
                        className="px-4 h-14 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/70 hover:text-white hover:bg-white/[0.08] transition-all"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-[#CAFF4B]" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Alternative Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-6"
            >
              <Link
                href="/meetings/schedule"
                className="flex items-center gap-2 text-sm text-white/50 hover:text-[#CAFF4B] transition-colors group"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule for later</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="w-px h-4 bg-white/10" />
              <Link
                href="/meetings/join"
                className="flex items-center gap-2 text-sm text-white/50 hover:text-[#9B5DE5] transition-colors group"
              >
                <Share2 className="w-4 h-4" />
                <span>Join existing meeting</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Features Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative rounded-2xl overflow-hidden"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#CAFF4B]/10 via-[#9B5DE5]/5 to-transparent" />
              <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-xl" />

              {/* Glow effect */}
              <motion.div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#CAFF4B]/20 blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative p-6 border border-white/[0.06] rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A] flex items-center justify-center shadow-lg shadow-[#CAFF4B]/30">
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Included Features</h3>
                    <p className="text-xs text-[#CAFF4B]">AI-powered meeting tools</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {includedFeatures.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="flex items-center gap-3 group"
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform",
                        feature.gradient
                      )}>
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-3"
            >
              {quickStats.map((stat, i) => (
                <div
                  key={i}
                  className="relative rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-center group hover:bg-white/[0.04] transition-colors"
                >
                  <stat.icon className="w-4 h-4 text-[#CAFF4B] mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Pro Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-[#9B5DE5]" />
                <h3 className="font-semibold text-white">Pro Tips</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: MessageSquare, text: "Meeting links are shareable instantly" },
                  { icon: Brain, text: "AI generates summaries automatically" },
                  { icon: FileText, text: "Transcripts are searchable & exportable" },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#9B5DE5]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <tip.icon className="w-3 h-3 text-[#9B5DE5]" />
                    </div>
                    <p className="text-xs text-white/50">{tip.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-4 py-4"
            >
              {["SOC 2", "GDPR", "HIPAA"].map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06]"
                >
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-white/40 font-medium">{badge}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
