"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Video,
  Mic,
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
  Target,
  TrendingUp,
  Clock,
  Globe,
  Award,
  BadgeCheck,
  Rocket,
  Menu,
  X,
  Wand2,
  FileText,
  BarChart3,
  Headphones,
  Calendar,
  Layers,
  Command,
  CirclePlay,
} from "lucide-react";

// ============================================
// ANIMATION VARIANTS
// ============================================
const orchestratedReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 80, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleReveal = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// FLOATING ORBS COMPONENT
// ============================================
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary aurora gradient */}
      <motion.div
        className="absolute -top-[40%] -left-[20%] w-[80vw] h-[80vw] rounded-full"
        style={{
          background: "conic-gradient(from 180deg, rgba(6,182,212,0.15), rgba(168,85,247,0.1), rgba(6,182,212,0.05), rgba(236,72,153,0.08), rgba(6,182,212,0.15))",
          filter: "blur(100px)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Secondary orb */}
      <motion.div
        className="absolute top-[20%] right-[-15%] w-[60vw] h-[60vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(6,182,212,0.06) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Accent orb */}
      <motion.div
        className="absolute bottom-[-20%] left-[30%] w-[50vw] h-[50vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, rgba(6,182,212,0.04) 50%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
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
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
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
// ANIMATED GRADIENT TEXT
// ============================================
function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10 bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
        {children}
      </span>
    </span>
  );
}

