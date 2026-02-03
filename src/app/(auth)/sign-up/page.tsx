"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Video, ArrowRight, Shield, Brain, Sparkles, CheckCircle2, Globe, Target, MessageSquare, FileText, Award } from "lucide-react";
import { SignUpForm } from "@/components/auth/sign-up-form";

// ============================================
// ANIMATION VARIANTS
// ============================================
const slideUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

// ============================================
// FLOATING ORBS
// ============================================
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, rgba(20,110,245,0.25), rgba(168,85,247,0.15), rgba(236,72,153,0.1), rgba(20,110,245,0.25))",
          filter: "blur(80px)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(20,110,245,0.1) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-violet-400/50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// FEATURE DATA
// ============================================
const features = [
  {
    icon: Brain,
    title: "AI Meeting Co-Pilot",
    description: "Real-time assistance, smart suggestions, and proactive insights during every meeting.",
    gradient: "from-brand-500 to-blue-600",
  },
  {
    icon: MessageSquare,
    title: "Live Transcription",
    description: "99% accurate speech-to-text in 100+ languages with speaker identification.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Sparkles,
    title: "Instant Summaries",
    description: "AI-generated meeting briefs delivered in seconds, not hours.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Target,
    title: "Action Detection",
    description: "Automatically capture commitments, deadlines, and owners from conversations.",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    icon: FileText,
    title: "Searchable Archive",
    description: "Find any moment from any meeting with semantic search.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption, SSO, and comprehensive audit logs.",
    gradient: "from-slate-500 to-zinc-600",
  },
];

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen bg-ink">
      {/* ============================================ */}
      {/* LEFT SIDE - IMMERSIVE FEATURES SHOWCASE */}
      {/* ============================================ */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-purple-500/15 to-pink-500/20" />

        {/* Floating Orbs */}
        <FloatingOrbs />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-brand-400 to-violet-500 rounded-xl blur-xl opacity-50 group-hover:opacity-80"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 via-violet-500 to-purple-500 shadow-lg shadow-violet-500/30">
                  <Video className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">
                  MeetVerse<span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">AI</span>
                </span>
                <span className="text-[10px] text-white/40 tracking-widest uppercase">Intelligent Meetings</span>
              </div>
            </Link>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-10"
          >
            {/* Hero Text - Bold Sans-Serif */}
            <motion.div variants={slideUp} className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">Free forever plan available</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
                Start your journey with
                <br />
                <span className="bg-gradient-to-r from-brand-300 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  AI-powered meetings
                </span>
              </h1>
              <p className="text-lg text-white/60 max-w-md leading-relaxed">
                Join 50,000+ teams using MeetVerse AI to capture every detail, generate summaries, and drive action.
              </p>
            </motion.div>

            {/* Feature Grid */}
            <motion.div variants={slideUp} className="grid grid-cols-2 gap-4">
              {features.slice(0, 4).map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="group p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-1 text-sm">{feature.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={slideUp} className="flex gap-8 pt-4">
              {[
                { value: "2 min", label: "Setup time" },
                { value: "99%", label: "Accuracy" },
                { value: "100+", label: "Languages" },
                { value: "5h+", label: "Saved/week" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/40">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={slideUp} className="flex items-center gap-3">
              {[
                { icon: Shield, label: "SOC 2" },
                { icon: Globe, label: "GDPR" },
                { icon: CheckCircle2, label: "HIPAA" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <badge.icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-white/60">{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-white/30"
          >
            © {new Date().getFullYear()} MeetVerse AI. All rights reserved.
          </motion.div>
        </div>
      </div>

      {/* ============================================ */}
      {/* RIGHT SIDE - SIGN UP FORM */}
      {/* ============================================ */}
      <div className="flex w-full lg:w-[45%] flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24 relative">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:hidden mb-10"
          >
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 via-violet-500 to-purple-500">
                <Video className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                MeetVerse<span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">AI</span>
              </span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-8"
          >
            <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs text-violet-400 font-medium">Start free today</span>
            </motion.div>
            <motion.h1 variants={slideUp} className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              Create your account
            </motion.h1>
            <motion.p variants={slideUp} className="text-white/50">
              Get started with AI-powered meetings in minutes
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SignUpForm />
          </motion.div>

          {/* Sign In Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center text-sm text-white/50"
          >
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1"
            >
              Sign in
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.p>

          {/* Features List - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:hidden mt-12 pt-8 border-t border-white/10"
          >
            <p className="text-sm text-white/60 mb-4">What you'll get:</p>
            <div className="space-y-3">
              {[
                "AI-powered transcription in 100+ languages",
                "Instant meeting summaries",
                "Automatic action item detection",
                "Calendar integrations",
                "Enterprise-grade security",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-white/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trust Signal - Mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="lg:hidden mt-8 flex items-center justify-center gap-4"
          >
            {["SOC 2", "GDPR", "HIPAA"].map((badge, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs border border-white/10 text-white/40">
                {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
