import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Customize your MeetVerse AI experience with theme preferences, notification settings, and default meeting configurations.",
  openGraph: {
    title: "Settings | MeetVerse AI",
    description: "Customize your MeetVerse AI experience with theme preferences, notification settings, and default meeting configurations.",
  },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
