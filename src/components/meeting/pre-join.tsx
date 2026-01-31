"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { useDevices, useDevicePermissions } from "@/lib/hooks/use-livekit";

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
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false, // Audio is handled separately
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

      // Set up audio analysis
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Monitor audio level
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

  // Handle video toggle
  useEffect(() => {
    if (videoEnabled && permissions.camera) {
      startCamera(selectedCamera || undefined);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [videoEnabled, selectedCamera, permissions.camera, startCamera, stopCamera]);

  // Handle audio toggle
  useEffect(() => {
    if (audioEnabled && permissions.microphone) {
      startMicrophone(selectedMicrophone || undefined);
    } else {
      stopMicrophone();
    }

    return () => {
      stopMicrophone();
    };
  }, [audioEnabled, selectedMicrophone, permissions.microphone, startMicrophone, stopMicrophone]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      stopMicrophone();
    };
  }, [stopCamera, stopMicrophone]);

  // Handle camera selection change
  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
    if (videoEnabled) {
      startCamera(deviceId);
    }
  };

  // Handle microphone selection change
  const handleMicrophoneChange = (deviceId: string) => {
    setSelectedMicrophone(deviceId);
    if (audioEnabled) {
      stopMicrophone();
      startMicrophone(deviceId);
    }
  };

  const handleJoin = () => {
    if (!displayName.trim()) {
      return;
    }

    // Stop streams before joining (LiveKit will manage its own streams)
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Meeting Info */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">{meetingTitle}</h1>
          <p className="text-sm text-muted-foreground">Room: {roomId}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Video Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center relative overflow-hidden">
                {videoEnabled && permissions.camera ? (
                  <>
                    {/* Live camera preview */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </>
                ) : (
                  <div className="text-center">
                    {permissions.camera === false ? (
                      <>
                        <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Camera access required
                        </p>
                      </>
                    ) : (
                      <>
                        <Avatar className="mx-auto h-20 w-20">
                          <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                            {displayName ? getInitials(displayName) : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Camera is off
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* Media controls overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className={cn(
                      "rounded-full",
                      !audioEnabled && "bg-destructive text-destructive-foreground"
                    )}
                    onClick={() => setAudioEnabled(!audioEnabled)}
                  >
                    {audioEnabled ? (
                      <Mic className="h-4 w-4" />
                    ) : (
                      <MicOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className={cn(
                      "rounded-full",
                      !videoEnabled && "bg-destructive text-destructive-foreground"
                    )}
                    onClick={() => setVideoEnabled(!videoEnabled)}
                  >
                    {videoEnabled ? (
                      <Video className="h-4 w-4" />
                    ) : (
                      <VideoOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                {/* Audio level indicator */}
                {audioEnabled && permissions.microphone && (
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 rounded-full px-2 py-1">
                    <Volume2 className="h-3 w-3 text-white" />
                    <div className="w-16 h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-75"
                        style={{ width: `${audioLevel}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Join Form */}
          <Card>
            <CardHeader>
              <CardTitle>Join Meeting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Permission Warning */}
              {needsPermissions && !isChecking && (
                <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3 text-sm">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-500">
                        Permissions needed
                      </p>
                      <p className="text-muted-foreground">
                        Please allow camera and microphone access to join.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={requestPermissions}
                      >
                        Grant Access
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <p className="text-destructive">{error}</p>
                  </div>
                </div>
              )}

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Your name</Label>
                <Input
                  id="displayName"
                  placeholder="Enter your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Device Settings */}
              {showSettings && !devicesLoading && (
                <div className="space-y-3 pt-2 border-t">
                  <div className="space-y-2">
                    <Label>Camera</Label>
                    <Select
                      value={selectedCamera}
                      onValueChange={handleCameraChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select camera" />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.cameras.map((camera) => (
                          <SelectItem key={camera.deviceId} value={camera.deviceId}>
                            {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Microphone</Label>
                    <Select
                      value={selectedMicrophone}
                      onValueChange={handleMicrophoneChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select microphone" />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.microphones.map((mic) => (
                          <SelectItem key={mic.deviceId} value={mic.deviceId}>
                            {mic.label || `Microphone ${mic.deviceId.slice(0, 8)}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {devices.speakers.length > 0 && (
                    <div className="space-y-2">
                      <Label>Speaker</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select speaker" />
                        </SelectTrigger>
                        <SelectContent>
                          {devices.speakers.map((speaker) => (
                            <SelectItem key={speaker.deviceId} value={speaker.deviceId}>
                              {speaker.label || `Speaker ${speaker.deviceId.slice(0, 8)}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Join Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleJoin}
                disabled={!displayName.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Meeting"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
