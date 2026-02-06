"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import {
  X,
  MessageSquare,
  Users,
  FileText,
  Sparkles,
  Send,
  Mic,
  MicOff,
  MoreVertical,
  Copy,
  CheckSquare,
  UserPlus,
  Check,
  Smile,
  Paperclip,
} from "lucide-react";
import {
  type Participant,
  mockChatMessages,
  mockTranscriptSegments,
  mockActionItems,
  mockAIInsights,
  roleColors,
  priorityColors,
  statusColors,
  insightTypeConfig,
} from "./mock-data";

interface MeetingSidebarProps {
  activeTab: "chat" | "participants" | "transcript" | "ai";
  onChangeTab: (tab: "chat" | "participants" | "transcript" | "ai") => void;
  onClose: () => void;
  participants: Participant[];
}

const tabs = [
  { id: "chat" as const, icon: MessageSquare, label: "Chat" },
  { id: "participants" as const, icon: Users, label: "People" },
  { id: "transcript" as const, icon: FileText, label: "Transcript" },
  { id: "ai" as const, icon: Sparkles, label: "AI", badge: true },
];

export function MeetingSidebar({
  activeTab,
  onChangeTab,
  onClose,
  participants,
}: MeetingSidebarProps) {
  return (
    <div className="flex w-[380px] flex-col h-full bg-[#0d0d0d]/95 backdrop-blur-2xl">
      {/* Top gradient accent */}
      <div className="h-[1px] bg-gradient-to-r from-[#CAFF4B]/30 via-[#9B5DE5]/30 to-[#CAFF4B]/30" />

      {/* Header with tab navigation */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-white/[0.06]">
        <div className="flex-1 bg-white/[0.02] rounded-xl p-1 flex gap-0.5 relative">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={cn(
                "relative flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all text-xs font-medium flex-1 justify-center z-10",
                activeTab === tab.id
                  ? "text-[#CAFF4B]"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg bg-[#CAFF4B]/10 border border-[#CAFF4B]/15"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon className="h-3.5 w-3.5 relative z-10" />
              <span className="hidden sm:inline relative z-10">{tab.label}</span>
              {tab.badge && (
                <span className="absolute -right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-[#CAFF4B] z-10" />
              )}
            </button>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="ml-2 w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeTab === "chat" && <ChatPanel />}
        {activeTab === "participants" && (
          <ParticipantsPanel participants={participants} />
        )}
        {activeTab === "transcript" && <TranscriptPanel />}
        {activeTab === "ai" && <AIPanel />}
      </div>
    </div>
  );
}

// Chat Panel
function ChatPanel() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 p-4">
        {mockChatMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2.5",
              msg.isYou && "flex-row-reverse"
            )}
          >
            {/* Avatar */}
            {!msg.isYou && (
              <div className="flex-shrink-0">
                {msg.avatarUrl ? (
                  <img
                    src={msg.avatarUrl}
                    alt={msg.sender}
                    className="w-7 h-7 rounded-full object-cover border border-white/[0.08]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#CAFF4B]/20 to-[#9B5DE5]/20 flex items-center justify-center text-[10px] text-white font-medium border border-white/[0.08]">
                    {getInitials(msg.sender)}
                  </div>
                )}
              </div>
            )}

            <div className={cn("max-w-[80%]", msg.isYou && "text-right")}>
              <div
                className={cn(
                  "rounded-xl p-3",
                  msg.isYou
                    ? "bg-[#CAFF4B]/10 border border-[#CAFF4B]/10"
                    : "bg-white/[0.03] border border-white/[0.06]"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "text-xs font-medium",
                    msg.isYou ? "text-[#CAFF4B]" : "text-white/70"
                  )}>
                    {msg.sender}
                  </span>
                  <span className="text-[10px] text-white/30">{msg.time}</span>
                </div>
                <p className="text-sm text-white/80">{msg.content}</p>
              </div>

              {/* Reactions */}
              {msg.reactions && msg.reactions.length > 0 && (
                <div className={cn("flex gap-1 mt-1", msg.isYou && "justify-end")}>
                  {msg.reactions.map((reaction, ri) => (
                    <span
                      key={ri}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px]"
                    >
                      <span>{reaction.emoji}</span>
                      <span className="text-white/40">{reaction.count}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        <div className="flex gap-2.5 items-start">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Sarah Chen"
            className="w-7 h-7 rounded-full object-cover border border-white/[0.08]"
          />
          <div className="rounded-xl p-3 bg-white/[0.03] border border-white/[0.06]">
            <span className="text-xs font-medium text-white/50 block mb-1">Sarah Chen</span>
            <div className="flex gap-1 items-center h-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/30"
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex gap-2 items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-xl bg-white/[0.04] text-white/30 hover:text-white/60 flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <Smile className="h-4 w-4" />
          </motion.button>
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-[#CAFF4B]/50 focus:ring-[#CAFF4B]/20 rounded-xl text-sm h-9"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-xl bg-white/[0.04] text-white/30 hover:text-white/60 flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <Paperclip className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-xl bg-[#CAFF4B] text-black flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#CAFF4B]/20"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Participants Panel
function ParticipantsPanel({ participants }: { participants: Participant[] }) {
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-white/50">
          In this meeting ({participants.length})
        </span>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#CAFF4B]/10 text-[#CAFF4B] text-xs font-medium hover:bg-[#CAFF4B]/15 transition-colors"
        >
          <UserPlus className="w-3 h-3" />
          Invite
        </motion.button>
      </div>
      <div className="space-y-1">
        {participants.map((participant, i) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between rounded-xl p-2.5 hover:bg-white/[0.03] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                {participant.avatarUrl ? (
                  <img
                    src={participant.avatarUrl}
                    alt={participant.name}
                    className="w-9 h-9 rounded-full object-cover border border-white/[0.08]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#CAFF4B]/20 to-[#9B5DE5]/20 flex items-center justify-center text-xs text-white font-medium border border-white/[0.08]">
                    {getInitials(participant.name)}
                  </div>
                )}
                {/* Status dot */}
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0d0d0d]",
                    statusColors[participant.status || "active"]
                  )}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    {participant.name}
                  </span>
                  {participant.role && participant.role !== "attendee" && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border",
                        roleColors[participant.role]
                      )}
                    >
                      {participant.role}
                    </span>
                  )}
                </div>
                {participant.department && (
                  <span className="text-[11px] text-white/30">{participant.department}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {participant.isMuted ? (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-500/10">
                  <MicOff className="h-3.5 w-3.5 text-red-400" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.04]">
                  <Mic className="h-3.5 w-3.5 text-white/40" />
                </div>
              )}
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-all">
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Transcript Panel
function TranscriptPanel() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = mockTranscriptSegments.map(s => `[${s.time}] ${s.speaker}: ${s.content}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actionKeywords = ["completed", "review", "schedule", "increase", "closed", "pipeline"];

  function highlightKeywords(text: string) {
    const parts = text.split(new RegExp(`(${actionKeywords.join("|")})`, "gi"));
    return parts.map((part, i) =>
      actionKeywords.some(k => k.toLowerCase() === part.toLowerCase()) ? (
        <span key={i} className="text-[#CAFF4B] font-medium">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CAFF4B] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#CAFF4B]" />
          </span>
          <span className="text-xs font-medium text-[#CAFF4B]">Live Transcript</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          {copied ? <Check className="h-3 w-3 text-[#CAFF4B]" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </motion.button>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin">
        {mockTranscriptSegments.map((segment, i) => {
          const isLatest = i === mockTranscriptSegments.length - 1;

          return (
            <motion.div
              key={segment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3 py-2"
            >
              {/* Left border accent */}
              <div
                className="w-[2px] rounded-full flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              />

              {/* Avatar */}
              <div className="flex-shrink-0 mt-0.5">
                {segment.avatarUrl ? (
                  <img
                    src={segment.avatarUrl}
                    alt={segment.speaker}
                    className="w-6 h-6 rounded-full object-cover border border-white/[0.08]"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#CAFF4B]/20 to-[#9B5DE5]/20 flex items-center justify-center text-[9px] text-white font-medium border border-white/[0.08]">
                    {getInitials(segment.speaker)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium" style={{ color: segment.color }}>
                    {segment.speaker}
                  </span>
                  <span className="text-[10px] text-white/20 font-mono">{segment.time}</span>
                </div>
                <p className={cn("text-sm text-white/70 leading-relaxed", isLatest && "text-white/90")}>
                  {isLatest ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      {highlightKeywords(segment.content)}
                    </motion.span>
                  ) : (
                    highlightKeywords(segment.content)
                  )}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// AI Panel
function AIPanel() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        {/* AI Co-Pilot Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A] flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-black" />
            </div>
            <span className="text-sm font-semibold text-white">AI Co-Pilot</span>
          </div>
          <p className="text-xs text-white/40 ml-8">
            Listening and detecting key items in real-time
          </p>
        </div>

        {/* AI Status */}
        <div className="mb-5 rounded-xl bg-[#CAFF4B]/[0.03] border border-[#CAFF4B]/[0.08] p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CAFF4B] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#CAFF4B]" />
            </span>
            <span className="text-xs font-medium text-[#CAFF4B]">Active</span>
          </div>
          <p className="text-xs text-white/40">
            Detecting action items, decisions, and sentiment in real-time.
          </p>
        </div>

        {/* Meeting Insights */}
        <div className="mb-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#9B5DE5]" />
            <span className="text-xs font-semibold text-white">Meeting Insights</span>
            <span className="text-[10px] text-white/30 bg-white/[0.04] px-1.5 py-0.5 rounded-full">
              {mockAIInsights.length}
            </span>
          </div>

          {mockAIInsights.map((insight, i) => {
            const config = insightTypeConfig[insight.type];
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border", config.color)}>
                    {config.label}
                  </span>
                  <span className="text-[10px] text-white/30">{insight.confidence}% confidence</span>
                </div>
                <div className="text-sm font-medium text-white mb-1">{insight.title}</div>
                <p className="text-xs text-white/40 leading-relaxed">{insight.description}</p>
                {/* Confidence bar */}
                <div className="mt-2 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${insight.confidence}%` }}
                    transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#CAFF4B]/60 to-[#9B5DE5]/60"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detected Action Items */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-[#CAFF4B]" />
            <span className="text-xs font-semibold text-white">Detected Action Items</span>
            <span className="text-[10px] text-white/30 bg-white/[0.04] px-1.5 py-0.5 rounded-full">
              {mockActionItems.length}
            </span>
          </div>

          {mockActionItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                {/* Priority dot */}
                <div className={cn("w-2 h-2 rounded-full", priorityColors[item.priority])} />
                <span className="text-sm font-medium text-white">{item.title}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                {/* Assignee avatar */}
                <div className="flex items-center gap-1.5">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.assignee}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-[#CAFF4B]/20 flex items-center justify-center text-[7px] text-[#CAFF4B] font-bold">
                      {getInitials(item.assignee)}
                    </div>
                  )}
                  <span>{item.assignee}</span>
                </div>
                <span className="text-white/20">|</span>
                <span>Due: {item.due}</span>
                <span className="text-white/20">|</span>
                <span className={cn(
                  "capitalize",
                  item.priority === "high" && "text-red-400",
                  item.priority === "medium" && "text-amber-400",
                  item.priority === "low" && "text-emerald-400",
                )}>
                  {item.priority}
                </span>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-1.5 rounded-lg bg-[#CAFF4B]/10 text-[#CAFF4B] text-xs font-medium hover:bg-[#CAFF4B]/15 transition-colors"
                >
                  Confirm
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/50 text-xs font-medium hover:bg-white/[0.08] hover:text-white transition-colors"
                >
                  Edit
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Generate Summary Button */}
        <div className="mt-5">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(202,255,75,0.2)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#CAFF4B]/15 to-[#9B5DE5]/15 border border-[#CAFF4B]/10 text-white text-sm font-medium hover:from-[#CAFF4B]/20 hover:to-[#9B5DE5]/20 transition-all"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-4 w-4 text-[#CAFF4B]" />
            </motion.div>
            Generate Summary
          </motion.button>
        </div>
      </div>

      {/* Query Input */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex gap-2">
          <Input
            placeholder="Ask the AI co-pilot..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-[#CAFF4B]/50 focus:ring-[#CAFF4B]/20 rounded-xl text-sm h-10"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A] text-black flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#CAFF4B]/20"
          >
            <Sparkles className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
