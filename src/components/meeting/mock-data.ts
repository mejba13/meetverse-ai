// Shared mock data for meeting room components

export interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
  avatarUrl?: string;
  role?: "host" | "co-host" | "presenter" | "attendee";
  department?: string;
  status?: "active" | "idle" | "away";
  accentColor?: string;
}

export const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "You",
    isMuted: false,
    isVideoEnabled: true,
    role: "host",
    department: "Engineering",
    status: "active",
    accentColor: "from-[#CAFF4B]/30 to-[#9EF01A]/20",
  },
  {
    id: "2",
    name: "Sarah Chen",
    isMuted: false,
    isVideoEnabled: true,
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "co-host",
    department: "Product",
    status: "active",
    accentColor: "from-[#9B5DE5]/30 to-violet-600/20",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    isMuted: true,
    isVideoEnabled: false,
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "attendee",
    department: "Design",
    status: "idle",
    accentColor: "from-cyan-500/30 to-blue-600/20",
  },
  {
    id: "4",
    name: "Alex Rivera",
    isMuted: false,
    isVideoEnabled: true,
    avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    role: "presenter",
    department: "Engineering",
    status: "active",
    accentColor: "from-amber-500/30 to-orange-600/20",
  },
  {
    id: "5",
    name: "Priya Patel",
    isMuted: false,
    isVideoEnabled: true,
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    role: "attendee",
    department: "Marketing",
    status: "active",
    accentColor: "from-rose-500/30 to-pink-600/20",
  },
  {
    id: "6",
    name: "James Wright",
    isMuted: true,
    isVideoEnabled: false,
    avatarUrl: "https://randomuser.me/api/portraits/men/46.jpg",
    role: "attendee",
    department: "Sales",
    status: "away",
    accentColor: "from-teal-500/30 to-emerald-600/20",
  },
];

export const mockChatMessages = [
  {
    id: "1",
    sender: "Sarah Chen",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "Hey everyone! Ready to start the sprint review?",
    time: "10:00 AM",
    isYou: false,
    reactions: [{ emoji: "👋", count: 3 }],
  },
  {
    id: "2",
    sender: "Marcus Johnson",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "Yes, let me pull up the design specs. Shared the Figma link in the thread.",
    time: "10:01 AM",
    isYou: false,
    reactions: [{ emoji: "👍", count: 2 }],
  },
  {
    id: "3",
    sender: "You",
    content: "Sounds good, go ahead! I'll share the task board.",
    time: "10:01 AM",
    isYou: true,
    reactions: [],
  },
  {
    id: "4",
    sender: "Alex Rivera",
    avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    content: "The API endpoints are all deployed to staging. We can do a live demo if needed.",
    time: "10:02 AM",
    isYou: false,
    reactions: [{ emoji: "🚀", count: 4 }],
  },
  {
    id: "5",
    sender: "Priya Patel",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    content: "I have the analytics dashboard ready for review too.",
    time: "10:03 AM",
    isYou: false,
    reactions: [{ emoji: "✨", count: 1 }],
  },
];

export const mockTranscriptSegments = [
  {
    id: "1",
    speaker: "Sarah Chen",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "Good morning everyone. Let's kick off our weekly sprint review with the engineering updates.",
    time: "00:15",
    color: "#9B5DE5",
  },
  {
    id: "2",
    speaker: "Marcus Johnson",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "I've completed the payment API integration and added webhook handlers for Stripe events.",
    time: "00:32",
    color: "#00D4FF",
  },
  {
    id: "3",
    speaker: "Alex Rivera",
    avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    content: "That's great progress. I'll need to review that PR once you're done. Let's schedule a code review session.",
    time: "01:15",
    color: "#FF9F1C",
  },
  {
    id: "4",
    speaker: "You",
    content: "Sounds good. Let me pull up the task board to track our progress on the remaining items.",
    time: "01:45",
    color: "#CAFF4B",
  },
  {
    id: "5",
    speaker: "Priya Patel",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    content: "The marketing site updates are live. We saw a 23% increase in signups this week.",
    time: "02:10",
    color: "#FF6B6B",
  },
  {
    id: "6",
    speaker: "James Wright",
    avatarUrl: "https://randomuser.me/api/portraits/men/46.jpg",
    content: "On the sales side, we closed three enterprise deals. Pipeline is looking strong for Q2.",
    time: "02:45",
    color: "#2EC4B6",
  },
];

export const mockTranscriptBarLines = [
  { speaker: "Sarah Chen", text: "Let's review the progress on the API integration." },
  { speaker: "Marcus Johnson", text: "I've completed the payment endpoints and added the webhook handlers." },
  { speaker: "Alex Rivera", text: "That's great. Do we have the test coverage for those?" },
  { speaker: "Priya Patel", text: "The marketing analytics are showing really positive trends this quarter." },
  { speaker: "James Wright", text: "We should align on the enterprise pricing before the next release." },
];

export const mockActionItems = [
  {
    id: "1",
    title: "Review payment API integration PR",
    assignee: "Alex Rivera",
    avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    due: "Tomorrow",
    priority: "high" as const,
    status: "pending",
  },
  {
    id: "2",
    title: "Update sprint task board with new items",
    assignee: "You",
    due: "Today",
    priority: "medium" as const,
    status: "pending",
  },
  {
    id: "3",
    title: "Prepare enterprise pricing document",
    assignee: "James Wright",
    avatarUrl: "https://randomuser.me/api/portraits/men/46.jpg",
    due: "Friday",
    priority: "low" as const,
    status: "pending",
  },
];

export const mockAIInsights = [
  {
    id: "1",
    type: "decision" as const,
    title: "Code review session scheduled",
    description: "Team agreed to schedule a dedicated code review for the payment API integration.",
    confidence: 92,
  },
  {
    id: "2",
    type: "topic" as const,
    title: "Q2 pipeline discussed",
    description: "Sales pipeline and enterprise deals were highlighted as key focus areas.",
    confidence: 87,
  },
  {
    id: "3",
    type: "sentiment" as const,
    title: "Positive team morale",
    description: "Overall positive sentiment detected. Team is energized by recent wins.",
    confidence: 78,
  },
];

export const roleColors: Record<string, string> = {
  host: "bg-[#CAFF4B]/15 text-[#CAFF4B] border-[#CAFF4B]/20",
  "co-host": "bg-[#9B5DE5]/15 text-[#9B5DE5] border-[#9B5DE5]/20",
  presenter: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  attendee: "bg-white/[0.06] text-white/40 border-white/[0.06]",
};

export const priorityColors: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

export const statusColors: Record<string, string> = {
  active: "bg-emerald-400",
  idle: "bg-amber-400",
  away: "bg-white/30",
};

export const insightTypeConfig: Record<string, { color: string; label: string }> = {
  decision: { color: "bg-[#CAFF4B]/15 text-[#CAFF4B] border-[#CAFF4B]/20", label: "Decision" },
  topic: { color: "bg-blue-500/15 text-blue-400 border-blue-500/20", label: "Topic" },
  sentiment: { color: "bg-[#9B5DE5]/15 text-[#9B5DE5] border-[#9B5DE5]/20", label: "Sentiment" },
};
