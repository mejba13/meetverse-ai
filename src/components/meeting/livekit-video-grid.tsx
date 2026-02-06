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
import { Mic, MicOff, Pin, MoreVertical, Crown } from "lucide-react";
import { getInitials } from "@/lib/utils";

export function LiveKitVideoGrid() {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();

  const screenShareTracks = useTracks([Track.Source.ScreenShare], {
    onlySubscribed: true,
  });

  const hasScreenShare = screenShareTracks.length > 0;

  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  if (hasScreenShare) {
    const screenTrack = screenShareTracks[0];
    return (
      <div className="flex h-full gap-3">
        <div className="flex-1 rounded-2xl bg-[#0d0d0d] border border-white/[0.08] overflow-hidden relative">
          <VideoTrack
            trackRef={screenTrack}
            className="h-full w-full object-contain"
          />
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm text-white border border-white/[0.1]">
            {screenTrack.participant.name || "Unknown"} is sharing screen
          </div>
        </div>
        <div className="w-48 flex flex-col gap-2 overflow-y-auto">
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
        "grid h-full gap-3 auto-rows-fr",
        getGridClass(participants.length)
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        "group relative rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/[0.08]",
        isSmall ? "aspect-video" : ""
      )}
    >
      {/* Speaking ring animation */}
      {isSpeaking && (
        <>
          <motion.div
            className="absolute inset-0 rounded-2xl ring-2 ring-[#CAFF4B]/60 z-10 pointer-events-none"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -inset-1 rounded-2xl border-2 border-[#CAFF4B]/20 z-10 pointer-events-none"
            animate={{ opacity: [0, 0.5, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {isVideoEnabled && cameraTrack ? (
        <VideoTrack
          trackRef={cameraTrack}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            isLocal && "scale-x-[-1]"
          )}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#111111]">
          <div
            className={cn(
              "rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white/60 border-2 border-white/[0.08]",
              isSmall ? "h-12 w-12 text-lg" : "h-24 w-24 text-3xl"
            )}
          >
            {getInitials(displayName)}
          </div>
        </div>
      )}

      {/* Audio track (hidden) */}
      {audioTrack && !isLocal && (
        <AudioTrack trackRef={audioTrack} />
      )}

      {/* Host badge */}
      {isHost && !isSmall && (
        <div className="absolute top-3 left-3 z-10">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border bg-[#CAFF4B]/15 text-[#CAFF4B] border-[#CAFF4B]/20 backdrop-blur-sm">
            <Crown className="h-3 w-3" />
            Host
          </span>
        </div>
      )}

      {/* Participant info overlay */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-3">
        <div className="flex items-center gap-2">
          {isMuted ? (
            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <MicOff className="h-3 w-3 text-red-400" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <Mic className={cn("h-3 w-3", isSpeaking ? "text-[#CAFF4B]" : "text-white")} />
            </div>
          )}
          <span className={cn("font-medium text-white drop-shadow-lg", isSmall ? "text-xs" : "text-sm")}>
            {displayName}
            {isLocal && " (You)"}
          </span>
        </div>
      </div>

      {/* Hover actions */}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 z-10">
        <button className="rounded-lg bg-black/50 backdrop-blur-sm p-1.5 text-white hover:bg-black/70 border border-white/[0.1]">
          <Pin className="h-3.5 w-3.5" />
        </button>
        <button className="rounded-lg bg-black/50 backdrop-blur-sm p-1.5 text-white hover:bg-black/70 border border-white/[0.1]">
          <MoreVertical className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// Export simple video grid for non-LiveKit scenarios (fallback)
export { VideoGrid } from "./video-grid";
