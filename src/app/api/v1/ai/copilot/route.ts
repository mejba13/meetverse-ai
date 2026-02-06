import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { withAuth } from "../../_lib/middleware";
import { success, error } from "../../_lib/response";
import * as errors from "../../_lib/errors";
import { copilotSchema } from "../../_lib/validation";
import { isAIConfigured } from "@/server/services/ai";
import { getTranscript } from "@/server/services/transcription";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  try {
    const user = await withAuth(request);

    const body = await request.json();
    const parsed = copilotSchema.safeParse(body);

    if (!parsed.success) {
      return error(errors.VALIDATION_ERROR, "Invalid request body", 400);
    }

    if (!isAIConfigured()) {
      return error(errors.AI_NOT_CONFIGURED, "AI service is not configured", 503);
    }

    const { meetingId, question } = parsed.data;

    // Verify access
    const meeting = await db.meeting.findUnique({
      where: { id: meetingId },
      include: {
        participants: {
          where: { userId: user.id },
          take: 1,
        },
      },
    });

    if (!meeting) {
      return error(errors.NOT_FOUND, "Meeting not found", 404);
    }

    const isHost = meeting.hostId === user.id;
    const isParticipant = meeting.participants.length > 0;

    if (!isHost && !isParticipant) {
      return error(errors.FORBIDDEN, "You do not have access to this meeting", 403);
    }

    // Get transcript context
    const transcript = await getTranscript(meetingId);
    const summaryContext = meeting.aiSummary
      ? `Meeting Summary: ${meeting.aiSummary}\n\n`
      : "";

    const context = `${summaryContext}${transcript ? `Transcript:\n${transcript}` : "No transcript available."}`;

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are an AI meeting co-pilot. Based on the following meeting context, answer the user's question concisely and helpfully.

Meeting: ${meeting.title}

${context}

User Question: ${question}`,
        },
      ],
    });

    const content = response.content[0];
    const answer = content.type === "text" ? content.text : "Unable to generate response";

    return success({ answer, meetingId });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) throw err;
    console.error("[API] AI copilot error:", err);
    return error(errors.INTERNAL_ERROR, "Internal server error", 500);
  }
}
