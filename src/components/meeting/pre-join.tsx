"use client";

import { useState } from "react";
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
}

export function PreJoin({
  roomId,
  meetingTitle,
  onJoin,
  isLoading = false,
  error,
}: PreJoinProps) {
  const [displayName, setDisplayName] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);

  const { devices, isLoading: devicesLoading } = useDevices();
  const { permissions, isChecking, requestPermissions } = useDevicePermissions();

  const handleJoin = () => {
    if (!displayName.trim()) {
      return;
    }

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
                {videoEnabled ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                        {displayName ? getInitials(displayName) : "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <div className="text-center">
                    <VideoOff className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Camera is off
                    </p>
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
                      onValueChange={setSelectedCamera}
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
                      onValueChange={setSelectedMicrophone}
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
