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
import { mockParticipants, type Participant, roleColors } from "./mock-data";
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
  Pin,
  MoreVertical,
  VideoOff,
  Volume2,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MeetingRoomProps {
  roomId: string;
}

type MeetingState = "loading" | "pre-join" | "connecting" | "connected" | "demo" | "error";

const loadingMessages = [
  "Initializing encryption...",
  "Preparing AI co-pilot...",
  "Setting up media channels...",
  "Connecting to servers...",
  "Almost ready...",
];

export function MeetingRoom({ roomId }: MeetingRoomProps) {
  const router = useRouter();
  const [state, setState] = useState<MeetingState>("loading");
  const [error] = useState<string | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [displayName, setDisplayName] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

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

  const { data: meeting, isLoading: meetingLoading, error: meetingError } =
    trpc.meeting.getByRoomId.useQuery({ roomId });

  const {
    token,
    serverUrl,
    error: tokenError,
    refetch: refetchToken,
  } = useLiveKitToken({ roomId, displayName });

  useEffect(() => {
    if (meetingLoading) {
      setState("loading");
    } else if (meetingError) {
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

  useEffect(() => {
    if (state === "connecting") {
      const timeout = setTimeout(() => {
        if (!token || !serverUrl) {
          setState("demo");
        }
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [state, token, serverUrl]);

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
    setState("demo");
  }, []);

  // Loading state
  if (state === "loading") {
    return <LoadingState />;
  }

  // Error state
  if (state === "error") {
    return <ErrorState error={error} />;
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

  // Demo mode
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
        <MeetingRoomContent meetingTitle={meetingTitle} />
        <RoomAudioRenderer />
      </LiveKitRoom>
    );
  }

  // Waiting for token (connecting state)
  if (state === "connecting") {
    return <ConnectingState />;
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
// LOADING STATE
// ============================================

function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 90));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-ink relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-ink" />
        <motion.div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #CAFF4B 0%, transparent 60%)" }}
          animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #9B5DE5 0%, transparent 60%)" }}
          animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Logo with rotating ring */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <motion.div
            className="absolute -inset-2 rounded-2xl"
            style={{
              background: "conic-gradient(from 0deg, #CAFF4B, #9B5DE5, #CAFF4B)",
              filter: "blur(8px)",
              opacity: 0.4,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#CAFF4B] to-[#9B5DE5] rounded-2xl blur-xl opacity-30 animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A] flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-black" />
          </div>
        </div>

        {/* Cycling status messages */}
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-white/50 text-sm mb-6"
          >
            {loadingMessages[messageIndex]}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-white/[0.06] rounded-full mx-auto overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#CAFF4B] to-[#9B5DE5]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// CONNECTING STATE
// ============================================

function ConnectingState() {
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
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#9B5DE5]/30"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9B5DE5] to-[#CAFF4B] rounded-2xl blur-xl opacity-50 animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9B5DE5] to-[#7B2FD4] flex items-center justify-center">
            {/* Waveform animation */}
            <div className="flex items-center gap-[3px]">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full bg-white"
                  animate={{ height: ["6px", "16px", "8px", "14px", "6px"] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.12,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-white/50 text-sm">Connecting to meeting...</p>
      </motion.div>
    </div>
  );
}

// ============================================
// ERROR STATE
// ============================================

function ErrorState({ error }: { error: string | null }) {
  const router = useRouter();

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
        {/* Glass card */}
        <div className="relative rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] p-8">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-red-400 to-red-500" />

          {/* Red glow orb behind icon */}
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-500 rounded-2xl blur-xl opacity-20" />
            <div className="relative w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
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

          <p className="mt-6 text-[11px] text-white/20">
            Need help? Contact support@meetverse.ai
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// MEETING HEADER (shared between Demo & Live)
// ============================================

interface MeetingHeaderProps {
  meetingTitle: string;
  isRecording: boolean;
  elapsedTime: number;
  participantCount: number;
  isDemo?: boolean;
  isLive?: boolean;
}

function MeetingHeader({
  meetingTitle,
  isRecording,
  elapsedTime,
  participantCount,
  isDemo,
  isLive,
}: MeetingHeaderProps) {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <header className="relative flex h-14 items-center justify-between px-4 bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.06]">
      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#CAFF4B]/20 to-transparent" />

      <div className="flex items-center gap-4">
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="text-sm font-semibold text-white hidden sm:block">MeetVerse</span>
        </motion.div>

        <div className="w-px h-5 bg-white/[0.08]" />
        <h1 className="text-sm font-medium text-white truncate max-w-[200px]">{meetingTitle}</h1>

        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 shadow-[0_0_10px_rgba(239,68,68,0.15)]"
            >
              <motion.span
                className="h-2 w-2 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs font-medium text-red-400">REC</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LIVE badge */}
        {(isLive || isDemo) && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] font-medium text-emerald-400">LIVE</span>
          </div>
        )}

        {isDemo && (
          <div className="flex items-center gap-1.5 rounded-full bg-[#9B5DE5]/10 border border-[#9B5DE5]/20 px-2.5 py-1">
            <span className="text-[10px] font-medium text-[#9B5DE5]">DEMO</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Network quality indicator */}
        <div className="flex items-center gap-1 text-white/30">
          <div className="flex items-end gap-[2px] h-3">
            <div className="w-[3px] h-[5px] rounded-full bg-emerald-400" />
            <div className="w-[3px] h-[8px] rounded-full bg-emerald-400" />
            <div className="w-[3px] h-[12px] rounded-full bg-emerald-400" />
          </div>
        </div>
        <div className="w-px h-4 bg-white/[0.08]" />
        <div className="flex items-center gap-1.5 text-[#CAFF4B]/60">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-mono tabular-nums">{formatTime(elapsedTime)}</span>
        </div>
        <div className="w-px h-4 bg-white/[0.08]" />
        <div className="flex items-center gap-1.5 text-white/40">
          <Users className="w-3.5 h-3.5" />
          <span className="text-xs">{participantCount}</span>
        </div>
        <div className="w-px h-4 bg-white/[0.08]" />
        <div className="flex items-center gap-1 text-white/30">
          <Shield className="w-3 h-3" />
          <span className="text-[10px]">E2E</span>
        </div>
      </div>
    </header>
  );
}

// ============================================
// DEMO MEETING ROOM (works without LiveKit)
// ============================================

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
  const [activeSpeakerId, setActiveSpeakerId] = useState("1");

  // Meeting timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Random speaking simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const speakerIds = mockParticipants.filter(p => !p.isMuted).map(p => p.id);
      const randomId = speakerIds[Math.floor(Math.random() * speakerIds.length)];
      setActiveSpeakerId(randomId);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Manage local camera stream
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
        .catch(() => {});
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

  const handleLeave = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    router.push("/dashboard");
  };

  const participants: Participant[] = mockParticipants.map((p, i) => ({
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
    <div className="flex h-screen flex-col bg-ink overflow-hidden relative">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #CAFF4B 0%, transparent 60%)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #9B5DE5 0%, transparent 60%)" }}
        />
      </div>

      {/* Meeting Header */}
      <MeetingHeader
        meetingTitle={meetingTitle}
        isRecording={isRecording}
        elapsedTime={elapsedTime}
        participantCount={participants.length}
        isDemo
        isLive
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        <div className="flex flex-1 flex-col">
          {/* Demo Video Grid - 6 participants, 3 columns */}
          <div className="flex-1 overflow-hidden p-3">
            <div className="grid h-full gap-2.5 auto-rows-fr grid-cols-3 p-0.5">
              {participants.map((p, i) => {
                const speaking = activeSpeakerId === p.id && !p.isMuted;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.92, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: i * 0.06,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative rounded-xl md:rounded-2xl overflow-hidden bg-obsidian border border-white/[0.06] transition-all duration-300 hover:border-white/[0.12]"
                  >
                    {/* Speaking indicator — animated glow ring */}
                    {speaking && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-xl md:rounded-2xl z-10 pointer-events-none"
                          style={{
                            boxShadow: "inset 0 0 0 2px rgba(202,255,75,0.5), 0 0 20px rgba(202,255,75,0.15)",
                          }}
                          animate={{
                            boxShadow: [
                              "inset 0 0 0 2px rgba(202,255,75,0.3), 0 0 15px rgba(202,255,75,0.1)",
                              "inset 0 0 0 2px rgba(202,255,75,0.6), 0 0 25px rgba(202,255,75,0.2)",
                              "inset 0 0 0 2px rgba(202,255,75,0.3), 0 0 15px rgba(202,255,75,0.1)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        {/* Audio wave bars */}
                        <div className="absolute top-3 right-3 z-20 flex items-end gap-[2px] h-4">
                          {[0, 1, 2, 3].map((j) => (
                            <motion.div
                              key={j}
                              className="w-[3px] rounded-full bg-lime"
                              animate={{ height: ["30%", "100%", "50%", "80%", "30%"] }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: j * 0.1,
                                ease: "easeInOut",
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Video or Avatar */}
                    {p.isVideoEnabled && i === 0 ? (
                      <div className="absolute inset-0">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-transparent pointer-events-none" />
                      </div>
                    ) : p.isVideoEnabled ? (
                      <div className="absolute inset-0">
                        <div className={cn("absolute inset-0 bg-gradient-to-br", p.accentColor || "from-lime/20 to-lime/5")} />
                        {/* Noise texture */}
                        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          {p.avatarUrl ? (
                            <div className="relative">
                              <div className="h-[5.5rem] w-[5.5rem] rounded-full overflow-hidden border-[2.5px] border-white/[0.12] shadow-xl">
                                <img
                                  src={p.avatarUrl}
                                  alt={p.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="absolute -inset-2 rounded-full bg-white/[0.04] blur-md -z-10" />
                            </div>
                          ) : (
                            <div className="h-[5.5rem] w-[5.5rem] rounded-full bg-gradient-to-br from-white/[0.08] to-white/[0.03] flex items-center justify-center text-2xl font-semibold text-white/80 border-[2.5px] border-white/[0.08] shadow-xl">
                              {getInitials(p.name)}
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-carbon">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            {p.avatarUrl ? (
                              <div className="h-[4.5rem] w-[4.5rem] rounded-full overflow-hidden border-[2.5px] border-white/[0.06] mx-auto">
                                <img
                                  src={p.avatarUrl}
                                  alt={p.name}
                                  className="h-full w-full object-cover opacity-50 grayscale-[30%]"
                                />
                              </div>
                            ) : (
                              <div className="mx-auto h-[4.5rem] w-[4.5rem] rounded-full bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center text-xl text-white/40 border-[2.5px] border-white/[0.05]">
                                {getInitials(p.name)}
                              </div>
                            )}
                            <div className="flex items-center justify-center gap-1.5 mt-2.5">
                              <VideoOff className="w-3 h-3 text-white/25" />
                              <p className="text-[11px] text-white/25 font-medium">Camera off</p>
                            </div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                      </div>
                    )}

                    {/* Role badge */}
                    {p.role && p.role !== "attendee" && (
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span
                          className={cn(
                            "px-2 py-[3px] rounded-md text-[9px] font-bold uppercase tracking-wider border backdrop-blur-md",
                            roleColors[p.role]
                          )}
                        >
                          {p.role}
                        </span>
                      </div>
                    )}

                    {/* Bottom info bar */}
                    <div className="absolute bottom-0 left-0 right-0 z-10">
                      <div className="flex items-center justify-between px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          {p.isMuted ? (
                            <div className="w-6 h-6 rounded-full bg-red-500/20 backdrop-blur-sm flex items-center justify-center border border-red-500/20">
                              <MicOff className="h-3 w-3 text-red-400" />
                            </div>
                          ) : (
                            <div className={cn(
                              "w-6 h-6 rounded-full backdrop-blur-sm flex items-center justify-center border",
                              speaking
                                ? "bg-lime/20 border-lime/30"
                                : "bg-white/[0.08] border-white/[0.06]"
                            )}>
                              <Mic className={cn("h-3 w-3", speaking ? "text-lime" : "text-white/70")} />
                            </div>
                          )}
                          <span className="text-[13px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                            {p.name}{i === 0 ? " (You)" : ""}
                          </span>
                        </div>
                        {p.status === "active" && (
                          <Volume2 className="w-3 h-3 text-white/20" />
                        )}
                      </div>
                    </div>

                    {/* Hover actions */}
                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-all duration-200 group-hover:opacity-100 z-10 translate-y-1 group-hover:translate-y-0">
                      <button className="rounded-lg bg-black/60 backdrop-blur-md p-1.5 text-white/80 hover:bg-black/80 border border-white/[0.08] transition-colors hover:text-white">
                        <Pin className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-lg bg-black/60 backdrop-blur-md p-1.5 text-white/80 hover:bg-black/80 border border-white/[0.08] transition-colors hover:text-white">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
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
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
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

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const participants: Participant[] = room?.remoteParticipants
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
    return <ConnectingState />;
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
    <div className="flex h-screen flex-col bg-ink overflow-hidden relative">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #CAFF4B 0%, transparent 60%)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #9B5DE5 0%, transparent 60%)" }}
        />
      </div>

      {/* Meeting Header */}
      <MeetingHeader
        meetingTitle={meetingTitle}
        isRecording={isRecording}
        elapsedTime={elapsedTime}
        participantCount={participants.length}
        isLive={connectionState === ConnectionState.Connected}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative z-10">
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
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
