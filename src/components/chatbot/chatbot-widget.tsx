"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Bot,
  Zap,
  ArrowRight,
  MessageSquare,
  Shield,
  DollarSign,
  Rocket,
  Brain,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================
interface Message {
  id: string;
  role: "ai" | "user";
  text: string;
  cta?: { label: string; target: string };
}

// ============================================
// MOCK AI RESPONSE SYSTEM — Conversion-optimized, SEO-rich
// ============================================
const intentMap: Record<string, string[]> = {
  pricing: ["price", "cost", "plan", "free", "pay", "subscription", "billing", "upgrade", "tier"],
  features: ["feature", "transcription", "summary", "ai", "copilot", "record", "note", "caption"],
  demo: ["demo", "trial", "try", "test", "show", "start", "begin", "signup", "sign up"],
  security: ["security", "encrypt", "soc", "gdpr", "hipaa", "compliance", "private", "safe", "protect"],
  integrations: ["integrat", "slack", "notion", "calendar", "connect", "zoom", "teams", "jira", "tool"],
  compare: ["compare", "versus", "vs", "better", "alternative", "competitor", "otter", "fireflies"],
  support: ["help", "support", "contact", "issue", "problem", "bug", "question"],
};

const intentResponses: Record<string, { text: string; cta: { label: string; target: string } }> = {
  pricing: {
    text: "Great question! MeetVerse AI offers flexible pricing:\n\n**Starter** — Free forever, 5 meetings/mo\n**Pro** — $29/mo, unlimited AI-powered meetings\n**Enterprise** — Custom pricing with SSO & HIPAA\n\nAll paid plans include a 14-day free trial with no credit card required.",
    cta: { label: "Compare Plans", target: "#pricing" },
  },
  features: {
    text: "MeetVerse AI is packed with intelligent features:\n\n**Real-time transcription** in 100+ languages\n**AI meeting summaries** generated in seconds\n**Smart action detection** with 98% accuracy\n**AI Co-Pilot** for live Q&A during meetings\n**4K video** supporting 200+ participants\n\nThousands of teams save 5+ hours per week with these tools.",
    cta: { label: "Explore Features", target: "#features" },
  },
  demo: {
    text: "You can get started in under 2 minutes! Sign up for a free account and instantly access all Pro features for 14 days — no credit card needed.\n\nExperience real-time AI transcription, automated summaries, and smart action items firsthand.",
    cta: { label: "Start Free Trial", target: "/sign-up" },
  },
  security: {
    text: "Security is built into everything we do:\n\n**SOC 2 Type II** certified\n**HIPAA** compliant for healthcare\n**GDPR** ready for EU compliance\n**End-to-end encryption** on all meetings\n**SSO/SAML** enterprise authentication\n\nYour meeting data is protected by enterprise-grade security at every layer.",
    cta: { label: "Learn About Security", target: "#features" },
  },
  integrations: {
    text: "MeetVerse AI connects with 50+ tools your team already uses:\n\n**Slack** — Get summaries in your channels\n**Notion** — Auto-sync meeting notes\n**Jira** — Create tickets from action items\n**Google Calendar** — Seamless scheduling\n**Salesforce** — Auto-log call notes to CRM\n\nAction items flow directly into your workflow.",
    cta: { label: "See Integrations", target: "#features" },
  },
  compare: {
    text: "Teams switch to MeetVerse AI for key advantages:\n\n**50% more accurate** transcription than alternatives\n**Real-time AI Co-Pilot** — not just post-meeting notes\n**200+ participant** support with 4K video\n**98% action item accuracy** vs industry avg of 70%\n\nJoin 50,000+ teams who made the switch.",
    cta: { label: "Start Free Trial", target: "/sign-up" },
  },
  support: {
    text: "We're here to help! You can reach our team through:\n\n**Live chat** — Available during business hours\n**Email** — support@meetverse.ai\n**Help Center** — Comprehensive guides & FAQs\n**Priority support** on Pro & Enterprise plans\n\nAverage response time under 2 hours.",
    cta: { label: "Get Started", target: "/sign-up" },
  },
  general: {
    text: "Welcome! I'm the MeetVerse AI assistant. We're the #1 AI-powered meeting platform trusted by **50,000+ teams** worldwide.\n\nI can help you with:\n- Pricing & plans\n- Feature details\n- Security & compliance\n- Integrations & setup\n\nWhat would you like to know?",
    cta: { label: "Start Free Trial", target: "/sign-up" },
  },
};

