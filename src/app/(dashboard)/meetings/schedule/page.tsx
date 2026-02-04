"use client";

import { useState, useEffect } from "react";
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
  Plus,
  X,
  Mail,
  Link2,
  Settings2,
  Wand2,
  Lock,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// ============================================
// ANIMATED BACKGROUND - LIME/PURPLE THEME
// ============================================
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Deep ink base - transparent to let dashboard bg show */}
      <div className="absolute inset-0 bg-transparent" />

      {/* Primary lime aurora orb */}
      <motion.div
        className="absolute -top-[30%] -right-[20%] w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px]"
        style={{
          background: "conic-gradient(from 180deg at 50% 50%, rgba(202,255,75,0.08) 0deg, rgba(155,93,229,0.05) 120deg, rgba(202,255,75,0.04) 240deg, rgba(155,93,229,0.06) 360deg)",
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

      {/* Secondary purple orb */}
      <motion.div
        className="absolute -bottom-[20%] -left-[15%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px]"
        style={{
          background: "conic-gradient(from 0deg at 50% 50%, rgba(155,93,229,0.1) 0deg, rgba(202,255,75,0.03) 180deg, rgba(155,93,229,0.08) 360deg)",
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

      {/* Center glow pulse */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px]"
        style={{
          background: "radial-gradient(circle, rgba(202,255,75,0.03) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute w-1.5 h-1.5 rounded-full",
            i % 2 === 0 ? "bg-[#CAFF4B]/30" : "bg-[#9B5DE5]/30"
          )}
          style={{
            left: `${15 + i * 10}%`,
            top: `${20 + (i % 4) * 18}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        />
      ))}

      {/* Subtle noise texture */}
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
// ANIMATION VARIANTS
// ============================================
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
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

const slideInRight = {
  hidden: { opacity: 0, x: 30, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// GLASS CARD COMPONENT
// ============================================
function GlassCard({
  children,
  className = "",
  hover = false,
  glow = false,
  lime = false,
  purple = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  lime?: boolean;
  purple?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-white/[0.01]",
        "backdrop-blur-2xl",
        "border border-white/[0.08]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        hover && "hover:border-[#CAFF4B]/30 hover:shadow-[0_8px_40px_rgba(202,255,75,0.06)] transition-all duration-500",
        glow && lime && "ring-1 ring-[#CAFF4B]/20",
        glow && purple && "ring-1 ring-[#9B5DE5]/20",
        className
      )}
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      transition={{ duration: 0.3 }}
    >
      {/* Inner glass highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}

// ============================================
// STEP INDICATOR
// ============================================
function StepIndicator({ currentStep, totalSteps = 3 }: { currentStep: number; totalSteps?: number }) {
  const steps = [
    { num: 1, label: "Details", icon: FileText },
    { num: 2, label: "Options", icon: Settings2 },
    { num: 3, label: "Confirm", icon: CheckCircle2 },
  ];

  return (
    <div className="flex items-center justify-between mb-10">
      {steps.slice(0, totalSteps).map((step, i) => (
        <div key={step.num} className="flex items-center flex-1">
          <div className="flex items-center gap-3">
            <motion.div
              className={cn(
                "relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                currentStep > step.num
                  ? "bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A]"
                  : currentStep === step.num
                  ? "bg-gradient-to-br from-[#CAFF4B]/20 to-[#9B5DE5]/20 border-2 border-[#CAFF4B]/50"
                  : "bg-white/[0.04] border border-white/[0.08]"
              )}
              animate={currentStep === step.num ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {currentStep > step.num ? (
                <Check className="w-5 h-5 text-black" />
              ) : (
                <step.icon className={cn(
                  "w-5 h-5 transition-colors",
                  currentStep === step.num ? "text-[#CAFF4B]" : "text-white/40"
                )} />
              )}
              {currentStep === step.num && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-[#CAFF4B]/30"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            <div className="hidden sm:block">
              <p className={cn(
                "text-sm font-medium transition-colors",
                currentStep >= step.num ? "text-white" : "text-white/40"
              )}>
                {step.label}
              </p>
              <p className="text-xs text-white/30">Step {step.num}</p>
            </div>
          </div>
          {i < totalSteps - 1 && (
            <div className="flex-1 mx-4">
              <div className="h-0.5 bg-white/[0.08] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#CAFF4B] to-[#9B5DE5]"
                  initial={{ width: "0%" }}
                  animate={{ width: currentStep > step.num ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================
// OPTION TOGGLE - LIME/PURPLE THEME
// ============================================
function OptionToggle({
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
  gradient,
  badge,
  recommended,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  gradient: string;
  badge?: string;
  recommended?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-300",
        checked
          ? "bg-[#CAFF4B]/[0.06] border-[#CAFF4B]/30 shadow-[0_0_30px_rgba(202,255,75,0.06)]"
          : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]"
      )}
    >
      {recommended && (
        <div className="absolute -top-2 left-4 px-2 py-0.5 bg-gradient-to-r from-[#CAFF4B] to-[#9EF01A] rounded-full">
          <span className="text-[10px] font-bold text-black">RECOMMENDED</span>
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-all duration-300",
          gradient,
          checked && "shadow-[#CAFF4B]/20 scale-105"
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{title}</span>
            {badge && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide",
                badge === "AI" ? "bg-[#CAFF4B]/20 text-[#CAFF4B]" : "bg-[#9B5DE5]/20 text-[#9B5DE5]"
              )}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-white/50 mt-0.5">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        onClick={(e) => e.stopPropagation()}
        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#CAFF4B] data-[state=checked]:to-[#9EF01A]"
      />
    </motion.div>
  );
}

// ============================================
// QUICK SCHEDULE BUTTON
// ============================================
function QuickScheduleButton({
  label,
  sublabel,
  onClick,
  active,
  icon: Icon,
}: {
  label: string;
  sublabel?: string;
  onClick: () => void;
  active?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center px-5 py-4 rounded-xl transition-all duration-300 min-w-[100px]",
        active
          ? "bg-gradient-to-br from-[#CAFF4B]/20 to-[#9B5DE5]/10 border-2 border-[#CAFF4B]/50 shadow-lg shadow-[#CAFF4B]/10"
          : "bg-white/[0.03] border border-white/[0.08] hover:border-[#CAFF4B]/20 hover:bg-white/[0.05]"
      )}
    >
      {Icon && <Icon className={cn("w-4 h-4 mb-1", active ? "text-[#CAFF4B]" : "text-white/50")} />}
      <span className={cn(
        "text-sm font-medium",
        active ? "text-[#CAFF4B]" : "text-white/70"
      )}>
        {label}
      </span>
      {sublabel && (
        <span className="text-[10px] text-white/40 mt-0.5">{sublabel}</span>
      )}
    </motion.button>
  );
}

// ============================================
// PARTICIPANT INPUT
// ============================================
function ParticipantInput({ participants, setParticipants }: {
  participants: string[];
  setParticipants: (p: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addParticipant = () => {
    if (input.trim() && !participants.includes(input.trim())) {
      setParticipants([...participants, input.trim()]);
      setInput("");
    }
  };

  const removeParticipant = (email: string) => {
    setParticipants(participants.filter((p) => p !== email));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            placeholder="Enter email address..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addParticipant())}
            className={cn(
              "pl-11 h-12 bg-white/[0.03] border-white/[0.08]",
              "placeholder:text-white/30 text-white",
              "focus:border-[#CAFF4B]/40 focus:ring-1 focus:ring-[#CAFF4B]/20",
              "rounded-xl"
            )}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addParticipant}
          className="px-4 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:border-[#CAFF4B]/30 hover:bg-white/[0.08] transition-all"
        >
          <Plus className="w-5 h-5 text-white/60" />
        </motion.button>
      </div>
      {participants.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {participants.map((email) => (
            <motion.div
              key={email}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#9B5DE5]/10 border border-[#9B5DE5]/20"
            >
              <span className="text-xs text-white/80">{email}</span>
              <button
                onClick={() => removeParticipant(email)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// INPUT STYLES
// ============================================
const inputStyles = cn(
  "bg-white/[0.03] border-white/[0.08] text-white",
  "placeholder:text-white/30",
  "focus:border-[#CAFF4B]/40 focus:ring-1 focus:ring-[#CAFF4B]/20",
  "h-12 rounded-xl transition-all duration-300",
  "hover:border-white/[0.15]"
);

const selectContentStyles = cn(
  "bg-[#0a0a0a]/95 backdrop-blur-xl border-white/[0.1]",
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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState("60");
  const [participants, setParticipants] = useState<string[]>([]);
  const [waitingRoom, setWaitingRoom] = useState(true);
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState(true);
  const [aiSummary, setAiSummary] = useState(true);
  const [actionItems, setActionItems] = useState(true);

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
    <div className="relative min-h-full pb-12">
      {/* Animated Background - contained within the page area */}
      <AnimatedBackground />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Back Navigation */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors group mb-6"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>

          {/* Title with Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#CAFF4B]/10 to-[#9B5DE5]/10 border border-[#CAFF4B]/20"
              whileHover={{ scale: 1.02 }}
            >
              <Calendar className="w-4 h-4 text-[#CAFF4B]" />
              <span className="text-sm text-[#CAFF4B] font-medium">Schedule Meeting</span>
            </motion.div>
            <div className="text-sm text-white/30">
              {format(currentTime, "EEEE, MMMM d, yyyy • h:mm a")}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="text-white">Plan your </span>
            <span className="bg-gradient-to-r from-[#CAFF4B] via-[#9EF01A] to-[#CAFF4B] bg-clip-text text-transparent">
              AI-powered meeting
            </span>
          </h1>
          <p className="text-white/50 mt-3 max-w-xl">
            Set up your meeting with real-time transcription, intelligent summaries,
            and automatic action item detection.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Step Indicator */}
              <motion.div variants={fadeInUp}>
                <StepIndicator currentStep={step} />
              </motion.div>

              {/* Form Content */}
              <AnimatePresence mode="wait">
                {/* STEP 1: Meeting Details */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                    transition={{ duration: 0.4 }}
                  >
                    <GlassCard className="p-6 sm:p-8">
                      {/* Section Header */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A] flex items-center justify-center shadow-lg shadow-[#CAFF4B]/20">
                          <FileText className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-white">Meeting Details</h2>
                          <p className="text-sm text-white/50">Basic information about your meeting</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Meeting Title */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/80">
                            Meeting Title <span className="text-[#CAFF4B]">*</span>
                          </label>
                          <Input
                            placeholder="e.g., Weekly Team Standup, Product Review, Client Call..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={inputStyles}
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/80">
                            Description / Agenda
                          </label>
                          <Textarea
                            placeholder="Add meeting agenda, discussion points, or notes for participants..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className={cn(
                              "bg-white/[0.03] border-white/[0.08] text-white",
                              "placeholder:text-white/30",
                              "focus:border-[#CAFF4B]/40 focus:ring-1 focus:ring-[#CAFF4B]/20",
                              "rounded-xl resize-none"
                            )}
                          />
                          <p className="text-xs text-white/30 flex items-center gap-1">
                            <Wand2 className="w-3 h-3" />
                            Pro tip: Adding an agenda helps our AI generate better summaries
                          </p>
                        </div>

                        {/* Quick Schedule */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-white/80">Quick Schedule</label>
                          <div className="flex flex-wrap gap-2">
                            <QuickScheduleButton
                              label="Today"
                              sublabel={format(new Date(), "MMM d")}
                              onClick={() => setQuickDate(0)}
                              active={date === format(new Date(), "yyyy-MM-dd")}
                              icon={Zap}
                            />
                            <QuickScheduleButton
                              label="Tomorrow"
                              sublabel={format(addDays(new Date(), 1), "MMM d")}
                              onClick={() => setQuickDate(1)}
                              active={date === format(addDays(new Date(), 1), "yyyy-MM-dd")}
                            />
                            <QuickScheduleButton
                              label="In 2 Days"
                              sublabel={format(addDays(new Date(), 2), "MMM d")}
                              onClick={() => setQuickDate(2)}
                              active={date === format(addDays(new Date(), 2), "yyyy-MM-dd")}
                            />
                            <QuickScheduleButton
                              label="Next Week"
                              sublabel={format(addDays(new Date(), 7), "MMM d")}
                              onClick={() => setQuickDate(7)}
                              active={date === format(addDays(new Date(), 7), "yyyy-MM-dd")}
                            />
                          </div>
                        </div>

                        {/* Date, Time, Duration Grid */}
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">
                              Date <span className="text-[#CAFF4B]">*</span>
                            </label>
                            <div className="relative">
                              <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                              <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={format(new Date(), "yyyy-MM-dd")}
                                className={cn(inputStyles, "pl-11")}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">
                              Time <span className="text-[#CAFF4B]">*</span>
                            </label>
                            <div className="relative">
                              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 z-10" />
                              <Select value={time} onValueChange={setTime}>
                                <SelectTrigger className={cn(inputStyles, "pl-11")}>
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
                            <label className="text-sm font-medium text-white/80">Duration</label>
                            <div className="relative">
                              <Timer className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 z-10" />
                              <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger className={cn(inputStyles, "pl-11")}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={selectContentStyles}>
                                  <SelectItem value="15" className={selectItemStyles}>15 minutes</SelectItem>
                                  <SelectItem value="30" className={selectItemStyles}>30 minutes</SelectItem>
                                  <SelectItem value="45" className={selectItemStyles}>45 minutes</SelectItem>
                                  <SelectItem value="60" className={selectItemStyles}>1 hour</SelectItem>
                                  <SelectItem value="90" className={selectItemStyles}>1.5 hours</SelectItem>
                                  <SelectItem value="120" className={selectItemStyles}>2 hours</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Participants */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/80">
                            Invite Participants <span className="text-white/30">(optional)</span>
                          </label>
                          <ParticipantInput
                            participants={participants}
                            setParticipants={setParticipants}
                          />
                        </div>
                      </div>

                      {/* Navigation */}
                      <div className="mt-10 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(202,255,75,0.2)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStep(2)}
                          disabled={!title.trim()}
                          className={cn(
                            "flex items-center gap-2 px-8 py-4 rounded-xl",
                            "bg-gradient-to-r from-[#CAFF4B] to-[#9EF01A] text-black font-semibold",
                            "shadow-lg shadow-[#CAFF4B]/20",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-all duration-300"
                          )}
                        >
                          Continue to Options
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                {/* STEP 2: Meeting Options */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                    transition={{ duration: 0.4 }}
                  >
                    <GlassCard className="p-6 sm:p-8">
                      {/* Section Header */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9B5DE5] to-[#7B2FD8] flex items-center justify-center shadow-lg shadow-[#9B5DE5]/20">
                          <Settings2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-white">Meeting Options</h2>
                          <p className="text-sm text-white/50">Configure AI features and security settings</p>
                        </div>
                      </div>

                      {/* AI Features */}
                      <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="w-4 h-4 text-[#CAFF4B]" />
                          <h3 className="text-sm font-semibold text-white">AI Features</h3>
                        </div>
                        <div className="space-y-3">
                          <OptionToggle
                            icon={Mic}
                            title="Real-time Transcription"
                            description="Automatically transcribe the entire meeting with speaker identification"
                            checked={transcription}
                            onCheckedChange={setTranscription}
                            gradient="from-[#CAFF4B] to-[#9EF01A]"
                            badge="AI"
                            recommended
                          />
                          <OptionToggle
                            icon={Brain}
                            title="AI Meeting Summary"
                            description="Generate intelligent summaries and key insights after the meeting"
                            checked={aiSummary}
                            onCheckedChange={setAiSummary}
                            gradient="from-[#9B5DE5] to-[#7B2FD8]"
                            badge="AI"
                          />
                          <OptionToggle
                            icon={CheckCircle2}
                            title="Auto Action Items"
                            description="Automatically detect and extract action items with assignees"
                            checked={actionItems}
                            onCheckedChange={setActionItems}
                            gradient="from-emerald-500 to-green-600"
                            badge="AI"
                          />
                        </div>
                      </div>

                      {/* Security & Recording */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Shield className="w-4 h-4 text-[#9B5DE5]" />
                          <h3 className="text-sm font-semibold text-white">Security & Recording</h3>
                        </div>
                        <div className="space-y-3">
                          <OptionToggle
                            icon={Lock}
                            title="Waiting Room"
                            description="Participants wait for host approval before joining"
                            checked={waitingRoom}
                            onCheckedChange={setWaitingRoom}
                            gradient="from-amber-500 to-orange-500"
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
                        </div>
                      </div>

                      {/* Navigation */}
                      <div className="mt-10 flex justify-between">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStep(1)}
                          className={cn(
                            "flex items-center gap-2 px-6 py-3.5 rounded-xl",
                            "bg-white/[0.04] text-white/70 hover:text-white",
                            "hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15]",
                            "transition-all duration-300"
                          )}
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(202,255,75,0.2)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSchedule}
                          disabled={!isFormValid || createMeeting.isPending}
                          className={cn(
                            "flex items-center gap-2 px-8 py-4 rounded-xl",
                            "bg-gradient-to-r from-[#CAFF4B] to-[#9EF01A] text-black font-semibold",
                            "shadow-lg shadow-[#CAFF4B]/20",
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

                {/* STEP 3: Confirmation */}
                {step === 3 && createMeeting.data && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.5 }}
                  >
                    <GlassCard className="p-8 sm:p-10" glow lime>
                      {/* Success Animation */}
                      <div className="text-center mb-8">
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                          className="relative w-28 h-28 mx-auto mb-6"
                        >
                          <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-br from-[#CAFF4B] to-[#9B5DE5]"
                            animate={{
                              boxShadow: [
                                "0 0 20px rgba(202,255,75,0.3)",
                                "0 0 50px rgba(202,255,75,0.4)",
                                "0 0 20px rgba(202,255,75,0.3)"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <div className="absolute inset-1.5 rounded-full bg-[#0a0a0a] flex items-center justify-center">
                            <CheckCircle2 className="w-14 h-14 text-[#CAFF4B]" />
                          </div>
                        </motion.div>

                        <motion.h2
                          className="text-3xl font-bold text-white mb-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          Meeting Scheduled!
                        </motion.h2>
                        <motion.p
                          className="text-white/50"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          Your AI-powered meeting is ready to go
                        </motion.p>
                      </div>

                      {/* Meeting Summary Card */}
                      <motion.div
                        className="bg-white/[0.03] rounded-2xl p-6 mb-8 border border-white/[0.06]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <h3 className="text-xl font-semibold text-white mb-5">{createMeeting.data.title}</h3>

                        <div className="grid sm:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#CAFF4B]/10 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-[#CAFF4B]" />
                            </div>
                            <div>
                              <p className="text-xs text-white/40">Date</p>
                              <p className="text-sm text-white">{format(new Date(date), "EEEE, MMMM d, yyyy")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#9B5DE5]/10 flex items-center justify-center">
                              <Clock className="w-5 h-5 text-[#9B5DE5]" />
                            </div>
                            <div>
                              <p className="text-xs text-white/40">Time</p>
                              <p className="text-sm text-white">{time} • {duration} minutes</p>
                            </div>
                          </div>
                        </div>

                        {/* Features enabled */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {transcription && (
                            <span className="px-3 py-1 rounded-full bg-[#CAFF4B]/10 text-[#CAFF4B] text-xs font-medium flex items-center gap-1">
                              <Mic className="w-3 h-3" /> Transcription
                            </span>
                          )}
                          {aiSummary && (
                            <span className="px-3 py-1 rounded-full bg-[#9B5DE5]/10 text-[#9B5DE5] text-xs font-medium flex items-center gap-1">
                              <Brain className="w-3 h-3" /> AI Summary
                            </span>
                          )}
                          {actionItems && (
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Action Items
                            </span>
                          )}
                        </div>

                        {/* Copy Link */}
                        <div className="pt-4 border-t border-white/[0.06]">
                          <p className="text-xs text-white/40 mb-2">Meeting Link</p>
                          <div className="flex items-center gap-2 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                            <Link2 className="w-4 h-4 text-white/30 flex-shrink-0" />
                            <input
                              type="text"
                              readOnly
                              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/meeting/${createMeeting.data.roomId}`}
                              className="flex-1 bg-transparent text-white/80 text-sm outline-none truncate"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleCopyLink}
                              className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg",
                                "bg-[#CAFF4B]/20 text-[#CAFF4B] text-sm font-medium",
                                "hover:bg-[#CAFF4B]/30 transition-all flex-shrink-0"
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
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Link href="/meetings" className="flex-1">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl",
                              "bg-white/[0.04] text-white/70 hover:text-white",
                              "hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15]",
                              "transition-all duration-300"
                            )}
                          >
                            <CalendarDays className="w-4 h-4" />
                            View All Meetings
                          </motion.button>
                        </Link>
                        <Link href={`/meeting/${createMeeting.data.roomId}`} className="flex-1">
                          <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(202,255,75,0.2)" }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl",
                              "bg-gradient-to-r from-[#CAFF4B] to-[#9EF01A] text-black font-semibold",
                              "shadow-lg shadow-[#CAFF4B]/20 transition-all duration-300"
                            )}
                          >
                            <Video className="w-5 h-5" />
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
            {/* AI Features Card */}
            <motion.div variants={slideInRight}>
              <GlassCard className="p-6 overflow-hidden" glow lime>
                {/* Animated glow */}
                <motion.div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#CAFF4B]/15 blur-3xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A] flex items-center justify-center shadow-lg shadow-[#CAFF4B]/25">
                      <Sparkles className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">AI-Powered</h3>
                      <p className="text-xs text-[#CAFF4B]">Smart meeting features</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: Mic, text: "Real-time transcription", gradient: "from-[#CAFF4B] to-[#9EF01A]" },
                      { icon: Brain, text: "AI meeting summaries", gradient: "from-[#9B5DE5] to-[#7B2FD8]" },
                      { icon: CheckCircle2, text: "Auto action items", gradient: "from-emerald-500 to-green-600" },
                      { icon: Globe, text: "100+ languages", gradient: "from-blue-500 to-cyan-500" },
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 group"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                          "group-hover:scale-110 transition-transform duration-300",
                          feature.gradient
                        )}>
                          <feature.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                          {feature.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Meeting Preview */}
            <motion.div variants={slideInRight}>
              <GlassCard className="p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-[#9B5DE5]" />
                  Meeting Preview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                    <span className="text-sm text-white/50">Title</span>
                    <span className="text-sm text-white font-medium truncate ml-4">
                      {title || "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                    <span className="text-sm text-white/50">Date</span>
                    <span className="text-sm text-white">
                      {date ? format(new Date(date), "MMM d, yyyy") : "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                    <span className="text-sm text-white/50">Time</span>
                    <span className="text-sm text-white">{time}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-white/50">Duration</span>
                    <span className="text-sm text-white">{duration} min</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Pro Tips */}
            <motion.div variants={slideInRight}>
              <GlassCard className="p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#CAFF4B]" />
                  Pro Tips
                </h3>
                <div className="space-y-3">
                  {[
                    "Add a clear agenda to help our AI generate better summaries",
                    "Enable transcription for searchable meeting records",
                    "Schedule 5 mins early for tech setup and testing",
                  ].map((tip, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#CAFF4B] mt-2 flex-shrink-0" />
                      <p className="text-xs text-white/60 leading-relaxed">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={slideInRight} className="flex flex-wrap gap-2">
              {[
                { icon: Shield, label: "SOC 2", color: "text-emerald-400" },
                { icon: Globe, label: "GDPR", color: "text-blue-400" },
                { icon: Users, label: "500 Max", color: "text-[#CAFF4B]" },
                { icon: Wifi, label: "99.9% Uptime", color: "text-[#9B5DE5]" },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                  whileHover={{ scale: 1.05, borderColor: "rgba(202,255,75,0.2)" }}
                >
                  <badge.icon className={cn("w-3.5 h-3.5", badge.color)} />
                  <span className="text-xs text-white/60">{badge.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
