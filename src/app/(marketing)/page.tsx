"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
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
} from "lucide-react";

// ============================================
// ANIMATION VARIANTS
// ============================================
const orchestratedReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 60, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleReveal = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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
// ANIMATED BACKGROUND COMPONENT
// ============================================
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(202,255,75,0.08),transparent)]" />

      {/* Animated orbs */}
      <motion.div
        className="absolute -top-[30%] -left-[10%] w-[60vw] h-[60vw] rounded-full"
        style={{
          background: "conic-gradient(from 180deg, rgba(202,255,75,0.12), rgba(155,93,229,0.08), transparent, rgba(202,255,75,0.06))",
          filter: "blur(100px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(155,93,229,0.1) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(202,255,75,0.06) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
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
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}) {
  return (
    <div className={`
      relative rounded-2xl
      bg-[#0d0d0d]/80 backdrop-blur-xl
      border border-white/[0.06]
      ${hover ? "hover:border-white/[0.12] hover:bg-[#111111]/90 transition-all duration-500" : ""}
      ${glow ? "hover:shadow-[0_0_40px_rgba(202,255,75,0.08)]" : ""}
      ${className}
    `}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ============================================
// MAGNETIC BUTTON COMPONENT
// ============================================
function MagneticButton({ children, className = "", href }: { children: React.ReactNode; className?: string; href?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

// ============================================
// HERO VIDEO SHOWCASE COMPONENT
// ============================================
function HeroVideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);

  // Simulated live transcription text
  const transcriptLines = [
    { speaker: "Sarah", text: "Let's finalize the Q4 roadmap priorities today.", time: "0:12" },
    { speaker: "Mike", text: "I'll handle the API integration by next Friday.", time: "0:24" },
    { speaker: "AI", text: "Action item detected: Mike - API integration - Due: Next Friday", time: "0:25", isAI: true },
    { speaker: "Lisa", text: "We should also discuss the security audit timeline.", time: "0:38" },
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

  // Auto-play the demo after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setIsPlaying(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Glow effect behind the video */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#CAFF4B]/20 via-[#9B5DE5]/20 to-[#CAFF4B]/20 rounded-3xl blur-3xl opacity-50" />

      {/* Browser Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d]/95 backdrop-blur-xl shadow-2xl shadow-black/50">
        {/* Browser Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0a0a0a]/80">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
          </div>
          <div className="flex-1 max-w-md mx-4">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="text-xs text-white/40 truncate">meetverse.ai/meeting/product-sync</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">Live</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#28c840] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#28c840]" />
            </span>
          </div>
        </div>

        {/* Video Content Area */}
        <div className="relative aspect-video bg-gradient-to-br from-[#0a0a0a] to-[#111]">
          {/* Meeting Grid with Real Photos */}
          <div className="absolute inset-0 p-3 sm:p-4 grid grid-cols-4 grid-rows-2 gap-2 sm:gap-3">
            {/* Main Speaker - Sarah (Woman) - Large tile */}
            <div className="col-span-2 row-span-2 relative rounded-xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop&crop=faces"
                alt="Sarah Chen - VP of Engineering"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 40vw"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Speaking border glow */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-[#CAFF4B]"
                animate={isPlaying ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {/* Name tag */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
                  <Mic className="w-3 h-3 text-[#CAFF4B]" />
                  <span className="text-xs sm:text-sm text-white font-medium">Sarah Chen</span>
                  <span className="text-[10px] text-[#CAFF4B] font-medium">Speaking</span>
                </div>
              </div>

              {/* Speaking indicator wave */}
              <motion.div
                className="absolute bottom-3 right-3 flex items-center gap-0.5 px-2 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-[#CAFF4B] rounded-full"
                    animate={isPlaying ? { height: [4, 12 + i * 3, 4] } : { height: 4 }}
                    transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.08 }}
                  />
                ))}
              </motion.div>
            </div>

            {/* Mike - Man */}
            <div className="relative rounded-xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=faces"
                alt="Mike Roberts - Product Director"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">Mike R.</span>
                <div className="p-1 rounded bg-black/50 backdrop-blur-sm">
                  <Mic className="w-2.5 h-2.5 text-white/60" />
                </div>
              </div>
            </div>

            {/* Lisa - Woman */}
            <div className="relative rounded-xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop&crop=faces"
                alt="Lisa Watson - COO"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">Lisa W.</span>
                <div className="p-1 rounded bg-black/50 backdrop-blur-sm">
                  <Mic className="w-2.5 h-2.5 text-white/60" />
                </div>
              </div>
            </div>

            {/* Alex - Man */}
            <div className="relative rounded-xl overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=faces"
                alt="Alex Johnson - Tech Lead"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">Alex J.</span>
                <div className="p-1 rounded bg-red-500/80 backdrop-blur-sm">
                  <MicOff className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>

            {/* You (Current User) - Woman */}
            <div className="relative rounded-xl overflow-hidden group ring-2 ring-[#9B5DE5]/50">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop&crop=faces"
                alt="You"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-2 right-2">
                <span className="text-[9px] text-white bg-[#9B5DE5] px-1.5 py-0.5 rounded font-medium">You</span>
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">Emma T.</span>
                <div className="p-1 rounded bg-black/50 backdrop-blur-sm">
                  <Mic className="w-2.5 h-2.5 text-[#CAFF4B]" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Transcription Panel */}
          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute right-4 top-4 bottom-4 w-72 rounded-xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/[0.08] overflow-hidden"
              >
                {/* Panel Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#CAFF4B]" />
                    <span className="text-sm font-medium text-white">AI Assistant</span>
                  </div>
                  <button
                    onClick={() => setShowTranscript(false)}
                    className="p-1 rounded hover:bg-white/5"
                  >
                    <X className="w-3 h-3 text-white/40" />
                  </button>
                </div>

                {/* Live Transcript */}
                <div className="p-4 space-y-3 h-[calc(100%-52px)] overflow-y-auto">
                  <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Live Transcript</div>
                  {transcriptLines.slice(0, currentLine + 1).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg ${
                        line.isAI
                          ? "bg-[#CAFF4B]/10 border border-[#CAFF4B]/20"
                          : "bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${line.isAI ? "text-[#CAFF4B]" : "text-[#9B5DE5]"}`}>
                          {line.isAI && <Sparkles className="w-3 h-3 inline mr-1" />}
                          {line.speaker}
                        </span>
                        <span className="text-[10px] text-white/30">{line.time}</span>
                      </div>
                      <p className={`text-xs leading-relaxed ${line.isAI ? "text-[#CAFF4B]/80" : "text-white/60"}`}>
                        {line.text}
                      </p>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isPlaying && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1 px-3 py-2"
                    >
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-white/30"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-white/30"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-white/30"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {[
                  { icon: Video, active: true },
                  { icon: MessageSquare, active: true },
                  { icon: Users, active: false },
                ].map((control, i) => (
                  <button
                    key={i}
                    className={`p-2.5 rounded-xl transition-all ${
                      control.active
                        ? "bg-white/10 text-white"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    <control.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    showTranscript
                      ? "bg-[#CAFF4B]/20 text-[#CAFF4B] border border-[#CAFF4B]/30"
                      : "bg-white/10 text-white"
                  }`}
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

          {/* Play/Pause Overlay */}
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
                className="w-20 h-20 rounded-full bg-[#CAFF4B] flex items-center justify-center shadow-2xl shadow-[#CAFF4B]/30"
              >
                <Play className="w-8 h-8 text-black ml-1" fill="black" />
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Feature Pills */}
        <div className="flex items-center justify-center gap-3 px-4 py-4 border-t border-white/[0.06] bg-[#0a0a0a]/80">
          {[
            { icon: Sparkles, label: "AI Summaries" },
            { icon: MessageSquare, label: "Live Transcription" },
            { icon: Zap, label: "Action Items" },
            { icon: Shield, label: "End-to-End Encrypted" },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]"
            >
              <feature.icon className="w-3 h-3 text-[#CAFF4B]" />
              <span className="text-[11px] text-white/50">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// LIVE ACTIVITY TOAST DATA
// ============================================
const liveActivities = [
  { company: "Stripe", action: "started a meeting", time: "just now" },
  { company: "Linear", action: "generated summary", time: "12s ago" },
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
    description: "Real-time Q&A, smart suggestions, and proactive insights during every meeting.",
    gradient: "from-[#CAFF4B] to-[#9EF01A]",
    badge: "Most Popular",
  },
  {
    icon: MessageSquare,
    title: "Live Transcription",
    description: "99% accurate speech-to-text in 100+ languages with speaker identification.",
    gradient: "from-[#9B5DE5] to-[#7B2FD8]",
  },
  {
    icon: Sparkles,
    title: "Instant Summaries",
    description: "AI-generated meeting briefs delivered in seconds, not hours.",
    gradient: "from-[#F472B6] to-[#EC4899]",
    badge: "5+ hrs/week saved",
  },
  {
    icon: Zap,
    title: "Action Detection",
    description: "Automatically capture commitments, deadlines, and owners.",
    gradient: "from-[#34D399] to-[#10B981]",
    badge: "98% Accuracy",
  },
  {
    icon: Video,
    title: "Crystal Clear Video",
    description: "4K quality with adaptive bitrate supporting 200+ participants.",
    gradient: "from-[#60A5FA] to-[#3B82F6]",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption, SSO, and comprehensive audit logs.",
    gradient: "from-[#6B7280] to-[#4B5563]",
    badge: "SOC 2 Certified",
  },
];

// ============================================
// STATS DATA
// ============================================
const stats = [
  { value: "11", suffix: "Billion+", label: "Requests Served" },
  { value: "50K", suffix: "+", label: "Teams Worldwide" },
  { value: "99.9", suffix: "%", label: "Uptime SLA" },
  { value: "4.9", suffix: "/5", label: "User Rating" },
];

// ============================================
// TRUSTED BY LOGOS (Company names as text)
// ============================================
const trustedCompanies = [
  "Stripe", "Linear", "Vercel", "Notion", "Figma", "Shopify", "Airbnb", "Slack"
];

// ============================================
// HOW IT WORKS DATA
// ============================================
const howItWorks = [
  {
    step: "01",
    title: "Connect Your Calendar",
    description: "Seamlessly integrate with Google Calendar, Outlook, or any major calendar provider in seconds.",
    icon: Calendar,
  },
  {
    step: "02",
    title: "Join Your Meeting",
    description: "Our AI co-pilot automatically joins your meetings and starts transcribing in real-time.",
    icon: Video,
  },
  {
    step: "03",
    title: "Get AI Insights",
    description: "Receive instant summaries, action items, and searchable transcripts after every meeting.",
    icon: Brain,
  },
];

// ============================================
// TESTIMONIALS DATA
// ============================================
const testimonials = [
  {
    quote: "MeetVerse AI has completely transformed how our team collaborates. The AI summaries save us hours every week.",
    author: "Sarah Chen",
    role: "VP of Engineering",
    company: "Google",
    avatar: "SC",
  },
  {
    quote: "The transcription accuracy is unmatched. We evaluated 12 solutions and MeetVerse was the clear winner.",
    author: "Michael Roberts",
    role: "Product Director",
    company: "Stripe",
    avatar: "MR",
  },
  {
    quote: "After switching to MeetVerse, our meeting follow-through improved by 80%. Nothing falls through the cracks.",
    author: "Emily Watson",
    role: "COO",
    company: "Shopify",
    avatar: "EW",
  },
];

// ============================================
// PRICING DATA
// ============================================
const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for individuals and small teams getting started.",
    features: [
      "5 meetings per month",
      "Basic transcription",
      "Meeting summaries",
      "Email support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing teams that need more power and flexibility.",
    features: [
      "Unlimited meetings",
      "Advanced AI features",
      "Action item detection",
      "Calendar integrations",
      "Priority support",
      "Custom vocabulary",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with advanced security needs.",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Advanced analytics",
      "Dedicated success manager",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

// ============================================
// MAIN LANDING PAGE COMPONENT
// ============================================
export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Live activity rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % liveActivities.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <AnimatedBackground />

      {/* Mouse-following spotlight */}
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
                <div className="w-2.5 h-2.5 rounded-full bg-[#CAFF4B]" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#CAFF4B] animate-ping" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-white">{liveActivities[activityIndex].company}</span>
                <span className="text-white/50"> {liveActivities[activityIndex].action}</span>
              </div>
              <span className="text-xs text-white/30">{liveActivities[activityIndex].time}</span>
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
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-6 py-4">
          <GlassCard className="px-6 py-4" hover={false}>
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#CAFF4B] to-[#9B5DE5] rounded-xl blur-lg opacity-40 group-hover:opacity-60"
                    transition={{ duration: 0.3 }}
                  />
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A] shadow-lg shadow-[#CAFF4B]/20">
                    <Video className="h-5 w-5 text-black" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight">
                    MeetVerse<span className="text-[#CAFF4B]">AI</span>
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {[
                  { label: "Features", href: "#features" },
                  { label: "How it Works", href: "#how-it-works" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Testimonials", href: "#testimonials" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#CAFF4B]/10 border border-[#CAFF4B]/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CAFF4B] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CAFF4B]" />
                  </span>
                  <span className="text-xs text-[#CAFF4B] font-medium">12,847 active now</span>
                </div>
                <Link href="/sign-in" className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">
                  Sign in
                </Link>
                <MagneticButton href="/sign-up">
                  <Button className="bg-[#CAFF4B] hover:bg-[#d8ff7a] text-black font-medium rounded-lg px-5 shadow-lg shadow-[#CAFF4B]/20 transition-all hover:-translate-y-0.5">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </MagneticButton>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </GlassCard>

          {/* Mobile Menu */}
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
                    {["Features", "How it Works", "Pricing", "Testimonials"].map((item) => (
                      <Link
                        key={item}
                        href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-base text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                      >
                        {item}
                      </Link>
                    ))}
                    <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                      <Link
                        href="/sign-in"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-center text-white/60 hover:text-white rounded-lg"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/sign-up"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 text-center bg-[#CAFF4B] text-black font-medium rounded-lg"
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
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-32 pb-20">
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CAFF4B]/10 border border-[#CAFF4B]/20">
                <Sparkles className="w-4 h-4 text-[#CAFF4B]" />
                <span className="text-sm text-[#CAFF4B] font-medium">Powered by AI</span>
                <ChevronRight className="w-4 h-4 text-[#CAFF4B]" />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={slideUp}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-8"
            >
              <span className="text-white">Most Reliable</span>
              <br />
              <span className="bg-gradient-to-r from-[#CAFF4B] via-[#9EF01A] to-[#CAFF4B] bg-clip-text text-transparent">
                AI Meeting Platform
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={slideUp}
              className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              The intelligent way to capture, analyze, and act on every meeting.
              Real-time transcription, AI summaries, and automatic action items for teams that move fast.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={slideUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <MagneticButton href="/sign-up">
                <Button className="h-14 px-8 bg-[#CAFF4B] hover:bg-[#d8ff7a] text-black font-semibold text-lg rounded-xl shadow-lg shadow-[#CAFF4B]/25 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#CAFF4B]/30">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </MagneticButton>
              <Button
                variant="outline"
                className="h-14 px-8 bg-transparent text-white border-white/20 hover:bg-white/5 hover:border-white/30 font-medium text-lg rounded-xl"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={slideUp} className="flex flex-wrap items-center justify-center gap-6">
              {[
                { icon: Shield, label: "SOC 2 Certified" },
                { icon: Zap, label: "99.9% Uptime" },
                { icon: Users, label: "50K+ Teams" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/40">
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Video Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
              className="w-1.5 h-1.5 rounded-full bg-[#CAFF4B]"
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
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
                  <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                  <span className="text-[#CAFF4B]">{stat.suffix}</span>
                </div>
                <div className="text-sm text-white/40 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TRUSTED BY SECTION */}
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
            <p className="text-sm text-white/40 uppercase tracking-wider mb-8">Trusted by leading companies</p>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
              {trustedCompanies.map((company, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
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
      {/* FEATURES SECTION */}
      {/* ============================================ */}
      <section id="features" className="py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={orchestratedReveal}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="text-sm text-[#CAFF4B] uppercase tracking-wider font-medium">Features</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold mb-6">
              Everything you need for
              <br />
              <span className="text-[#CAFF4B]">smarter meetings</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-white/50 max-w-2xl mx-auto">
              Our AI-powered platform transforms how your team meets, collaborates, and takes action.
            </motion.p>
          </motion.div>

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
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  {feature.badge && (
                    <span className="inline-block px-3 py-1 text-xs font-medium text-[#CAFF4B] bg-[#CAFF4B]/10 rounded-full mb-4">
                      {feature.badge}
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/50 leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS SECTION */}
      {/* ============================================ */}
      <section id="how-it-works" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#CAFF4B]/[0.02] to-transparent" />
        <div className="mx-auto max-w-7xl px-6 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={orchestratedReveal}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="text-sm text-[#9B5DE5] uppercase tracking-wider font-medium">How It Works</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold mb-6">
              Get started in
              <span className="text-[#9B5DE5]"> minutes</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-white/50 max-w-2xl mx-auto">
              Three simple steps to transform your meetings with AI.
            </motion.p>
          </motion.div>

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
                  <div className="text-6xl font-bold text-white/5 mb-4">{step.step}</div>
                  <div className="w-16 h-16 rounded-2xl bg-[#9B5DE5]/20 flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-8 h-8 text-[#9B5DE5]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-white/50">{step.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS SECTION */}
      {/* ============================================ */}
      <section id="testimonials" className="py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={orchestratedReveal}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="text-sm text-[#CAFF4B] uppercase tracking-wider font-medium">Testimonials</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold mb-6">
              Loved by teams
              <span className="text-[#CAFF4B]"> worldwide</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={orchestratedReveal}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <GlassCard className="p-8 h-full">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-[#CAFF4B] text-[#CAFF4B]" />
                    ))}
                  </div>
                  <blockquote className="text-white/80 text-lg leading-relaxed mb-8">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#CAFF4B] to-[#9B5DE5] flex items-center justify-center font-semibold text-black">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.author}</div>
                      <div className="text-sm text-white/50">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRICING SECTION */}
      {/* ============================================ */}
      <section id="pricing" className="py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={orchestratedReveal}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="text-sm text-[#CAFF4B] uppercase tracking-wider font-medium">Pricing</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-bold mb-6">
              Simple, transparent
              <span className="text-[#CAFF4B]"> pricing</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-white/50 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </motion.p>
          </motion.div>

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
                  className={`p-8 h-full relative ${plan.popular ? "border-[#CAFF4B]/50 shadow-[0_0_40px_rgba(202,255,75,0.1)]" : ""}`}
                  hover={!plan.popular}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 text-xs font-semibold text-black bg-[#CAFF4B] rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.period && <span className="text-white/50">{plan.period}</span>}
                    </div>
                    <p className="text-sm text-white/50">{plan.description}</p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-white/70">
                        <CheckCircle2 className="w-5 h-5 text-[#CAFF4B] flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full h-12 font-medium rounded-xl ${
                      plan.popular
                        ? "bg-[#CAFF4B] hover:bg-[#d8ff7a] text-black shadow-lg shadow-[#CAFF4B]/20"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA SECTION */}
      {/* ============================================ */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={orchestratedReveal}
          >
            <GlassCard className="p-12 lg:p-20 text-center relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#CAFF4B]/10 via-transparent to-[#9B5DE5]/10" />

              <motion.div variants={fadeInUp} className="relative">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                  Ready to transform your
                  <br />
                  <span className="text-[#CAFF4B]">meetings?</span>
                </h2>
                <p className="text-lg text-white/50 max-w-xl mx-auto mb-10">
                  Join thousands of teams already using MeetVerse AI to capture every detail and drive action.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <MagneticButton href="/sign-up">
                    <Button className="h-14 px-10 bg-[#CAFF4B] hover:bg-[#d8ff7a] text-black font-semibold text-lg rounded-xl shadow-lg shadow-[#CAFF4B]/25 transition-all hover:-translate-y-1">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </MagneticButton>
                  <Button
                    variant="outline"
                    className="h-14 px-10 bg-transparent text-white border-white/20 hover:bg-white/5 font-medium text-lg rounded-xl"
                  >
                    Contact Sales
                  </Button>
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
            {/* Logo & Description */}
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A]">
                  <Video className="h-5 w-5 text-black" />
                </div>
                <span className="text-lg font-bold">
                  MeetVerse<span className="text-[#CAFF4B]">AI</span>
                </span>
              </Link>
              <p className="text-white/40 text-sm max-w-xs mb-6">
                The intelligent way to capture, analyze, and act on every meeting.
              </p>
              <div className="flex items-center gap-4">
                {["Twitter", "LinkedIn", "GitHub"].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-white/30 hover:text-white/60 transition-colors text-sm"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: "Product", links: ["Features", "Pricing", "Integrations", "Changelog"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "GDPR"] },
            ].map((column, i) => (
              <div key={i}>
                <h4 className="font-semibold text-white mb-4">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-white/40 hover:text-white/70 transition-colors text-sm">
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
              &copy; {new Date().getFullYear()} MeetVerse AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["SOC 2", "GDPR", "HIPAA"].map((badge, i) => (
                <span key={i} className="text-white/20 text-xs font-medium">{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
