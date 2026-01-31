"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
}: ControlBarProps) {
  return (
    <div className="flex items-center justify-center gap-2 border-t bg-card p-4">
      {/* Primary Controls */}
      <div className="flex items-center gap-2">
        {/* Mute/Unmute */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "control-button",
            isMuted ? "control-button-danger" : "control-button-default"
          )}
          onClick={onToggleMute}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        {/* Camera Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "control-button",
            !isVideoEnabled ? "control-button-danger" : "control-button-default"
          )}
          onClick={onToggleVideo}
        >
          {isVideoEnabled ? (
            <Video className="h-5 w-5" />
          ) : (
            <VideoOff className="h-5 w-5" />
          )}
        </Button>

        {/* Screen Share */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "control-button",
            isScreenSharing ? "control-button-active" : "control-button-default"
          )}
          onClick={onToggleScreenShare}
        >
          {isScreenSharing ? (
            <ScreenShareOff className="h-5 w-5" />
          ) : (
            <ScreenShare className="h-5 w-5" />
          )}
        </Button>

        {/* Recording */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "control-button",
            isRecording ? "control-button-active" : "control-button-default"
          )}
          onClick={onToggleRecording}
        >
          <Circle
            className={cn("h-5 w-5", isRecording && "fill-red-500 text-red-500")}
          />
        </Button>
      </div>

      <div className="mx-4 h-8 w-px bg-border" />

      {/* Reactions & Hand Raise */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="control-button control-button-default"
        >
          <Hand className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="control-button control-button-default"
        >
          <Smile className="h-5 w-5" />
        </Button>
      </div>

      <div className="mx-4 h-8 w-px bg-border" />

      {/* Sidebar Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="control-button control-button-default"
          onClick={onOpenChat}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="control-button control-button-default"
          onClick={onOpenParticipants}
        >
          <Users className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="control-button control-button-default"
          onClick={onOpenTranscript}
        >
          <FileText className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="control-button control-button-default relative"
          onClick={onOpenAI}
        >
          <Sparkles className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="control-button control-button-default"
          onClick={onToggleSidebar}
        >
          {isSidebarOpen ? (
            <PanelRightClose className="h-5 w-5" />
          ) : (
            <PanelRight className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="mx-4 h-8 w-px bg-border" />

      {/* More & Leave */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="control-button control-button-default"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="control-button"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
