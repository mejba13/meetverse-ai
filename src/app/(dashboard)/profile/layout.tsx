import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your MeetVerse AI profile, update personal information, and view your account details and subscription status.",
  openGraph: {
    title: "Profile | MeetVerse AI",
    description: "Manage your MeetVerse AI profile, update personal information, and view your account details and subscription status.",
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
