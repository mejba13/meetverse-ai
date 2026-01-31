import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule Meeting",
  description: "Schedule a future meeting with customizable settings including waiting room, recording, and AI transcription options.",
  openGraph: {
    title: "Schedule Meeting | MeetVerse AI",
    description: "Schedule a future meeting with customizable settings including waiting room, recording, and AI transcription options.",
  },
};

export default function ScheduleMeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
