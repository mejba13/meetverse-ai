import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Meeting",
  description: "Start an instant video meeting with AI-powered transcription, smart summaries, and automatic action item detection.",
  openGraph: {
    title: "Start Meeting | MeetVerse AI",
    description: "Start an instant video meeting with AI-powered transcription, smart summaries, and automatic action item detection.",
  },
};

export default function NewMeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
