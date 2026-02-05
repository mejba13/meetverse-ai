"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
}

interface MeetingSidebarProps {
  activeTab: "chat" | "participants" | "transcript" | "ai";
  onChangeTab: (tab: "chat" | "participants" | "transcript" | "ai") => void;
  onClose: () => void;
  participants: Participant[];
}

export function MeetingSidebar({
  activeTab,
  onChangeTab,
  onClose,
  participants,
}: MeetingSidebarProps) {
  return (
    <div className="flex w-[340px] flex-col h-full border-l border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex gap-1">
          <TabButton
            active={activeTab === "chat"}
            onClick={() => onChangeTab("chat")}
            icon={MessageSquare}
            label="Chat"
          />
          <TabButton
            active={activeTab === "participants"}
            onClick={() => onChangeTab("participants")}
            icon={Users}
            label="People"
          />
          <TabButton
            active={activeTab === "transcript"}
            onClick={() => onChangeTab("transcript")}
            icon={FileText}
            label="Transcript"
          />
          <TabButton
            active={activeTab === "ai"}
            onClick={() => onChangeTab("ai")}
            icon={Sparkles}
            label="AI"
            badge
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors"
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

// Tab Button Component
function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all text-xs font-medium",
        active
          ? "bg-[#CAFF4B]/10 text-[#CAFF4B]"
          : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
      {badge && (
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#CAFF4B]" />
      )}
    </button>
  );
}

// Chat Panel
function ChatPanel() {
  const [message, setMessage] = useState("");

  const messages = [
    { id: "1", sender: "Sarah Chen", content: "Hey everyone! Ready to start?", time: "10:00 AM", isYou: false },
    { id: "2", sender: "Marcus Johnson", content: "Yes, let me share my screen", time: "10:01 AM", isYou: false },
    { id: "3", sender: "You", content: "Sounds good, go ahead!", time: "10:01 AM", isYou: true },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "rounded-xl p-3 max-w-[85%]",
              msg.isYou
                ? "ml-auto bg-[#CAFF4B]/10 border border-[#CAFF4B]/10"
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
        ))}
      </div>
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-[#CAFF4B]/50 focus:ring-[#CAFF4B]/20 rounded-xl text-sm h-10"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-[#CAFF4B] text-black flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#CAFF4B]/20"
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
                <Avatar className="h-8 w-8 border border-white/[0.08]">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-[#CAFF4B]/20 to-[#9B5DE5]/20 text-white">
                    {getInitials(participant.name)}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0d0d0d]" />
              </div>
              <div>
                <span className="text-sm font-medium text-white">
                  {participant.name}
                </span>
                {i === 0 && (
                  <span className="ml-1.5 text-[10px] text-[#CAFF4B]/60">(Host)</span>
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

  const transcriptSegments = [
    { id: "1", speaker: "Sarah Chen", content: "Good morning everyone. Let's start with our weekly standup.", time: "00:15" },
    { id: "2", speaker: "Marcus Johnson", content: "I've completed the API integration for the payment system. Currently working on the frontend components.", time: "00:32" },
    { id: "3", speaker: "Alex Rivera", content: "That's great progress. I'll need to review that once you're done.", time: "01:15" },
    { id: "4", speaker: "You", content: "Sounds good. Let me pull up the task board to track our progress.", time: "01:45" },
  ];

  const handleCopy = () => {
    const text = transcriptSegments.map(s => `[${s.time}] ${s.speaker}: ${s.content}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin">
        {transcriptSegments.map((segment, i) => (
          <motion.div
            key={segment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#CAFF4B]">{segment.speaker}</span>
              <span className="text-[10px] text-white/20 font-mono">{segment.time}</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{segment.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// AI Panel
function AIPanel() {
  const [query, setQuery] = useState("");

  const actionItems = [
    { id: "1", title: "Review API integration", assignee: "Alex Rivera", due: "Tomorrow", status: "pending" },
    { id: "2", title: "Update task board", assignee: "You", due: "Today", status: "pending" },
  ];

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
            Detecting action items and key decisions from the conversation.
          </p>
        </div>

        {/* Detected Action Items */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-[#CAFF4B]" />
            <span className="text-xs font-semibold text-white">Detected Action Items</span>
            <span className="text-[10px] text-white/30 bg-white/[0.04] px-1.5 py-0.5 rounded-full">
              {actionItems.length}
            </span>
          </div>

          {actionItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 hover:bg-white/[0.04] transition-colors"
            >
              <div className="text-sm font-medium text-white mb-1">{item.title}</div>
              <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                <span>{item.assignee}</span>
                <span className="text-white/20">|</span>
                <span>Due: {item.due}</span>
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
