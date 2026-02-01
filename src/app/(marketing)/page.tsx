"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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
  Layers,
  Target,
  TrendingUp,
  Clock,
  Globe,
  Award,
  Flame,
  BadgeCheck,
  Rocket,
  Timer,
  Activity,
  Menu,
  X,
} from "lucide-react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

// Live activity simulation
const recentSignups = [
  { name: "Sarah from Google", time: "just now", avatar: "SG" },
  { name: "Team at Stripe", time: "2 min ago", avatar: "TS" },
  { name: "Michael from Meta", time: "5 min ago", avatar: "MM" },
  { name: "Enterprise deal closed", time: "12 min ago", avatar: "ED" },
  { name: "Alex from Shopify", time: "18 min ago", avatar: "AS" },
];

// Counter animation hook
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

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Adjusted parallax - slower fade for better visibility
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live activity notification
  const [currentNotification, setCurrentNotification] = useState(0);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNotification(false);
      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % recentSignups.length);
        setShowNotification(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Live stats counters
  const meetingsCounter = useCounter(847);
  const usersCounter = useCounter(2847);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen bg-ink text-snow overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_20%,rgba(6,182,212,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_80%,rgba(8,51,68,0.4),transparent)]" />

        <motion.div
          className="absolute top-1/4 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px md:100px md:100px",
          }}
        />
      </div>

      {/* Live Activity Notification - Responsive positioning */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:bottom-6 z-50"
          >
            <div className="flex items-center gap-3 rounded-full bg-charcoal/80 backdrop-blur-xl border border-graphite px-4 py-3 shadow-2xl max-w-[320px] mx-auto sm:mx-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-success to-success-600 flex items-center justify-center text-xs sm:text-sm font-bold text-white flex-shrink-0">
                {recentSignups[currentNotification].avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate text-snow">{recentSignups[currentNotification].name}</p>
                <p className="text-xs text-silver">signed up {recentSignups[currentNotification].time}</p>
              </div>
              <Activity className="w-4 h-4 text-green-400 animate-pulse flex-shrink-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - Fully Responsive */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between rounded-2xl border border-graphite bg-charcoal/60 backdrop-blur-xl px-4 sm:px-6 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70">
                  <Video className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight">
                MeetVerse<span className="text-primary">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
              {["Features", "Pricing", "Customers", "Enterprise"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm text-silver hover:text-snow transition-colors rounded-lg hover:bg-graphite/50"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Live Users Indicator */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-xs text-success font-medium">2,847 online</span>
              </div>

              <Link href="/sign-in" className="px-4 py-2 text-sm text-pearl hover:text-snow transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
                  Start Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-graphite/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden mt-2 rounded-2xl border border-graphite bg-charcoal/90 backdrop-blur-xl overflow-hidden"
              >
                <nav className="p-4 space-y-2">
                  {["Features", "Pricing", "Customers", "Enterprise"].map((item) => (
                    <Link
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-base text-pearl hover:text-snow hover:bg-graphite/50 rounded-xl transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-graphite space-y-3">
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-center text-pearl hover:text-snow hover:bg-graphite/50 rounded-xl transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)} className="block">
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 py-3">
                        Start Free
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

      <main role="main">
        {/* Hero Section - Responsive */}
        <section
          ref={heroRef}
          aria-label="Hero - AI Meeting Platform Introduction"
          className="relative min-h-screen flex items-center justify-center pt-28 sm:pt-32 pb-16 sm:pb-20"
        >
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col items-center text-center">
              {/* Urgency Badge - Responsive text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 sm:px-5 py-2 text-xs sm:text-sm mb-4 backdrop-blur-sm"
              >
                <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400 flex-shrink-0" />
                <span className="text-orange-200 font-medium">Limited Time: 3 months free</span>
                <Timer className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400 flex-shrink-0 hidden sm:block" />
              </motion.div>

              {/* Product Hunt & Awards - Responsive stacking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8"
              >
                <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#ff6154]/10 border border-[#ff6154]/30">
                  <span className="text-[#ff6154] font-bold text-sm">#1</span>
                  <span className="text-white/80 text-xs sm:text-sm">Product of the Day</span>
                </div>
                <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                  <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                  <span className="text-white/80 text-xs sm:text-sm">G2 Leader 2024</span>
                </div>
                <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/30">
                  <BadgeCheck className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span className="text-white/80 text-xs sm:text-sm">4.9/5 Capterra</span>
                </div>
              </motion.div>

              {/* Main Heading - Responsive sizing */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] sm:leading-[0.9]"
              >
                <span className="block text-snow">The #1 AI Meeting</span>
                <span className="relative inline-block mt-1 sm:mt-2">
                  <span className="relative z-10 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                    Platform for Teams
                  </span>
                  <motion.span
                    className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-cyan-500/15 to-cyan-500/10 blur-2xl"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </span>
              </motion.h1>

              {/* Social Proof Counter - Responsive */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-5 sm:mt-6 flex items-center gap-3"
              >
                <div className="flex -space-x-2 sm:-space-x-3">
                  {["bg-cyan-500", "bg-cyan-600", "bg-cyan-700", "bg-cyan-400", "bg-cyan-500"].map((bg, i) => (
                    <div key={i} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${bg} border-2 border-ink flex items-center justify-center text-[10px] sm:text-xs font-bold text-white`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-base sm:text-lg font-bold text-snow">50,000+ teams</div>
                  <div className="text-xs sm:text-sm text-silver">already switched to MeetVerse</div>
                </div>
              </motion.div>

              {/* Subheading - Responsive */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl text-silver leading-relaxed px-2"
              >
                Join <span className="text-snow font-semibold">Google, Stripe, and Shopify</span> in
                transforming meetings with AI transcription, instant summaries, and smart action items.
                <span className="text-cyan-400 font-medium"> Save 5+ hours every week.</span>
              </motion.p>

              {/* CTA Buttons - Responsive */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
              >
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto group relative overflow-hidden bg-snow text-ink hover:bg-pearl px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-xl shadow-2xl shadow-snow/10">
                    <span className="relative z-10 flex items-center justify-center">
                      <Rocket className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Start Free — No Credit Card
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto group border-graphite bg-charcoal/50 hover:bg-graphite/50 backdrop-blur-sm px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl text-snow"
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  Watch 2-Min Demo
                </Button>
              </motion.div>

              {/* Trust Signals - Responsive grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl w-full"
              >
                {[
                  { icon: Clock, text: "Setup in 2 min" },
                  { icon: Shield, text: "SOC 2 Type II" },
                  { icon: Zap, text: "99.9% Uptime" },
                  { icon: Globe, text: "100+ Languages" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-center gap-2 text-slate">
                    <item.icon className="h-3 w-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{item.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* Hero Visual - Responsive with simplified mobile view */}
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="mt-12 sm:mt-16 w-full max-w-6xl"
              >
                <div className="relative">
                  <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-cyan-500/30 via-cyan-600/20 to-cyan-700/20 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl" />

                  <div className="relative rounded-xl sm:rounded-2xl border border-graphite bg-gradient-to-b from-charcoal/80 to-charcoal/60 backdrop-blur-xl p-1.5 sm:p-2 shadow-2xl">
                    <div className="rounded-lg sm:rounded-xl bg-ink/90 overflow-hidden">
                      {/* Window Controls */}
                      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-graphite bg-ink/60">
                        <div className="flex gap-1 sm:gap-1.5">
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-error/80" />
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-warning/80" />
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-success/80" />
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-error"></span>
                          </span>
                          <span className="text-[10px] sm:text-xs text-silver">Recording • 00:32:15</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-xs text-slate">
                          <Users className="w-3 h-3" />
                          <span>12 participants</span>
                        </div>
                      </div>

                      {/* Video Grid - Responsive */}
                      <div className="aspect-[16/10] sm:aspect-video relative bg-gradient-to-br from-ink to-charcoal p-3 sm:p-6">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-4 w-full max-w-3xl">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.3 + i * 0.1 }}
                                className={`aspect-video sm:aspect-video bg-gradient-to-br from-cyan-500/15 to-cyan-700/10 border border-graphite rounded-lg flex items-center justify-center overflow-hidden relative ${
                                  i > 4 ? "hidden sm:flex" : ""
                                }`}
                              >
                                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-semibold text-xs sm:text-base">
                                  {String.fromCharCode(64 + i)}
                                </div>
                                {i === 1 && (
                                  <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 px-1.5 sm:px-2 py-0.5 rounded bg-success/20 text-success text-[8px] sm:text-[10px] flex items-center gap-0.5 sm:gap-1">
                                    <Mic className="w-1.5 h-1.5 sm:w-2 sm:h-2" />
                                    Speaking
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* AI Panel - Hidden on mobile, visible on lg+ */}
                        <motion.div
                          initial={{ x: 100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 2, duration: 0.6 }}
                          className="absolute right-2 sm:right-4 top-2 sm:top-4 bottom-2 sm:bottom-4 w-48 sm:w-56 md:w-64 lg:w-72 rounded-lg sm:rounded-xl bg-ink/80 backdrop-blur-xl border border-graphite p-2 sm:p-3 md:p-4 overflow-hidden hidden md:block"
                        >
                          <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                              <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <span className="font-semibold text-xs sm:text-sm text-snow">AI Co-Pilot</span>
                            <motion.div
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success"
                            />
                          </div>

                          {/* Live Transcription */}
                          <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-500"
                              />
                              <span className="text-[10px] sm:text-xs text-cyan-400">Live Transcribing</span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-silver line-clamp-2">"...and that's why we should prioritize the Q2 roadmap..."</p>
                          </div>

                          <div className="space-y-1.5 sm:space-y-2">
                            {[
                              { icon: Target, text: "Action item detected", color: "text-warning bg-warning/10" },
                              { icon: CheckCircle2, text: "Decision captured", color: "text-success bg-success/10" },
                              { icon: Sparkles, text: "Key insight found", color: "text-info bg-info/10" },
                            ].map((item, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 2.3 + i * 0.2 }}
                                className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs p-1.5 sm:p-2 rounded-lg ${item.color}`}
                              >
                                <item.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                                <span className="truncate">{item.text}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Control Bar - Responsive */}
                        <motion.div
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.8 }}
                          className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 bg-ink/80 backdrop-blur-xl rounded-full px-3 sm:px-6 py-2 sm:py-3 border border-graphite"
                        >
                          {[Mic, Video, Users, MessageSquare].map((Icon, i) => (
                            <button key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-graphite hover:bg-steel flex items-center justify-center transition-colors">
                              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-pearl" />
                            </button>
                          ))}
                          <div className="w-px h-4 sm:h-6 bg-graphite mx-1 sm:mx-2" />
                          <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-error hover:bg-error-600 text-white text-xs sm:text-sm font-medium transition-colors">
                            End
                          </button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll Indicator - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-graphite flex items-start justify-center p-1.5"
            >
              <motion.div
                animate={{ height: ["20%", "40%", "20%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 bg-slate rounded-full"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Logos Section - Responsive */}
        <section aria-label="Trusted by leading companies" className="py-12 sm:py-16 border-y border-graphite/50">
          <div className="container max-w-7xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-6 sm:mb-8"
            >
              <p className="text-xs sm:text-sm text-slate mb-1 sm:mb-2">TRUSTED BY 50,000+ TEAMS WORLDWIDE</p>
              <p className="text-[10px] sm:text-xs text-steel">From startups to Fortune 500 companies</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 md:gap-x-16 gap-y-4 sm:gap-y-6 md:gap-y-8"
            >
              {[
                { name: "Google", highlight: true },
                { name: "Microsoft", highlight: false },
                { name: "Stripe", highlight: true },
                { name: "Shopify", highlight: false },
                { name: "Airbnb", highlight: true },
                { name: "Notion", highlight: false },
              ].map((company, i) => (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`text-lg sm:text-xl md:text-2xl font-bold transition-colors cursor-default ${
                    company.highlight ? "text-slate hover:text-silver" : "text-steel hover:text-slate"
                  }`}
                >
                  {company.name}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why Teams Are Switching Section - Responsive */}
        <section aria-label="Benefits and statistics" className="py-16 sm:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
          <div className="container max-w-7xl px-4 sm:px-6 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-10 sm:mb-16"
            >
              <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-cyan-400 mb-3 sm:mb-4">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                WHY TEAMS ARE SWITCHING
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 text-snow">
                The meetings revolution is here
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-base sm:text-lg text-silver max-w-2xl mx-auto px-4">
                Teams waste 31 hours per month in unproductive meetings. MeetVerse AI changes that.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
            >
              {[
                {
                  stat: "73%",
                  label: "Less time on notes",
                  description: "AI captures everything so you can focus on the conversation",
                  color: "from-cyan-400 to-cyan-600",
                },
                {
                  stat: "5h",
                  label: "Saved per week",
                  description: "Average time saved by teams using MeetVerse AI",
                  color: "from-cyan-500 to-cyan-700",
                },
                {
                  stat: "2x",
                  label: "More action items completed",
                  description: "Automatic tracking ensures nothing falls through the cracks",
                  color: "from-warning to-error",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="relative group"
                >
                  <div className="relative rounded-2xl sm:rounded-3xl border border-graphite bg-charcoal/50 p-6 sm:p-8 hover:border-graphite transition-all overflow-hidden">
                    <div className={`absolute -top-16 sm:-top-20 -right-16 sm:-right-20 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-gradient-to-br ${item.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                    <div className={`text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-2`}>
                      {item.stat}
                    </div>
                    <div className="text-lg sm:text-xl font-semibold mb-2 text-snow">{item.label}</div>
                    <p className="text-sm sm:text-base text-silver">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section - Responsive Bento Grid */}
        <section id="features" aria-labelledby="features-heading" className="py-20 sm:py-32">
          <div className="container max-w-7xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-12 sm:mb-20"
            >
              <motion.span variants={fadeInUp} className="inline-block text-xs sm:text-sm font-medium text-cyan-400 mb-3 sm:mb-4">
                POWERFUL FEATURES
              </motion.span>
              <motion.h2 id="features-heading" variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-snow">
                Everything you need for
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                  intelligent meetings
                </span>
              </motion.h2>
            </motion.div>

            {/* Bento Grid - Responsive */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
            >
              {/* Large Feature Card - AI Co-Pilot */}
              <motion.div variants={fadeInUp} className="md:col-span-2 lg:col-span-2 lg:row-span-2 group">
                <div className="relative h-full rounded-2xl sm:rounded-3xl border border-graphite bg-gradient-to-br from-cyan-500/10 to-cyan-700/5 p-5 sm:p-8 overflow-hidden hover:border-cyan-500/30 transition-colors min-h-[300px] sm:min-h-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600">
                        <Brain className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="px-2 sm:px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-[10px] sm:text-xs font-medium">
                        Most Popular Feature
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-snow">AI Meeting Co-Pilot</h3>
                    <p className="text-sm sm:text-base md:text-lg text-silver mb-6 sm:mb-8 max-w-lg">
                      Your intelligent assistant that listens, understands, and helps in real-time.
                      Get instant answers, smart suggestions, and proactive insights.
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {[
                        { icon: MessageSquare, label: "Real-time Q&A" },
                        { icon: Target, label: "Smart Suggestions" },
                        { icon: Layers, label: "Knowledge Search" },
                        { icon: TrendingUp, label: "Meeting Analytics" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 sm:gap-3 text-pearl">
                          <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Decorative Element - Hidden on mobile */}
                  <div className="absolute right-2 sm:right-4 bottom-2 sm:bottom-4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 hidden sm:block">
                    <motion.div
                      className="absolute inset-0 sm:border border-cyan-500/20 bg-cyan-500/5 rounded-lg"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute inset-3 sm:inset-4 border border-cyan-600/20 bg-cyan-600/5 rounded-lg"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-10 h-10 sm:w-16 sm:h-16 text-cyan-500/30" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Feature Cards - Responsive */}
              {[
                {
                  icon: MessageSquare,
                  title: "Live Transcription",
                  description: "99% accurate speech-to-text in 100+ languages with speaker identification",
                  gradient: "from-info to-cyan-500",
                  badge: "Enterprise Ready",
                },
                {
                  icon: Sparkles,
                  title: "Smart Summaries",
                  description: "AI-generated meeting briefs in executive, detailed, or action-focused formats",
                  gradient: "from-warning to-error",
                  badge: "Saves 5+ hrs/week",
                },
                {
                  icon: Zap,
                  title: "Action Detection",
                  description: "Automatically capture commitments, deadlines, and owners from conversations",
                  gradient: "from-success to-success-600",
                  badge: "98% Accuracy",
                },
                {
                  icon: Video,
                  title: "4K Video",
                  description: "Crystal-clear video with adaptive bitrate supporting 200 participants",
                  gradient: "from-cyan-500 to-cyan-600",
                  badge: null,
                },
              ].map((feature, i) => (
                <motion.div key={i} variants={fadeInUp} className="group">
                  <div className="relative h-full rounded-2xl sm:rounded-3xl border border-graphite bg-charcoal/50 p-4 sm:p-6 overflow-hidden hover:border-graphite transition-all hover:bg-charcoal/70">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                        <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      {feature.badge && (
                        <span className="px-2 py-1 rounded-full bg-graphite text-silver text-[9px] sm:text-[10px] font-medium">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 text-snow">{feature.title}</h3>
                    <p className="text-silver text-xs sm:text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}

              {/* Security Card - Responsive */}
              <motion.div variants={fadeInUp} className="md:col-span-2 lg:col-span-2 group">
                <div className="relative h-full rounded-2xl sm:rounded-3xl border border-graphite bg-gradient-to-r from-success/10 to-cyan-700/10 p-5 sm:p-8 overflow-hidden hover:border-success/30 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-success to-success-600 flex-shrink-0">
                      <Shield className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2 text-snow">Enterprise-Grade Security</h3>
                      <p className="text-sm sm:text-base text-silver">
                        End-to-end encryption, SSO, and comprehensive audit logs. Your data stays protected.
                      </p>
                    </div>
                    <div className="flex gap-2 sm:gap-3 flex-wrap">
                      {["SOC 2", "GDPR", "HIPAA", "ISO 27001"].map((badge) => (
                        <span key={badge} className="px-2 sm:px-3 py-1 rounded-full border border-success/30 bg-success/10 text-success text-xs sm:text-sm font-medium">
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

        {/* Live Stats Section - Responsive */}
        <section aria-label="Platform statistics" className="py-16 sm:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent" />
          <div className="container max-w-7xl px-4 sm:px-6 relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              onViewportEnter={() => {
                meetingsCounter.startAnimation();
                usersCounter.startAnimation();
              }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-success/10 border border-success/20 mb-4 sm:mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-xs sm:text-sm text-success">Live Platform Statistics</span>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
            >
              {[
                { value: "99.99%", label: "Uptime SLA", suffix: "", live: false },
                { value: "50,000", label: "Active Teams", suffix: "+", live: false },
                { value: "10", label: "Meetings Hosted", suffix: "M+", live: false },
                { value: "4.9", label: "Customer Rating", suffix: "/5", live: false },
              ].map((stat, i) => (
                <motion.div key={i} variants={scaleIn} className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-snow to-silver bg-clip-text text-transparent">
                    {stat.value}<span className="text-cyan-400">{stat.suffix}</span>
                  </div>
                  <div className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-slate flex items-center justify-center gap-2">
                    {stat.live && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                      </span>
                    )}
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section - Responsive */}
        <section id="customers" aria-labelledby="testimonials-heading" className="py-20 sm:py-32">
          <div className="container max-w-7xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-10 sm:mb-16"
            >
              <motion.span variants={fadeInUp} className="inline-block text-xs sm:text-sm font-medium text-cyan-400 mb-3 sm:mb-4">
                CUSTOMER LOVE
              </motion.span>
              <motion.h2 id="testimonials-heading" variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 text-snow">
                Join 50,000+ happy teams
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-base sm:text-lg text-silver">
                See why teams at Google, Stripe, and Shopify trust MeetVerse AI
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
              role="list"
              aria-label="Customer testimonials"
            >
              {[
                {
                  quote: "MeetVerse AI has completely transformed how our engineering team collaborates. The AI summaries save us 10+ hours every week. It's not optional anymore — it's essential.",
                  author: "Sarah Chen",
                  role: "VP of Engineering",
                  company: "Google",
                  avatar: "SC",
                  companyLogo: "G",
                },
                {
                  quote: "We evaluated 12 different solutions. MeetVerse was the clear winner — the transcription accuracy is unmatched, and the action item detection actually works.",
                  author: "Michael Roberts",
                  role: "Product Director",
                  company: "Stripe",
                  avatar: "MR",
                  companyLogo: "S",
                },
                {
                  quote: "After switching to MeetVerse, our meeting follow-through improved by 80%. Nothing falls through the cracks anymore. Our entire company runs on it now.",
                  author: "Emily Watson",
                  role: "COO",
                  company: "Shopify",
                  avatar: "EW",
                  companyLogo: "SH",
                },
              ].map((testimonial, i) => (
                <motion.div key={i} variants={fadeInUp} className="group">
                  <div className="relative h-full rounded-2xl sm:rounded-3xl border border-graphite bg-charcoal/50 p-5 sm:p-8 hover:border-cyan-500/30 transition-all hover:bg-charcoal/70">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex gap-0.5 sm:gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 sm:w-5 sm:h-5 fill-warning text-warning" />
                        ))}
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-graphite flex items-center justify-center font-bold text-silver text-sm sm:text-base">
                        {testimonial.companyLogo}
                      </div>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-pearl mb-6 sm:mb-8 leading-relaxed">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center font-semibold text-sm sm:text-base text-white">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base text-snow">
                          {testimonial.author}
                          <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-info" />
                        </div>
                        <div className="text-xs sm:text-sm text-slate">{testimonial.role}, {testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* More Testimonials CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 sm:mt-12 text-center"
            >
              <Button variant="outline" className="border-graphite hover:bg-graphite/50 text-sm sm:text-base text-pearl">
                Read more customer stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section - Responsive */}
        <section id="pricing" aria-labelledby="pricing-heading" className="py-20 sm:py-32">
          <div className="container max-w-7xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-10 sm:mb-16"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-warning/10 border border-warning/30 mb-4 sm:mb-6">
                <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
                <span className="text-xs sm:text-sm text-warning">Limited time: 3 months free on annual plans</span>
              </motion.div>
              <motion.h2 id="pricing-heading" variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 text-snow">
                Start free, scale as you grow
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-base sm:text-lg text-silver max-w-2xl mx-auto">
                No credit card required. Start with our free plan and upgrade when you're ready.
              </motion.p>
            </motion.div>

            {/* Pricing Grid - Responsive: 1 col mobile, 2 col tablet, 4 col desktop */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto"
            >
              {[
                {
                  name: "Free",
                  price: "$0",
                  period: "",
                  description: "Perfect for trying out",
                  features: ["45-min meetings", "3 participants", "Basic transcription", "5 recordings/mo"],
                  cta: "Get Started",
                  highlighted: false,
                },
                {
                  name: "Pro",
                  price: "$19",
                  period: "/user/mo",
                  description: "For professionals",
                  features: ["Unlimited meetings", "50 participants", "Full AI suite", "Unlimited recordings", "Calendar sync"],
                  cta: "Start Free Trial",
                  highlighted: true,
                  badge: "Most Popular",
                },
                {
                  name: "Business",
                  price: "$39",
                  period: "/user/mo",
                  description: "For growing teams",
                  features: ["Everything in Pro", "200 participants", "Admin dashboard", "SSO & analytics", "Priority support"],
                  cta: "Start Free Trial",
                  highlighted: false,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "",
                  description: "For large orgs",
                  features: ["Everything in Business", "Unlimited participants", "Dedicated support", "Custom integrations", "On-premise option"],
                  cta: "Contact Sales",
                  highlighted: false,
                },
              ].map((plan, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className={`relative group ${plan.highlighted ? "sm:scale-105 sm:z-10" : ""}`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-xs sm:text-sm font-medium z-10 whitespace-nowrap text-white">
                      {plan.badge}
                    </div>
                  )}
                  <div className={`relative h-full rounded-2xl sm:rounded-3xl border p-5 sm:p-6 transition-all ${
                    plan.highlighted
                      ? "border-cyan-500/50 bg-gradient-to-b from-cyan-500/20 to-cyan-700/10 shadow-2xl shadow-cyan-500/20"
                      : "border-graphite bg-charcoal/50 hover:border-graphite"
                  }`}>
                    <div className="text-base sm:text-lg font-semibold mb-1 text-snow">{plan.name}</div>
                    <div className="text-xs sm:text-sm text-slate mb-3 sm:mb-4">{plan.description}</div>
                    <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
                      <span className="text-3xl sm:text-4xl font-bold text-snow">{plan.price}</span>
                      {plan.period && <span className="text-slate text-sm">{plan.period}</span>}
                    </div>
                    <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-pearl">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/sign-up" className="block">
                      <Button
                        className={`w-full py-2.5 sm:py-3 text-sm ${
                          plan.highlighted
                            ? "bg-snow text-ink hover:bg-pearl"
                            : "bg-graphite hover:bg-steel text-pearl"
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Money Back Guarantee - Responsive */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 sm:mt-12 text-center"
            >
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-success/10 border border-success/20">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                <span className="text-xs sm:text-sm text-success">30-day money-back guarantee • No questions asked</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section - Responsive */}
        <section aria-label="Get started with MeetVerse AI" className="py-16 sm:py-32">
          <div className="container max-w-7xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)]" />
              <motion.div
                className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 rounded-full bg-white/10 blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
              />

              <div className="relative px-5 py-12 sm:px-16 sm:py-24 text-center">
                {/* Urgency Banner */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 mb-6 sm:mb-8"
                >
                  <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-warning" />
                  <span className="text-xs sm:text-sm font-medium text-white">Limited time: Get 3 months free</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white"
                >
                  Join 50,000+ teams already
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>transforming their meetings
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-sm sm:text-base md:text-lg text-white/80 mb-8 sm:mb-10 max-w-2xl mx-auto"
                >
                  Start your free trial today. No credit card required.
                  Setup takes less than 2 minutes.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
                >
                  <Link href="/sign-up" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-cyan-600 hover:bg-white/90 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-xl shadow-xl">
                      <Rocket className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 bg-white/10 hover:bg-white/20 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl text-white">
                    Talk to Sales
                  </Button>
                </motion.div>

                {/* Social Proof - Responsive */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-white/70 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    Free forever plan
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    No credit card
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    Cancel anytime
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer - Responsive */}
      <footer role="contentinfo" aria-label="Site footer" className="border-t border-graphite py-10 sm:py-16">
        <div className="container max-w-7xl px-4 sm:px-6">
          {/* Footer Grid - Responsive columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Brand Column - Full width on mobile */}
            <div className="col-span-2 sm:col-span-3 md:col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600">
                  <Video className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-snow">MeetVerse<span className="text-cyan-400">AI</span></span>
              </Link>
              <p className="text-xs sm:text-sm text-slate max-w-xs mb-3 sm:mb-4">
                AI-powered video conferencing that makes every meeting count. Trusted by 50,000+ teams worldwide.
              </p>
              <div className="flex items-center gap-2 sm:gap-3">
                {["SOC 2", "GDPR"].map((badge) => (
                  <span key={badge} className="px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs border border-graphite text-slate">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Link Columns */}
            {[
              { title: "Product", links: ["Features", "Pricing", "Security", "Enterprise", "Integrations"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press", "Partners"] },
              { title: "Resources", links: ["Documentation", "Help Center", "API", "Status", "Webinars"] },
              { title: "Legal", links: ["Privacy", "Terms", "Cookies", "Licenses", "GDPR"] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-snow">{section.title}</h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-xs sm:text-sm text-slate hover:text-snow transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Bottom - Responsive */}
          <div className="pt-6 sm:pt-8 border-t border-graphite flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-slate order-2 sm:order-1">
              © {new Date().getFullYear()} MeetVerse AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 order-1 sm:order-2">
              {["Twitter", "LinkedIn", "GitHub", "YouTube"].map((social) => (
                <Link key={social} href="#" className="text-xs sm:text-sm text-slate hover:text-snow transition-colors">
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
