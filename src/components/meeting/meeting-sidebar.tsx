"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    <div className="flex w-80 flex-col border-l bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex gap-1">
          <TabButton
            active={activeTab === "chat"}
            onClick={() => onChangeTab("chat")}
            icon={MessageSquare}
          />
          <TabButton
            active={activeTab === "participants"}
            onClick={() => onChangeTab("participants")}
            icon={Users}
          />
          <TabButton
            active={activeTab === "transcript"}
            onClick={() => onChangeTab("transcript")}
            icon={FileText}
          />
          <TabButton
            active={activeTab === "ai"}
            onClick={() => onChangeTab("ai")}
            icon={Sparkles}
            badge
          />
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
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
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  badge?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-lg p-2 transition-colors",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
      )}
    >
      <Icon className="h-5 w-5" />
      {badge && (
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
      )}
    </button>
  );
}

// Chat Panel
function ChatPanel() {
  const [message, setMessage] = useState("");

  const messages = [
    { id: "1", sender: "Sarah Chen", content: "Hey everyone! Ready to start?", time: "10:00 AM" },
    { id: "2", sender: "Marcus Johnson", content: "Yes, let me share my screen", time: "10:01 AM" },
    { id: "3", sender: "You", content: "Sounds good, go ahead!", time: "10:01 AM" },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-4">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{msg.sender}</span>
              <span className="text-xs text-muted-foreground">{msg.time}</span>
            </div>
            <p className="text-sm text-muted-foreground">{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
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
        <span className="text-sm font-medium">In this meeting ({participants.length})</span>
        <Button variant="outline" size="sm">
          Invite
        </Button>
      </div>
      <div className="space-y-2">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between rounded-lg p-2 hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {getInitials(participant.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {participant.name}
                {participant.id === "1" && " (You)"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {participant.isMuted ? (
                <MicOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Mic className="h-4 w-4 text-muted-foreground" />
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Transcript Panel
function TranscriptPanel() {
  const transcriptSegments = [
    { id: "1", speaker: "Sarah Chen", content: "Good morning everyone. Let's start with our weekly standup.", time: "00:15" },
    { id: "2", speaker: "Marcus Johnson", content: "I've completed the API integration for the payment system. Currently working on the frontend components.", time: "00:32" },
    { id: "3", speaker: "Alex Rivera", content: "That's great progress. I'll need to review that once you're done.", time: "01:15" },
    { id: "4", speaker: "You", content: "Sounds good. Let me pull up the task board to track our progress.", time: "01:45" },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <span className="text-sm font-medium">Live Transcript</span>
        <Button variant="ghost" size="sm">
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {transcriptSegments.map((segment) => (
          <div key={segment.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">{segment.speaker}</span>
              <span className="text-xs text-muted-foreground">{segment.time}</span>
            </div>
            <p className="text-sm">{segment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// AI Panel
function AIPanel() {
  const [query, setQuery] = useState("");

  const actionItems = [
    { id: "1", title: "Review API integration", assignee: "Alex Rivera", due: "Tomorrow" },
    { id: "2", title: "Update task board", assignee: "You", due: "Today" },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* AI Co-Pilot Chat */}
      <div className="flex-1 p-4">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Co-Pilot
          </div>
          <p className="text-xs text-muted-foreground">
            Ask questions about the meeting or get insights
          </p>
        </div>

        <div className="mb-4 rounded-lg bg-muted/50 p-3">
          <p className="text-sm text-muted-foreground">
            I'm listening to the conversation and detecting action items and key decisions.
          </p>
        </div>

        {/* Detected Action Items */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckSquare className="h-4 w-4 text-primary" />
            Detected Action Items
          </div>
          {actionItems.map((item) => (
            <div key={item.id} className="rounded-lg border p-3">
              <div className="text-sm font-medium">{item.title}</div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{item.assignee}</span>
                <span>•</span>
                <span>Due: {item.due}</span>
              </div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  Confirm
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Query Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask the AI co-pilot..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button size="icon">
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