// ============================================
// GLASS CARD COMPONENT
// ============================================
function GlassCard({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`
      relative rounded-3xl
      bg-gradient-to-br from-white/[0.08] to-white/[0.02]
      backdrop-blur-2xl
      border border-white/[0.08]
      ${hover ? "hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-cyan-500/5" : ""}
      transition-all duration-500
      ${className}
    `}>
      {/* Inner glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// ============================================
// LIVE ACTIVITY DATA
// ============================================
const liveActivities = [
  { name: "Stripe", action: "started a meeting", time: "just now", icon: "🚀" },
  { name: "Linear", action: "generated summary", time: "12s ago", icon: "✨" },
  { name: "Vercel", action: "detected 8 action items", time: "34s ago", icon: "🎯" },
  { name: "Notion", action: "joined enterprise plan", time: "1m ago", icon: "🎉" },
  { name: "Figma", action: "completed onboarding", time: "2m ago", icon: "💫" },
];

// ============================================
// FEATURE DATA
// ============================================
const features = [
  {
    icon: Brain,
    title: "AI Meeting Co-Pilot",
    description: "Real-time Q&A, smart suggestions, and proactive insights during every meeting.",
    gradient: "from-cyan-500 to-blue-600",
    badge: "Most Popular",
    size: "large",
  },
  {
    icon: MessageSquare,
    title: "Live Transcription",
    description: "99% accurate speech-to-text in 100+ languages with speaker identification.",
    gradient: "from-violet-500 to-purple-600",
    badge: "Enterprise",
  },
  {
    icon: Sparkles,
    title: "Instant Summaries",
    description: "AI-generated meeting briefs delivered in seconds, not hours.",
    gradient: "from-amber-500 to-orange-600",
    badge: "5+ hrs/week",
  },
  {
    icon: Zap,
    title: "Action Detection",
    description: "Automatically capture commitments, deadlines, and owners.",
    gradient: "from-emerald-500 to-green-600",
    badge: "98% Accuracy",
  },
  {
    icon: Video,
    title: "Crystal Clear Video",
    description: "4K quality with adaptive bitrate supporting 200+ participants.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption, SSO, and comprehensive audit logs.",
    gradient: "from-slate-500 to-zinc-600",
    badge: "SOC 2",
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

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Live activity rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % liveActivities.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for gradient effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#030014] text-white overflow-hidden selection:bg-cyan-500/30">
      {/* ============================================ */}
      {/* IMMERSIVE BACKGROUND */}
      {/* ============================================ */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />

        {/* Floating orbs */}
        <FloatingOrbs />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
          }}
        />

        {/* Mouse-following spotlight */}
        <div
          className="pointer-events-none fixed inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6,182,212,0.06), transparent 50%)`,
          }}
        />
      </div>

      {/* ============================================ */}
      {/* LIVE ACTIVITY TOAST */}
      {/* ============================================ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activityIndex}
          initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -30, scale: 0.9, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-8 left-8 z-50 hidden lg:block"
        >
          <GlassCard className="px-5 py-4" hover={false}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">{liveActivities[activityIndex].icon}</span>
                <div className="text-sm">
                  <span className="font-semibold text-white">{liveActivities[activityIndex].name}</span>
                  <span className="text-white/60"> {liveActivities[activityIndex].action}</span>
                </div>
              </div>
              <span className="text-xs text-white/40 ml-2">{liveActivities[activityIndex].time}</span>
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
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-6 py-4">
          <nav className="relative">
            <GlassCard className="px-6 py-4" hover={false}>
              <div className="flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl blur-xl opacity-50 group-hover:opacity-80"
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-purple-500 shadow-lg shadow-purple-500/25">
                      <Video className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-semibold tracking-tight">
                      MeetVerse<span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">AI</span>
                    </span>
                    <span className="text-[10px] text-white/40 tracking-[0.15em] uppercase">Intelligent Meetings</span>
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1">
                  {[
                    { label: "Features", href: "#features" },
                    { label: "How it Works", href: "#how-it-works" },
                    { label: "Pricing", href: "#pricing" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="px-4 py-2 text-sm text-white/60 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/5"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">12,847 active now</span>
                  </div>
                  <Link href="/sign-in" className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">
                    Sign in
                  </Link>
                  <MagneticButton href="/sign-up">
                    <Button className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-violet-500 to-purple-500 hover:opacity-90 text-white border-0 shadow-lg shadow-purple-500/25 rounded-xl px-6 group">
                      <span className="relative z-10 flex items-center font-medium">
                        Start Free
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </MagneticButton>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </GlassCard>

            {/* Mobile Menu */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="md:hidden mt-3 overflow-hidden"
                >
                  <GlassCard className="p-4" hover={false}>
                    <nav className="space-y-1">
                      {["Features", "How it Works", "Pricing"].map((item) => (
                        <Link
                          key={item}
                          href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-3 text-base text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          {item}
                        </Link>
                      ))}
                      <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                        <Link
                          href="/sign-in"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-3 text-center text-white/60 hover:text-white rounded-xl transition-colors"
                        >
                          Sign in
                        </Link>
                        <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full bg-gradient-to-r from-cyan-500 via-violet-500 to-purple-500 text-white rounded-xl py-3">
                            Start Free Trial
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </nav>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </div>
      </motion.header>

      <main>
        {/* ============================================ */}
        {/* HERO SECTION */}
        {/* ============================================ */}
        <section
          ref={heroRef}
          className="relative min-h-[100vh] flex items-center pt-32 pb-20 lg:pt-44 lg:pb-32"
          aria-label="AI-Powered Meeting Platform"
        >
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="container max-w-7xl mx-auto px-6"
          >
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column - Content */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={orchestratedReveal}
                className="lg:col-span-6 text-center lg:text-left"
              >
                {/* Trust Badges */}
                <motion.div variants={slideUp} className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                  <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Award className="h-4 w-4 text-amber-400" />
                    <span className="text-sm text-amber-200 font-medium">#1 on Product Hunt</span>
                  </motion.div>
                  <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/10 border border-cyan-500/30 backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 text-cyan-400 fill-cyan-400" />
                      ))}
                    </div>
                    <span className="text-sm text-cyan-200 font-medium">4.9/5 from 2,800+ reviews</span>
                  </motion.div>
                </motion.div>

                {/* Main Headline - Bold Sans-Serif */}
                <motion.h1
                  variants={slideUp}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-tight"
                >
                  <span className="block text-white mb-2">Meetings that</span>
                  <span className="relative inline-block">
                    <GradientText>actually work</GradientText>
                    <motion.span
                      className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-purple-500/20 blur-3xl rounded-full -z-10"
                      animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                  variants={slideUp}
                  className="mt-8 text-lg sm:text-xl text-white/60 leading-relaxed max-w-xl mx-auto lg:mx-0"
                >
                  The AI meeting platform that captures every word, generates instant summaries,
                  and ensures{" "}
                  <span className="text-white font-medium">nothing falls through the cracks</span>.
                </motion.p>

                {/* Stats inline */}
                <motion.div
                  variants={slideUp}
                  className="mt-8 flex flex-wrap justify-center lg:justify-start gap-8"
                >
                  {[
                    { value: "50K+", label: "Teams" },
                    { value: "2.5M", label: "Hours saved" },
                    { value: "99%", label: "Accuracy" },
                  ].map((stat, i) => (
                    <div key={i} className="text-center lg:text-left">
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-sm text-white/40">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div variants={slideUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <MagneticButton href="/sign-up">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto group relative bg-white text-[#030014] hover:bg-white/90 px-8 py-7 text-base font-semibold rounded-2xl shadow-2xl shadow-white/10 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        <Rocket className="mr-2 h-5 w-5" />
                        Start Free — No Credit Card
                        <motion.span
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="h-5 w-5" />
                        </motion.span>
                      </span>
                    </Button>
                  </MagneticButton>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsVideoPlaying(true)}
                    className="w-full sm:w-auto group border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm px-8 py-7 text-base rounded-2xl text-white"
                  >
                    <CirclePlay className="mr-2 h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    Watch 2-min Demo
                  </Button>
                </motion.div>

                {/* Trust signals */}
                <motion.div variants={slideUp} className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-white/40">
                  {[
                    { icon: Clock, text: "2-min setup" },
                    { icon: Shield, text: "SOC 2 Type II" },
                    { icon: Globe, text: "100+ languages" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-emerald-400" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Column - Hero Visual */}
              <motion.div
                initial={{ opacity: 0, x: 80, rotateY: -15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-6 relative perspective-1000"
              >
                {/* Floating Glow */}
                <div className="absolute -inset-10 bg-gradient-to-br from-cyan-500/30 via-violet-500/20 to-purple-500/30 rounded-[4rem] blur-[80px] opacity-50" />

                {/* Main Visual Container */}
                <div className="relative">
                  <GlassCard className="p-2 shadow-2xl shadow-purple-500/10" hover={false}>
                    <div className="rounded-2xl bg-[#0a0a0f] overflow-hidden">
                      {/* Window Chrome */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative h-2 w-2 rounded-full bg-rose-500" />
                          </span>
                          <span className="text-xs text-white/50">Recording • 23:45</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <Users className="w-3.5 h-3.5" />
                          <span>8 participants</span>
                        </div>
                      </div>

                      {/* Meeting Content */}
                      <div className="aspect-[16/10] relative bg-gradient-to-br from-[#0f0f15] to-[#0a0a0f] p-4 sm:p-6">
                        {/* Video Grid */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 h-full">
                          {[
                            { name: "Sarah", speaking: true },
                            { name: "Mike", speaking: false },
                            { name: "Emma", speaking: false },
                            { name: "James", speaking: false },
                            { name: "Lisa", speaking: false },
                            { name: "+3", speaking: false },
                          ].map((participant, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.7 + i * 0.08 }}
                              className={`relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border ${
                                participant.speaking ? "border-cyan-500/50 shadow-lg shadow-cyan-500/20" : "border-white/10"
                              } flex items-center justify-center`}
                            >
                              <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                                participant.name === "+3"
                                  ? "bg-white/10 text-white/60"
                                  : "bg-gradient-to-br from-cyan-500 to-violet-500 text-white"
                              }`}>
                                {participant.name.charAt(0)}
                                {participant.name === "+3" && "3"}
                              </div>
                              {participant.speaking && (
                                <motion.div
                                  className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30"
                                  animate={{ opacity: [1, 0.6, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  <Mic className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-cyan-400" />
                                  <span className="text-[8px] sm:text-[10px] text-cyan-300 hidden sm:inline">Speaking</span>
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </div>

                        {/* AI Panel Overlay */}
                        <motion.div
                          initial={{ x: 120, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.2, duration: 0.7 }}
                          className="absolute top-3 right-3 bottom-3 sm:top-4 sm:right-4 sm:bottom-4 w-44 sm:w-56 hidden sm:block"
                        >
                          <GlassCard className="h-full p-3 sm:p-4" hover={false}>
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                                <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                              </div>
                              <span className="font-semibold text-xs sm:text-sm text-white">AI Co-Pilot</span>
                              <motion.div
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="ml-auto w-2 h-2 rounded-full bg-emerald-400"
                              />
                            </div>

                            {/* Live Transcript */}
                            <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/20">
                              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                                <motion.div
                                  animate={{ scale: [1, 1.3, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400"
                                />
                                <span className="text-[10px] sm:text-xs text-cyan-300">Live Transcript</span>
                              </div>
                              <p className="text-[10px] sm:text-xs text-white/50 leading-relaxed line-clamp-2">
                                "...the Q2 targets look achievable if we focus on enterprise..."
                              </p>
                            </div>

                            {/* AI Insights */}
                            <div className="space-y-1.5 sm:space-y-2">
                              {[
                                { icon: Target, text: "Action detected", color: "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400" },
                                { icon: CheckCircle2, text: "Decision logged", color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400" },
                                { icon: Sparkles, text: "Key insight", color: "from-violet-500/20 to-violet-500/5 border-violet-500/30 text-violet-400" },
                              ].map((item, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 1.6 + i * 0.15 }}
                                  className={`flex items-center gap-2 text-[10px] sm:text-xs p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${item.color} border`}
                                >
                                  <item.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                                  <span className="truncate">{item.text}</span>
                                </motion.div>
                              ))}
                            </div>
                          </GlassCard>
                        </motion.div>

                        {/* Control Bar */}
                        <motion.div
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1 }}
                          className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2"
                        >
                          <GlassCard className="px-3 sm:px-4 py-2 sm:py-2.5" hover={false}>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              {[Mic, Video, Users, MessageSquare].map((Icon, i) => (
                                <button key={i} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
                                </button>
                              ))}
                              <div className="w-px h-4 sm:h-5 bg-white/20 mx-1" />
                              <button className="px-3 sm:px-4 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-medium transition-colors">
                                End
                              </button>
                            </div>
                          </GlassCard>
                        </motion.div>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Floating Stat Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30, x: -30 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="absolute -bottom-6 -left-6 hidden lg:block"
                  >
                    <GlassCard className="p-4" hover={false}>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">73%</div>
                          <div className="text-xs text-white/50">Less time on notes</div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>

                  {/* Floating Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -20, x: 20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: 1.7 }}
                    className="absolute -top-4 -right-4 hidden lg:block"
                  >
                    <GlassCard className="px-4 py-2" hover={false}>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span className="text-sm font-medium text-white">AI-Powered</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3"
          >
            <span className="text-xs text-white/30 tracking-wider uppercase">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
            >
              <motion.div
                className="w-1 h-2 bg-white/40 rounded-full"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* ============================================ */}
        {/* LOGOS MARQUEE */}
        {/* ============================================ */}
        <section className="py-20 border-y border-white/5 overflow-hidden" aria-label="Trusted by leading companies">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="text-sm text-white/40 uppercase tracking-[0.2em] font-medium">
                Powering meetings at the world's best companies
              </p>
            </motion.div>
          </div>

          {/* Infinite scrolling marquee */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#030014] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#030014] to-transparent z-10 pointer-events-none" />

            <motion.div
              className="flex gap-20"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-20 shrink-0">
                  {["Google", "Microsoft", "Stripe", "Shopify", "Airbnb", "Notion", "Slack", "Figma", "Dropbox", "Linear", "Vercel", "Supabase"].map((company) => (
                    <div
                      key={`${setIndex}-${company}`}
                      className="text-2xl sm:text-3xl font-bold text-white/20 hover:text-white/40 transition-colors duration-500 cursor-default whitespace-nowrap select-none"
                    >
                      {company}
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* PROBLEM / IMPACT SECTION */}
        {/* ============================================ */}
        <section className="py-32 relative overflow-hidden" aria-label="Meeting productivity impact">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />

          <div className="container max-w-7xl mx-auto px-6 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="text-center mb-20"
            >
              <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-white/60">The Meeting Productivity Gap</span>
              </motion.div>
              <motion.h2 variants={slideUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-white">Stop losing </span>
                <GradientText>31 hours</GradientText>
                <span className="text-white"> monthly</span>
              </motion.h2>
              <motion.p variants={slideUp} className="text-lg text-white/50 max-w-2xl mx-auto">
                The average professional spends 31 hours per month in unproductive meetings.
                MeetVerse AI turns that wasted time into actionable outcomes.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={orchestratedReveal}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { value: "73%", label: "Less time on notes", description: "AI captures everything automatically", gradient: "from-cyan-500 to-blue-600", icon: FileText },
                { value: "5h+", label: "Saved per week", description: "Average time saved per team member", gradient: "from-violet-500 to-purple-600", icon: Clock },
                { value: "98%", label: "Action accuracy", description: "Never miss a commitment again", gradient: "from-amber-500 to-orange-600", icon: Target },
                { value: "2x", label: "Follow-through", description: "Double your team's execution rate", gradient: "from-emerald-500 to-green-600", icon: TrendingUp },
              ].map((stat, i) => (
                <motion.div key={i} variants={scaleReveal}>
                  <GlassCard className="p-8 h-full text-center group">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className={`text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3`}>
                      {stat.value}
                    </div>
                    <div className="text-lg font-semibold text-white mb-2">{stat.label}</div>
                    <p className="text-sm text-white/50">{stat.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* FEATURES SECTION */}
        {/* ============================================ */}
        <section id="features" className="py-32" aria-labelledby="features-heading">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="text-center mb-20"
            >
              <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Wand2 className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-white/60">Powerful Capabilities</span>
              </motion.div>
              <motion.h2 id="features-heading" variants={slideUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-white">Everything for </span>
                <GradientText>smarter meetings</GradientText>
              </motion.h2>
              <motion.p variants={slideUp} className="text-lg text-white/50 max-w-2xl mx-auto">
                A complete AI-powered suite that handles transcription, summaries, action items, and more.
              </motion.p>
            </motion.div>

            {/* Bento Grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={orchestratedReveal}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Large Feature - AI Co-Pilot */}
              <motion.div variants={scaleReveal} className="md:col-span-2 lg:col-span-2 lg:row-span-2">
                <GlassCard className="h-full overflow-hidden group">
                  <div className="relative h-full p-8 lg:p-10 flex flex-col min-h-[450px]">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                          <Brain className="w-7 h-7 text-white" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                          Most Popular
                        </div>
                      </div>
                      <h3 className="font-sans text-xl lg:text-2xl font-bold text-white mb-4 tracking-tight">
                        AI Meeting Co-Pilot
                      </h3>
                      <p className="text-white/60 text-lg mb-8 max-w-md">
                        Your intelligent assistant that listens, understands, and helps in real-time.
                        Get instant answers, smart suggestions, and proactive insights.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4 mt-auto">
                        {[
                          { icon: MessageSquare, label: "Real-time Q&A" },
                          { icon: Target, label: "Smart suggestions" },
                          { icon: FileText, label: "Knowledge search" },
                          { icon: BarChart3, label: "Meeting analytics" },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-white/70 group-hover:text-white/90 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-cyan-400" />
                            </div>
                            <span className="text-sm">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute right-0 bottom-0 w-72 h-72 hidden lg:block opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                      <motion.div
                        className="absolute inset-0 border border-cyan-500/30 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div
                        className="absolute inset-8 border border-violet-500/20 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div
                        className="absolute inset-16 border border-purple-500/10 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-20 h-20 text-cyan-500/30" />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Feature Cards */}
              {features.slice(1).map((feature, i) => (
                <motion.div key={i} variants={scaleReveal}>
                  <GlassCard className="p-6 h-full group">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      {feature.badge && (
                        <span className="px-2 py-1 rounded-full bg-white/10 text-white/60 text-[10px] font-medium border border-white/10">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/50 text-sm">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* HOW IT WORKS */}
        {/* ============================================ */}
        <section id="how-it-works" className="py-32 relative overflow-hidden" aria-label="How MeetVerse AI works">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />

          <div className="container max-w-7xl mx-auto px-6 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="text-center mb-20"
            >
              <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-white/60">Simple Workflow</span>
              </motion.div>
              <motion.h2 variants={slideUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-white">Up and running in </span>
                <GradientText>2 minutes</GradientText>
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={orchestratedReveal}
              className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {[
                {
                  step: "01",
                  icon: Calendar,
                  title: "Connect Calendar",
                  description: "Sync with Google Calendar or Outlook. MeetVerse AI automatically joins your meetings.",
                },
                {
                  step: "02",
                  icon: Brain,
                  title: "AI Takes Notes",
                  description: "Real-time transcription, speaker identification, action item detection—all automatic.",
                },
                {
                  step: "03",
                  icon: Rocket,
                  title: "Execute Faster",
                  description: "Instant summaries, searchable transcripts, and tracked action items delivered to your inbox.",
                },
              ].map((item, i) => (
                <motion.div key={i} variants={slideUp} className="relative group">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-px z-0">
                      <div className="h-full bg-gradient-to-r from-white/20 via-cyan-500/20 to-transparent" />
                      <motion.div
                        className="absolute top-0 left-0 w-8 h-px bg-cyan-400"
                        animate={{ x: [0, 100, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      />
                    </div>
                  )}
                  <GlassCard className="p-8 text-center h-full">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                      <item.icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="text-xs font-bold text-cyan-400 mb-3 tracking-widest">{item.step}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* COMPARISON TABLE */}
        {/* ============================================ */}
        <section className="py-32 relative" aria-label="Why choose MeetVerse AI">
          <div className="container max-w-5xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="text-center mb-16"
            >
              <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-white/60">The Difference</span>
              </motion.div>
              <motion.h2 variants={slideUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-white">Not just another </span>
                <GradientText>meeting tool</GradientText>
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={scaleReveal}
            >
              <GlassCard className="overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-3 border-b border-white/10">
                  <div className="p-6 font-semibold text-white/60">Feature</div>
                  <div className="p-6 font-semibold text-white/40 text-center border-x border-white/10">Traditional Tools</div>
                  <div className="p-6 font-semibold text-white text-center bg-gradient-to-r from-cyan-500/10 to-violet-500/10">
                    <span className="inline-flex items-center gap-2">
                      <Video className="w-4 h-4 text-cyan-400" />
                      MeetVerse AI
                    </span>
                  </div>
                </div>

                {/* Rows */}
                {[
                  { feature: "Transcription Accuracy", old: "70-80%", new: "99%+", highlight: true },
                  { feature: "Action Item Detection", old: "Manual", new: "Automatic AI", highlight: true },
                  { feature: "Setup Time", old: "30+ minutes", new: "2 minutes", highlight: false },
                  { feature: "Meeting Summaries", old: "Write yourself", new: "Instant AI-generated", highlight: true },
                  { feature: "Language Support", old: "5-10 languages", new: "100+ languages", highlight: false },
                  { feature: "Real-time AI Copilot", old: "Not available", new: "Full support", highlight: true },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-3 border-b border-white/5 last:border-b-0 ${i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}`}
                  >
                    <div className="p-5 text-white/80 flex items-center">
                      {row.feature}
                    </div>
                    <div className="p-5 text-white/40 text-center border-x border-white/5 flex items-center justify-center">
                      <span className="flex items-center gap-2">
                        <X className="w-4 h-4 text-rose-400/60" />
                        {row.old}
                      </span>
                    </div>
                    <div className="p-5 text-white text-center bg-gradient-to-r from-cyan-500/5 to-violet-500/5 flex items-center justify-center">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className={row.highlight ? "font-semibold text-cyan-300" : ""}>{row.new}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* TESTIMONIALS */}
        {/* ============================================ */}
        <section id="customers" className="py-32" aria-labelledby="testimonials-heading">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={orchestratedReveal}
              className="text-center mb-16"
            >
              <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm text-white/60">Customer Success</span>
              </motion.div>
              <motion.h2 id="testimonials-heading" variants={slideUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-white">Loved by </span>
                <GradientText>50,000+ teams</GradientText>
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={orchestratedReveal}
              className="grid md:grid-cols-3 gap-6"
            >
              {[
                {
                  quote: "MeetVerse AI has completely transformed our engineering standups. What used to take 30 minutes of note-taking now happens automatically.",
                  author: "Sarah Chen",
                  role: "VP of Engineering",
                  company: "Google",
                },
                {
                  quote: "We evaluated 12 different solutions. MeetVerse was the clear winner — the transcription accuracy is unmatched.",
                  author: "Michael Roberts",
                  role: "Product Director",
                  company: "Stripe",
                },
                {
                  quote: "After switching to MeetVerse, our meeting follow-through improved by 80%. Nothing falls through the cracks.",
                  author: "Emily Watson",
                  role: "Chief Operating Officer",
                  company: "Shopify",
                },
              ].map((testimonial, i) => (
                <motion.div key={i} variants={scaleReveal}>
                  <GlassCard className="p-8 h-full group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <blockquote className="text-white/80 text-lg leading-relaxed mb-8">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center font-semibold text-white">
                        {testimonial.author.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          {testimonial.author}
                          <BadgeCheck className="w-4 h-4 text-cyan-400" />
                        </div>
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
        {/* INTEGRATIONS */}
        {/* ============================================ */}
        <section className="py-32 relative overflow-hidden" aria-label="Integrations">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />

          <div className="container max-w-7xl mx-auto px-6 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="text-center mb-16"
            >
              <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-white/60">Seamless Integrations</span>
              </motion.div>
              <motion.h2 variants={slideUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-white">Works with </span>
                <GradientText>your stack</GradientText>
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={orchestratedReveal}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto"
            >
              {[
                { name: "Google Calendar", icon: Calendar, gradient: "from-blue-500 to-blue-600" },
                { name: "Slack", icon: MessageSquare, gradient: "from-purple-500 to-purple-600" },
                { name: "Notion", icon: FileText, gradient: "from-slate-400 to-slate-500" },
                { name: "HubSpot", icon: Target, gradient: "from-orange-500 to-orange-600" },
                { name: "Jira", icon: BarChart3, gradient: "from-blue-600 to-blue-700" },
                { name: "Linear", icon: Zap, gradient: "from-indigo-500 to-indigo-600" },
                { name: "Zoom", icon: Video, gradient: "from-blue-500 to-blue-600" },
                { name: "Teams", icon: Users, gradient: "from-violet-500 to-violet-600" },
                { name: "Asana", icon: CheckCircle2, gradient: "from-rose-500 to-rose-600" },
                { name: "Salesforce", icon: Globe, gradient: "from-sky-500 to-sky-600" },
                { name: "GitHub", icon: Command, gradient: "from-gray-600 to-gray-700" },
                { name: "Zapier", icon: Sparkles, gradient: "from-orange-500 to-amber-500" },
              ].map((integration) => (
                <motion.div key={integration.name} variants={scaleReveal}>
                  <GlassCard className="p-6 text-center group cursor-pointer">
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${integration.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <integration.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{integration.name}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <Link href="#" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                See all 50+ integrations
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* FAQ SECTION */}
        {/* ============================================ */}
        <section className="py-32" aria-labelledby="faq-heading">
          <div className="container max-w-4xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="text-center mb-16"
            >
              <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-white/60">FAQ</span>
              </motion.div>
              <motion.h2 id="faq-heading" variants={slideUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-white">Got </span>
                <GradientText>questions?</GradientText>
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={orchestratedReveal}
              className="space-y-4"
            >
              {[
                {
                  question: "How accurate is the AI transcription?",
                  answer: "Our transcription achieves 99%+ accuracy using advanced speech recognition. We support 100+ languages and automatically identify different speakers.",
                },
                {
                  question: "Is my meeting data secure?",
                  answer: "Absolutely. We use end-to-end encryption for all meetings. We're SOC 2 Type II certified, GDPR compliant, and HIPAA ready.",
                },
                {
                  question: "Can I use MeetVerse with Zoom or Teams?",
                  answer: "Yes! MeetVerse AI integrates with Zoom, Google Meet, Microsoft Teams, and other platforms. Our AI bot joins as a participant automatically.",
                },
                {
                  question: "How long does setup take?",
                  answer: "Most teams are up and running in under 2 minutes. Just connect your calendar, and we'll automatically join your meetings.",
                },
                {
                  question: "Can I try before committing?",
                  answer: "Definitely! Our free plan includes all core features. Plus, paid plans come with a 30-day money-back guarantee.",
                },
              ].map((faq, i) => (
                <motion.div key={i} variants={slideUp}>
                  <GlassCard className="overflow-hidden">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-lg font-semibold text-white list-none select-none">
                        {faq.question}
                        <span className="ml-4 flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-open:rotate-45 transition-transform duration-300">
                          <span className="text-white/60 text-xl leading-none">+</span>
                        </span>
                      </summary>
                      <div className="px-6 pb-6 text-white/60 leading-relaxed">
                        {faq.answer}
                      </div>
                    </details>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* PRICING */}
        {/* ============================================ */}
        <section id="pricing" className="py-32" aria-labelledby="pricing-heading">
          <div className="container max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={orchestratedReveal}
              className="text-center mb-16"
            >
              <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 mb-6">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-amber-200">Limited: 3 months free on annual</span>
              </motion.div>
              <motion.h2 id="pricing-heading" variants={slideUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-white">Start free, </span>
                <GradientText>scale confidently</GradientText>
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={orchestratedReveal}
              className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {[
                {
                  name: "Starter",
                  price: "$0",
                  period: "forever",
                  description: "Perfect for individuals and small projects",
                  icon: Sparkles,
                  gradient: "from-slate-500 to-zinc-600",
                  features: [
                    "45-minute meetings",
                    "Up to 5 participants",
                    "Basic AI transcription",
                    "5 recordings/month",
                    "Email support",
                  ],
                  cta: "Get Started Free",
                  highlighted: false,
                },
                {
                  name: "Pro",
                  price: "$24",
                  period: "/user/mo",
                  description: "For growing teams that need more power",
                  icon: Zap,
                  gradient: "from-cyan-500 to-violet-500",
                  features: [
                    "Unlimited meetings",
                    "Up to 100 participants",
                    "Full AI suite with summaries",
                    "Unlimited cloud recordings",
                    "Calendar integrations",
                    "Custom branding",
                    "Priority support",
                  ],
                  cta: "Start 14-Day Trial",
                  highlighted: true,
                  badge: "Most Popular",
                },
                {
                  name: "Business",
                  price: "$49",
                  period: "/user/mo",
                  description: "Advanced features for large organizations",
                  icon: Shield,
                  gradient: "from-violet-500 to-purple-600",
                  features: [
                    "Everything in Pro",
                    "Up to 500 participants",
                    "Admin dashboard & analytics",
                    "SSO & SAML authentication",
                    "Advanced security controls",
                    "Dedicated account manager",
                    "Custom integrations",
                  ],
                  cta: "Contact Sales",
                  highlighted: false,
                },
              ].map((plan, planIndex) => (
                <motion.div
                  key={planIndex}
                  variants={scaleReveal}
                  className={`relative group ${plan.highlighted ? "lg:-translate-y-6 lg:scale-105" : ""}`}
                >
                  {/* Popular badge */}
                  {plan.badge && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 blur-md opacity-60" />
                        <div className="relative px-5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-sm font-semibold text-white shadow-xl">
                          {plan.badge}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  <div className={`relative h-full rounded-3xl overflow-hidden transition-all duration-500 ${
                    plan.highlighted
                      ? "bg-gradient-to-b from-white/[0.12] to-white/[0.04] border-2 border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.15)]"
                      : "bg-white/[0.03] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}>
                    {/* Glow effect for highlighted */}
                    {plan.highlighted && (
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-violet-500/10 pointer-events-none" />
                    )}

                    <div className="relative p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                          <p className="text-sm text-white/50">{plan.description}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                          <plan.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-8">
                        <div className="flex items-baseline gap-2">
                          <span className={`text-5xl font-bold ${plan.highlighted ? "bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent" : "text-white"}`}>
                            {plan.price}
                          </span>
                          {plan.period && (
                            <span className="text-white/40 text-sm font-medium">{plan.period}</span>
                          )}
                        </div>
                        {plan.name === "Pro" && (
                          <div className="mt-2 text-xs text-emerald-400 font-medium">
                            Save 20% with annual billing
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                              plan.highlighted
                                ? "bg-gradient-to-br from-cyan-500 to-violet-500"
                                : "bg-white/10"
                            }`}>
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm text-white/70">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Link href={plan.name === "Business" ? "/contact" : "/sign-up"} className="block">
                        <button className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                          plan.highlighted
                            ? "bg-white text-[#030014] hover:bg-white/90 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-0.5"
                            : "bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/20"
                        }`}>
                          {plan.cta}
                          <ArrowRight className="inline-block w-4 h-4 ml-2" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 text-sm">30-day money-back guarantee • No questions asked</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* FINAL CTA */}
        {/* ============================================ */}
        <section className="py-32" aria-label="Get started">
          <div className="container max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-[3rem] overflow-hidden"
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-violet-500 to-purple-600" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent)]" />

              {/* Animated orbs */}
              <motion.div
                className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-white/20 blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-cyan-300/20 blur-3xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 8, repeat: Infinity }}
              />

              {/* Content */}
              <div className="relative px-8 py-20 sm:px-16 sm:py-28 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-8"
                >
                  <Rocket className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Join 50,000+ teams</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white tracking-tight"
                >
                  Ready to transform
                  <br />
                  your meetings?
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white/80 mb-10 max-w-2xl mx-auto"
                >
                  Start free today. No credit card required. Setup takes 2 minutes.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <MagneticButton href="/sign-up">
                    <Button size="lg" className="bg-white text-violet-600 hover:bg-white/90 px-8 py-7 text-base font-semibold rounded-2xl shadow-xl">
                      <Rocket className="mr-2 h-5 w-5" />
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </MagneticButton>
                  <Button size="lg" variant="outline" className="border-white/30 bg-white/10 hover:bg-white/20 px-8 py-7 text-base rounded-2xl text-white backdrop-blur-sm">
                    <Headphones className="mr-2 h-5 w-5" />
                    Talk to Sales
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/70 text-sm"
                >
                  {["Free forever plan", "No credit card", "Cancel anytime"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      {item}
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="border-t border-white/10 py-20" role="contentinfo">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-violet-500 to-purple-500">
                  <Video className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-white tracking-tight">
                  MeetVerse<span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">AI</span>
                </span>
              </Link>
              <p className="text-sm text-white/50 max-w-xs mb-6 leading-relaxed">
                AI-powered meetings that make every conversation count. Trusted by 50,000+ teams worldwide.
              </p>
              <div className="flex items-center gap-3">
                {["SOC 2", "GDPR", "HIPAA"].map((badge) => (
                  <span key={badge} className="px-3 py-1 rounded-full text-xs border border-white/10 text-white/50">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {[
              { title: "Product", links: ["Features", "Pricing", "Integrations", "Security", "Roadmap"] },
              { title: "Company", links: ["About", "Careers", "Blog", "Press", "Contact"] },
              { title: "Resources", links: ["Documentation", "Help Center", "API", "Status", "Community"] },
              { title: "Legal", links: ["Privacy", "Terms", "Cookies", "Licenses"] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm text-white/50 hover:text-white transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} MeetVerse AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Twitter", "LinkedIn", "GitHub", "YouTube"].map((social) => (
                <Link key={social} href="#" className="text-sm text-white/40 hover:text-white transition-colors">
                  {social}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-[#030014] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/50">Demo video placeholder</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </div>
  );
}
