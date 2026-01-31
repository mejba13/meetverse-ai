import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your MeetVerse AI dashboard - view upcoming meetings, recent activity, and quick actions for managing your video conferences.",
  openGraph: {
    title: "Dashboard | MeetVerse AI",
    description: "Your MeetVerse AI dashboard - view upcoming meetings, recent activity, and quick actions for managing your video conferences.",
  },
};

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
