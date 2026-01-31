"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Users,
  MoreVertical,
  Play,
  ExternalLink,
  Copy,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/api/client";
import { cn } from "@/lib/utils";

function getStatusBadge(status: string) {
  const variants: Record<string, { label: string; className: string }> = {
    SCHEDULED: { label: "Scheduled", className: "bg-blue-500/10 text-blue-500" },
    LIVE: { label: "Live", className: "bg-green-500/10 text-green-500" },
    ENDED: { label: "Ended", className: "bg-gray-500/10 text-gray-500" },
    CANCELLED: { label: "Cancelled", className: "bg-red-500/10 text-red-500" },
  };
  const variant = variants[status] || variants.SCHEDULED;
  return <Badge className={variant.className}>{variant.label}</Badge>;
}

export default function MeetingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const { data: meetings, isLoading } = trpc.meeting.list.useQuery({
    limit: 50,
  });

  const upcomingMeetings = meetings?.meetings.filter(
    (m) => m.status === "SCHEDULED" || m.status === "LIVE"
  ) || [];

  const pastMeetings = meetings?.meetings.filter(
    (m) => m.status === "ENDED" || m.status === "CANCELLED"
  ) || [];

  const copyMeetingLink = (roomId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${roomId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meetings</h1>
          <p className="text-muted-foreground">
            View and manage your meetings
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/meetings/schedule">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Link>
          </Button>
          <Button asChild>
            <Link href="/meetings/new">
              <Plus className="mr-2 h-4 w-4" />
              New Meeting
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingMeetings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastMeetings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                    <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingMeetings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming meetings</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Schedule a meeting or start an instant meeting
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <Link href="/meetings/schedule">Schedule</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/meetings/new">Start Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingMeetings.map((meeting) => (
                <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{meeting.title}</CardTitle>
                        {getStatusBadge(meeting.status)}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => copyMeetingLink(meeting.roomId)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/meeting/${meeting.roomId}`} target="_blank">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open in New Tab
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancel Meeting
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {meeting.scheduledStart && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(new Date(meeting.scheduledStart), "MMM d, yyyy")}
                      </div>
                    )}
                    {meeting.scheduledStart && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        {format(new Date(meeting.scheduledStart), "h:mm a")}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      Room: {meeting.roomId}
                    </div>
                    <Button className="w-full mt-4" asChild>
                      <Link href={`/meeting/${meeting.roomId}`}>
                        <Play className="mr-2 h-4 w-4" />
                        {meeting.status === "LIVE" ? "Join Now" : "Start Meeting"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastMeetings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No past meetings</h3>
                <p className="text-muted-foreground text-center">
                  Your completed meetings will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastMeetings.map((meeting) => (
                <Card key={meeting.id} className={cn(
                  "hover:shadow-md transition-shadow",
                  meeting.status === "CANCELLED" && "opacity-60"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{meeting.title}</CardTitle>
                        {getStatusBadge(meeting.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {meeting.actualStart && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(new Date(meeting.actualStart), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                    )}
                    {meeting.status === "ENDED" && (
                      <Button variant="outline" className="w-full mt-4" asChild>
                        <Link href={`/meetings/${meeting.id}/summary`}>
                          View Summary
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
