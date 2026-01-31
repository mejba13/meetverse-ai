"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
  useConnectionState,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import "@livekit/components-styles";

import { LiveKitVideoGrid } from "./livekit-video-grid";
import { ControlBar } from "./control-bar";
import { MeetingSidebar } from "./meeting-sidebar";
import { TranscriptBar } from "./transcript-bar";
import { PreJoin } from "./pre-join";
import { trpc } from "@/lib/api/client";
import { useLiveKitToken } from "@/lib/hooks/use-livekit";
import { Loader2, AlertCircle, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeetingRoomProps {
  roomId: string;
}

type MeetingState = "loading" | "pre-join" | "connecting" | "connected" | "error";

export function MeetingRoom({ roomId }: MeetingRoomProps) {
  const router = useRouter();
  const [state, setState] = useState<MeetingState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  // Fetch meeting data
  const { data: meeting, isLoading: meetingLoading, error: meetingError } =
    trpc.meeting.getByRoomId.useQuery({ roomId });

  // LiveKit token hook
  const {
    token,
    serverUrl,
    isHost,
    isLoading: tokenLoading,
    error: tokenError,
    refetch: refetchToken
  } = useLiveKitToken({ roomId, displayName });

  // Determine state based on loading/data
  useEffect(() => {
    if (meetingLoading) {
      setState("loading");
    } else if (meetingError) {
      setState("error");
      setError(meetingError.message || "Failed to load meeting");
    } else if (meeting) {
      setState("pre-join");
    }
  }, [meetingLoading, meetingError, meeting]);

  const handleJoin = useCallback(async (settings: {
    displayName: string;
    audioEnabled: boolean;
    videoEnabled: boolean;
    selectedCamera?: string;
    selectedMicrophone?: string;
  }) => {
    setDisplayName(settings.displayName);
    setAudioEnabled(settings.audioEnabled);
    setVideoEnabled(settings.videoEnabled);
    setState("connecting");

    // Refetch token with the display name
    await refetchToken();
  }, [refetchToken]);

  const handleDisconnect = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const handleError = useCallback((error: Error) => {
    console.error("LiveKit error:", error);
    setError(error.message);
    setState("error");
  }, []);

  // Loading state
  if (state === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading meeting...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (state === "error") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-xl font-semibold">Unable to Join Meeting</h2>
          <p className="mt-2 text-muted-foreground">{error || "An unexpected error occurred"}</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Pre-join state
  if (state === "pre-join" && meeting) {
    return (
      <PreJoin
        roomId={roomId}
        meetingTitle={meeting.title}
        onJoin={handleJoin}
        isLoading={false}
        error={null}
      />
    );
  }

  // Connecting or connected - use LiveKit
  if ((state === "connecting" || state === "connected") && token && serverUrl) {
    return (
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        audio={audioEnabled}
        video={videoEnabled}
        onDisconnected={handleDisconnect}
        onError={handleError}
        options={{
          adaptiveStream: true,
          dynacast: true,
        }}
      >
        <MeetingRoomContent
          roomId={roomId}
          meetingTitle={meeting?.title || "Meeting"}
        />
        <RoomAudioRenderer />
      </LiveKitRoom>
    );
  }

  // Waiting for token
  if (state === "connecting" && tokenLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Connecting to meeting...</p>
        </div>
      </div>
    );
  }

  // Token error
  if (tokenError) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <WifiOff className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-xl font-semibold">Connection Failed</h2>
          <p className="mt-2 text-muted-foreground">{tokenError}</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button onClick={() => setState("pre-join")}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback loading
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

interface MeetingRoomContentProps {
  roomId: string;
  meetingTitle: string;
}

function MeetingRoomContent({ roomId, meetingTitle }: MeetingRoomContentProps) {
  const room = useRoomContext();
  const connectionState = useConnectionState();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"chat" | "participants" | "transcript" | "ai">("chat");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Sync with room state
  useEffect(() => {
    if (room) {
      const localParticipant = room.localParticipant;

      setIsMuted(!localParticipant.isMicrophoneEnabled);
      setIsVideoEnabled(localParticipant.isCameraEnabled);
      setIsScreenSharing(localParticipant.isScreenShareEnabled);
    }
  }, [room]);

  // Handle mute toggle
  const handleToggleMute = async () => {
    if (room) {
      const newState = !isMuted;
      await room.localParticipant.setMicrophoneEnabled(!newState);
      setIsMuted(newState);
    }
  };

  // Handle video toggle
  const handleToggleVideo = async () => {
    if (room) {
      const newState = !isVideoEnabled;
      await room.localParticipant.setCameraEnabled(newState);
      setIsVideoEnabled(newState);
    }
  };

  // Handle screen share toggle
  const handleToggleScreenShare = async () => {
    if (room) {
      try {
        if (isScreenSharing) {
          await room.localParticipant.setScreenShareEnabled(false);
        } else {
          await room.localParticipant.setScreenShareEnabled(true);
        }
        setIsScreenSharing(!isScreenSharing);
      } catch (err) {
        console.error("Screen share error:", err);
      }
    }
  };

  // Get participant list for sidebar
  const participants = room?.remoteParticipants
    ? Array.from(room.remoteParticipants.values()).map((p) => ({
        id: p.sid,
        name: p.name || "Participant",
        isMuted: !p.isMicrophoneEnabled,
        isVideoEnabled: p.isCameraEnabled,
      }))
    : [];

  // Add local participant
  if (room?.localParticipant) {
    participants.unshift({
      id: room.localParticipant.sid,
      name: room.localParticipant.name || "You",
      isMuted: !room.localParticipant.isMicrophoneEnabled,
      isVideoEnabled: room.localParticipant.isCameraEnabled,
    });
  }

  function openSidebar(tab: typeof sidebarTab) {
    setSidebarTab(tab);
    setIsSidebarOpen(true);
  }

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  // Show connecting state
  if (connectionState === ConnectionState.Connecting) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Connecting to meeting...</p>
        </div>
      </div>
    );
  }

  // Show reconnecting state
  if (connectionState === ConnectionState.Reconnecting) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <WifiOff className="mx-auto h-12 w-12 text-yellow-500 animate-pulse" />
          <p className="mt-4 text-muted-foreground">Reconnecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Meeting Header */}
      <header className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">{meetingTitle}</h1>
          {isRecording && (
            <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Recording
            </div>
          )}
          {connectionState === ConnectionState.Connected && (
            <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Connected
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
            <LiveKitVideoGrid />
          </div>

          {/* Transcript Bar (Live captions) */}
          <TranscriptBar />

          {/* Control Bar */}
          <ControlBar
            isMuted={isMuted}
            isVideoEnabled={isVideoEnabled}
            isScreenSharing={isScreenSharing}
            isRecording={isRecording}
            onToggleMute={handleToggleMute}
            onToggleVideo={handleToggleVideo}
            onToggleScreenShare={handleToggleScreenShare}
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
