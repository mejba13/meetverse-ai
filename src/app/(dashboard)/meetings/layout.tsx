import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meetings",
  description: "View and manage all your meetings, join scheduled calls, and access meeting recordings with AI-powered summaries.",
  openGraph: {
    title: "Meetings | MeetVerse AI",
    description: "View and manage all your meetings, join scheduled calls, and access meeting recordings with AI-powered summaries.",
  },
};

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
