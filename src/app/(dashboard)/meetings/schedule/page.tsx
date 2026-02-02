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
        className="absolute -bottom-[20%] -left-[15%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full"
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
// GLASS CARD
// ============================================
function GlassCard({
  children,
  className = "",
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      className={`
        relative rounded-2xl overflow-hidden
        bg-white/[0.03] backdrop-blur-xl
        border border-white/[0.08]
        ${hover ? "transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.15]" : ""}
        ${className}
      `}
      whileHover={hover ? { y: -2 } : undefined}
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
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <Icon className="w-3 h-3 text-white" />
      </div>
      <span className="text-xs text-white/60">{label}</span>
    </div>
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
          ? "bg-white/[0.05] border-cyan-500/30"
          : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${
          checked ? "shadow-cyan-500/20" : ""
        }`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-white text-sm">{title}</span>
            {badge && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-medium">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-white/40 mt-0.5">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-violet-500"
      />
    </motion.div>
  );
}

// ============================================
// QUICK TIME BUTTON
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/25"
          : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
      }`}
    >
      {label}
    </motion.button>
  );
}

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
      {/* Background */}
      <FloatingOrbs />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs text-cyan-400 font-medium">Schedule Meeting</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                  <span className="text-white">Plan your </span>
                  <GradientText>next meeting</GradientText>
                </h1>
                <p className="text-white/50 text-base max-w-lg">
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
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          step >= s.num
                            ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white"
                            : "bg-white/5 text-white/40 border border-white/10"
                        }`}
                      >
                        {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                      </div>
                      <span className={`text-sm hidden sm:block ${step >= s.num ? "text-white" : "text-white/40"}`}>
                        {s.label}
                      </span>
                      {i < 2 && (
                        <div className={`w-12 h-0.5 ${step > s.num ? "bg-cyan-500" : "bg-white/10"}`} />
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
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GlassCard className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-white">Meeting Details</h2>
                          <p className="text-xs text-white/40">Basic information about your meeting</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/80">
                            Meeting Title <span className="text-cyan-400">*</span>
                          </label>
                          <Input
                            placeholder="e.g., Weekly Team Standup"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-12 rounded-xl"
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/80">Description</label>
                          <Textarea
                            placeholder="Add an agenda or notes for participants..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl resize-none"
                          />
                        </div>

                        {/* Quick Date Buttons */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-white/80">Quick Schedule</label>
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
                            <label className="text-sm font-medium text-white/80">
                              Date <span className="text-cyan-400">*</span>
                            </label>
                            <div className="relative">
                              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                              <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={format(new Date(), "yyyy-MM-dd")}
                                className="bg-white/5 border-white/10 text-white pl-10 h-12 rounded-xl focus:border-cyan-500/50"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">
                              Time <span className="text-cyan-400">*</span>
                            </label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />
                              <Select value={time} onValueChange={setTime}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white pl-10 h-12 rounded-xl focus:border-cyan-500/50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a1a2e] border-white/10">
                                  {timeOptions.map((t) => (
                                    <SelectItem key={t} value={t} className="text-white hover:bg-white/10">
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
                              <Timer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />
                              <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white pl-10 h-12 rounded-xl focus:border-cyan-500/50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a1a2e] border-white/10">
                                  <SelectItem value="30" className="text-white hover:bg-white/10">30 minutes</SelectItem>
                                  <SelectItem value="60" className="text-white hover:bg-white/10">1 hour</SelectItem>
                                  <SelectItem value="90" className="text-white hover:bg-white/10">1.5 hours</SelectItem>
                                  <SelectItem value="120" className="text-white hover:bg-white/10">2 hours</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Next Button */}
                      <div className="mt-8 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStep(2)}
                          disabled={!title.trim()}
                          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GlassCard className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-white">Meeting Options</h2>
                          <p className="text-xs text-white/40">Configure AI features and settings</p>
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
                          gradient="from-pink-500 to-rose-600"
                          badge="PRO"
                        />

                        <OptionToggle
                          icon={Brain}
                          title="AI Transcription & Summaries"
                          description="Real-time transcription, action items, and smart summaries"
                          checked={transcription}
                          onCheckedChange={setTranscription}
                          gradient="from-cyan-500 to-violet-500"
                          badge="AI"
                        />
                      </div>

                      {/* Navigation Buttons */}
                      <div className="mt-8 flex justify-between">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStep(1)}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10 transition-all"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(6,182,212,0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSchedule}
                          disabled={!isFormValid || createMeeting.isPending}
                          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <GlassCard className="p-8 text-center">
                      {/* Success Animation */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="relative w-20 h-20 mx-auto mb-6"
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 animate-pulse" />
                        <div className="absolute inset-1 rounded-full bg-[#030014] flex items-center justify-center">
                          <CheckCircle2 className="w-10 h-10 text-cyan-400" />
                        </div>
                      </motion.div>

                      <h2 className="text-2xl font-bold text-white mb-2">Meeting Scheduled!</h2>
                      <p className="text-white/50 mb-8">
                        Your meeting has been created and is ready to share.
                      </p>

                      {/* Meeting Summary */}
                      <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
                        <h3 className="font-semibold text-white mb-4">{createMeeting.data.title}</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span className="text-white/70">
                              {format(new Date(date), "EEEE, MMMM d, yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Clock className="w-4 h-4 text-violet-400" />
                            <span className="text-white/70">{time} • {duration} minutes</span>
                          </div>
                        </div>

                        {/* Copy Link */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl">
                            <input
                              type="text"
                              readOnly
                              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/meeting/${createMeeting.data.roomId}`}
                              className="flex-1 bg-transparent text-white/70 text-sm outline-none"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleCopyLink}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-all"
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
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/meetings" className="flex-1">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10 transition-all"
                          >
                            View All Meetings
                          </motion.button>
                        </Link>
                        <Link href={`/meeting/${createMeeting.data.roomId}`} className="flex-1">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium shadow-lg shadow-cyan-500/25 transition-all"
                          >
                            <Video className="w-4 h-4" />
                            Start Meeting Now
                          </motion.button>
                        </Link>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-violet-500/15 to-purple-500/20" />
                <div className="absolute inset-0 bg-[#030014]/80 backdrop-blur-xl" />

                <motion.div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-500/20 blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="relative p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">AI-Powered</h3>
                      <p className="text-xs text-cyan-400">Smart meeting features</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { icon: Mic, text: "Real-time transcription", gradient: "from-cyan-500 to-cyan-600" },
                      { icon: Brain, text: "AI meeting summaries", gradient: "from-violet-500 to-purple-600" },
                      { icon: CheckCircle2, text: "Auto action items", gradient: "from-emerald-500 to-green-600" },
                      { icon: Globe, text: "100+ languages", gradient: "from-amber-500 to-orange-600" },
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <feature.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tips Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Pro Tips
                </h3>
                <div className="space-y-3">
                  {[
                    "Add a clear agenda to help participants prepare",
                    "Enable transcription for searchable meeting records",
                    "Schedule 5 mins early for tech setup",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                      <p className="text-xs text-white/50">{tip}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Feature Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2"
            >
              <FeatureBadge icon={Shield} label="SOC 2" gradient="from-emerald-500 to-green-600" />
              <FeatureBadge icon={Globe} label="GDPR" gradient="from-violet-500 to-purple-600" />
              <FeatureBadge icon={Users} label="500 Max" gradient="from-cyan-500 to-cyan-600" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
