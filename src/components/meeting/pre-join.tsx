"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Loader2,
  AlertCircle,
  Volume2,
  Sparkles,
  Shield,
  Users,
} from "lucide-react";
import { useDevices, useDevicePermissions } from "@/lib/hooks/use-livekit";
import { mockParticipants } from "./mock-data";

interface PreJoinProps {
  roomId: string;
  meetingTitle: string;
  onJoin: (settings: {
    displayName: string;
    audioEnabled: boolean;
    videoEnabled: boolean;
    selectedCamera?: string;
    selectedMicrophone?: string;
  }) => void;
  isLoading?: boolean;
  error?: string | null;
  defaultName?: string;
}

export function PreJoin({
  roomId,
  meetingTitle,
  onJoin,
  isLoading = false,
  error,
  defaultName = "",
}: PreJoinProps) {
  const [displayName, setDisplayName] = useState(defaultName);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const { devices, isLoading: devicesLoading } = useDevices();
  const { permissions, isChecking, requestPermissions } = useDevicePermissions();

  // Start/stop camera stream
  const startCamera = useCallback(async (deviceId?: string) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Failed to start camera:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Start/stop microphone for level monitoring
  const startMicrophone = useCallback(async (deviceId?: string) => {
    try {
      const constraints: MediaStreamConstraints = {
        video: false,
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setAudioLevel(Math.min(100, (average / 128) * 100));
        }
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } catch (err) {
      console.error("Failed to start microphone:", err);
    }
  }, []);

  const stopMicrophone = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
  }, []);

  useEffect(() => {
    if (videoEnabled && permissions.camera) {
      startCamera(selectedCamera || undefined);
    } else {
      stopCamera();
    }
    return () => { stopCamera(); };
  }, [videoEnabled, selectedCamera, permissions.camera, startCamera, stopCamera]);

  useEffect(() => {
    if (audioEnabled && permissions.microphone) {
      startMicrophone(selectedMicrophone || undefined);
    } else {
      stopMicrophone();
    }
    return () => { stopMicrophone(); };
  }, [audioEnabled, selectedMicrophone, permissions.microphone, startMicrophone, stopMicrophone]);

  useEffect(() => {
    return () => {
      stopCamera();
      stopMicrophone();
    };
  }, [stopCamera, stopMicrophone]);

  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
    if (videoEnabled) {
      startCamera(deviceId);
    }
  };

  const handleMicrophoneChange = (deviceId: string) => {
    setSelectedMicrophone(deviceId);
    if (audioEnabled) {
      stopMicrophone();
      startMicrophone(deviceId);
    }
  };

  const handleJoin = () => {
    if (!displayName.trim()) return;

    stopCamera();
    stopMicrophone();

    onJoin({
      displayName: displayName.trim(),
      audioEnabled,
      videoEnabled,
      selectedCamera: selectedCamera || undefined,
      selectedMicrophone: selectedMicrophone || undefined,
    });
  };

  const needsPermissions = permissions.camera === false || permissions.microphone === false;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-ink" />

        {/* Lime orb - top right */}
        <motion.div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
          style={{
            background: "conic-gradient(from 180deg, rgba(202,255,75,0.12), rgba(155,93,229,0.06), transparent, rgba(202,255,75,0.08))",
            filter: "blur(80px)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />

        {/* Purple orb - bottom left */}
        <motion.div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(155,93,229,0.15) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: "linear-gradient(rgba(202,255,75,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(202,255,75,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="w-full max-w-5xl px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#CAFF4B] to-[#9EF01A] flex items-center justify-center shadow-lg shadow-[#CAFF4B]/30"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-5 h-5 text-black" />
            </motion.div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            <span className="text-white">{meetingTitle}</span>
          </h1>
          <p className="text-white/40 text-sm">Room: {roomId}</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Video Preview - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="relative rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/[0.06]">
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#CAFF4B] via-[#9B5DE5] to-[#CAFF4B] z-10" />

              <div className="aspect-video relative bg-[#0d0d0d] flex items-center justify-center">
                {videoEnabled && permissions.camera ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                  </>
                ) : (
                  <div className="text-center">
                    {permissions.camera === false ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                          <AlertCircle className="w-8 h-8 text-amber-400" />
                        </div>
                        <p className="text-sm text-white/50">Camera access required</p>
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#CAFF4B]/20 to-[#9B5DE5]/20 rounded-full blur-xl" />
                          <Avatar className="relative mx-auto h-24 w-24 border-2 border-white/[0.08]">
                            <AvatarFallback className="text-3xl bg-gradient-to-br from-[#CAFF4B]/20 to-[#9B5DE5]/20 text-white">
                              {displayName ? getInitials(displayName) : "?"}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <p className="mt-4 text-sm text-white/40">Camera is off</p>
                      </>
                    )}
                  </div>
                )}

                {/* Audio level indicator */}
                <AnimatePresence>
                  {audioEnabled && permissions.microphone && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/[0.08]"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-[#CAFF4B]" />
                      <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#CAFF4B] to-[#9EF01A] rounded-full"
                          style={{ width: `${audioLevel}%` }}
                          transition={{ duration: 0.075 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Media controls overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                      !audioEnabled
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                        : "bg-white/10 backdrop-blur-sm text-white border border-white/[0.1] hover:bg-white/15"
                    )}
                    onClick={() => setAudioEnabled(!audioEnabled)}
                  >
                    {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                      !videoEnabled
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                        : "bg-white/10 backdrop-blur-sm text-white border border-white/[0.1] hover:bg-white/15"
                    )}
                    onClick={() => setVideoEnabled(!videoEnabled)}
                  >
                    {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                      showSettings
                        ? "bg-[#CAFF4B] text-black shadow-lg shadow-[#CAFF4B]/30"
                        : "bg-white/10 backdrop-blur-sm text-white border border-white/[0.1] hover:bg-white/15"
                    )}
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* Enhanced Ready badge with signal strength */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/[0.08]">
                  <div className="flex items-end gap-[2px] h-3">
                    <motion.div
                      className="w-[3px] rounded-full bg-emerald-400"
                      animate={{ height: ["3px", "5px", "3px"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="w-[3px] rounded-full bg-emerald-400"
                      animate={{ height: ["5px", "8px", "5px"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    />
                    <motion.div
                      className="w-[3px] rounded-full bg-emerald-400"
                      animate={{ height: ["8px", "12px", "8px"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    />
                  </div>
                  <span className="text-xs text-white/70 font-medium">Ready</span>
                </div>
              </div>

              {/* Already in this meeting */}
              <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.01]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-white/40">Already in this meeting</span>
                    <div className="flex -space-x-2">
                      {mockParticipants.filter(p => p.avatarUrl).slice(0, 3).map((p, i) => (
                        <div key={p.id} className="relative" style={{ zIndex: 3 - i }}>
                          <img
                            src={p.avatarUrl!}
                            alt={p.name}
                            className="w-7 h-7 rounded-full object-cover border-2 border-[#0d0d0d]"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-[#0d0d0d]" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-white/30">+3 more</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Join Form - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="relative rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/[0.06]">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#9B5DE5] via-[#CAFF4B] to-[#9B5DE5]" />

              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Join Meeting</h2>
                  <p className="text-xs text-white/40">Set up your audio and video before joining</p>
                </div>

                {/* Permission Warning */}
                <AnimatePresence>
                  {needsPermissions && !isChecking && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4"
                    >
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="h-4 w-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-400">Permissions needed</p>
                          <p className="text-xs text-white/40 mt-1">
                            Allow camera and microphone access to join.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 h-8 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                            onClick={requestPermissions}
                          >
                            Grant Access
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl bg-red-500/10 border border-red-500/20 p-4"
                    >
                      <div className="flex gap-3">
                        <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Display Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white/70">Your name</Label>
                  <Input
                    placeholder="Enter your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={isLoading}
                    className="h-12 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-[#CAFF4B]/50 focus:ring-[#CAFF4B]/20 rounded-xl"
                    onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  />
                </div>

                {/* Device Settings */}
                <AnimatePresence>
                  {showSettings && !devicesLoading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4 border-t border-white/[0.06]"
                    >
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-white/50">Camera</Label>
                        <Select value={selectedCamera} onValueChange={handleCameraChange}>
                          <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl h-10">
                            <SelectValue placeholder="Select camera" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a1a] border-white/[0.1]">
                            {devices.cameras.map((camera) => (
                              <SelectItem key={camera.deviceId} value={camera.deviceId} className="text-white">
                                {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-white/50">Microphone</Label>
                        <Select value={selectedMicrophone} onValueChange={handleMicrophoneChange}>
                          <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl h-10">
                            <SelectValue placeholder="Select microphone" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a1a] border-white/[0.1]">
                            {devices.microphones.map((mic) => (
                              <SelectItem key={mic.deviceId} value={mic.deviceId} className="text-white">
                                {mic.label || `Microphone ${mic.deviceId.slice(0, 8)}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {devices.speakers.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-white/50">Speaker</Label>
                          <Select>
                            <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white rounded-xl h-10">
                              <SelectValue placeholder="Select speaker" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-white/[0.1]">
                              {devices.speakers.map((speaker) => (
                                <SelectItem key={speaker.deviceId} value={speaker.deviceId} className="text-white">
                                  {speaker.label || `Speaker ${speaker.deviceId.slice(0, 8)}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Meeting Info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#CAFF4B]/[0.03] border border-[#CAFF4B]/[0.08]">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#CAFF4B]/60" />
                    <span className="text-xs text-white/40">End-to-end encrypted</span>
                  </div>
                  <div className="w-px h-3 bg-white/[0.08]" />
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#CAFF4B]/60" />
                    <span className="text-xs text-white/40">AI-powered</span>
                  </div>
                </div>

                {/* Join Button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(202,255,75,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleJoin}
                  disabled={!displayName.trim() || isLoading}
                  className="w-full flex items-center justify-center gap-3 h-14 rounded-xl bg-gradient-to-r from-[#CAFF4B] via-[#9EF01A] to-[#CAFF4B] bg-[length:200%_auto] text-black font-bold text-lg shadow-lg shadow-[#CAFF4B]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-right"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Join Meeting
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
