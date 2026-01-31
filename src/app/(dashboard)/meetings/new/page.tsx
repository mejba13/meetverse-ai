"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Video, Loader2, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/api/client";
import { useToast } from "@/components/ui/use-toast";

export default function NewMeetingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("Quick Meeting");
  const [copied, setCopied] = useState(false);
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState(true);

  const createMeeting = trpc.meeting.create.useMutation({
    onSuccess: (meeting) => {
      router.push(`/meeting/${meeting.roomId}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to create meeting",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartMeeting = () => {
    createMeeting.mutate({
      title,
      settings: {
        waitingRoom,
        recording,
        transcription,
      },
    });
  };

  const handleCopyLink = () => {
    if (createMeeting.data) {
      navigator.clipboard.writeText(
        `${window.location.origin}/meeting/${createMeeting.data.roomId}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
          <Video className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Start a New Meeting</h1>
        <p className="text-muted-foreground">
          Create an instant meeting and invite others to join
        </p>
      </div>

      {/* Meeting Form */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Details</CardTitle>
          <CardDescription>
            Configure your meeting settings before starting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              placeholder="Enter meeting title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <Separator />

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Meeting Options</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Waiting Room</Label>
                <p className="text-sm text-muted-foreground">
                  Participants wait for approval to join
                </p>
              </div>
              <Switch
                checked={waitingRoom}
                onCheckedChange={setWaitingRoom}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recording</Label>
                <p className="text-sm text-muted-foreground">
                  Record the meeting for later review
                </p>
              </div>
              <Switch
                checked={recording}
                onCheckedChange={setRecording}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI Transcription</Label>
                <p className="text-sm text-muted-foreground">
                  Enable real-time transcription and AI summaries
                </p>
              </div>
              <Switch
                checked={transcription}
                onCheckedChange={setTranscription}
              />
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={handleStartMeeting}
              disabled={!title.trim() || createMeeting.isPending}
            >
              {createMeeting.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Video className="mr-2 h-4 w-4" />
                  Start Meeting
                </>
              )}
            </Button>
            {createMeeting.data && (
              <Button variant="outline" onClick={handleCopyLink}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
