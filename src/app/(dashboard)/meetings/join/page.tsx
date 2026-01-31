"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function JoinMeetingPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      setError("Please enter a meeting code");
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      // Extract room ID from various formats
      let roomId = roomCode.trim();

      // Handle full URLs
      if (roomId.includes("/meeting/")) {
        const match = roomId.match(/\/meeting\/([^/?]+)/);
        if (match) {
          roomId = match[1];
        }
      }

      // Validate room ID format (alphanumeric with hyphens)
      if (!/^[a-zA-Z0-9-]+$/.test(roomId)) {
        throw new Error("Invalid meeting code format");
      }

      // Navigate to the meeting room
      router.push(`/meeting/${roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join meeting");
      setIsJoining(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isJoining) {
      handleJoin();
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <LogIn className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Join a Meeting</h1>
        <p className="text-muted-foreground">
          Enter a meeting code or link to join
        </p>
      </div>

      {/* Join Form */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Code</CardTitle>
          <CardDescription>
            Enter the meeting code shared by the host
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                <p className="text-destructive">{error}</p>
              </div>
            </div>
          )}

          {/* Room Code Input */}
          <div className="space-y-2">
            <Label htmlFor="roomCode">Meeting Code or Link</Label>
            <Input
              id="roomCode"
              placeholder="abc-xyz-123 or paste meeting link"
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              disabled={isJoining}
            />
            <p className="text-xs text-muted-foreground">
              You can paste the full meeting link or just the meeting code
            </p>
          </div>

          {/* Join Button */}
          <Button
            className="w-full"
            onClick={handleJoin}
            disabled={!roomCode.trim() || isJoining}
          >
            {isJoining ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Join Meeting
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Help Text */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have a meeting code?{" "}
        <Link href="/meetings/new" className="text-primary hover:underline">
          Start a new meeting
        </Link>
      </p>
    </div>
  );
}
