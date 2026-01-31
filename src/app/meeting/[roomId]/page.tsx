import { Metadata } from "next";
import { MeetingRoom } from "@/components/meeting/meeting-room";

interface MeetingPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export async function generateMetadata({
  params,
}: MeetingPageProps): Promise<Metadata> {
  const { roomId } = await params;
  return {
    title: `Meeting ${roomId}`,
    description: "Join the MeetVerse AI meeting",
  };
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { roomId } = await params;

  return <MeetingRoom roomId={roomId} />;
}
