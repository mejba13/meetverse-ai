"use client";

import { useState } from "react";
import { VideoGrid } from "./video-grid";
import { ControlBar } from "./control-bar";
import { MeetingSidebar } from "./meeting-sidebar";
import { TranscriptBar } from "./transcript-bar";

interface MeetingRoomProps {
  roomId: string;
}

export function MeetingRoom({ roomId }: MeetingRoomProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"chat" | "participants" | "transcript" | "ai">("chat");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Mock participants for demo
  const participants = [
    { id: "1", name: "You", isMuted: false, isVideoEnabled: true },
    { id: "2", name: "Sarah Chen", isMuted: false, isVideoEnabled: true },
    { id: "3", name: "Marcus Johnson", isMuted: true, isVideoEnabled: true },
    { id: "4", name: "Alex Rivera", isMuted: false, isVideoEnabled: false },
  ];

  function openSidebar(tab: typeof sidebarTab) {
    setSidebarTab(tab);
    setIsSidebarOpen(true);
  }

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Meeting Header */}
      <header className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Weekly Team Standup</h1>
          {isRecording && (
            <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Recording
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Room: {roomId}</span>
          <span>•</span>
          <span>{participants.length} participants</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Area */}
        <div className="flex flex-1 flex-col">
          {/* Video Grid */}
          <div className="flex-1 overflow-hidden p-4">
            <VideoGrid
              participants={participants}
              isScreenSharing={isScreenSharing}
            />
          </div>

          {/* Transcript Bar (Live captions) */}
          <TranscriptBar />

          {/* Control Bar */}
          <ControlBar
            isMuted={isMuted}
            isVideoEnabled={isVideoEnabled}
            isScreenSharing={isScreenSharing}
            isRecording={isRecording}
            onToggleMute={() => setIsMuted(!isMuted)}
            onToggleVideo={() => setIsVideoEnabled(!isVideoEnabled)}
            onToggleScreenShare={() => setIsScreenSharing(!isScreenSharing)}
            onToggleRecording={() => setIsRecording(!isRecording)}
            onOpenChat={() => openSidebar("chat")}
            onOpenParticipants={() => openSidebar("participants")}
            onOpenTranscript={() => openSidebar("transcript")}
            onOpenAI={() => openSidebar("ai")}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        </div>

        {/* Sidebar */}
        {isSidebarOpen && (
          <MeetingSidebar
            activeTab={sidebarTab}
            onChangeTab={setSidebarTab}
            onClose={() => setIsSidebarOpen(false)}
            participants={participants}
          />
        )}
      </div>
    </div>
  );
}
