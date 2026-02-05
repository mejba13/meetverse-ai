"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Loader2,
  AlertCircle,
  WifiOff,
  Sparkles,
  ArrowLeft,
  Users,
  Clock,
  Shield,
  Mic,
  MicOff,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MeetingRoomProps {
  roomId: string;
}

type MeetingState = "loading" | "pre-join" | "connecting" | "connected" | "demo" | "error";

export function MeetingRoom({ roomId }: MeetingRoomProps) {
  const router = useRouter();
  const [state, setState] = useState<MeetingState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  // Try to get meeting title from sessionStorage (set by new meeting page)
  const [meetingTitle, setMeetingTitle] = useState("Meeting");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`meeting-settings-${roomId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.title) setMeetingTitle(parsed.title);
      }
    } catch {
      // ignore
    }
  }, [roomId]);

  // Fetch meeting data
  const { data: meeting, isLoading: meetingLoading, error: meetingError } =
    trpc.meeting.getByRoomId.useQuery({ roomId });

  // LiveKit token hook
  const {
    token,
    serverUrl,
    isLoading: tokenLoading,
    error: tokenError,
    refetch: refetchToken,
  } = useLiveKitToken({ roomId, displayName });

  // Determine state based on loading/data
  useEffect(() => {
    if (meetingLoading) {
      setState("loading");
    } else if (meetingError) {
      // If the tRPC fails (no backend), go straight to pre-join with fallback
      setState("pre-join");
    } else if (meeting) {
      if (meeting.title) setMeetingTitle(meeting.title);
      setState("pre-join");
    }
  }, [meetingLoading, meetingError, meeting]);

  const handleJoin = useCallback(
    async (settings: {
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

      try {
        await refetchToken();
      } catch {
        // If token fetch fails, fall through to demo mode below
      }
    },
    [refetchToken]
  );

  // Auto-detect when LiveKit isn't available and switch to demo mode
  useEffect(() => {
    if (state === "connecting") {
      // Give LiveKit token 3 seconds, then fallback to demo mode
      const timeout = setTimeout(() => {
        if (!token || !serverUrl) {
          setState("demo");
        }
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [state, token, serverUrl]);

  // Also switch to demo if token error occurs while connecting
  useEffect(() => {
    if (state === "connecting" && tokenError) {
      setState("demo");
    }
  }, [state, tokenError]);

  const handleDisconnect = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const handleError = useCallback((error: Error) => {
    console.error("LiveKit error:", error);
    // Instead of showing error, go to demo mode
    setState("demo");
  }, []);

  // Loading state
  if (state === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-ink relative overflow-hidden">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-ink" />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(202,255,75,0.08) 0%, transparent 60%)",
              filter: "blur(60px)",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#CAFF4B] to-[#9B5DE5] rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-black animate-spin" />
            </div>
          </div>
          <p className="text-white/50 text-sm">Loading meeting...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (state === "error") {
    return (
      <div className="flex h-screen items-center justify-center bg-ink relative overflow-hidden">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-ink" />
          <div
            className="absolute inset-0 opacity-[0.012]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(202,255,75,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(202,255,75,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md px-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Unable to Join Meeting</h2>
          <p className="text-sm text-white/40 mb-8">
            {error || "An unexpected error occurred"}
          </p>
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/70 hover:text-white hover:bg-white/[0.08] transition-all text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Back to Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(202,255,75,0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#CAFF4B] to-[#9EF01A] text-black font-bold text-sm shadow-lg shadow-[#CAFF4B]/20"
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Pre-join state
  if (state === "pre-join") {
    return (
      <PreJoin
        roomId={roomId}
        meetingTitle={meetingTitle}
        onJoin={handleJoin}
        isLoading={false}
        error={null}
      />
    );
  }

  // Demo mode - show full meeting room UI without LiveKit
  if (state === "demo") {
    return (
      <DemoMeetingRoom
        meetingTitle={meetingTitle}
        displayName={displayName}
        initialAudioEnabled={audioEnabled}
        initialVideoEnabled={videoEnabled}
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
          meetingTitle={meetingTitle}
        />
        <RoomAudioRenderer />
      </LiveKitRoom>
    );
  }

  // Waiting for token (shows briefly before demo mode kicks in)
  if (state === "connecting") {
    return (
      <div className="flex h-screen items-center justify-center bg-ink relative overflow-hidden">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-ink" />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(155,93,229,0.08) 0%, transparent 60%)",
              filter: "blur(60px)",
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#9B5DE5] to-[#CAFF4B] rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9B5DE5] to-[#7B2FD4] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
          <p className="text-white/50 text-sm">Connecting to meeting...</p>
        </motion.div>
      </div>
    );
  }

  // Fallback loading
  return (
    <div className="flex h-screen items-center justify-center bg-ink">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 bg-[#CAFF4B] rounded-xl blur-lg opacity-30 animate-pulse" />
        <div className="relative w-12 h-12 rounded-xl bg-[#CAFF4B] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-black animate-spin" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// DEMO MEETING ROOM (works without LiveKit)
// ============================================

const mockParticipants = [
  { id: "1", name: "You", isMuted: false, isVideoEnabled: true },
  { id: "2", name: "Sarah Chen", isMuted: false, isVideoEnabled: true },
  { id: "3", name: "Marcus Johnson", isMuted: true, isVideoEnabled: false },
  { id: "4", name: "Alex Rivera", isMuted: false, isVideoEnabled: true },
];

const participantColors = [
  "from-[#CAFF4B]/30 to-[#9EF01A]/20",
  "from-[#9B5DE5]/30 to-violet-600/20",
  "from-cyan-500/30 to-blue-600/20",
  "from-amber-500/30 to-orange-600/20",
];

interface DemoMeetingRoomProps {
  meetingTitle: string;
  displayName: string;
  initialAudioEnabled: boolean;
  initialVideoEnabled: boolean;
}

function DemoMeetingRoom({ meetingTitle, displayName, initialAudioEnabled, initialVideoEnabled }: DemoMeetingRoomProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"chat" | "participants" | "transcript" | "ai">("chat");
  const [isMuted, setIsMuted] = useState(!initialAudioEnabled);
  const [isVideoEnabled, setIsVideoEnabled] = useState(initialVideoEnabled);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Meeting timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Manage local camera stream for "You" tile
  useEffect(() => {
    if (isVideoEnabled) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Camera not available
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isVideoEnabled]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleLeave = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    router.push("/dashboard");
  };

  const participants = mockParticipants.map((p, i) => ({
    ...p,
    name: i === 0 ? (displayName || "You") : p.name,
    isMuted: i === 0 ? isMuted : p.isMuted,
    isVideoEnabled: i === 0 ? isVideoEnabled : p.isVideoEnabled,
  }));

  function openSidebar(tab: typeof sidebarTab) {
    setSidebarTab(tab);
    setIsSidebarOpen(true);
  }

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div className="flex h-screen flex-col bg-ink overflow-hidden">
      {/* Meeting Header */}
      <header className="flex h-14 items-center justify-between px-4 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="text-sm font-semibold text-white hidden sm:block">MeetVerse</span>
          </div>

          <div className="w-px h-5 bg-white/[0.08]" />
          <h1 className="text-sm font-medium text-white truncate max-w-[200px]">{meetingTitle}</h1>

          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="text-xs font-medium text-red-400">REC</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LIVE badge */}
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-medium text-emerald-400">LIVE</span>
          </div>

          {/* Demo badge */}
          <div className="flex items-center gap-1.5 rounded-full bg-[#9B5DE5]/10 border border-[#9B5DE5]/20 px-2.5 py-1">
            <span className="text-[10px] font-medium text-[#9B5DE5]">DEMO</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white/40">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-mono tabular-nums">{formatTime(elapsedTime)}</span>
          </div>
          <div className="w-px h-4 bg-white/[0.08]" />
          <div className="flex items-center gap-1.5 text-white/40">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">{participants.length}</span>
          </div>
          <div className="w-px h-4 bg-white/[0.08]" />
          <div className="flex items-center gap-1 text-white/30">
            <Shield className="w-3 h-3" />
            <span className="text-[10px]">E2E</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          {/* Demo Video Grid */}
          <div className="flex-1 overflow-hidden p-3">
            <div className="grid h-full gap-3 auto-rows-fr grid-cols-2">
              {participants.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "relative rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/[0.06]",
                    !p.isMuted && i === 0 && "ring-2 ring-[#CAFF4B]/50 ring-offset-2 ring-offset-[#0a0a0a]"
                  )}
                >
                  {/* Video or Avatar */}
                  {p.isVideoEnabled && i === 0 ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    </>
                  ) : p.isVideoEnabled ? (
                    <div className={cn("absolute inset-0 bg-gradient-to-br", participantColors[i % participantColors.length])}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Avatar className="h-20 w-20 border-2 border-white/[0.1]">
                          <AvatarFallback className="text-2xl bg-white/10 text-white">
                            {getInitials(p.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#111111]">
                      <div className="text-center">
                        <Avatar className="mx-auto h-20 w-20 border-2 border-white/[0.08]">
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-white/10 to-white/5 text-white/60">
                            {getInitials(p.name)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="mt-2 text-xs text-white/30">Camera off</p>
                      </div>
                    </div>
                  )}

                  {/* Participant info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                      {p.isMuted ? (
                        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                          <MicOff className="h-3 w-3 text-red-400" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                          <Mic className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-white drop-shadow-lg">
                        {p.name}{i === 0 ? " (You)" : ""}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Transcript Bar */}
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
            onLeave={handleLeave}
          />
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <MeetingSidebar
                activeTab={sidebarTab}
                onChangeTab={setSidebarTab}
                onClose={() => setIsSidebarOpen(false)}
                participants={participants}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================
// LIVE MEETING ROOM (with LiveKit)
// ============================================

interface MeetingRoomContentProps {
  meetingTitle: string;
}

function MeetingRoomContent({ meetingTitle }: MeetingRoomContentProps) {
  const room = useRoomContext();
  const connectionState = useConnectionState();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"chat" | "participants" | "transcript" | "ai">("chat");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Meeting timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Sync with room state
  useEffect(() => {
    if (room) {
      const localParticipant = room.localParticipant;
      setIsMuted(!localParticipant.isMicrophoneEnabled);
      setIsVideoEnabled(localParticipant.isCameraEnabled);
      setIsScreenSharing(localParticipant.isScreenShareEnabled);
    }
  }, [room]);

  const handleToggleMute = async () => {
    if (room) {
      const newState = !isMuted;
      await room.localParticipant.setMicrophoneEnabled(!newState);
      setIsMuted(newState);
    }
  };

  const handleToggleVideo = async () => {
    if (room) {
      const newState = !isVideoEnabled;
      await room.localParticipant.setCameraEnabled(newState);
      setIsVideoEnabled(newState);
    }
  };

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

  const handleLeave = () => {
    if (room) {
      room.disconnect();
    }
    router.push("/dashboard");
  };

  const participants = room?.remoteParticipants
    ? Array.from(room.remoteParticipants.values()).map((p) => ({
        id: p.sid,
        name: p.name || "Participant",
        isMuted: !p.isMicrophoneEnabled,
        isVideoEnabled: p.isCameraEnabled,
      }))
    : [];

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
      <div className="flex h-screen items-center justify-center bg-ink">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#CAFF4B] to-[#9B5DE5] rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-black animate-spin" />
            </div>
          </div>
          <p className="text-white/50 text-sm">Connecting to meeting...</p>
        </motion.div>
      </div>
    );
  }

  // Show reconnecting state
  if (connectionState === ConnectionState.Reconnecting) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <p className="text-white/50 text-sm">Reconnecting...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-ink overflow-hidden">
      {/* Meeting Header */}
      <header className="flex h-14 items-center justify-between px-4 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="text-sm font-semibold text-white hidden sm:block">MeetVerse</span>
          </div>

          <div className="w-px h-5 bg-white/[0.08]" />
          <h1 className="text-sm font-medium text-white truncate max-w-[200px]">{meetingTitle}</h1>

          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="text-xs font-medium text-red-400">REC</span>
              </motion.div>
            )}
          </AnimatePresence>

          {connectionState === ConnectionState.Connected && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-400">LIVE</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white/40">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-mono tabular-nums">{formatTime(elapsedTime)}</span>
          </div>
          <div className="w-px h-4 bg-white/[0.08]" />
          <div className="flex items-center gap-1.5 text-white/40">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">{participants.length}</span>
          </div>
          <div className="w-px h-4 bg-white/[0.08]" />
          <div className="flex items-center gap-1 text-white/30">
            <Shield className="w-3 h-3" />
            <span className="text-[10px]">E2E</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-hidden p-3">
            <LiveKitVideoGrid />
          </div>
          <TranscriptBar />
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
            onLeave={handleLeave}
          />
        </div>

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <MeetingSidebar
                activeTab={sidebarTab}
                onChangeTab={setSidebarTab}
                onClose={() => setIsSidebarOpen(false)}
                participants={participants}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