function detectIntent(input: string): string {
  const lower = input.toLowerCase();
  for (const [intent, keywords] of Object.entries(intentMap)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return intent;
    }
  }
  return "general";
}

// ============================================
// QUICK ACTIONS — with icons for visual punch
// ============================================
const quickActions = [
  { label: "Pricing & Plans", target: "#pricing", icon: DollarSign },
  { label: "Start Free Trial", target: "/sign-up", icon: Rocket },
  { label: "Key Features", target: "#features", icon: Zap },
  { label: "How It Works", target: "#how-it-works", icon: Brain },
  { label: "Security", target: "#features", icon: Shield },
];

// ============================================
// ANIMATION CONFIG
// ============================================
const smoothEase = [0.22, 1, 0.36, 1] as const;

const windowVariants = {
  hidden: {
    scale: 0.8,
    y: 60,
    opacity: 0,
    filter: "blur(8px)",
  },
  visible: {
    scale: 1,
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: smoothEase },
  },
  exit: {
    scale: 0.85,
    y: 40,
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: smoothEase },
  },
};

const messageVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: smoothEase },
  },
};

// ============================================
// FORMAT AI TEXT — render bold markdown
// ============================================
function FormatText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={i} className="block">
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <span key={j} className="font-semibold text-white/90">
                    {part.slice(2, -2)}
                  </span>
                );
              }
              return <span key={j}>{part}</span>;
            })}
          </span>
        );
      })}
    </>
  );
}

