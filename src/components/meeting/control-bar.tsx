"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  MessageSquare,
  Users,
  FileText,
  Sparkles,
  MoreVertical,
  PhoneOff,
  Circle,
  Hand,
  Smile,
  PanelRightClose,
  PanelRight,
} from "lucide-react";

interface ControlBarProps {
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  isSidebarOpen: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
  onOpenChat: () => void;
  onOpenParticipants: () => void;
  onOpenTranscript: () => void;
  onOpenAI: () => void;
  onToggleSidebar: () => void;
  onLeave: () => void;
}

export function ControlBar({
  isMuted,
  isVideoEnabled,
  isScreenSharing,
  isRecording,
  isSidebarOpen,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleRecording,
  onOpenChat,
  onOpenParticipants,
  onOpenTranscript,
  onOpenAI,
  onToggleSidebar,
  onLeave,
}: ControlBarProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 px-6 bg-white/[0.02] backdrop-blur-xl border-t border-white/[0.06]">
      {/* Primary Controls */}
      <div className="flex items-center gap-2">
        {/* Mute/Unmute */}
        <ControlButton
          active={!isMuted}
          danger={isMuted}
          onClick={onToggleMute}
          tooltip={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </ControlButton>

        {/* Camera Toggle */}
        <ControlButton
          active={isVideoEnabled}
          danger={!isVideoEnabled}
          onClick={onToggleVideo}
          tooltip={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
        >
          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </ControlButton>

        {/* Screen Share */}
        <ControlButton
          active={isScreenSharing}
          highlight={isScreenSharing}
          onClick={onToggleScreenShare}
          tooltip={isScreenSharing ? "Stop sharing" : "Share screen"}
        >
          {isScreenSharing ? <ScreenShareOff className="h-5 w-5" /> : <ScreenShare className="h-5 w-5" />}
        </ControlButton>

        {/* Recording */}
        <ControlButton
          active={isRecording}
          highlight={isRecording}
          onClick={onToggleRecording}
          tooltip={isRecording ? "Stop recording" : "Start recording"}
        >
          <Circle className={cn("h-5 w-5", isRecording && "fill-red-500 text-red-500")} />
        </ControlButton>
      </div>

      <div className="mx-3 h-8 w-px bg-white/[0.06]" />

      {/* Reactions & Hand Raise */}
      <div className="flex items-center gap-2">
        <ControlButton onClick={() => {}} tooltip="Raise hand">
          <Hand className="h-5 w-5" />
        </ControlButton>
        <ControlButton onClick={() => {}} tooltip="Reactions">
          <Smile className="h-5 w-5" />
        </ControlButton>
      </div>

      <div className="mx-3 h-8 w-px bg-white/[0.06]" />

      {/* Sidebar Controls */}
      <div className="flex items-center gap-2">
        <ControlButton onClick={onOpenChat} tooltip="Chat">
          <MessageSquare className="h-5 w-5" />
        </ControlButton>
        <ControlButton onClick={onOpenParticipants} tooltip="Participants">
          <Users className="h-5 w-5" />
        </ControlButton>
        <ControlButton onClick={onOpenTranscript} tooltip="Transcript">
          <FileText className="h-5 w-5" />
        </ControlButton>
        <ControlButton onClick={onOpenAI} tooltip="AI Co-Pilot" badge>
          <Sparkles className="h-5 w-5" />
        </ControlButton>
        <ControlButton onClick={onToggleSidebar} tooltip={isSidebarOpen ? "Close panel" : "Open panel"}>
          {isSidebarOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRight className="h-5 w-5" />}
        </ControlButton>
      </div>

      <div className="mx-3 h-8 w-px bg-white/[0.06]" />

      {/* More & Leave */}
      <div className="flex items-center gap-2">
        <ControlButton onClick={() => {}} tooltip="More options">
          <MoreVertical className="h-5 w-5" />
        </ControlButton>

        {/* Leave Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLeave}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-colors"
        >
          <PhoneOff className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  );
}

interface ControlButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  highlight?: boolean;
  tooltip?: string;
  badge?: boolean;
}

function ControlButton({
  children,
  onClick,
  danger = false,
  highlight = false,
  tooltip,
  badge = false,
}: ControlButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={tooltip}
      className={cn(
        "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200",
        danger
          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20"
          : highlight
            ? "bg-[#CAFF4B] text-black shadow-lg shadow-[#CAFF4B]/20"
            : "bg-white/[0.06] text-white/70 hover:bg-white/[0.1] hover:text-white border border-white/[0.06]"
      )}
    >
      {children}
      {badge && (
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#CAFF4B] border-2 border-[#0a0a0a]" />
      )}
    </motion.button>
  );
}
