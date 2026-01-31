import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Meeting",
  description: "Join a meeting using a meeting code or link. Enter your meeting ID to connect with participants instantly.",
  openGraph: {
    title: "Join Meeting | MeetVerse AI",
    description: "Join a meeting using a meeting code or link. Enter your meeting ID to connect with participants instantly.",
  },
};

export default function JoinMeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