// ============================================
// TYPING INDICATOR — premium animated dots
// ============================================
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-3 px-5"
    >
      <div className="relative flex-shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-lime/20 to-purple/20 border border-lime/10 flex items-center justify-center">
          <Bot className="w-4 h-4 text-lime" />
        </div>
      </div>
      <div className="px-4 py-3.5 rounded-2xl rounded-tl-md bg-white/[0.02] border border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-br from-lime to-lime/60"
              animate={{
                y: [0, -6, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// CHATBOT WIDGET — Premium Redesign
// ============================================
export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Tooltip auto-show after 5s, auto-dismiss after 5s
  useEffect(() => {
    if (hasOpened) return;
    const showTimer = setTimeout(() => setShowTooltip(true), 5000);
    return () => clearTimeout(showTimer);
  }, [hasOpened]);

  useEffect(() => {
    if (!showTooltip) return;
    const dismissTimer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(dismissTimer);
  }, [showTooltip]);

  // Welcome messages on first open
  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
      setShowTooltip(false);
      setMessages([
        {
          id: "welcome-1",
          role: "ai",
          text: "Hey! I'm the MeetVerse AI assistant — here to help you discover how AI can transform your meetings.",
        },
        {
          id: "welcome-2",
          role: "ai",
          text: "Ask me anything about our features, pricing, security, or integrations. Or tap a quick action below to get started!",
        },
      ]);
    }
  }, [isOpen, hasOpened]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 450);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Send message handler
  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const intent = detectIntent(trimmed);
    const delay = 900 + Math.random() * 600;

    setTimeout(() => {
      setIsTyping(false);
      const response = intentResponses[intent];
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: response.text,
          cta: response.cta,
        },
      ]);
    }, delay);
  }, [inputValue, isTyping]);

  // Quick action handler
  const handleQuickAction = useCallback((target: string) => {
    if (target.startsWith("#")) {
      setIsOpen(false);
      setTimeout(() => {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 350);
    } else {
      window.location.href = target;
    }
  }, []);

  return (
    <>
      {/* ============================================ */}
      {/* FAB BUTTON — Dramatic floating action button */}
      {/* ============================================ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            transition={{ duration: 0.4, ease: smoothEase }}
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50"
          >
            {/* Tooltip bubble */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: smoothEase }}
                  className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap"
                >
                  <div className="relative px-5 py-3 rounded-2xl bg-ink/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-lime/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-lime/15 flex items-center justify-center">
                        <MessageSquare className="w-3.5 h-3.5 text-lime" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          Need help?
                        </p>
                        <p className="text-[11px] text-white/40">
                          Ask our AI assistant anything
                        </p>
                      </div>
                    </div>
                    {/* Arrow */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[5px] w-2.5 h-2.5 rotate-45 bg-ink/95 border-r border-t border-white/[0.08]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pulse rings behind button */}
            <div className="absolute inset-0 -m-2">
              <motion.div
                className="absolute inset-0 rounded-full bg-lime/20"
                animate={{
                  scale: [1, 1.8, 1.8],
                  opacity: [0.4, 0, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-purple/15"
                animate={{
                  scale: [1, 2, 2],
                  opacity: [0.3, 0, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.4,
                }}
              />
            </div>

            {/* Main button */}
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{
                scale: 1.12,
                boxShadow:
                  "0 0 50px rgba(202,255,75,0.4), 0 0 100px rgba(155,93,229,0.2)",
              }}
              whileTap={{ scale: 0.92 }}
              className="relative w-14 h-14 md:w-16 md:h-16 rounded-full shadow-glow-lime-lg"
            >
              {/* Gradient border ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-lime via-purple to-lime p-[2px]">
                <div className="w-full h-full rounded-full bg-ink flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-lime" />
                  </motion.div>
                </div>
              </div>

              {/* Notification badge */}
              {!hasOpened && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-rose-600 border-2 border-ink flex items-center justify-center"
                >
                  <span className="text-[9px] font-bold text-white">1</span>
                </motion.span>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* CHAT WINDOW — Premium glass panel */}
      {/* ============================================ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={windowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed z-50",
              // Mobile
              "bottom-3 right-3 left-3 h-[75vh]",
              // Desktop
              "md:bottom-8 md:right-8 md:left-auto md:w-[420px] md:h-[640px]",
              // Glassmorphism
              "bg-ink/95 backdrop-blur-2xl rounded-3xl",
              "border border-white/[0.08]",
              "shadow-2xl shadow-black/60",
              "flex flex-col overflow-hidden"
            )}
          >
            {/* Animated gradient top border */}
            <div className="h-[2px] flex-shrink-0 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-lime via-purple via-50% to-lime"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ width: "200%" }}
              />
            </div>

            {/* Internal glow effects */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-lime/[0.03] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple/[0.04] rounded-full blur-3xl pointer-events-none" />

            {/* ============================================ */}
            {/* HEADER — Premium branded header */}
            {/* ============================================ */}
            <div className="relative flex items-center justify-between px-5 py-4 flex-shrink-0">
              <div className="flex items-center gap-3.5">
                {/* AI Avatar with animated ring */}
                <div className="relative">
                  <motion.div
                    className="absolute -inset-1 rounded-xl bg-gradient-to-br from-lime/30 to-purple/30 blur-sm"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-lime/20 to-purple/20 border border-lime/20 flex items-center justify-center overflow-hidden">
                    <Bot className="w-5 h-5 text-lime" />
                  </div>
                  {/* Pulsing online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-ink">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-emerald-400"
                      animate={{ scale: [1, 1.6, 1.6], opacity: [0.6, 0, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      MeetVerse AI
                    </h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-lime bg-lime/10 rounded-md border border-lime/20">
                      AI
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] text-white/40">
                      Always online — Instant replies
                    </span>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-white/50" />
              </motion.button>
            </div>

            {/* Separator with subtle gradient */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent flex-shrink-0" />

            {/* ============================================ */}
            {/* MESSAGES AREA */}
            {/* ============================================ */}
            <div className="flex-1 overflow-y-auto py-5 space-y-4 relative">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index < 3 ? index * 0.12 : 0 }}
                  className={cn(
                    "flex px-5",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {/* AI Message */}
                  {msg.role === "ai" && (
                    <div className="flex items-start gap-3 max-w-[88%]">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-lime/15 to-purple/15 border border-white/[0.06] flex items-center justify-center">
                          <Bot className="w-4 h-4 text-lime" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative group">
                          {/* Subtle glow on hover */}
                          <div className="absolute -inset-px rounded-2xl rounded-tl-md bg-gradient-to-br from-lime/[0.06] to-purple/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                          <div className="relative px-4 py-3.5 rounded-2xl rounded-tl-md bg-white/[0.03] border border-white/[0.06] group-hover:border-white/[0.1] transition-colors">
                            <div className="text-[13px] text-white/65 leading-[1.7]">
                              <FormatText text={msg.text} />
                            </div>
                          </div>
                        </div>
                        {/* CTA button inline */}
                        {msg.cta && (
                          <motion.button
                            onClick={() => handleQuickAction(msg.cta!.target)}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-lime/10 border border-lime/20 text-lime text-xs font-semibold hover:bg-lime/15 transition-colors"
                          >
                            {msg.cta.label}
                            <ArrowRight className="w-3 h-3" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* User Message */}
                  {msg.role === "user" && (
                    <div className="max-w-[80%]">
                      <div className="relative">
                        <div className="absolute -inset-px rounded-2xl rounded-tr-md bg-gradient-to-br from-lime/20 to-lime/5 blur-sm" />
                        <div className="relative px-4 py-3.5 rounded-2xl rounded-tr-md bg-gradient-to-br from-lime/[0.08] to-lime/[0.03] border border-lime/15">
                          <p className="text-[13px] text-white/85 leading-[1.7]">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ============================================ */}
            {/* QUICK ACTIONS — Icon pills with scroll */}
            {/* ============================================ */}
            <div className="px-4 pt-2 pb-3 flex-shrink-0">
              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="w-3 h-3 text-white/25" />
                <span className="text-[10px] font-medium text-white/25 uppercase tracking-wider">
                  Quick actions
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.label}
                    onClick={() => handleQuickAction(action.target)}
                    whileHover={{
                      y: -2,
                      scale: 1.03,
                      borderColor: "rgba(202,255,75,0.3)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium",
                      "bg-white/[0.02] border border-white/[0.06] text-white/50",
                      "hover:text-lime/90 hover:bg-lime/[0.04] transition-all duration-200"
                    )}
                  >
                    <action.icon className="w-3 h-3" />
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* ============================================ */}
            {/* INPUT AREA — Premium glass input */}
            {/* ============================================ */}
            <div className="px-4 pb-4 pt-1 flex-shrink-0">
              <div className="relative">
                {/* Glow behind input when focused */}
                <div
                  className={cn(
                    "absolute -inset-1 rounded-2xl transition-opacity duration-300",
                    inputValue.trim()
                      ? "opacity-100 bg-gradient-to-r from-lime/10 via-purple/5 to-lime/10 blur-lg"
                      : "opacity-0"
                  )}
                />
                <div className="relative flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] focus-within:border-lime/20 transition-colors">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask about features, pricing, security..."
                    className="flex-1 h-9 px-3 bg-transparent text-sm text-white/85 placeholder:text-white/25 focus:outline-none"
                  />
                  <motion.button
                    onClick={handleSend}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    disabled={!inputValue.trim() || isTyping}
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200",
                      inputValue.trim() && !isTyping
                        ? "bg-gradient-to-br from-lime to-lime-500 text-ink shadow-lg shadow-lime/20"
                        : "bg-white/[0.03] text-white/15"
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Powered by footer */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <Sparkles className="w-3 h-3 text-white/15" />
                <span className="text-[10px] text-white/15">
                  Powered by MeetVerse AI
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* MINIMIZE PILL — Shown when chat is open */}
      {/* ============================================ */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            onClick={() => setIsOpen(false)}
            className={cn(
              "fixed z-50",
              "bottom-4 right-4 md:bottom-8 md:right-8",
              "md:hidden",
              "w-12 h-12 rounded-full",
              "bg-ink/90 border border-white/[0.08] backdrop-blur-xl",
              "flex items-center justify-center",
              "shadow-lg"
            )}
          >
            <ChevronDown className="w-5 h-5 text-white/50" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
