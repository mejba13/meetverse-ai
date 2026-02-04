"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Video, ArrowRight, Star, Shield, Zap, Users, Brain, Sparkles, CheckCircle2 } from "lucide-react";
import { SignInForm } from "@/components/auth/sign-in-form";

// ============================================
// ANIMATION VARIANTS
// ============================================
const slideUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
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
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};


// ============================================
// ANIMATED BACKGROUND COMPONENT
// ============================================
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Animated orb - Lime */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
        style={{
          background: "conic-gradient(from 180deg, rgba(202,255,75,0.2), rgba(155,93,229,0.1), transparent, rgba(202,255,75,0.15))",
          filter: "blur(80px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Animated orb - Purple */}
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(155,93,229,0.15) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#CAFF4B]/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.5, 0.2],
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
// TESTIMONIAL DATA
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

export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* ============================================ */}
      {/* LEFT SIDE - IMMERSIVE BRANDING */}
      {/* ============================================ */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <AnimatedBackground />

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
                  className="absolute inset-0 bg-gradient-to-br from-[#CAFF4B] to-[#9B5DE5] rounded-xl blur-xl opacity-40 group-hover:opacity-60"
                  transition={{ duration: 0.3 }}
                />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A] shadow-lg shadow-[#CAFF4B]/20">
                  <Video className="h-6 w-6 text-black" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">
                  MeetVerse<span className="text-[#CAFF4B]">AI</span>
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
            {/* Hero Text */}
            <motion.div variants={slideUp} className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
                Welcome back to
                <br />
                <span className="text-[#CAFF4B]">smarter meetings</span>
              </h1>
              <p className="text-lg text-white/50 max-w-md leading-relaxed">
                Your AI-powered meeting co-pilot is ready to capture every detail and drive action.
              </p>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={slideUp} className="flex gap-8">
              {[
                { value: "50K+", label: "Teams" },
                { value: "99%", label: "Accuracy" },
                { value: "2.5M", label: "Hours saved" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/40">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Testimonial */}
            <motion.div variants={slideUp}>
              <div className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#CAFF4B] text-[#CAFF4B]" />
                  ))}
                </div>
                <blockquote className="text-white/70 text-lg leading-relaxed mb-6">
                  "{testimonials[0].quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#CAFF4B] to-[#9B5DE5] flex items-center justify-center font-semibold text-black">
                    {testimonials[0].avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonials[0].author}</div>
                    <div className="text-sm text-white/40">{testimonials[0].role}, {testimonials[0].company}</div>
                  </div>
                </div>

                {/* Decorative gradient line */}
                <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#CAFF4B]/50 to-transparent" />
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={slideUp} className="flex items-center gap-4">
              {[
                { icon: Shield, label: "SOC 2 Type II" },
                { icon: Zap, label: "99.9% Uptime" },
                { icon: Users, label: "50K+ Teams" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                  <badge.icon className="w-3.5 h-3.5 text-[#CAFF4B]" />
                  <span className="text-xs text-white/50">{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-white/20"
          >
            &copy; {new Date().getFullYear()} MeetVerse AI. All rights reserved.
          </motion.div>
        </div>
      </div>

      {/* ============================================ */}
      {/* RIGHT SIDE - SIGN IN FORM */}
      {/* ============================================ */}
      <div className="flex w-full lg:w-[45%] flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24 relative">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#CAFF4B]/[0.02] via-transparent to-[#9B5DE5]/[0.02]" />

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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A]">
                <Video className="h-5 w-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">
                MeetVerse<span className="text-[#CAFF4B]">AI</span>
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
            <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#CAFF4B]/10 border border-[#CAFF4B]/20 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#CAFF4B]" />
              <span className="text-xs text-[#CAFF4B] font-medium">Welcome back</span>
            </motion.div>
            <motion.h1 variants={slideUp} className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              Sign in to your account
            </motion.h1>
            <motion.p variants={slideUp} className="text-white/40">
              Continue your journey with AI-powered meetings
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SignInForm />
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center text-sm text-white/40"
          >
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-[#CAFF4B] hover:text-[#d8ff7a] transition-colors inline-flex items-center gap-1"
            >
              Create one free
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.p>

          {/* Features List - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:hidden mt-12 pt-8 border-t border-white/[0.06]"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Brain, label: "AI Co-Pilot" },
                { icon: Sparkles, label: "Instant Summaries" },
                { icon: CheckCircle2, label: "Action Items" },
                { icon: Shield, label: "Enterprise Security" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-white/40">
                  <feature.icon className="w-4 h-4 text-[#CAFF4B]" />
                  <span className="text-sm">{feature.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
