"use client";

import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Video,
  MessageSquare,
  Brain,
  Sparkles,
  Users,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Play,
  Star,
  Menu,
  X,
  Calendar,
  ChevronRight,
  Mic,
  MicOff,
  Globe,
  BarChart3,
  Lock,
  Headphones,
  Quote,
  TrendingUp,
  Target,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// ANIMATION VARIANTS
// ============================================
const orchestratedReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 60, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleReveal = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// ANIMATED BACKGROUND
// ============================================
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-ink" />

      {/* Primary lime orb */}
      <motion.div
        className="absolute -top-[30%] -left-[10%] w-[60vw] h-[60vw] rounded-full"
        style={{
          background:
            "conic-gradient(from 180deg, rgba(202,255,75,0.12), rgba(155,93,229,0.08), transparent, rgba(202,255,75,0.06))",
          filter: "blur(100px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />

      {/* Purple depth orb */}
      <motion.div
        className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(155,93,229,0.1) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom lime glow */}
      <motion.div
        className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(202,255,75,0.06) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(202,255,75,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(202,255,75,0.15) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
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
  hover = true,
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl bg-carbon/80 backdrop-blur-xl border border-white/[0.06]",
        hover && "hover:border-lime/20 transition-all duration-500",
        glow && "hover:shadow-glow-lime",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ============================================
// MAGNETIC BUTTON
// ============================================
function MagneticButton({
  children,
  className = "",
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.15);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.15);
  };

  const content = (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

// ============================================
// HERO VIDEO SHOWCASE
// ============================================
function HeroVideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);

  const transcriptLines = [
    {
      speaker: "Sarah",
      text: "Let's finalize the Q4 roadmap priorities today.",
      time: "0:12",
    },
    {
      speaker: "Mike",
      text: "I'll handle the API integration by next Friday.",
      time: "0:24",
    },
    {
      speaker: "AI",
      text: "Action item detected: Mike - API integration - Due: Next Friday",
      time: "0:25",
      isAI: true,
    },
    {
      speaker: "Lisa",
      text: "We should also discuss the security audit timeline.",
      time: "0:38",
    },
  ];

  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentLine((prev) => (prev + 1) % transcriptLines.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, transcriptLines.length]);

  useEffect(() => {
    const timer = setTimeout(() => setIsPlaying(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Glow behind */}
      <div className="absolute -inset-4 bg-gradient-to-r from-lime/20 via-purple/20 to-lime/20 rounded-3xl blur-3xl opacity-50" />

      {/* Browser Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-obsidian/95 backdrop-blur-xl shadow-2xl shadow-black/50">
        {/* Browser Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-ink/80">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 max-w-md mx-4">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="text-xs text-white/40 truncate">
                meetverse.ai/meeting/product-sync
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">Live</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
            </span>
          </div>
        </div>

        {/* Video Grid */}
        <div className="relative aspect-video bg-gradient-to-br from-ink to-carbon">
          <div className="absolute inset-0 p-3 sm:p-4 grid grid-cols-4 grid-rows-2 gap-2 sm:gap-3">
            {/* Sarah - Main Speaker */}
            <div className="col-span-2 row-span-2 relative rounded-xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop&crop=faces"
                alt="Sarah Chen speaking in meeting"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-lime"
                animate={
                  isPlaying ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 }
                }
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
                  <Mic className="w-3 h-3 text-lime" />
                  <span className="text-xs sm:text-sm text-white font-medium">
                    Sarah Chen
                  </span>
                  <span className="text-[10px] text-lime font-medium">
                    Speaking
                  </span>
                </div>
              </div>
              <motion.div className="absolute bottom-3 right-3 flex items-center gap-0.5 px-2 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-lime rounded-full"
                    animate={
                      isPlaying
                        ? { height: [4, 12 + i * 3, 4] }
                        : { height: 4 }
                    }
                    transition={{
                      duration: 0.4,
                      repeat: Infinity,
                      delay: i * 0.08,
                    }}
                  />
                ))}
              </motion.div>
            </div>

            {/* Mike */}
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=faces"
                alt="Mike Roberts in meeting"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                  Mike R.
                </span>
                <div className="p-1 rounded bg-black/50 backdrop-blur-sm">
                  <Mic className="w-2.5 h-2.5 text-white/60" />
                </div>
              </div>
            </div>

            {/* Lisa */}
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop&crop=faces"
                alt="Lisa Watson in meeting"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                  Lisa W.
                </span>
                <div className="p-1 rounded bg-black/50 backdrop-blur-sm">
                  <Mic className="w-2.5 h-2.5 text-white/60" />
                </div>
              </div>
            </div>

            {/* Alex */}
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=faces"
                alt="Alex Johnson in meeting"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                  Alex J.
                </span>
                <div className="p-1 rounded bg-red-500/80 backdrop-blur-sm">
                  <MicOff className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>

            {/* You */}
            <div className="relative rounded-xl overflow-hidden ring-2 ring-purple/50">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop&crop=faces"
                alt="You in meeting"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-2 right-2">
                <span className="text-[9px] text-white bg-purple px-1.5 py-0.5 rounded font-medium">
                  You
                </span>
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                  Emma T.
                </span>
                <div className="p-1 rounded bg-black/50 backdrop-blur-sm">
                  <Mic className="w-2.5 h-2.5 text-lime" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Transcript Panel */}
          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute right-4 top-4 bottom-4 w-72 rounded-xl bg-ink/90 backdrop-blur-xl border border-white/[0.08] overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-lime" />
                    <span className="text-sm font-medium text-white">
                      AI Assistant
                    </span>
                  </div>
                  <button
                    onClick={() => setShowTranscript(false)}
                    className="p-1 rounded hover:bg-white/5"
                  >
                    <X className="w-3 h-3 text-white/40" />
                  </button>
                </div>
                <div className="p-4 space-y-3 h-[calc(100%-52px)] overflow-y-auto">
                  <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">
                    Live Transcript
                  </div>
                  {transcriptLines.slice(0, currentLine + 1).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-3 rounded-lg",
                        line.isAI
                          ? "bg-lime/10 border border-lime/20"
                          : "bg-white/[0.03]"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "text-xs font-medium",
                            line.isAI ? "text-lime" : "text-purple"
                          )}
                        >
                          {line.isAI && (
                            <Sparkles className="w-3 h-3 inline mr-1" />
                          )}
                          {line.speaker}
                        </span>
                        <span className="text-[10px] text-white/30">
                          {line.time}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-xs leading-relaxed",
                          line.isAI ? "text-lime/80" : "text-white/60"
                        )}
                      >
                        {line.text}
                      </p>
                    </motion.div>
                  ))}
                  {isPlaying && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1 px-3 py-2"
                    >
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-white/30"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {[
                  { icon: Video, active: true },
                  { icon: MessageSquare, active: true },
                  { icon: Users, active: false },
                ].map((ctrl, i) => (
                  <button
                    key={i}
                    className={cn(
                      "p-2.5 rounded-xl transition-all",
                      ctrl.active
                        ? "bg-white/10 text-white"
                        : "bg-red-500/20 text-red-400"
                    )}
                  >
                    <ctrl.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
                    showTranscript
                      ? "bg-lime/20 text-lime border border-lime/30"
                      : "bg-white/10 text-white"
                  )}
                >
                  <Brain className="w-4 h-4" />
                  <span className="text-xs font-medium">AI Co-Pilot</span>
                </button>
                <button className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors">
                  End Meeting
                </button>
              </div>
            </div>
          </div>

          {/* Play Overlay */}
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full bg-lime flex items-center justify-center shadow-2xl shadow-lime/30"
              >
                <Play className="w-8 h-8 text-ink ml-1" fill="black" />
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Feature Pills */}
        <div className="flex items-center justify-center gap-3 px-4 py-4 border-t border-white/[0.06] bg-ink/80">
          {[
            { icon: Sparkles, label: "AI Summaries" },
            { icon: MessageSquare, label: "Live Transcription" },
            { icon: Zap, label: "Action Items" },
            { icon: Shield, label: "End-to-End Encrypted" },
          ].map((feat, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]"
            >
              <feat.icon className="w-3 h-3 text-lime" />
              <span className="text-[11px] text-white/50">{feat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// SECTION HEADER COMPONENT
// ============================================
function SectionHeader({
  label,
  labelColor = "text-lime",
  title,
  highlight,
  highlightColor = "text-lime",
  description,
}: {
  label: string;
  labelColor?: string;
  title: string;
  highlight: string;
  highlightColor?: string;
  description: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={orchestratedReveal}
      className="text-center mb-20"
    >
      <motion.div variants={fadeInUp} className="mb-4">
        <span
          className={cn(
            "text-sm uppercase tracking-wider font-medium",
            labelColor
          )}
        >
          {label}
        </span>
      </motion.div>
      <motion.h2
        variants={fadeInUp}
        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
      >
        {title}
        <br />
        <span className={highlightColor}>{highlight}</span>
      </motion.h2>
      <motion.p
        variants={fadeInUp}
        className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed"
      >
        {description}
      </motion.p>
    </motion.div>
  );
}

// ============================================
// LIVE ACTIVITY DATA
// ============================================
const liveActivities = [
  { company: "Stripe", action: "started a meeting", time: "just now" },
  { company: "Linear", action: "generated AI summary", time: "12s ago" },
  { company: "Vercel", action: "detected 8 action items", time: "34s ago" },
  { company: "Notion", action: "joined enterprise plan", time: "1m ago" },
  { company: "Figma", action: "completed onboarding", time: "2m ago" },
];

// ============================================
// FEATURE DATA
// ============================================
const features = [
  {
    icon: Brain,
    title: "AI Meeting Co-Pilot",
    description:
      "Real-time Q&A, smart suggestions, and proactive insights powered by advanced language models. Your meetings just got an IQ boost.",
    gradient: "from-lime to-lime-500",
    badge: "Most Popular",
    color: "text-lime",
    bg: "bg-lime/10",
  },
  {
    icon: MessageSquare,
    title: "99% Accurate Transcription",
    description:
      "Real-time speech-to-text in 100+ languages with speaker diarization. Every word, attributed to the right person.",
    gradient: "from-purple to-purple-700",
    color: "text-purple",
    bg: "bg-purple/10",
  },
  {
    icon: Sparkles,
    title: "Instant AI Summaries",
    description:
      "Meeting briefs generated in seconds, not hours. Key decisions, topics discussed, and next steps — all organized automatically.",
    gradient: "from-pink-500 to-rose-500",
    badge: "5+ hrs/week saved",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: Zap,
    title: "Smart Action Detection",
    description:
      "AI automatically captures commitments, deadlines, and task owners. Nothing falls through the cracks ever again.",
    gradient: "from-emerald-400 to-emerald-600",
    badge: "98% Accuracy",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Video,
    title: "Crystal Clear 4K Video",
    description:
      "Adaptive bitrate streaming supporting 200+ concurrent participants with ultra-low latency and pristine quality.",
    gradient: "from-cyan-400 to-blue-500",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description:
      "End-to-end encryption, SSO/SAML, SOC 2 Type II certified, comprehensive audit logs, and HIPAA compliance.",
    gradient: "from-slate-400 to-slate-600",
    badge: "SOC 2 Certified",
    color: "text-slate-300",
    bg: "bg-slate-500/10",
  },
];

// ============================================
// STATS DATA
// ============================================
const stats = [
  {
    value: "11B",
    suffix: "+",
    label: "Requests Served",
    icon: BarChart3,
    color: "text-lime",
  },
  {
    value: "50K",
    suffix: "+",
    label: "Teams Worldwide",
    icon: Users,
    color: "text-purple",
  },
  {
    value: "99.9",
    suffix: "%",
    label: "Uptime SLA",
    icon: Zap,
    color: "text-emerald-400",
  },
  {
    value: "4.9",
    suffix: "/5",
    label: "User Rating",
    icon: Star,
    color: "text-amber-400",
  },
];

// ============================================
// TRUSTED COMPANIES
// ============================================
const trustedCompanies = [
  "Stripe",
  "Linear",
  "Vercel",
  "Notion",
  "Figma",
  "Shopify",
  "Airbnb",
  "Slack",
];

// ============================================
// HOW IT WORKS
// ============================================
const howItWorks = [
  {
    step: "01",
    title: "Connect Your Calendar",
    description:
      "Seamlessly integrate with Google Calendar, Outlook, or any major provider. MeetVerse AI auto-detects your scheduled meetings.",
    icon: Calendar,
    color: "text-lime",
    bg: "bg-lime/10",
  },
  {
    step: "02",
    title: "Join Your Meeting",
    description:
      "Our AI co-pilot automatically joins, starts transcribing in real-time, and identifies speakers with 99% accuracy.",
    icon: Video,
    color: "text-purple",
    bg: "bg-purple/10",
  },
  {
    step: "03",
    title: "Get AI Insights",
    description:
      "Receive instant summaries, auto-generated action items, and searchable transcripts — delivered to your inbox and integrations.",
    icon: Brain,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

// ============================================
// TESTIMONIALS
// ============================================
const testimonials = [
  {
    quote:
      "MeetVerse AI has completely transformed how our engineering team collaborates. The AI summaries save us 6+ hours every single week.",
    author: "Sarah Chen",
    role: "VP of Engineering",
    company: "Google",
    avatar: "SC",
    rating: 5,
  },
  {
    quote:
      "We evaluated 12 solutions and MeetVerse was the clear winner. The transcription accuracy is unmatched, and the action item detection is game-changing.",
    author: "Michael Roberts",
    role: "Product Director",
    company: "Stripe",
    avatar: "MR",
    rating: 5,
  },
  {
    quote:
      "After switching to MeetVerse, our meeting follow-through improved by 80%. Nothing falls through the cracks anymore. It's like having a perfect assistant.",
    author: "Emily Watson",
    role: "COO",
    company: "Shopify",
    avatar: "EW",
    rating: 5,
  },
];

// ============================================
// PRICING DATA
// ============================================
const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description:
      "Perfect for individuals and small teams getting started with AI meetings.",
    features: [
      "5 meetings per month",
      "Basic AI transcription",
      "Meeting summaries",
      "Email support",
      "1 integration",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description:
      "For growing teams that need unlimited power, integrations, and AI features.",
    features: [
      "Unlimited meetings",
      "Advanced AI co-pilot",
      "Action item detection",
      "Calendar integrations",
      "Priority support",
      "Custom AI vocabulary",
      "100+ language support",
    ],
    cta: "Start 14-Day Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description:
      "For large organizations with advanced security, compliance, and admin needs.",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Advanced analytics",
      "Dedicated success manager",
      "Custom integrations",
      "SLA guarantee",
      "HIPAA compliance",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

// ============================================
// USE CASES
// ============================================
const useCases = [
  {
    icon: Target,
    title: "Product Teams",
    description: "Capture every user insight and decision from sprint reviews, standups, and discovery calls.",
    metric: "3x faster decision-making",
  },
  {
    icon: TrendingUp,
    title: "Sales Teams",
    description: "Auto-log call notes to CRM, track objections, and surface winning patterns across deals.",
    metric: "40% more deals closed",
  },
  {
    icon: Users,
    title: "Customer Success",
    description: "Never miss a customer request. AI auto-creates tickets and tracks sentiment in real-time.",
    metric: "60% faster response time",
  },
  {
    icon: Layers,
    title: "Engineering Teams",
    description: "Technical discussions captured with code-aware context, architecture decisions logged automatically.",
    metric: "5+ hrs/week saved",
  },
];

// ============================================
// INTEGRATION LOGOS
// ============================================
const integrations = [
  { name: "Slack", icon: MessageSquare },
  { name: "Google Calendar", icon: Calendar },
  { name: "Jira", icon: Target },
  { name: "Notion", icon: Layers },
  { name: "Salesforce", icon: TrendingUp },
  { name: "HubSpot", icon: BarChart3 },
  { name: "Zoom", icon: Video },
  { name: "Teams", icon: Users },
];

// ============================================
// MAIN LANDING PAGE
// ============================================
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % liveActivities.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-ink text-white overflow-hidden">
      <AnimatedBackground />

      {/* Mouse spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(202,255,75,0.04), transparent 50%)`,
        }}
      />

      {/* ============================================ */}
      {/* LIVE ACTIVITY TOAST */}
      {/* ============================================ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activityIndex}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-8 left-8 z-50 hidden lg:block"
        >
          <GlassCard className="px-5 py-4" hover={false}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-lime" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-lime animate-ping" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-white">
                  {liveActivities[activityIndex].company}
                </span>
                <span className="text-white/50">
                  {" "}
                  {liveActivities[activityIndex].action}
                </span>
              </div>
              <span className="text-xs text-white/30">
                {liveActivities[activityIndex].time}
              </span>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* ============================================ */}
      {/* NAVIGATION */}
      {/* ============================================ */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.1,
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-6 py-4">
          <GlassCard className="px-6 py-4" hover={false}>
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-lime to-purple rounded-xl blur-lg opacity-40 group-hover:opacity-60"
                    transition={{ duration: 0.3 }}
                  />
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime to-lime-500 shadow-lg shadow-lime/20">
                    <Video className="h-5 w-5 text-ink" />
                  </div>
                </div>
                <span className="text-lg font-bold tracking-tight">
                  MeetVerse<span className="text-lime">AI</span>
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1">
                {[
                  { label: "Features", href: "#features" },
                  { label: "Use Cases", href: "#use-cases" },
                  { label: "How it Works", href: "#how-it-works" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Testimonials", href: "#testimonials" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime/10 border border-lime/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
                  </span>
                  <span className="text-xs text-lime font-medium">
                    12,847 active now
                  </span>
                </div>
                <Link
                  href="/sign-in"
                  className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2"
                >
                  Sign in
                </Link>
                <MagneticButton href="/sign-up">
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 0 30px rgba(202,255,75,0.3)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-lime text-ink font-semibold rounded-xl shadow-lg shadow-lime/20 text-sm"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </MagneticButton>
              </div>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </GlassCard>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-3 overflow-hidden"
              >
                <GlassCard className="p-4" hover={false}>
                  <nav className="space-y-1">
                    {[
                      "Features",
                      "Use Cases",
                      "How it Works",
                      "Pricing",
                      "Testimonials",
                    ].map((item) => (
                      <Link
                        key={item}
                        href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-base text-white/60 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all"
                      >
                        {item}
                      </Link>
                    ))}
                    <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                      <Link
                        href="/sign-in"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-center text-white/60"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/sign-up"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-center bg-lime text-ink font-semibold rounded-xl"
                      >
                        Get Started
                      </Link>
                    </div>
                  </nav>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-32 pb-20"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="mx-auto max-w-7xl px-6 w-full"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={orchestratedReveal}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={slideUp} className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime/10 border border-lime/20">
                <Sparkles className="w-4 h-4 text-lime" />
                <span className="text-sm text-lime font-medium">
                  #1 AI Meeting Platform — Trusted by 50K+ Teams
                </span>
                <ChevronRight className="w-4 h-4 text-lime" />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={slideUp}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-8"
            >
              <span className="text-white">Your Meetings</span>
              <br />
              <span className="bg-gradient-to-r from-lime via-lime-300 to-lime bg-clip-text text-transparent">
                Powered by AI
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={slideUp}
              className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Real-time transcription, AI-generated summaries, and automatic
              action items — so your team can focus on what matters, not meeting
              notes.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={slideUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <MagneticButton href="/sign-up">
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 40px rgba(202,255,75,0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="h-14 px-8 bg-lime text-ink font-semibold text-lg rounded-xl shadow-lg shadow-lime/25 flex items-center gap-2"
                >
                  Start Free — No Credit Card
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </MagneticButton>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-14 px-8 bg-transparent text-white border border-white/20 hover:bg-white/5 hover:border-white/30 font-medium text-lg rounded-xl flex items-center gap-2 transition-colors"
              >
                <Play className="h-5 w-5" />
                Watch 2-Min Demo
              </motion.button>
            </motion.div>

            {/* Trust Row */}
            <motion.div
              variants={slideUp}
              className="flex flex-wrap items-center justify-center gap-6"
            >
              {[
                { icon: Shield, label: "SOC 2 Certified" },
                { icon: Lock, label: "E2E Encrypted" },
                { icon: Zap, label: "99.9% Uptime" },
                { icon: Globe, label: "100+ Languages" },
                { icon: Users, label: "50,000+ Teams" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-white/40"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-20 max-w-6xl mx-auto"
          >
            <HeroVideoShowcase />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-lime"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* STATS SECTION */}
      {/* ============================================ */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={orchestratedReveal}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <GlassCard className="p-6 text-center" glow>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4",
                      stat.color === "text-lime"
                        ? "bg-lime/10"
                        : stat.color === "text-purple"
                          ? "bg-purple/10"
                          : stat.color === "text-emerald-400"
                            ? "bg-emerald-500/10"
                            : "bg-amber-500/10"
                    )}
                  >
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold mb-2">
                    <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                    <span className="text-lime">{stat.suffix}</span>
                  </div>
                  <div className="text-sm text-white/40 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TRUSTED BY */}
      {/* ============================================ */}
      <section className="py-16 border-y border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-sm text-white/40 uppercase tracking-wider mb-8">
              Trusted by 50,000+ teams at the world&apos;s best companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
              {trustedCompanies.map((company, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.1, color: "rgba(202,255,75,0.6)" }}
                  className="text-xl font-semibold text-white/20 hover:text-white/40 transition-colors cursor-default"
                >
                  {company}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FEATURES */}
      {/* ============================================ */}
      <section id="features" className="py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            label="Features"
            title="Everything you need for"
            highlight="smarter, faster meetings"
            description="Our AI-powered platform transforms how your team meets, collaborates, and drives action — from the first hello to the final follow-up."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={orchestratedReveal}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={scaleReveal}>
                <GlassCard className="p-8 h-full group" glow>
                  {/* Subtle top gradient */}
                  <div
                    className={cn(
                      "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                      feature.gradient
                    )}
                  />

                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500",
                      feature.gradient
                    )}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  {feature.badge && (
                    <span className="inline-block px-3 py-1 text-xs font-medium text-lime bg-lime/10 border border-lime/20 rounded-full mb-4">
                      {feature.badge}
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/50 leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* USE CASES */}
      {/* ============================================ */}
      <section id="use-cases" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple/[0.02] to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 relative">
          <SectionHeader
            label="Use Cases"
            labelColor="text-purple"
            title="Built for every team,"
            highlight="designed for results"
            highlightColor="text-purple"
            description="From product sprints to sales calls, MeetVerse AI adapts to your workflow and multiplies your team's output."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={orchestratedReveal}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {useCases.map((useCase, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <GlassCard className="p-8 h-full group" glow>
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-purple/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <useCase.icon className="w-7 h-7 text-purple" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {useCase.title}
                      </h3>
                      <p className="text-white/50 leading-relaxed mb-4">
                        {useCase.description}
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-lime/10 border border-lime/20">
                        <TrendingUp className="w-3.5 h-3.5 text-lime" />
                        <span className="text-xs font-medium text-lime">
                          {useCase.metric}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS */}
      {/* ============================================ */}
      <section id="how-it-works" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lime/[0.02] to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 relative">
          <SectionHeader
            label="How It Works"
            labelColor="text-purple"
            title="Get started in"
            highlight="under 2 minutes"
            highlightColor="text-purple"
            description="Three simple steps to transform your meetings with AI. No complex setup, no learning curve."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={orchestratedReveal}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {howItWorks.map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-white/10" />
                )}
                <GlassCard className="p-8 text-center h-full">
                  <div className="text-7xl font-bold text-white/[0.03] mb-4">
                    {step.step}
                  </div>
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6",
                      step.bg
                    )}
                  >
                    <step.icon className={cn("w-8 h-8", step.color)} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/50 leading-relaxed">
                    {step.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* INTEGRATIONS */}
      {/* ============================================ */}
      <section className="py-24 border-y border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={orchestratedReveal}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="text-sm text-lime uppercase tracking-wider font-medium">
                Integrations
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight"
            >
              Connects with your
              <span className="text-lime"> favorite tools</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-white/50 max-w-xl mx-auto mb-12"
            >
              Seamlessly integrate with 50+ apps your team already uses. Action
              items flow directly into your project management tools.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              {integrations.map((integration, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <GlassCard className="px-6 py-4 flex items-center gap-3">
                    <integration.icon className="w-5 h-5 text-white/50" />
                    <span className="text-sm font-medium text-white/70">
                      {integration.name}
                    </span>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS */}
      {/* ============================================ */}
      <section id="testimonials" className="py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            label="Testimonials"
            title="Loved by teams"
            highlight="worldwide"
            description="See why 50,000+ teams trust MeetVerse AI to capture every detail and drive action from their meetings."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={orchestratedReveal}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <GlassCard className="p-8 h-full group" glow>
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-lime/20 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-lime text-lime"
                      />
                    ))}
                  </div>
                  <blockquote className="text-white/80 text-lg leading-relaxed mb-8">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lime to-purple flex items-center justify-center font-semibold text-ink text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-white/50">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRICING */}
      {/* ============================================ */}
      <section id="pricing" className="py-32">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            label="Pricing"
            title="Simple, transparent"
            highlight="pricing for every team"
            description="Start free. Upgrade when you're ready. No hidden fees, no surprises."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={orchestratedReveal}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {pricingPlans.map((plan, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <GlassCard
                  className={cn(
                    "p-8 h-full relative",
                    plan.popular &&
                      "border-lime/50 shadow-glow-lime"
                  )}
                  hover={!plan.popular}
                >
                  {plan.popular && (
                    <>
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-lime via-purple to-lime" />
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1.5 text-xs font-semibold text-ink bg-lime rounded-full shadow-lg shadow-lime/30">
                          Most Popular
                        </span>
                      </div>
                    </>
                  )}
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold text-white">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-white/50">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-sm text-white/50">{plan.description}</p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-3 text-white/70"
                      >
                        <CheckCircle2 className="w-5 h-5 text-lime flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      ...(plan.popular && {
                        boxShadow: "0 0 30px rgba(202,255,75,0.25)",
                      }),
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full h-12 font-medium rounded-xl flex items-center justify-center gap-2 transition-colors",
                      plan.popular
                        ? "bg-lime text-ink shadow-lg shadow-lime/20"
                        : "bg-white/[0.05] text-white border border-white/10 hover:bg-white/[0.08]"
                    )}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <Shield className="w-5 h-5 text-lime" />
              <span className="text-sm text-white/60">
                14-day free trial on all paid plans. Cancel anytime. No credit
                card required.
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FINAL CTA */}
      {/* ============================================ */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={orchestratedReveal}
          >
            <GlassCard
              className="p-12 lg:p-20 text-center relative overflow-hidden"
              hover={false}
            >
              {/* Background glows */}
              <div className="absolute inset-0 bg-gradient-to-br from-lime/10 via-transparent to-purple/10 pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-lime/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple/10 rounded-full blur-3xl pointer-events-none" />

              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-lime via-purple to-lime" />

              <motion.div variants={fadeInUp} className="relative">
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime/10 border border-lime/20 text-sm text-lime font-medium">
                    <Sparkles className="w-4 h-4" />
                    Join 50,000+ teams already using MeetVerse AI
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                  Ready to transform
                  <br />
                  <span className="bg-gradient-to-r from-lime to-purple bg-clip-text text-transparent">
                    your meetings?
                  </span>
                </h2>
                <p className="text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
                  Stop losing insights, action items, and hours to manual note-taking.
                  Start capturing every detail automatically.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <MagneticButton href="/sign-up">
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 0 40px rgba(202,255,75,0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="h-14 px-10 bg-lime text-ink font-semibold text-lg rounded-xl shadow-lg shadow-lime/25 flex items-center gap-2"
                    >
                      Get Started Free
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  </MagneticButton>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-14 px-10 bg-transparent text-white border border-white/20 hover:bg-white/5 font-medium text-lg rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <Headphones className="h-5 w-5" />
                    Talk to Sales
                  </motion.button>
                </div>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="py-16 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime to-lime-500">
                  <Video className="h-5 w-5 text-ink" />
                </div>
                <span className="text-lg font-bold">
                  MeetVerse<span className="text-lime">AI</span>
                </span>
              </Link>
              <p className="text-white/40 text-sm max-w-xs mb-6 leading-relaxed">
                The intelligent way to capture, analyze, and act on every
                meeting. Trusted by 50,000+ teams worldwide.
              </p>
              <div className="flex items-center gap-4">
                {["Twitter", "LinkedIn", "GitHub", "YouTube"].map(
                  (social, i) => (
                    <a
                      key={i}
                      href="#"
                      className="text-white/30 hover:text-lime/60 transition-colors text-sm"
                    >
                      {social}
                    </a>
                  )
                )}
              </div>
            </div>

            {[
              {
                title: "Product",
                links: [
                  "Features",
                  "Pricing",
                  "Integrations",
                  "Changelog",
                  "API Docs",
                ],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press", "Partners"],
              },
              {
                title: "Legal",
                links: [
                  "Privacy Policy",
                  "Terms of Service",
                  "Security",
                  "GDPR",
                  "Cookie Policy",
                ],
              },
            ].map((column, i) => (
              <div key={i}>
                <h4 className="font-semibold text-white mb-4">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="text-white/40 hover:text-white/70 transition-colors text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">
              &copy; {new Date().getFullYear()} MeetVerse AI. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6">
              {["SOC 2 Type II", "GDPR", "HIPAA", "ISO 27001"].map(
                (badge, i) => (
                  <span
                    key={i}
                    className="text-white/20 text-xs font-medium hover:text-white/40 transition-colors"
                  >
                    {badge}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
