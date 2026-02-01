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
  MousePointer,
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
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleReveal = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// MAGNETIC BUTTON COMPONENT
// ============================================
function MagneticButton({ children, className = "", href }: { children: React.ReactNode; className?: string; href?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

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
// ANIMATED COUNTER HOOK
// ============================================
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const startAnimation = () => {
    if (hasAnimated) return;
    setHasAnimated(true);
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
  };

  return { count, startAnimation };
}

// ============================================
// LIVE ACTIVITY DATA
// ============================================
const liveActivities = [
  { name: "Acme Corp", action: "started a meeting", time: "just now" },
  { name: "TechStart Inc", action: "generated summary", time: "12s ago" },
  { name: "GlobalTeam", action: "detected 8 action items", time: "34s ago" },
  { name: "InnovateCo", action: "joined enterprise plan", time: "1m ago" },
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

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Live activity rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % liveActivities.length);
    }, 3000);
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

  // Stats counters
  const teamsCounter = useCounter(50000);
  const hoursCounter = useCounter(2500000);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-ink text-snow overflow-hidden selection:bg-cyan-500/30">
      {/* ============================================ */}
      {/* CINEMATIC BACKGROUND */}
      {/* ============================================ */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,rgba(6,182,212,0.12),transparent_60%)]" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Gold accent orb */}
        <motion.div
          className="absolute top-[40%] right-[20%] w-[30vw] h-[30vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Mouse-following gradient */}
        <div
          className="pointer-events-none fixed inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6,182,212,0.04), transparent 60%)`,
          }}
        />
      </div>

      {/* ============================================ */}
      {/* LIVE ACTIVITY BADGE */}
      {/* ============================================ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activityIndex}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-6 z-50 hidden lg:block"
        >
          <div className="flex items-center gap-3 rounded-full bg-charcoal/90 backdrop-blur-2xl border border-graphite/50 px-5 py-3 shadow-2xl shadow-black/20">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-sm">
              <span className="font-semibold text-snow">{liveActivities[activityIndex].name}</span>
              <span className="text-silver"> {liveActivities[activityIndex].action}</span>
            </div>
            <span className="text-xs text-slate">{liveActivities[activityIndex].time}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ============================================ */}
      {/* NAVIGATION HEADER */}
      {/* ============================================ */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center justify-between rounded-2xl border border-graphite/40 bg-ink/80 backdrop-blur-2xl px-6 py-3 shadow-2xl shadow-black/10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl blur-xl opacity-40 group-hover:opacity-60"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/25">
                  <Video className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-display font-bold tracking-tight">
                MeetVerse<span className="text-cyan-400">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { label: "Features", href: "#features" },
                { label: "Solutions", href: "#solutions" },
                { label: "Pricing", href: "#pricing" },
                { label: "Enterprise", href: "#enterprise" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm text-silver hover:text-snow transition-colors duration-200 rounded-lg hover:bg-graphite/30"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs text-emerald-400 font-medium">3,847 meetings now</span>
              </div>
              <Link href="/sign-in" className="text-sm text-silver hover:text-snow transition-colors">
                Sign in
              </Link>
              <MagneticButton href="/sign-up">
                <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white border-0 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300 rounded-xl px-5">
                  Start Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </MagneticButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-graphite/50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="md:hidden mt-3 rounded-2xl border border-graphite/40 bg-ink/95 backdrop-blur-2xl overflow-hidden shadow-2xl"
              >
                <nav className="p-4 space-y-1">
                  {["Features", "Solutions", "Pricing", "Enterprise"].map((item) => (
                    <Link
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-base text-silver hover:text-snow hover:bg-graphite/30 rounded-xl transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                  <div className="pt-4 mt-4 border-t border-graphite/50 space-y-3">
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-center text-silver hover:text-snow rounded-xl transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl py-3">
                        Start Free Trial
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <main>
        {/* ============================================ */}
        {/* HERO SECTION */}
        {/* ============================================ */}
        <section
          ref={heroRef}
          className="relative min-h-[100vh] flex items-center pt-32 pb-20 lg:pt-40 lg:pb-32"
          aria-label="AI-Powered Meeting Platform - Transform Your Team Collaboration"
        >
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Column - Content */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={orchestratedReveal}
                className="text-center lg:text-left"
              >
                {/* Award Badges */}
                <motion.div variants={slideUp} className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span className="text-sm text-amber-200 font-medium">#1 Product Hunt</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm">
                    <Star className="h-4 w-4 text-cyan-400 fill-cyan-400" />
                    <span className="text-sm text-cyan-200 font-medium">4.9/5 Rating</span>
                  </div>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                  variants={slideUp}
                  className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
                >
                  <span className="block text-snow">Meetings That</span>
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500 bg-clip-text text-transparent">
                      Work For You
                    </span>
                    <motion.span
                      className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 blur-2xl rounded-full"
                      animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                  variants={slideUp}
                  className="mt-6 text-lg sm:text-xl text-silver leading-relaxed max-w-xl mx-auto lg:mx-0"
                >
                  The AI meeting platform that captures every detail, generates instant summaries,
                  and ensures no action item falls through the cracks.{" "}
                  <span className="text-snow font-medium">Trusted by 50,000+ teams worldwide.</span>
                </motion.p>

                {/* CTA Buttons */}
                <motion.div variants={slideUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <MagneticButton href="/sign-up">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto group relative bg-snow text-ink hover:bg-pearl px-8 py-6 text-base font-semibold rounded-2xl shadow-2xl shadow-white/10 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        <Rocket className="mr-2 h-5 w-5" />
                        Start Free — No Credit Card
                        <motion.span
                          className="ml-2"
                          animate={{ x: [0, 4, 0] }}
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
                    className="w-full sm:w-auto group border-graphite/50 bg-charcoal/30 hover:bg-charcoal/50 backdrop-blur-sm px-8 py-6 text-base rounded-2xl text-snow"
                  >
                    <Play className="mr-2 h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div variants={slideUp} className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-slate">
                  {[
                    { icon: Clock, text: "2-min setup" },
                    { icon: Shield, text: "SOC 2 Certified" },
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
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Floating Glow Effects */}
                <div className="absolute -inset-8 bg-gradient-to-br from-cyan-500/20 via-transparent to-amber-500/10 rounded-[3rem] blur-3xl" />

                {/* Main Visual Container */}
                <div className="relative rounded-3xl border border-graphite/40 bg-gradient-to-br from-charcoal/80 to-ink/90 backdrop-blur-xl p-2 shadow-2xl shadow-black/30">
                  <div className="rounded-2xl bg-ink/80 overflow-hidden">
                    {/* Window Chrome */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-graphite/40 bg-charcoal/40">
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
                        <span className="text-xs text-silver">Recording • 23:45</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate">
                        <Users className="w-3.5 h-3.5" />
                        <span>8 participants</span>
                      </div>
                    </div>

                    {/* Meeting Content */}
                    <div className="aspect-[4/3] relative bg-gradient-to-br from-charcoal to-ink p-6">
                      {/* Video Grid */}
                      <div className="grid grid-cols-3 gap-3 h-full">
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
                            transition={{ delay: 0.6 + i * 0.1 }}
                            className={`relative rounded-xl bg-gradient-to-br from-graphite/60 to-graphite/30 border ${
                              participant.speaking ? "border-cyan-500/50" : "border-graphite/30"
                            } flex items-center justify-center overflow-hidden`}
                          >
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-semibold ${
                              participant.name === "+3"
                                ? "bg-graphite/60 text-silver"
                                : "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white"
                            }`}>
                              {participant.name.charAt(0)}
                              {participant.name === "+3" && "3"}
                            </div>
                            {participant.speaking && (
                              <motion.div
                                className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30"
                                animate={{ opacity: [1, 0.6, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <Mic className="w-2.5 h-2.5 text-cyan-400" />
                                <span className="text-[10px] text-cyan-300">Speaking</span>
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>

                      {/* AI Panel Overlay */}
                      <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                        className="absolute top-4 right-4 bottom-4 w-56 rounded-xl bg-ink/95 backdrop-blur-xl border border-graphite/40 p-4 shadow-2xl hidden sm:block"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-sm text-snow">AI Co-Pilot</span>
                          <motion.div
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="ml-auto w-2 h-2 rounded-full bg-emerald-400"
                          />
                        </div>

                        {/* Live Transcript */}
                        <div className="mb-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <motion.div
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-2 h-2 rounded-full bg-cyan-400"
                            />
                            <span className="text-xs text-cyan-300">Live Transcript</span>
                          </div>
                          <p className="text-xs text-silver leading-relaxed line-clamp-2">
                            "...the Q2 targets look achievable if we focus on enterprise..."
                          </p>
                        </div>

                        {/* AI Insights */}
                        <div className="space-y-2">
                          {[
                            { icon: Target, text: "Action item detected", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                            { icon: CheckCircle2, text: "Decision logged", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                            { icon: Sparkles, text: "Key insight", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
                          ].map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.5 + i * 0.2 }}
                              className={`flex items-center gap-2 text-xs p-2 rounded-lg border ${item.color}`}
                            >
                              <item.icon className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{item.text}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Control Bar */}
                      <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-ink/90 backdrop-blur-xl rounded-full px-4 py-2.5 border border-graphite/40 shadow-xl"
                      >
                        {[Mic, Video, Users, MessageSquare].map((Icon, i) => (
                          <button key={i} className="w-9 h-9 rounded-full bg-graphite/60 hover:bg-graphite flex items-center justify-center transition-colors">
                            <Icon className="w-4 h-4 text-pearl" />
                          </button>
                        ))}
                        <div className="w-px h-5 bg-graphite/60 mx-1" />
                        <button className="px-4 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-colors">
                          End
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-charcoal/90 backdrop-blur-xl border border-graphite/40 shadow-2xl hidden lg:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-snow">73%</div>
                      <div className="text-xs text-silver">Less time on notes</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
          >
            <span className="text-xs text-slate">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-8 rounded-full border border-graphite flex items-start justify-center p-1.5"
            >
              <motion.div className="w-1 h-2 bg-slate rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* ============================================ */}
        {/* LOGOS / SOCIAL PROOF - INFINITE MARQUEE */}
        {/* ============================================ */}
        <section className="py-16 border-y border-graphite/30 overflow-hidden" aria-label="Trusted by leading companies">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <p className="text-sm text-slate uppercase tracking-wider font-medium">
                Trusted by 50,000+ teams at companies like
              </p>
            </motion.div>
          </div>

          {/* Infinite scrolling marquee */}
          <div className="relative">
            {/* Gradient masks */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />

            <motion.div
              className="flex gap-16"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              {/* Double the logos for seamless loop */}
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-16 shrink-0">
                  {["Google", "Microsoft", "Stripe", "Shopify", "Airbnb", "Notion", "Slack", "Figma", "Dropbox", "Adobe", "Spotify", "Netflix"].map((company) => (
                    <div
                      key={`${setIndex}-${company}`}
                      className="text-2xl sm:text-3xl font-bold text-steel/60 hover:text-silver transition-colors duration-300 cursor-default whitespace-nowrap select-none"
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
        {/* PROBLEM / STATS SECTION */}
        {/* ============================================ */}
        <section className="py-24 lg:py-32 relative overflow-hidden" aria-label="Meeting productivity statistics">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="text-center mb-16"
            >
              <motion.span variants={slideUp} className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 mb-4">
                <BarChart3 className="w-4 h-4" />
                THE MEETING CRISIS
              </motion.span>
              <motion.h2 variants={slideUp} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-snow">
                Your team deserves better meetings
              </motion.h2>
              <motion.p variants={slideUp} className="text-lg text-silver max-w-2xl mx-auto">
                Professionals waste an average of 31 hours per month in unproductive meetings.
                MeetVerse AI transforms this lost time into focused, actionable outcomes.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              onViewportEnter={() => {
                teamsCounter.startAnimation();
                hoursCounter.startAnimation();
              }}
              variants={orchestratedReveal}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            >
              {[
                { value: "73%", label: "Less time on meeting notes", description: "AI captures everything automatically", gradient: "from-cyan-400 to-cyan-600" },
                { value: "5h+", label: "Saved per week", description: "Average time saved per team member", gradient: "from-emerald-400 to-emerald-600" },
                { value: "98%", label: "Action item accuracy", description: "Never miss a commitment again", gradient: "from-amber-400 to-amber-600" },
                { value: "2x", label: "Meeting follow-through", description: "Double your team's execution rate", gradient: "from-rose-400 to-rose-600" },
              ].map((stat, i) => (
                <motion.div key={i} variants={scaleReveal}>
                  <div className="relative group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-graphite/30 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative h-full rounded-3xl border border-graphite/40 bg-charcoal/30 p-8 text-center backdrop-blur-sm hover:border-graphite/60 transition-colors">
                      <div className={`text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3`}>
                        {stat.value}
                      </div>
                      <div className="text-lg font-semibold text-snow mb-2">{stat.label}</div>
                      <p className="text-sm text-silver">{stat.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* FEATURES BENTO GRID */}
        {/* ============================================ */}
        <section id="features" className="py-24 lg:py-32" aria-labelledby="features-heading">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="text-center mb-16"
            >
              <motion.span variants={slideUp} className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 mb-4">
                <Wand2 className="w-4 h-4" />
                POWERFUL CAPABILITIES
              </motion.span>
              <motion.h2 id="features-heading" variants={slideUp} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-snow">
                Everything you need for
                <br />
                <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                  smarter meetings
                </span>
              </motion.h2>
            </motion.div>

            {/* Bento Grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto"
            >
              {/* Large Feature - AI Co-Pilot */}
              <motion.div variants={scaleReveal} className="md:col-span-2 lg:col-span-2 lg:row-span-2">
                <div className="relative h-full rounded-3xl border border-graphite/40 bg-gradient-to-br from-cyan-500/10 via-charcoal/50 to-ink overflow-hidden group min-h-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative h-full p-8 lg:p-10 flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Brain className="w-7 h-7 text-white" />
                      </div>
                      <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                        Most Popular
                      </div>
                    </div>
                    <h3 className="font-display text-2xl lg:text-3xl font-bold text-snow mb-4">
                      AI Meeting Co-Pilot
                    </h3>
                    <p className="text-silver text-lg mb-8 max-w-md">
                      Your intelligent assistant that listens, understands, and helps in real-time.
                      Get instant answers, smart suggestions, and proactive insights during every meeting.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 mt-auto">
                      {[
                        { icon: MessageSquare, label: "Real-time Q&A" },
                        { icon: Target, label: "Smart suggestions" },
                        { icon: FileText, label: "Knowledge search" },
                        { icon: BarChart3, label: "Meeting analytics" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-pearl">
                          <item.icon className="w-5 h-5 text-cyan-400" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute right-0 bottom-0 w-64 h-64 hidden lg:block">
                      <motion.div
                        className="absolute inset-0 border border-cyan-500/20 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div
                        className="absolute inset-8 border border-cyan-500/10 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-16 h-16 text-cyan-500/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Feature Cards */}
              {[
                {
                  icon: MessageSquare,
                  title: "Live Transcription",
                  description: "99% accurate speech-to-text in 100+ languages with automatic speaker identification",
                  gradient: "from-blue-500 to-cyan-500",
                  badge: "Enterprise Ready",
                },
                {
                  icon: Sparkles,
                  title: "Instant Summaries",
                  description: "AI-generated meeting briefs delivered in seconds, not hours",
                  gradient: "from-amber-500 to-orange-500",
                  badge: "5+ hrs saved/week",
                },
                {
                  icon: Zap,
                  title: "Action Detection",
                  description: "Automatically capture commitments, deadlines, and owners from conversations",
                  gradient: "from-emerald-500 to-green-500",
                  badge: "98% Accuracy",
                },
                {
                  icon: Video,
                  title: "Crystal Clear Video",
                  description: "4K quality with adaptive bitrate supporting up to 200 participants",
                  gradient: "from-purple-500 to-pink-500",
                  badge: null,
                },
              ].map((feature, i) => (
                <motion.div key={i} variants={scaleReveal}>
                  <div className="relative h-full rounded-3xl border border-graphite/40 bg-charcoal/30 p-6 overflow-hidden group hover:border-graphite/60 transition-all duration-300 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      {feature.badge && (
                        <span className="px-2 py-1 rounded-full bg-graphite/60 text-silver text-[10px] font-medium">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-snow mb-2">{feature.title}</h3>
                    <p className="text-silver text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}

              {/* Security Banner */}
              <motion.div variants={scaleReveal} className="md:col-span-2 lg:col-span-3">
                <div className="relative rounded-3xl border border-graphite/40 bg-gradient-to-r from-emerald-500/10 via-charcoal/30 to-cyan-500/10 p-8 overflow-hidden group">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                      <h3 className="text-2xl font-bold text-snow mb-2">Enterprise-Grade Security</h3>
                      <p className="text-silver">
                        End-to-end encryption, SSO, SCIM provisioning, and comprehensive audit logs.
                        Your conversations are protected by industry-leading security standards.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {["SOC 2", "GDPR", "HIPAA", "ISO 27001"].map((badge) => (
                        <span key={badge} className="px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* WHY MEETVERSE - COMPARISON */}
        {/* ============================================ */}
        <section className="py-24 lg:py-32 relative overflow-hidden" aria-label="Why choose MeetVerse AI">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/3 to-transparent" />
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="text-center mb-16"
            >
              <motion.span variants={slideUp} className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 mb-4">
                <Award className="w-4 h-4" />
                THE DIFFERENCE
              </motion.span>
              <motion.h2 variants={slideUp} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-snow">
                Not just another meeting tool
              </motion.h2>
              <motion.p variants={slideUp} className="text-lg text-silver max-w-2xl mx-auto">
                See how MeetVerse AI compares to traditional meeting solutions
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="max-w-4xl mx-auto"
            >
              {/* Comparison Table */}
              <div className="rounded-3xl border border-graphite/40 bg-charcoal/30 backdrop-blur-sm overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-3 bg-graphite/30 border-b border-graphite/40">
                  <div className="p-6 font-semibold text-silver">Feature</div>
                  <div className="p-6 font-semibold text-slate text-center border-x border-graphite/40">Traditional Tools</div>
                  <div className="p-6 font-semibold text-snow text-center bg-cyan-500/10">
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
                  { feature: "Calendar Sync", old: "Limited", new: "Full auto-join", highlight: false },
                  { feature: "Speaker Identification", old: "Basic", new: "Advanced diarization", highlight: true },
                  { feature: "Real-time AI Copilot", old: "Not available", new: "Full support", highlight: true },
                ].map((row, i) => (
                  <motion.div
                    key={i}
                    variants={slideUp}
                    className={`grid grid-cols-3 border-b border-graphite/30 last:border-b-0 ${i % 2 === 0 ? "bg-transparent" : "bg-graphite/10"}`}
                  >
                    <div className="p-5 text-pearl flex items-center">
                      {row.feature}
                    </div>
                    <div className="p-5 text-slate text-center border-x border-graphite/30 flex items-center justify-center">
                      <span className="flex items-center gap-2">
                        <X className="w-4 h-4 text-rose-400/60" />
                        {row.old}
                      </span>
                    </div>
                    <div className="p-5 text-snow text-center bg-cyan-500/5 flex items-center justify-center">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className={row.highlight ? "font-semibold text-cyan-300" : ""}>{row.new}</span>
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* HOW IT WORKS */}
        {/* ============================================ */}
        <section className="py-24 lg:py-32 relative overflow-hidden" aria-label="How MeetVerse AI works">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-charcoal/30 to-transparent" />
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="text-center mb-16"
            >
              <motion.span variants={slideUp} className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 mb-4">
                <MousePointer className="w-4 h-4" />
                SIMPLE WORKFLOW
              </motion.span>
              <motion.h2 variants={slideUp} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-snow">
                Three steps to meeting excellence
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {[
                {
                  step: "01",
                  icon: Calendar,
                  title: "Connect Your Calendar",
                  description: "Sync with Google Calendar or Outlook in one click. MeetVerse AI automatically joins your scheduled meetings.",
                },
                {
                  step: "02",
                  icon: Brain,
                  title: "Let AI Work",
                  description: "Our AI transcribes in real-time, identifies speakers, detects action items, and captures key decisions automatically.",
                },
                {
                  step: "03",
                  icon: Rocket,
                  title: "Execute Faster",
                  description: "Receive instant summaries, searchable transcripts, and tracked action items. Never miss a follow-up again.",
                },
              ].map((item, i) => (
                <motion.div key={i} variants={slideUp} className="relative">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-graphite/60 via-cyan-500/20 to-transparent -translate-x-1/2 z-0" />
                  )}
                  <div className="relative text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-charcoal to-graphite border border-graphite/60 mb-6 shadow-xl">
                      <item.icon className="w-7 h-7 text-cyan-400" />
                    </div>
                    <div className="text-xs font-bold text-cyan-400 mb-2 tracking-wider">{item.step}</div>
                    <h3 className="text-xl font-bold text-snow mb-3">{item.title}</h3>
                    <p className="text-silver text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* TESTIMONIALS */}
        {/* ============================================ */}
        <section id="customers" className="py-24 lg:py-32" aria-labelledby="testimonials-heading">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={orchestratedReveal}
              className="text-center mb-16"
            >
              <motion.span variants={slideUp} className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 mb-4">
                <Star className="w-4 h-4 fill-cyan-400" />
                CUSTOMER SUCCESS
              </motion.span>
              <motion.h2 id="testimonials-heading" variants={slideUp} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-snow">
                Loved by 50,000+ teams
              </motion.h2>
              <motion.p variants={slideUp} className="text-lg text-silver">
                See why industry leaders trust MeetVerse AI for their most important meetings
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={orchestratedReveal}
              className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
              {[
                {
                  quote: "MeetVerse AI has completely transformed our engineering standups. What used to take 30 minutes of note-taking now happens automatically. The AI summaries are incredibly accurate.",
                  author: "Sarah Chen",
                  role: "VP of Engineering",
                  company: "Google",
                  avatar: "SC",
                },
                {
                  quote: "We evaluated 12 different solutions. MeetVerse was the clear winner — the transcription accuracy is unmatched, and the action item detection actually works. It's a game-changer.",
                  author: "Michael Roberts",
                  role: "Product Director",
                  company: "Stripe",
                  avatar: "MR",
                },
                {
                  quote: "After switching to MeetVerse, our meeting follow-through improved by 80%. Nothing falls through the cracks anymore. Our entire executive team runs on it now.",
                  author: "Emily Watson",
                  role: "Chief Operating Officer",
                  company: "Shopify",
                  avatar: "EW",
                },
              ].map((testimonial, i) => (
                <motion.div key={i} variants={scaleReveal}>
                  <div className="relative h-full rounded-3xl border border-graphite/40 bg-charcoal/30 p-8 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <blockquote className="text-pearl text-lg leading-relaxed mb-8">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center font-semibold text-white">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-snow flex items-center gap-2">
                          {testimonial.author}
                          <BadgeCheck className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="text-sm text-slate">{testimonial.role}, {testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* INTEGRATIONS */}
        {/* ============================================ */}
        <section className="py-24 lg:py-32 relative overflow-hidden" aria-label="Seamless integrations with your favorite tools">
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-transparent" />
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="text-center mb-16"
            >
              <motion.span variants={slideUp} className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 mb-4">
                <Zap className="w-4 h-4" />
                SEAMLESS INTEGRATIONS
              </motion.span>
              <motion.h2 variants={slideUp} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-snow">
                Works with your stack
              </motion.h2>
              <motion.p variants={slideUp} className="text-lg text-silver max-w-2xl mx-auto">
                Connect MeetVerse AI with the tools you already use. One-click setup, instant sync.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={orchestratedReveal}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto"
            >
              {[
                { name: "Google Calendar", icon: Calendar, color: "from-blue-500 to-blue-600" },
                { name: "Microsoft 365", icon: Globe, color: "from-sky-500 to-sky-600" },
                { name: "Slack", icon: MessageSquare, color: "from-purple-500 to-purple-600" },
                { name: "Notion", icon: FileText, color: "from-zinc-400 to-zinc-500" },
                { name: "Salesforce", icon: Users, color: "from-blue-400 to-blue-500" },
                { name: "HubSpot", icon: Target, color: "from-orange-500 to-orange-600" },
                { name: "Jira", icon: BarChart3, color: "from-blue-600 to-blue-700" },
                { name: "Asana", icon: CheckCircle2, color: "from-rose-500 to-rose-600" },
                { name: "Linear", icon: Zap, color: "from-indigo-500 to-indigo-600" },
                { name: "Zoom", icon: Video, color: "from-blue-500 to-blue-600" },
                { name: "Teams", icon: Users, color: "from-violet-500 to-violet-600" },
                { name: "Zapier", icon: Sparkles, color: "from-orange-500 to-amber-500" },
              ].map((integration) => (
                <motion.div
                  key={integration.name}
                  variants={scaleReveal}
                  className="group"
                >
                  <div className="relative rounded-2xl border border-graphite/40 bg-charcoal/30 p-6 backdrop-blur-sm hover:border-cyan-500/30 hover:bg-charcoal/50 transition-all duration-300 text-center cursor-pointer">
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <integration.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm font-medium text-pearl group-hover:text-snow transition-colors">{integration.name}</div>
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
        <section className="py-24 lg:py-32" aria-labelledby="faq-heading">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={orchestratedReveal}
              className="text-center mb-16"
            >
              <motion.span variants={slideUp} className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 mb-4">
                <MessageSquare className="w-4 h-4" />
                FREQUENTLY ASKED QUESTIONS
              </motion.span>
              <motion.h2 id="faq-heading" variants={slideUp} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-snow">
                Got questions?
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
                  answer: "Our transcription achieves 99%+ accuracy using advanced speech recognition models trained on millions of hours of meeting audio. We support 100+ languages and automatically identify different speakers with speaker diarization technology.",
                },
                {
                  question: "Is my meeting data secure?",
                  answer: "Absolutely. We use end-to-end encryption for all meetings and transcripts. We're SOC 2 Type II certified, GDPR compliant, and HIPAA ready. Your data is never used to train AI models and you can delete it anytime.",
                },
                {
                  question: "Can I use MeetVerse AI with my existing video platform?",
                  answer: "Yes! MeetVerse AI integrates seamlessly with Zoom, Google Meet, Microsoft Teams, and other popular platforms. Our AI bot joins as a participant and captures everything automatically—no switching tools required.",
                },
                {
                  question: "How long does setup take?",
                  answer: "Most teams are up and running in under 2 minutes. Just connect your calendar, and MeetVerse AI will automatically join your scheduled meetings. No complex configuration or IT support needed.",
                },
                {
                  question: "What happens if I exceed my meeting limit?",
                  answer: "On the free plan, meetings are limited to 45 minutes. If you hit your limit, the recording stops but your meeting continues. Upgrade to Pro for unlimited meeting duration and recordings.",
                },
                {
                  question: "Can I try before committing to a paid plan?",
                  answer: "Definitely! Our free plan includes all core features with reasonable limits. Plus, all paid plans come with a 30-day money-back guarantee—no questions asked.",
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  variants={slideUp}
                  className="group"
                >
                  <details className="rounded-2xl border border-graphite/40 bg-charcoal/30 overflow-hidden hover:border-graphite/60 transition-colors">
                    <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-lg font-semibold text-snow list-none select-none">
                      {faq.question}
                      <span className="ml-4 flex-shrink-0 w-6 h-6 rounded-full bg-graphite/50 flex items-center justify-center group-open:rotate-45 transition-transform duration-300">
                        <span className="text-silver text-xl leading-none">+</span>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-silver leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className="text-silver mb-4">Still have questions?</p>
              <Link href="#" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                <Headphones className="w-4 h-4" />
                Contact our support team
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* PRICING */}
        {/* ============================================ */}
        <section id="pricing" className="py-24 lg:py-32" aria-labelledby="pricing-heading">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={orchestratedReveal}
              className="text-center mb-16"
            >
              <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-amber-200">Limited time: 3 months free on annual plans</span>
              </motion.div>
              <motion.h2 id="pricing-heading" variants={slideUp} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-snow">
                Start free, scale with confidence
              </motion.h2>
              <motion.p variants={slideUp} className="text-lg text-silver max-w-2xl mx-auto">
                No credit card required. Start with our free plan and upgrade as your team grows.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={orchestratedReveal}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            >
              {[
                {
                  name: "Free",
                  price: "$0",
                  period: "",
                  description: "For individuals getting started",
                  features: ["45-minute meetings", "Up to 3 participants", "Basic transcription", "5 recordings/month"],
                  cta: "Get Started",
                  highlighted: false,
                },
                {
                  name: "Pro",
                  price: "$19",
                  period: "/user/mo",
                  description: "For professionals and small teams",
                  features: ["Unlimited meetings", "Up to 50 participants", "Full AI suite", "Unlimited recordings", "Calendar integrations"],
                  cta: "Start Free Trial",
                  highlighted: true,
                  badge: "Most Popular",
                },
                {
                  name: "Business",
                  price: "$39",
                  period: "/user/mo",
                  description: "For growing organizations",
                  features: ["Everything in Pro", "Up to 200 participants", "Admin dashboard", "SSO & analytics", "Priority support"],
                  cta: "Start Free Trial",
                  highlighted: false,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "",
                  description: "For large-scale deployments",
                  features: ["Everything in Business", "Unlimited participants", "Dedicated success manager", "Custom integrations", "On-premise option"],
                  cta: "Contact Sales",
                  highlighted: false,
                },
              ].map((plan, i) => (
                <motion.div key={i} variants={scaleReveal} className={`relative ${plan.highlighted ? "lg:-translate-y-4" : ""}`}>
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-sm font-medium text-white z-10 whitespace-nowrap shadow-lg shadow-cyan-500/20">
                      {plan.badge}
                    </div>
                  )}
                  <div className={`relative h-full rounded-3xl border p-6 transition-all duration-300 ${
                    plan.highlighted
                      ? "border-cyan-500/50 bg-gradient-to-b from-cyan-500/15 via-charcoal/50 to-ink shadow-2xl shadow-cyan-500/10"
                      : "border-graphite/40 bg-charcoal/30 hover:border-graphite/60"
                  }`}>
                    <div className="text-lg font-semibold text-snow mb-1">{plan.name}</div>
                    <div className="text-sm text-slate mb-4">{plan.description}</div>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-bold text-snow">{plan.price}</span>
                      {plan.period && <span className="text-slate text-sm">{plan.period}</span>}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm text-pearl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/sign-up" className="block">
                      <Button className={`w-full py-3 rounded-xl transition-all duration-300 ${
                        plan.highlighted
                          ? "bg-snow text-ink hover:bg-pearl shadow-lg"
                          : "bg-graphite/60 hover:bg-graphite text-pearl"
                      }`}>
                        {plan.cta}
                      </Button>
                    </Link>
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
                <span className="text-emerald-300">30-day money-back guarantee • No questions asked</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* FINAL CTA */}
        {/* ============================================ */}
        <section className="py-24 lg:py-32" aria-label="Get started with MeetVerse AI">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-[2.5rem] overflow-hidden"
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent)]" />
              <motion.div
                className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 10, repeat: Infinity }}
              />

              {/* Content */}
              <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-8"
                >
                  <Rocket className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Join 50,000+ teams transforming meetings</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
                >
                  Ready to make every
                  <br />
                  meeting count?
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white/80 mb-10 max-w-2xl mx-auto"
                >
                  Start your free trial today. No credit card required.
                  Setup takes less than 2 minutes.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <MagneticButton href="/sign-up">
                    <Button size="lg" className="bg-white text-cyan-600 hover:bg-white/90 px-8 py-6 text-base font-semibold rounded-2xl shadow-xl shadow-black/10">
                      <Rocket className="mr-2 h-5 w-5" />
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </MagneticButton>
                  <Button size="lg" variant="outline" className="border-white/30 bg-white/10 hover:bg-white/20 px-8 py-6 text-base rounded-2xl text-white backdrop-blur-sm">
                    <Headphones className="mr-2 h-5 w-5" />
                    Talk to Sales
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="mt-10 flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm"
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
      <footer className="border-t border-graphite/30 py-16" role="contentinfo">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600">
                  <Video className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-display font-bold text-snow">
                  MeetVerse<span className="text-cyan-400">AI</span>
                </span>
              </Link>
              <p className="text-sm text-slate max-w-xs mb-4">
                AI-powered video conferencing that makes every meeting count. Trusted by 50,000+ teams worldwide.
              </p>
              <div className="flex items-center gap-3">
                {["SOC 2", "GDPR", "HIPAA"].map((badge) => (
                  <span key={badge} className="px-2 py-1 rounded text-xs border border-graphite/40 text-slate">
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
                <h4 className="font-semibold text-snow mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm text-slate hover:text-snow transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-graphite/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate">
              © {new Date().getFullYear()} MeetVerse AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Twitter", "LinkedIn", "GitHub", "YouTube"].map((social) => (
                <Link key={social} href="#" className="text-sm text-slate hover:text-snow transition-colors">
                  {social}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
