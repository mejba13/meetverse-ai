"use client";

import { useState } from "react";
import { format, addHours, addDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Loader2,
  ArrowLeft,
  Clock,
  Copy,
  Check,
  Sparkles,
  Video,
  Users,
  Mic,
  Shield,
  Brain,
  Globe,
  Zap,
  CalendarDays,
  Timer,
  FileText,
  CheckCircle2,
  ArrowRight,
  Send,
} from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// ============================================
// AURORA BACKGROUND - PREMIUM DARK THEME
// ============================================
function AuroraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep ink base with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink to-[#050810]" />

      {/* Primary gold aurora orb */}
      <motion.div
        className="absolute -top-[40%] -right-[30%] w-[90vw] h-[90vw] max-w-[1200px] max-h-[1200px]"
        style={{
          background: "conic-gradient(from 180deg at 50% 50%, rgba(252,161,17,0.12) 0deg, rgba(20,33,61,0.08) 120deg, rgba(252,161,17,0.06) 240deg, rgba(20,33,61,0.1) 360deg)",
          filter: "blur(100px)",
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Secondary navy orb */}
      <motion.div
        className="absolute -bottom-[30%] -left-[20%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px]"
        style={{
          background: "conic-gradient(from 0deg at 50% 50%, rgba(20,33,61,0.15) 0deg, rgba(252,161,17,0.05) 180deg, rgba(20,33,61,0.12) 360deg)",
          filter: "blur(80px)",
        }}
        animate={{
          rotate: [360, 0],
          y: [0, -30, 0],
        }}
        transition={{
          rotate: { duration: 50, repeat: Infinity, ease: "linear" },
          y: { duration: 12, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Floating accent particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gold/30"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

// ============================================
// ANIMATION VARIANTS
// ============================================
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// GLASS CARD - DARK GLASSMORPHISM
// ============================================
function GlassCard({
  children,
  className = "",
  hover = false,
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.02]",
        "backdrop-blur-2xl",
        "border border-white/[0.08]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        hover && "hover:border-gold/30 hover:shadow-[0_8px_40px_rgba(252,161,17,0.08)] transition-all duration-500",
        glow && "ring-1 ring-gold/20",
        className
      )}
      whileHover={hover ? { y: -3, scale: 1.005 } : undefined}
      transition={{ duration: 0.3 }}
    >
      {/* Inner glass highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}

// ============================================
// GRADIENT TEXT - GOLD THEME
// ============================================
function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      "bg-gradient-to-r from-gold via-amber-400 to-gold",
      "bg-clip-text text-transparent bg-[length:200%_auto]",
      "animate-gradient",
      className
    )}>
      {children}
    </span>
  );
}

// ============================================
// FEATURE BADGE
// ============================================
function FeatureBadge({
  icon: Icon,
  label,
  gradient,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  gradient: string;
}) {
  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm"
      whileHover={{ scale: 1.05, borderColor: "rgba(252,161,17,0.3)" }}
      transition={{ duration: 0.2 }}
    >
      <div className={cn("w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center", gradient)}>
        <Icon className="w-3 h-3 text-white" />
      </div>
      <span className="text-xs text-silver/80">{label}</span>
    </motion.div>
  );
}

// ============================================
// OPTION TOGGLE - GOLD THEME
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
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
        checked
          ? "bg-gold/[0.08] border-gold/30 shadow-[0_0_20px_rgba(252,161,17,0.08)]"
          : "bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05]"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
          gradient,
          checked && "shadow-gold/20"
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-white text-sm">{title}</span>
            {badge && (
              <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-semibold tracking-wide">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-silver/60 mt-0.5">{description}</p>
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
// QUICK TIME BUTTON - GOLD THEME
// ============================================
function QuickTimeButton({
  label,
  onClick,
  active,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300",
        active
          ? "bg-gradient-to-r from-gold to-amber-500 text-ink shadow-lg shadow-gold/25"
          : "bg-white/[0.04] text-silver/70 hover:text-white hover:bg-white/[0.08] border border-white/[0.08] hover:border-gold/20"
      )}
    >
      {label}
    </motion.button>
  );
}

// ============================================
// PREMIUM INPUT STYLES
// ============================================
const inputStyles = cn(
  "bg-white/[0.04] border-white/[0.08] text-white",
  "placeholder:text-silver/40",
  "focus:border-gold/40 focus:ring-1 focus:ring-gold/20",
  "h-12 rounded-xl transition-all duration-300",
  "hover:border-white/[0.15]"
);

const selectContentStyles = cn(
  "bg-ink/95 backdrop-blur-xl border-white/[0.1]",
  "shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
);

const selectItemStyles = cn(
  "text-white hover:bg-white/[0.08] focus:bg-white/[0.08]",
  "transition-colors duration-150"
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function ScheduleMeetingPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState("60");
  const [waitingRoom, setWaitingRoom] = useState(true);
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState(true);

  const createMeeting = trpc.meeting.create.useMutation({
    onSuccess: (meeting) => {
      toast({
        title: "Meeting scheduled successfully!",
        description: `"${meeting.title}" has been added to your calendar.`,
      });
      setStep(3);
    },
    onError: (error) => {
      toast({
        title: "Failed to schedule meeting",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSchedule = () => {
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);
    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = addHours(startDate, parseInt(duration) / 60);

    createMeeting.mutate({
      title,
      description: description || undefined,
      scheduledStart: startDate.toISOString(),
      scheduledEnd: endDate.toISOString(),
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
        description: "Meeting link has been copied to clipboard.",
      });
    }
  };

  // Quick date setters
  const setQuickDate = (days: number) => {
    setDate(format(addDays(new Date(), days), "yyyy-MM-dd"));
  };

  // Generate time options
  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      timeOptions.push(`${hour}:${minute}`);
    }
  }

  const isFormValid = title.trim() && date && time;

  return (
    <div className="relative min-h-screen pb-12">
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-silver/60 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Header */}
              <motion.div variants={fadeInUp} className="mb-8">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/[0.1] border border-gold/20 mb-5"
                  whileHover={{ scale: 1.02, borderColor: "rgba(252,161,17,0.4)" }}
                >
                  <Calendar className="w-3.5 h-3.5 text-gold" />
                  <span className="text-xs text-gold font-medium tracking-wide">Schedule Meeting</span>
                </motion.div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                  <span className="text-white">Plan your </span>
                  <GradientText>next meeting</GradientText>
                </h1>
                <p className="text-silver/70 text-base max-w-lg">
                  Set up your AI-powered meeting with transcription, summaries, and smart action items.
                </p>
              </motion.div>

              {/* Progress Steps */}
              <motion.div variants={fadeInUp} className="mb-8">
                <div className="flex items-center gap-4">
                  {[
                    { num: 1, label: "Details" },
                    { num: 2, label: "Options" },
                    { num: 3, label: "Confirm" },
                  ].map((s, i) => (
                    <div key={s.num} className="flex items-center gap-3">
                      <motion.div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500",
                          step >= s.num
                            ? "bg-gradient-to-r from-gold to-amber-500 text-ink shadow-lg shadow-gold/30"
                            : "bg-white/[0.05] text-silver/50 border border-white/[0.1]"
                        )}
                        animate={step >= s.num ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                      </motion.div>
                      <span className={cn(
                        "text-sm hidden sm:block transition-colors duration-300",
                        step >= s.num ? "text-white" : "text-silver/50"
                      )}>
                        {s.label}
                      </span>
                      {i < 2 && (
                        <div className={cn(
                          "w-12 h-0.5 transition-all duration-500",
                          step > s.num ? "bg-gradient-to-r from-gold to-amber-500" : "bg-white/[0.1]"
                        )} />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Form Content */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <GlassCard className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-lg shadow-gold/25">
                          <FileText className="w-5 h-5 text-ink" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-white">Meeting Details</h2>
                          <p className="text-xs text-silver/60">Basic information about your meeting</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-silver">
                            Meeting Title <span className="text-gold">*</span>
                          </label>
                          <Input
                            placeholder="e.g., Weekly Team Standup"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={inputStyles}
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-silver">Description</label>
                          <Textarea
                            placeholder="Add an agenda or notes for participants..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className={cn(
                              "bg-white/[0.04] border-white/[0.08] text-white",
                              "placeholder:text-silver/40",
                              "focus:border-gold/40 focus:ring-1 focus:ring-gold/20",
                              "rounded-xl resize-none transition-all duration-300",
                              "hover:border-white/[0.15]"
                            )}
                          />
                        </div>

                        {/* Quick Date Buttons */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-silver">Quick Schedule</label>
                          <div className="flex flex-wrap gap-2">
                            <QuickTimeButton
                              label="Today"
                              onClick={() => setQuickDate(0)}
                              active={date === format(new Date(), "yyyy-MM-dd")}
                            />
                            <QuickTimeButton
                              label="Tomorrow"
                              onClick={() => setQuickDate(1)}
                              active={date === format(addDays(new Date(), 1), "yyyy-MM-dd")}
                            />
                            <QuickTimeButton
                              label="In 2 Days"
                              onClick={() => setQuickDate(2)}
                              active={date === format(addDays(new Date(), 2), "yyyy-MM-dd")}
                            />
                            <QuickTimeButton
                              label="Next Week"
                              onClick={() => setQuickDate(7)}
                              active={date === format(addDays(new Date(), 7), "yyyy-MM-dd")}
                            />
                          </div>
                        </div>

                        {/* Date & Time Grid */}
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-silver">
                              Date <span className="text-gold">*</span>
                            </label>
                            <div className="relative">
                              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver/50" />
                              <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={format(new Date(), "yyyy-MM-dd")}
                                className={cn(inputStyles, "pl-10")}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-silver">
                              Time <span className="text-gold">*</span>
                            </label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver/50 z-10" />
                              <Select value={time} onValueChange={setTime}>
                                <SelectTrigger className={cn(inputStyles, "pl-10")}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={selectContentStyles}>
                                  {timeOptions.map((t) => (
                                    <SelectItem key={t} value={t} className={selectItemStyles}>
                                      {t}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-silver">Duration</label>
                            <div className="relative">
                              <Timer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver/50 z-10" />
                              <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger className={cn(inputStyles, "pl-10")}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={selectContentStyles}>
                                  <SelectItem value="30" className={selectItemStyles}>30 minutes</SelectItem>
                                  <SelectItem value="60" className={selectItemStyles}>1 hour</SelectItem>
                                  <SelectItem value="90" className={selectItemStyles}>1.5 hours</SelectItem>
                                  <SelectItem value="120" className={selectItemStyles}>2 hours</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Next Button */}
                      <div className="mt-8 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(252,161,17,0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStep(2)}
                          disabled={!title.trim()}
                          className={cn(
                            "flex items-center gap-2 px-8 py-3.5 rounded-xl",
                            "bg-gradient-to-r from-gold to-amber-500 text-ink font-semibold",
                            "shadow-lg shadow-gold/25",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-all duration-300"
                          )}
                        >
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <GlassCard className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-white">Meeting Options</h2>
                          <p className="text-xs text-silver/60">Configure AI features and settings</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <OptionToggle
                          icon={Shield}
                          title="Waiting Room"
                          description="Participants wait for host approval before joining"
                          checked={waitingRoom}
                          onCheckedChange={setWaitingRoom}
                          gradient="from-emerald-500 to-green-600"
                        />

                        <OptionToggle
                          icon={Video}
                          title="Cloud Recording"
                          description="Record the meeting for later review and sharing"
                          checked={recording}
                          onCheckedChange={setRecording}
                          gradient="from-rose-500 to-pink-600"
                          badge="PRO"
                        />

                        <OptionToggle
                          icon={Brain}
                          title="AI Transcription & Summaries"
                          description="Real-time transcription, action items, and smart summaries"
                          checked={transcription}
                          onCheckedChange={setTranscription}
                          gradient="from-gold to-amber-500"
                          badge="AI"
                        />
                      </div>

                      {/* Navigation Buttons */}
                      <div className="mt-8 flex justify-between">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStep(1)}
                          className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl",
                            "bg-white/[0.05] text-silver/70 hover:text-white",
                            "hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15]",
                            "transition-all duration-300"
                          )}
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(252,161,17,0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSchedule}
                          disabled={!isFormValid || createMeeting.isPending}
                          className={cn(
                            "flex items-center gap-2 px-8 py-3.5 rounded-xl",
                            "bg-gradient-to-r from-gold to-amber-500 text-ink font-semibold",
                            "shadow-lg shadow-gold/25",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-all duration-300"
                          )}
                        >
                          {createMeeting.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Scheduling...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Schedule Meeting
                            </>
                          )}
                        </motion.button>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                {step === 3 && createMeeting.data && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <GlassCard className="p-8 text-center" glow>
                      {/* Success Animation */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                        className="relative w-24 h-24 mx-auto mb-6"
                      >
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-gold to-amber-500"
                          animate={{
                            boxShadow: ["0 0 20px rgba(252,161,17,0.3)", "0 0 40px rgba(252,161,17,0.5)", "0 0 20px rgba(252,161,17,0.3)"]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <div className="absolute inset-1 rounded-full bg-ink flex items-center justify-center">
                          <CheckCircle2 className="w-12 h-12 text-gold" />
                        </div>
                      </motion.div>

                      <motion.h2
                        className="text-2xl font-bold text-white mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        Meeting Scheduled!
                      </motion.h2>
                      <motion.p
                        className="text-silver/70 mb-8"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        Your meeting has been created and is ready to share.
                      </motion.p>

                      {/* Meeting Summary */}
                      <motion.div
                        className="bg-white/[0.04] rounded-2xl p-6 mb-8 text-left border border-white/[0.06]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <h3 className="font-semibold text-white mb-4">{createMeeting.data.title}</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-gold" />
                            </div>
                            <span className="text-silver">
                              {format(new Date(date), "EEEE, MMMM d, yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                              <Clock className="w-4 h-4 text-amber-500" />
                            </div>
                            <span className="text-silver">{time} • {duration} minutes</span>
                          </div>
                        </div>

                        {/* Copy Link */}
                        <div className="mt-4 pt-4 border-t border-white/[0.08]">
                          <div className="flex items-center gap-2 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                            <input
                              type="text"
                              readOnly
                              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/meeting/${createMeeting.data.roomId}`}
                              className="flex-1 bg-transparent text-silver text-sm outline-none"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleCopyLink}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg",
                                "bg-gold/20 text-gold text-sm font-medium",
                                "hover:bg-gold/30 transition-all"
                              )}
                            >
                              {copied ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Copy
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>

                      {/* Action Buttons */}
                      <motion.div
                        className="flex flex-col sm:flex-row gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Link href="/meetings" className="flex-1">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl",
                              "bg-white/[0.05] text-silver/70 hover:text-white",
                              "hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15]",
                              "transition-all duration-300"
                            )}
                          >
                            View All Meetings
                          </motion.button>
                        </Link>
                        <Link href={`/meeting/${createMeeting.data.roomId}`} className="flex-1">
                          <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(252,161,17,0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl",
                              "bg-gradient-to-r from-gold to-amber-500 text-ink font-semibold",
                              "shadow-lg shadow-gold/25 transition-all duration-300"
                            )}
                          >
                            <Video className="w-4 h-4" />
                            Start Meeting Now
                          </motion.button>
                        </Link>
                      </motion.div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Features Card */}
            <motion.div variants={slideInRight}>
              <GlassCard className="p-6 overflow-hidden" glow>
                {/* Animated glow orb */}
                <motion.div
                  className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gold/20 blur-3xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-lg shadow-gold/30">
                      <Sparkles className="w-5 h-5 text-ink" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">AI-Powered</h3>
                      <p className="text-xs text-gold">Smart meeting features</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: Mic, text: "Real-time transcription", gradient: "from-gold to-amber-500" },
                      { icon: Brain, text: "AI meeting summaries", gradient: "from-amber-500 to-orange-500" },
                      { icon: CheckCircle2, text: "Auto action items", gradient: "from-emerald-500 to-green-600" },
                      { icon: Globe, text: "100+ languages", gradient: "from-navy to-blue-600" },
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 group"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-lg",
                          "group-hover:scale-110 transition-transform duration-300",
                          feature.gradient
                        )}>
                          <feature.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-silver/80 group-hover:text-white transition-colors duration-300">
                          {feature.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Tips Card */}
            <motion.div variants={slideInRight}>
              <GlassCard className="p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gold" />
                  Pro Tips
                </h3>
                <div className="space-y-3">
                  {[
                    "Add a clear agenda to help participants prepare",
                    "Enable transcription for searchable meeting records",
                    "Schedule 5 mins early for tech setup",
                  ].map((tip, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <p className="text-xs text-silver/70">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Feature Badges */}
            <motion.div
              variants={slideInRight}
              className="flex flex-wrap gap-2"
            >
              <FeatureBadge icon={Shield} label="SOC 2" gradient="from-emerald-500 to-green-600" />
              <FeatureBadge icon={Globe} label="GDPR" gradient="from-navy to-blue-600" />
              <FeatureBadge icon={Users} label="500 Max" gradient="from-gold to-amber-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
