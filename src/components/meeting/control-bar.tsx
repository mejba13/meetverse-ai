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
    <div className="flex items-center justify-center py-3 px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex items-center gap-1.5 rounded-2xl bg-[#111111]/90 backdrop-blur-2xl border border-white/[0.08] shadow-2xl px-4 py-2.5"
      >
        {/* Media Controls */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <ControlButton
              active={!isMuted}
              danger={isMuted}
              onClick={onToggleMute}
              tooltip={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff className="h-[18px] w-[18px]" /> : <Mic className="h-[18px] w-[18px]" />}
            </ControlButton>

            <ControlButton
              active={isVideoEnabled}
              danger={!isVideoEnabled}
              onClick={onToggleVideo}
              tooltip={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
            >
              {isVideoEnabled ? <Video className="h-[18px] w-[18px]" /> : <VideoOff className="h-[18px] w-[18px]" />}
            </ControlButton>

            <ControlButton
              active={isScreenSharing}
              highlight={isScreenSharing}
              onClick={onToggleScreenShare}
              tooltip={isScreenSharing ? "Stop sharing" : "Share screen"}
            >
              {isScreenSharing ? <ScreenShareOff className="h-[18px] w-[18px]" /> : <ScreenShare className="h-[18px] w-[18px]" />}
            </ControlButton>

            <ControlButton
              active={isRecording}
              highlight={isRecording}
              onClick={onToggleRecording}
              tooltip={isRecording ? "Stop recording" : "Start recording"}
            >
              <Circle className={cn("h-[18px] w-[18px]", isRecording && "fill-red-500 text-red-500")} />
            </ControlButton>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-white/20 font-medium">Media</span>
        </div>

        <div className="h-10 w-px bg-white/[0.06] mx-1.5" />

        {/* React */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <ControlButton onClick={() => {}} tooltip="Raise hand">
              <Hand className="h-[18px] w-[18px]" />
            </ControlButton>
            <ControlButton onClick={() => {}} tooltip="Reactions">
              <Smile className="h-[18px] w-[18px]" />
            </ControlButton>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-white/20 font-medium">React</span>
        </div>

        <div className="h-10 w-px bg-white/[0.06] mx-1.5" />

        {/* Panels */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <ControlButton onClick={onOpenChat} tooltip="Chat">
              <MessageSquare className="h-[18px] w-[18px]" />
            </ControlButton>
            <ControlButton onClick={onOpenParticipants} tooltip="Participants">
              <Users className="h-[18px] w-[18px]" />
            </ControlButton>
            <ControlButton onClick={onOpenTranscript} tooltip="Transcript">
              <FileText className="h-[18px] w-[18px]" />
            </ControlButton>
            <ControlButton onClick={onOpenAI} tooltip="AI Co-Pilot" badge>
              <Sparkles className="h-[18px] w-[18px]" />
            </ControlButton>
            <ControlButton onClick={onToggleSidebar} tooltip={isSidebarOpen ? "Close panel" : "Open panel"}>
              {isSidebarOpen ? <PanelRightClose className="h-[18px] w-[18px]" /> : <PanelRight className="h-[18px] w-[18px]" />}
            </ControlButton>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-white/20 font-medium">Panels</span>
        </div>

        <div className="h-10 w-px bg-white/[0.06] mx-1.5" />

        {/* End */}
        <div className="flex flex-col items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(239,68,68,0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onLeave}
            className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-colors"
          >
            <PhoneOff className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline text-sm font-semibold">Leave</span>
          </motion.button>
          <span className="text-[9px] uppercase tracking-widest text-white/20 font-medium">End</span>
        </div>
      </motion.div>
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
      whileHover={{ y: -2, scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={tooltip}
      className={cn(
        "relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200",
        danger
          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          : highlight
            ? "bg-[#CAFF4B] text-black shadow-lg shadow-[#CAFF4B]/25"
            : "bg-white/[0.06] text-white/70 hover:bg-white/[0.1] hover:text-white border border-white/[0.06]"
      )}
    >
      {children}
      {badge && (
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#CAFF4B] border-2 border-[#111111]"
        />
      )}
    </motion.button>
  );
}
