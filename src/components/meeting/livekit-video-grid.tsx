"use client";

import {
  useParticipants,
  useLocalParticipant,
  useTracks,
  VideoTrack,
  AudioTrack,
  useIsSpeaking,
} from "@livekit/components-react";
import { Track, Participant } from "livekit-client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Mic, MicOff, Pin, MoreVertical, Crown, VideoOff, Volume2 } from "lucide-react";
import { getInitials } from "@/lib/utils";

export function LiveKitVideoGrid() {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();

  const screenShareTracks = useTracks([Track.Source.ScreenShare], {
    onlySubscribed: true,
  });

  const hasScreenShare = screenShareTracks.length > 0;

  const getGridLayout = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3 md:grid-cols-3";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  if (hasScreenShare) {
    const screenTrack = screenShareTracks[0];
    return (
      <div className="flex h-full gap-2.5">
        <div className="flex-1 rounded-2xl bg-obsidian border border-white/[0.06] overflow-hidden relative">
          <VideoTrack
            trackRef={screenTrack}
            className="h-full w-full object-contain"
          />
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md rounded-xl px-3.5 py-2 text-sm text-white border border-white/[0.08] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            {screenTrack.participant.name || "Unknown"} is sharing screen
          </div>
        </div>
        <div className="w-52 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
          {participants.map((participant) => (
            <ParticipantTile
              key={participant.sid}
              participant={participant}
              isLocal={participant.sid === localParticipant?.sid}
              size="small"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid h-full gap-2.5 auto-rows-fr p-0.5",
        getGridLayout(participants.length)
      )}
    >
      {participants.map((participant, i) => (
        <ParticipantTile
          key={participant.sid}
          participant={participant}
          isLocal={participant.sid === localParticipant?.sid}
          index={i}
        />
      ))}
    </div>
  );
}

interface ParticipantTileProps {
  participant: Participant;
  isLocal?: boolean;
  size?: "default" | "small";
  index?: number;
}

function ParticipantTile({ participant, isLocal, size = "default", index = 0 }: ParticipantTileProps) {
  const isSmall = size === "small";

  const cameraTracks = useTracks([Track.Source.Camera], {
    onlySubscribed: true,
  });

  const cameraTrack = cameraTracks.find(
    (track) => track.participant.sid === participant.sid
  );

  const isSpeaking = useIsSpeaking(participant);

  const audioTracks = useTracks([Track.Source.Microphone], {
    onlySubscribed: true,
  });

  const audioTrack = audioTracks.find(
    (track) => track.participant.sid === participant.sid
  );

  const isMuted = !audioTrack || audioTrack.publication?.isMuted;
  const isVideoEnabled = cameraTrack && !cameraTrack.publication?.isMuted;

  let isHost = false;
  try {
    if (participant.metadata) {
      isHost = JSON.parse(participant.metadata).isHost === true;
    }
  } catch {
    // Ignore JSON parse errors
  }

  const displayName = participant.name || "Participant";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "group relative overflow-hidden",
        "rounded-xl md:rounded-2xl",
        "bg-obsidian",
        "border border-white/[0.06]",
        "transition-all duration-300",
        "hover:border-white/[0.12]",
        isSmall ? "aspect-video" : ""
      )}
    >
      {/* Speaking indicator — animated glow ring */}
      {isSpeaking && (
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
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full bg-lime"
                animate={{ height: ["30%", "100%", "50%", "80%", "30%"] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Video / Avatar content */}
      {isVideoEnabled && cameraTrack ? (
        <div className="absolute inset-0">
          <VideoTrack
            trackRef={cameraTrack}
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              isLocal && "scale-x-[-1]"
            )}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-transparent pointer-events-none" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-carbon">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className={cn(
                  "mx-auto rounded-full bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center text-white/40 border-[2.5px] border-white/[0.05]",
                  isSmall ? "h-12 w-12 text-base" : "h-[5rem] w-[5rem] text-2xl"
                )}
              >
                {getInitials(displayName)}
              </div>
              {!isSmall && (
                <div className="flex items-center justify-center gap-1.5 mt-2.5">
                  <VideoOff className="w-3 h-3 text-white/25" />
                  <p className="text-[11px] text-white/25 font-medium">Camera off</p>
                </div>
              )}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Audio track (hidden) */}
      {audioTrack && !isLocal && (
        <AudioTrack trackRef={audioTrack} />
      )}

      {/* Host badge */}
      {isHost && !isSmall && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="flex items-center gap-1 px-2 py-[3px] rounded-md text-[9px] font-bold uppercase tracking-wider border bg-lime/15 text-lime border-lime/20 backdrop-blur-md">
            <Crown className="h-3 w-3" />
            Host
          </span>
        </div>
      )}

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className={cn(
          "flex items-center justify-between",
          isSmall ? "px-2 py-1.5" : "px-3 py-2.5"
        )}>
          <div className="flex items-center gap-2">
            {isMuted ? (
              <div className={cn(
                "rounded-full bg-red-500/20 backdrop-blur-sm flex items-center justify-center border border-red-500/20",
                isSmall ? "w-5 h-5" : "w-6 h-6"
              )}>
                <MicOff className={cn("text-red-400", isSmall ? "h-2.5 w-2.5" : "h-3 w-3")} />
              </div>
            ) : (
              <div className={cn(
                "rounded-full backdrop-blur-sm flex items-center justify-center border",
                isSpeaking
                  ? "bg-lime/20 border-lime/30"
                  : "bg-white/[0.08] border-white/[0.06]",
                isSmall ? "w-5 h-5" : "w-6 h-6"
              )}>
                <Mic className={cn(
                  isSpeaking ? "text-lime" : "text-white/70",
                  isSmall ? "h-2.5 w-2.5" : "h-3 w-3"
                )} />
              </div>
            )}
            <span className={cn(
              "font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]",
              isSmall ? "text-[10px]" : "text-[13px]"
            )}>
              {displayName}
              {isLocal && " (You)"}
            </span>
          </div>

          {!isSmall && (
            <div className="flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-white/20" />
            </div>
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
}

// Export simple video grid for non-LiveKit scenarios (fallback)
export { VideoGrid } from "./video-grid";
