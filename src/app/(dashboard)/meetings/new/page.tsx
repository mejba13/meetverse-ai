"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { trpc } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

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
// FLOATING ORBS
// ============================================
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-[30%] -right-[20%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(252,161,17,0.1) 0%, rgba(20,33,61,0.06) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[20%] -left-[15%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(20,33,61,0.1) 0%, rgba(252,161,17,0.05) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ============================================
// GLASS CARD
// ============================================
function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden",
        "bg-white dark:bg-gradient-to-br dark:from-white/[0.07] dark:to-white/[0.02] backdrop-blur-xl",
        "border border-gray-200 dark:border-white/[0.08]",
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================
// GRADIENT TEXT
// ============================================
function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-gold via-amber-400 to-gold bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient ${className}`}>
      {children}
    </span>
  );
}

// ============================================
// OPTION TOGGLE
// ============================================
function OptionToggle({
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
  gradient,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  gradient: string;
  badge?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
        checked
          ? "bg-gold/5 dark:bg-gold/10 border-gold/30"
          : "bg-gray-50 dark:bg-white/[0.02] border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.1]"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${
          checked ? "shadow-gold/20" : ""
        }`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white text-sm">{title}</span>
            {badge && (
              <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-medium">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-silver/70 mt-0.5">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-gold data-[state=checked]:to-amber-500"
      />
    </motion.div>
  );
}

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

  return (
    <div className="relative min-h-screen pb-12">
      {/* Background */}
      <FloatingOrbs />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-500 dark:text-silver/70 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-3">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Header */}
              <motion.div variants={fadeInUp} className="text-center mb-8">
                <motion.div
                  className="relative w-20 h-20 mx-auto mb-6"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold to-amber-500 rounded-2xl blur-xl opacity-50" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-gold via-amber-400 to-gold flex items-center justify-center shadow-2xl shadow-gold/30">
                    <Video className="w-10 h-10 text-ink" />
                  </div>
                </motion.div>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                  <span className="text-gray-900 dark:text-white">Start an </span>
                  <GradientText>Instant Meeting</GradientText>
                </h1>
                <p className="text-gray-500 dark:text-silver max-w-md mx-auto">
                  Launch your AI-powered meeting room instantly with real-time transcription and smart features.
                </p>
              </motion.div>

              {/* Meeting Form */}
              <motion.div variants={fadeInUp}>
                <GlassCard className="p-8">
                  <div className="space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-silver">
                        Meeting Title
                      </label>
                      <Input
                        placeholder="Enter meeting title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-silver/50 focus:border-gold/50 focus:ring-gold/20 h-12 rounded-xl text-lg"
                      />
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
                      <span className="text-xs text-gray-400 dark:text-silver/50 font-medium">MEETING OPTIONS</span>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                      <OptionToggle
                        icon={Shield}
                        title="Waiting Room"
                        description="Participants wait for approval to join"
                        checked={waitingRoom}
                        onCheckedChange={setWaitingRoom}
                        gradient="from-emerald-500 to-green-600"
                      />

                      <OptionToggle
                        icon={Video}
                        title="Cloud Recording"
                        description="Record the meeting for later review"
                        checked={recording}
                        onCheckedChange={setRecording}
                        gradient="from-rose-500 to-pink-600"
                        badge="PRO"
                      />

                      <OptionToggle
                        icon={Brain}
                        title="AI Transcription"
                        description="Real-time transcription and AI summaries"
                        checked={transcription}
                        onCheckedChange={setTranscription}
                        gradient="from-gold to-amber-500"
                        badge="AI"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(252,161,17,0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleStartMeeting}
                        disabled={!title.trim() || createMeeting.isPending}
                        className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-gold via-amber-500 to-gold bg-[length:200%_auto] animate-gradient text-ink font-semibold shadow-lg shadow-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
                      >
                        {createMeeting.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            Start Meeting
                          </>
                        )}
                      </motion.button>
                      {createMeeting.data && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCopyLink}
                          className="px-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-silver hover:text-gray-900 dark:hover:text-white transition-all"
                        >
                          {copied ? (
                            <Check className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Alternative Actions */}
              <motion.div variants={fadeInUp} className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-silver/70">
                  Need to plan ahead?{" "}
                  <Link href="/meetings/schedule" className="text-gold hover:text-amber-400 font-medium transition-colors">
                    Schedule a meeting
                  </Link>
                  {" "}or{" "}
                  <Link href="/meetings/join" className="text-gold hover:text-amber-400 font-medium transition-colors">
                    join an existing one
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Features Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-amber-500/15 to-orange-500/20" />
                <div className="absolute inset-0 bg-white/80 dark:bg-ink/80 backdrop-blur-xl" />

                <motion.div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gold/20 blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="relative p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-lg shadow-gold/30">
                      <Sparkles className="w-5 h-5 text-ink" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Included Features</h3>
                      <p className="text-xs text-gold">AI-powered meeting tools</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: Mic, text: "Real-time transcription", gradient: "from-gold to-amber-500" },
                      { icon: Brain, text: "AI meeting summaries", gradient: "from-amber-500 to-orange-500" },
                      { icon: CheckCircle2, text: "Auto action items", gradient: "from-emerald-500 to-green-600" },
                      { icon: Globe, text: "100+ languages", gradient: "from-navy to-blue-600" },
                      { icon: Users, text: "Up to 500 participants", gradient: "from-violet-500 to-purple-600" },
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center gap-3 group"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <feature.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-silver group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {feature.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gold" />
                  Quick Tips
                </h3>
                <div className="space-y-3">
                  {[
                    "Your meeting link is ready to share instantly",
                    "AI will generate summaries after the meeting",
                    "Transcripts are searchable and exportable",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <p className="text-xs text-gray-500 dark:text-silver">{tip}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
