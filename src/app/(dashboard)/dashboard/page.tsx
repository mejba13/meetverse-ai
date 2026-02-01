"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Video,
  Calendar,
  Clock,
  Users,
  CheckSquare,
  Plus,
  ArrowRight,
  Play,
  LogIn,
} from "lucide-react";
import { trpc } from "@/lib/api/client";

export default function DashboardPage() {
  const { data: user } = trpc.user.me.useQuery();
  const { data: meetingsData, isLoading: meetingsLoading } = trpc.meeting.list.useQuery({
    limit: 10,
  });

  const upcomingMeetings = meetingsData?.meetings.filter(
    (m) => m.status === "SCHEDULED" || m.status === "LIVE"
  ).slice(0, 3) || [];

  const pastMeetings = meetingsData?.meetings.filter(
    (m) => m.status === "ENDED"
  ).slice(0, 3) || [];

  const totalMeetings = meetingsData?.meetings.length || 0;
  const liveMeetings = meetingsData?.meetings.filter(m => m.status === "LIVE").length || 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Here&apos;s what&apos;s happening with your meetings
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-initial" asChild>
            <Link href="/meetings/schedule">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Link>
          </Button>
          <Button size="sm" className="flex-1 sm:flex-initial" asChild>
            <Link href="/meetings/new">
              <Plus className="mr-2 h-4 w-4" />
              New Meeting
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Meetings"
          value={meetingsLoading ? "-" : String(totalMeetings)}
          description="All time"
          icon={Video}
          loading={meetingsLoading}
        />
        <StatsCard
          title="Live Now"
          value={meetingsLoading ? "-" : String(liveMeetings)}
          description="Active meetings"
          icon={Play}
          loading={meetingsLoading}
          highlight={liveMeetings > 0}
        />
        <StatsCard
          title="Upcoming"
          value={meetingsLoading ? "-" : String(upcomingMeetings.length)}
          description="Scheduled"
          icon={Calendar}
          loading={meetingsLoading}
        />
        <StatsCard
          title="Completed"
          value={meetingsLoading ? "-" : String(pastMeetings.length)}
          description="This week"
          icon={CheckSquare}
          loading={meetingsLoading}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Upcoming Meetings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Upcoming Meetings</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm" asChild>
              <Link href="/meetings">
                View all <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {meetingsLoading ? (
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 sm:gap-4 border p-3 sm:p-4">
                    <Skeleton className="h-10 w-10" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingMeetings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                <Video className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">No upcoming meetings</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Schedule a meeting or start one now
                </p>
                <div className="flex gap-2 sm:gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/meetings/schedule">Schedule</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/meetings/new">Start Now</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <MeetingItem
                    key={meeting.id}
                    title={meeting.title}
                    time={meeting.scheduledStart
                      ? format(new Date(meeting.scheduledStart), "MMM d, h:mm a")
                      : "Not scheduled"
                    }
                    roomId={meeting.roomId}
                    isLive={meeting.status === "LIVE"}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:gap-3">
            <Button variant="outline" className="justify-start h-auto py-2.5 sm:py-3" asChild>
              <Link href="/meetings/new">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center border bg-primary/10">
                    <Video className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm sm:text-base">Start Instant Meeting</div>
                    <div className="text-xs text-muted-foreground">
                      Create a meeting now
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-2.5 sm:py-3" asChild>
              <Link href="/meetings/schedule">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center bg-secondary/30">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm sm:text-base">Schedule Meeting</div>
                    <div className="text-xs text-muted-foreground">
                      Plan for later
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-2.5 sm:py-3" asChild>
              <Link href="/meetings/join">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center bg-primary/20">
                    <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm sm:text-base">Join Meeting</div>
                    <div className="text-xs text-muted-foreground">
                      Enter meeting code
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Meetings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Recent Meetings</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm" asChild>
              <Link href="/meetings">
                View all <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {meetingsLoading ? (
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 sm:gap-4 border p-3 sm:p-4">
                    <Skeleton className="h-10 w-10" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : pastMeetings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">No recent meetings</h3>
                <p className="text-muted-foreground text-sm">
                  Your completed meetings will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {pastMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between border p-3 sm:p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center border bg-muted">
                        <Video className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-sm sm:text-base">{meeting.title}</div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {meeting.actualStart
                            ? format(new Date(meeting.actualStart), "MMM d, h:mm a")
                            : "Completed"
                          }
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs sm:text-sm" asChild>
                      <Link href={`/meetings/${meeting.id}/summary`}>
                        View Summary
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Features Card */}
        <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">AI Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center border bg-primary/10">
                <CheckSquare className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Smart Transcription</p>
                <p className="text-xs text-muted-foreground">
                  Real-time transcription in 100+ languages
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center bg-secondary/30">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Action Items</p>
                <p className="text-xs text-muted-foreground">
                  Automatic extraction from conversations
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center bg-primary/20">
                <Video className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Meeting Summaries</p>
                <p className="text-xs text-muted-foreground">
                  AI-generated summaries after each call
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  loading,
  highlight,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-green-500/50 bg-green-500/5" : ""}>
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{title}</p>
            {loading ? (
              <Skeleton className="h-7 sm:h-8 w-12 mt-1" />
            ) : (
              <p className={`text-2xl sm:text-3xl font-bold ${highlight ? "text-green-500" : ""}`}>
                {value}
              </p>
            )}
            <p className="text-[10px] sm:text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${
            highlight ? "bg-green-500/10" : "bg-primary/10"
          }`}>
            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${highlight ? "text-green-500" : "text-primary"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Meeting Item Component
function MeetingItem({
  title,
  time,
  roomId,
  isLive,
}: {
  title: string;
  time: string;
  roomId: string;
  isLive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border p-3 sm:p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center border bg-primary/10 flex-shrink-0">
          <Video className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm sm:text-base truncate">{title}</div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{time}</span>
            {isLive && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 text-[10px] sm:text-xs">
                Live
              </Badge>
            )}
          </div>
        </div>
      </div>
      <Button size="sm" variant={isLive ? "default" : "outline"} className="ml-2 flex-shrink-0 text-xs sm:text-sm" asChild>
        <Link href={`/meeting/${roomId}`}>
          {isLive ? (
            <>
              <span className="mr-1.5 sm:mr-2 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white animate-pulse" />
              Join
            </>
          ) : (
            "Start"
          )}
        </Link>
      </Button>
    </div>
  );
}
