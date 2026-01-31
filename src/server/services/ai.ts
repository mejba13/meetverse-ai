/**
 * AI Service
 *
 * Integrates with Claude API for intelligent meeting analysis including:
 * - Meeting summarization
 * - Action item extraction
 * - Key decision identification
 * - Topic detection
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/server/db";

// Claude API configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Lazy initialization of Anthropic client
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    if (!ANTHROPIC_API_KEY) {
      throw new Error("Anthropic API key is not configured. Please set ANTHROPIC_API_KEY.");
    }
    anthropicClient = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

/**
 * Check if AI service is configured
 */
export function isAIConfigured(): boolean {
  return !!ANTHROPIC_API_KEY;
}

export interface MeetingSummary {
  title: string;
  overview: string;
  keyPoints: string[];
  decisions: string[];
  topics: string[];
  nextSteps: string[];
  duration: string;
  participantCount: number;
}

export interface ActionItem {
  title: string;
  description: string;
  assignee?: string;
  dueDate?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  context: string;
}

export interface MeetingAnalysis {
  summary: MeetingSummary;
  actionItems: ActionItem[];
  sentiment: "positive" | "neutral" | "negative" | "mixed";
  engagementScore: number;
}

/**
 * Generate a comprehensive meeting summary from transcript
 */
export async function generateMeetingSummary(
  transcript: string,
  meetingTitle: string,
  participantNames: string[] = []
): Promise<MeetingSummary> {
  const client = getAnthropicClient();

  const prompt = `You are an expert meeting analyst. Analyze the following meeting transcript and provide a comprehensive summary.

Meeting Title: ${meetingTitle}
Participants: ${participantNames.length > 0 ? participantNames.join(", ") : "Not specified"}

Transcript:
${transcript}

Provide your analysis in the following JSON format:
{
  "title": "A concise, descriptive title for the meeting",
  "overview": "A 2-3 sentence executive summary of the meeting",
  "keyPoints": ["Array of 3-7 key discussion points"],
  "decisions": ["Array of decisions made during the meeting"],
  "topics": ["Array of main topics discussed"],
  "nextSteps": ["Array of agreed next steps or follow-ups"],
  "duration": "Estimated duration based on transcript length",
  "participantCount": number
}

Respond ONLY with valid JSON, no additional text.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude API");
  }

  try {
    const summary = JSON.parse(content.text) as MeetingSummary;
    return summary;
  } catch {
    throw new Error("Failed to parse meeting summary response");
  }
}

/**
 * Extract action items from meeting transcript
 */
export async function extractActionItems(
  transcript: string,
  participantNames: string[] = []
): Promise<ActionItem[]> {
  const client = getAnthropicClient();

  const prompt = `You are an expert at identifying action items and tasks from meeting discussions. Analyze the following transcript and extract all action items.

Known Participants: ${participantNames.length > 0 ? participantNames.join(", ") : "Not specified"}

Transcript:
${transcript}

For each action item, provide:
- A clear, actionable title
- Detailed description
- Assignee (if mentioned or can be inferred)
- Due date (if mentioned)
- Priority (LOW, MEDIUM, HIGH, or URGENT based on context and urgency)
- Context (the relevant part of the conversation)

Respond with a JSON array:
[
  {
    "title": "Clear action item title",
    "description": "Detailed description of what needs to be done",
    "assignee": "Person responsible (or null if not specified)",
    "dueDate": "Due date in YYYY-MM-DD format (or null if not specified)",
    "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    "context": "Brief excerpt from transcript where this was discussed"
  }
]

Respond ONLY with valid JSON array, no additional text. If no action items found, return empty array [].`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude API");
  }

  try {
    const actionItems = JSON.parse(content.text) as ActionItem[];
    return actionItems;
  } catch {
    throw new Error("Failed to parse action items response");
  }
}

/**
 * Analyze meeting sentiment and engagement
 */
export async function analyzeMeetingSentiment(transcript: string): Promise<{
  sentiment: "positive" | "neutral" | "negative" | "mixed";
  engagementScore: number;
  insights: string[];
}> {
  const client = getAnthropicClient();

  const prompt = `Analyze the following meeting transcript for sentiment and engagement levels.

Transcript:
${transcript}

Provide your analysis in JSON format:
{
  "sentiment": "positive" | "neutral" | "negative" | "mixed",
  "engagementScore": number between 0-100 (100 being highly engaged),
  "insights": ["Array of 2-4 observations about the meeting dynamics"]
}

Consider:
- Tone of discussions
- Level of participation
- Constructive vs contentious exchanges
- Energy and enthusiasm
- Collaborative language vs individual focus

Respond ONLY with valid JSON, no additional text.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude API");
  }

  try {
    return JSON.parse(content.text);
  } catch {
    return {
      sentiment: "neutral",
      engagementScore: 50,
      insights: ["Unable to analyze meeting sentiment"],
    };
  }
}

/**
 * Generate a full meeting analysis
 */
export async function analyzeMeeting(
  transcript: string,
  meetingTitle: string,
  participantNames: string[] = []
): Promise<MeetingAnalysis> {
  // Run analyses in parallel for efficiency
  const [summary, actionItems, sentimentAnalysis] = await Promise.all([
    generateMeetingSummary(transcript, meetingTitle, participantNames),
    extractActionItems(transcript, participantNames),
    analyzeMeetingSentiment(transcript),
  ]);

  return {
    summary,
    actionItems,
    sentiment: sentimentAnalysis.sentiment,
    engagementScore: sentimentAnalysis.engagementScore,
  };
}

/**
 * Save meeting analysis to database
 */
export async function saveMeetingAnalysis(
  meetingId: string,
  analysis: MeetingAnalysis
): Promise<void> {
  // Update meeting with summary
  await db.meeting.update({
    where: { id: meetingId },
    data: {
      aiSummary: JSON.stringify({
        title: analysis.summary.title,
        overview: analysis.summary.overview,
        keyPoints: analysis.summary.keyPoints,
        decisions: analysis.summary.decisions,
        topics: analysis.summary.topics,
        nextSteps: analysis.summary.nextSteps,
        sentiment: analysis.sentiment,
        engagementScore: analysis.engagementScore,
      }),
      aiSummaryFormat: "json",
    },
  });

  // Create action items
  const meeting = await db.meeting.findUnique({
    where: { id: meetingId },
    select: { hostId: true },
  });

  if (!meeting) {
    throw new Error("Meeting not found");
  }

  for (const item of analysis.actionItems) {
    await db.actionItem.create({
      data: {
        meetingId,
        title: item.title,
        description: item.description,
        priority: item.priority,
        status: "PENDING",
        assigneeId: meeting.hostId, // Default to host if no assignee specified
        dueDate: item.dueDate ? new Date(item.dueDate) : null,
      },
    });
  }
}

/**
 * Generate quick insights during a meeting (lighter analysis)
 */
export async function generateQuickInsights(
  recentTranscript: string
): Promise<string[]> {
  if (!isAIConfigured()) {
    return [];
  }

  const client = getAnthropicClient();

  const prompt = `Based on this recent meeting transcript segment, provide 2-3 quick, actionable insights or observations. Keep each insight under 100 characters.

Transcript:
${recentTranscript}

Respond with a JSON array of strings:
["insight 1", "insight 2", "insight 3"]

Respond ONLY with valid JSON array.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return [];
    }

    return JSON.parse(content.text) as string[];
  } catch {
    return [];
  }
}
