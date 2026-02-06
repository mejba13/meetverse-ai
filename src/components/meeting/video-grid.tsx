"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Mic, MicOff, Pin, MoreVertical, Video, VideoOff, Volume2 } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { type Participant, roleColors } from "./mock-data";

// ============================================
// GRID LAYOUT — Adaptive responsive grid
// ============================================
interface VideoGridProps {
  participants: Participant[];
  isScreenSharing?: boolean;
}

export function VideoGrid({ participants, isScreenSharing }: VideoGridProps) {
  const getGridLayout = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3 md:grid-cols-3";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  if (isScreenSharing) {
    return (
      <div className="flex h-full gap-2.5">
        {/* Main screen share area */}
        <div className="flex-1 rounded-2xl bg-obsidian border border-white/[0.06] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-lime/[0.02] to-purple/[0.02]" />
          <div className="text-center relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-lime/10 border border-lime/20 flex items-center justify-center mx-auto mb-4">
              <Video className="w-7 h-7 text-lime" />
            </div>
            <div className="text-lg font-semibold text-white mb-1">Screen Share</div>
            <div className="text-sm text-white/40">You are sharing your screen</div>
          </div>
        </div>
        {/* Participant sidebar strip */}
        <div className="w-52 flex flex-col gap-2 overflow-y-auto scrollbar-hide">
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
        "grid h-full gap-2.5 auto-rows-fr p-0.5",
        getGridLayout(participants.length)
      )}
    >
      {participants.map((participant, i) => (
        <ParticipantTile key={participant.id} participant={participant} index={i} />
      ))}
    </div>
  );
}

// ============================================
// PARTICIPANT TILE — Premium redesign
// ============================================
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
      {/* Speaking indicator — animated gradient ring */}
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

      {/* ============================================ */}
      {/* VIDEO ON — Gradient backdrop with avatar */}
      {/* ============================================ */}
      {participant.isVideoEnabled ? (
        <div className="absolute inset-0">
          {/* Gradient background */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br",
            participant.accentColor || "from-lime/20 to-lime/5"
          )} />
          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Avatar */}
          <div className="absolute inset-0 flex items-center justify-center">
            {participant.avatarUrl ? (
              <div className="relative">
                <div className={cn(
                  "rounded-full overflow-hidden border-[2.5px] border-white/[0.12] shadow-xl",
                  isSmall ? "h-12 w-12" : "h-[5.5rem] w-[5.5rem]"
                )}>
                  <img
                    src={participant.avatarUrl}
                    alt={participant.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Glow ring behind avatar */}
                {!isSmall && (
                  <div className="absolute -inset-2 rounded-full bg-white/[0.04] blur-md -z-10" />
                )}
              </div>
            ) : (
              <div className={cn(
                "rounded-full bg-gradient-to-br from-white/[0.08] to-white/[0.03] flex items-center justify-center font-semibold text-white/80 border-[2.5px] border-white/[0.08] shadow-xl",
                isSmall ? "h-12 w-12 text-base" : "h-[5.5rem] w-[5.5rem] text-2xl"
              )}>
                {getInitials(participant.name)}
              </div>
            )}
          </div>
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>
      ) : (
        /* ============================================ */
        /* VIDEO OFF — Elegant dark tile */
        /* ============================================ */
        <div className="absolute inset-0 bg-carbon">
          {/* Subtle radial gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {participant.avatarUrl ? (
                <div className="relative mx-auto">
                  <div className={cn(
                    "rounded-full overflow-hidden border-[2.5px] border-white/[0.06] mx-auto",
                    isSmall ? "h-12 w-12" : "h-[4.5rem] w-[4.5rem]"
                  )}>
                    <img
                      src={participant.avatarUrl}
                      alt={participant.name}
                      className="h-full w-full object-cover opacity-50 grayscale-[30%]"
                    />
                  </div>
                </div>
              ) : (
                <div className={cn(
                  "mx-auto rounded-full bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center text-white/40 border-[2.5px] border-white/[0.05]",
                  isSmall ? "h-12 w-12 text-base" : "h-[4.5rem] w-[4.5rem] text-xl"
                )}>
                  {getInitials(participant.name)}
                </div>
              )}
              {!isSmall && (
                <div className="flex items-center justify-center gap-1.5 mt-2.5">
                  <VideoOff className="w-3 h-3 text-white/25" />
                  <p className="text-[11px] text-white/25 font-medium">Camera off</p>
                </div>
              )}
            </div>
          </div>
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* ============================================ */}
      {/* ROLE BADGE — Premium styled */}
      {/* ============================================ */}
      {participant.role && participant.role !== "attendee" && !isSmall && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={cn(
              "px-2 py-[3px] rounded-md text-[9px] font-bold uppercase tracking-wider border backdrop-blur-md",
              roleColors[participant.role]
            )}
          >
            {participant.role}
          </span>
        </div>
      )}

      {/* ============================================ */}
      {/* BOTTOM INFO BAR — Glassmorphism overlay */}
      {/* ============================================ */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className={cn(
          "flex items-center justify-between",
          isSmall ? "px-2 py-1.5" : "px-3 py-2.5"
        )}>
          <div className="flex items-center gap-2">
            {/* Mic indicator */}
            {participant.isMuted ? (
              <div className={cn(
                "rounded-full bg-red-500/20 backdrop-blur-sm flex items-center justify-center border border-red-500/20",
                isSmall ? "w-5 h-5" : "w-6 h-6"
              )}>
                <MicOff className={cn("text-red-400", isSmall ? "h-2.5 w-2.5" : "h-3 w-3")} />
              </div>
            ) : (
              <div className={cn(
                "rounded-full backdrop-blur-sm flex items-center justify-center border",
                speaking
                  ? "bg-lime/20 border-lime/30"
                  : "bg-white/[0.08] border-white/[0.06]",
                isSmall ? "w-5 h-5" : "w-6 h-6"
              )}>
                <Mic className={cn(
                  speaking ? "text-lime" : "text-white/70",
                  isSmall ? "h-2.5 w-2.5" : "h-3 w-3"
                )} />
              </div>
            )}
            {/* Name */}
            <span className={cn(
              "font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]",
              isSmall ? "text-[10px]" : "text-[13px]"
            )}>
              {participant.name}
            </span>
          </div>

          {/* Connection quality dot */}
          {!isSmall && participant.status === "active" && (
            <div className="flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-white/20" />
            </div>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* HOVER ACTIONS — Refined buttons */}
      {/* ============================================ */}
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
