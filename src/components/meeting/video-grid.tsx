"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Mic, MicOff, Pin, MoreVertical } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { type Participant, roleColors } from "./mock-data";

interface VideoGridProps {
  participants: Participant[];
  isScreenSharing?: boolean;
}

export function VideoGrid({ participants, isScreenSharing }: VideoGridProps) {
  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  if (isScreenSharing) {
    return (
      <div className="flex h-full gap-3">
        <div className="flex-1 rounded-2xl bg-[#0d0d0d] border border-white/[0.08] flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-medium text-white mb-2">Screen Share</div>
            <div className="text-sm text-white/40">
              You are sharing your screen
            </div>
          </div>
        </div>
        <div className="w-48 flex flex-col gap-2 overflow-y-auto">
          {participants.map((participant) => (
            <ParticipantTile
              key={participant.id}
              participant={participant}
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
        <ParticipantTile key={participant.id} participant={participant} index={i} />
      ))}
    </div>
  );
}

interface ParticipantTileProps {
  participant: Participant;
  size?: "default" | "small";
  index?: number;
  isSpeaking?: boolean;
}

function ParticipantTile({ participant, size = "default", index = 0, isSpeaking }: ParticipantTileProps) {
  const isSmall = size === "small";
  const speaking = isSpeaking ?? (!participant.isMuted && participant.id === "1");

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
      {speaking && (
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

      {participant.isVideoEnabled ? (
        <div className={cn("absolute inset-0 bg-gradient-to-br", participant.accentColor || "from-[#CAFF4B]/30 to-[#9EF01A]/20")}>
          <div className="absolute inset-0 flex items-center justify-center">
            {participant.avatarUrl ? (
              <img
                src={participant.avatarUrl}
                alt={participant.name}
                className={cn(
                  "rounded-full object-cover border-2 border-white/[0.1]",
                  isSmall ? "h-12 w-12" : "h-24 w-24"
                )}
              />
            ) : (
              <div
                className={cn(
                  "rounded-full bg-white/10 flex items-center justify-center text-white border-2 border-white/[0.1]",
                  isSmall ? "h-12 w-12 text-lg" : "h-24 w-24 text-3xl"
                )}
              >
                {getInitials(participant.name)}
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#111111]">
          <div className="text-center">
            {participant.avatarUrl ? (
              <img
                src={participant.avatarUrl}
                alt={participant.name}
                className={cn(
                  "mx-auto rounded-full object-cover border-2 border-white/[0.08] opacity-60",
                  isSmall ? "h-12 w-12" : "h-20 w-20"
                )}
              />
            ) : (
              <div
                className={cn(
                  "mx-auto rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white/60 border-2 border-white/[0.08]",
                  isSmall ? "h-12 w-12 text-lg" : "h-20 w-20 text-2xl"
                )}
              >
                {getInitials(participant.name)}
              </div>
            )}
            {!isSmall && <p className="mt-2 text-xs text-white/30">Camera off</p>}
          </div>
        </div>
      )}

      {/* Role badge */}
      {participant.role && participant.role !== "attendee" && !isSmall && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border backdrop-blur-sm",
              roleColors[participant.role]
            )}
          >
            {participant.role}
          </span>
        </div>
      )}

      {/* Participant info overlay */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-3">
        <div className="flex items-center gap-2">
          {participant.isMuted ? (
            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <MicOff className="h-3 w-3 text-red-400" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <Mic className={cn("h-3 w-3", speaking ? "text-[#CAFF4B]" : "text-white")} />
            </div>
          )}
          <span className={cn("font-medium text-white drop-shadow-lg", isSmall ? "text-xs" : "text-sm")}>
            {participant.name}
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
