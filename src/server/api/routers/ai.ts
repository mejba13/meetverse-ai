/**
 * AI Router
 *
 * tRPC router for AI-powered features including:
 * - Meeting summaries
 * - Action item extraction
 * - Real-time insights
 * - Post-meeting processing
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  generateMeetingSummary,
  extractActionItems,
  isAIConfigured,
} from "@/server/services/ai";
import {
  getTranscript,
  getTranscriptSegments,
} from "@/server/services/transcription";
import {
  getProcessingStatus,
  reprocessMeeting,
  queueMeetingForProcessing,
} from "@/server/services/post-meeting-processor";

export const aiRouter = createTRPCRouter({
  /**
   * Get AI configuration status
   */
  getStatus: protectedProcedure.query(() => {
    return {
      isConfigured: isAIConfigured(),
      features: {
        summarization: isAIConfigured(),
        actionItemExtraction: isAIConfigured(),
        realTimeInsights: isAIConfigured(),
      },
    };
  }),

  /**
   * Generate meeting summary
   */
  generateSummary: protectedProcedure
    .input(
      z.object({
        meetingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!isAIConfigured()) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "AI service is not configured",
        });
      }

      // Verify access to meeting
      const meeting = await ctx.db.meeting.findUnique({
        where: { id: input.meetingId },
        include: {
          participants: {
            where: { userId: ctx.user.id },
          },
        },
      });

      if (!meeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      const isHost = meeting.hostId === ctx.user.id;
      const isParticipant = meeting.participants.length > 0;

      if (!isHost && !isParticipant) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this meeting",
        });
      }

      // Get transcript
      const transcript = await getTranscript(input.meetingId);

      if (!transcript) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "No transcript available for this meeting",
        });
      }

      // Generate summary
      const summary = await generateMeetingSummary(
        transcript,
        meeting.title,
        [] // Participant names would be fetched in production
      );

      // Save to meeting
      await ctx.db.meeting.update({
        where: { id: input.meetingId },
        data: {
          aiSummary: JSON.stringify(summary),
          aiSummaryFormat: "json",
        },
      });

      return summary;
    }),

  /**
   * Extract action items from meeting
   */
  extractActionItems: protectedProcedure
    .input(
      z.object({
        meetingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!isAIConfigured()) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "AI service is not configured",
        });
      }

      // Verify access to meeting
      const meeting = await ctx.db.meeting.findUnique({
        where: { id: input.meetingId },
      });

      if (!meeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      if (meeting.hostId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the host can extract action items",
        });
      }

      // Get transcript
      const transcript = await getTranscript(input.meetingId);

      if (!transcript) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "No transcript available for this meeting",
        });
      }

      // Extract action items
      const actionItems = await extractActionItems(transcript);

      // Save action items to database
      const createdItems = [];
      for (const item of actionItems) {
        const created = await ctx.db.actionItem.create({
          data: {
            meetingId: input.meetingId,
            title: item.title,
            description: item.description,
            priority: item.priority,
            status: "PENDING",
            assigneeId: meeting.hostId,
            dueDate: item.dueDate ? new Date(item.dueDate) : null,
            aiGenerated: true,
          },
        });
        createdItems.push(created);
      }

      return {
        count: createdItems.length,
        items: createdItems,
      };
    }),

  /**
   * Get meeting summary
   */
  getSummary: protectedProcedure
    .input(
      z.object({
        meetingId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const meeting = await ctx.db.meeting.findUnique({
        where: { id: input.meetingId },
        select: {
          id: true,
          title: true,
          aiSummary: true,
          aiSummaryFormat: true,
          hostId: true,
        },
      });

      if (!meeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      if (!meeting.aiSummary) {
        return null;
      }

      try {
        return JSON.parse(meeting.aiSummary);
      } catch {
        return { raw: meeting.aiSummary };
      }
    }),

  /**
   * Get transcript for a meeting
   */
  getTranscript: protectedProcedure
    .input(
      z.object({
        meetingId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Verify access
      const meeting = await ctx.db.meeting.findUnique({
        where: { id: input.meetingId },
        include: {
          participants: {
            where: { userId: ctx.user.id },
          },
        },
      });

      if (!meeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      const isHost = meeting.hostId === ctx.user.id;
      const isParticipant = meeting.participants.length > 0;

      if (!isHost && !isParticipant) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this meeting",
        });
      }

      const segments = await getTranscriptSegments(input.meetingId);
      const fullText = await getTranscript(input.meetingId);

      return {
        segments: segments.map((s) => ({
          id: s.id,
          speakerName: s.speakerName,
          content: s.content,
          startTime: s.startTime,
          endTime: s.endTime,
          confidence: s.confidence,
        })),
        fullText,
      };
    }),

  /**
   * Trigger post-meeting processing
   */
  processMeeting: protectedProcedure
    .input(
      z.object({
        meetingId: z.string(),
        audioUrl: z.string().optional(),
        notifyParticipants: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify host access
      const meeting = await ctx.db.meeting.findUnique({
        where: { id: input.meetingId },
      });

      if (!meeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      if (meeting.hostId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the host can trigger processing",
        });
      }

      // Queue for background processing
      const result = await queueMeetingForProcessing(input.meetingId, {
        audioUrl: input.audioUrl,
        notifyParticipants: input.notifyParticipants,
      });

      return result;
    }),

  /**
   * Get processing status
   */
  getProcessingStatus: protectedProcedure
    .input(
      z.object({
        meetingId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return getProcessingStatus(input.meetingId);
    }),

  /**
   * Reprocess a meeting (regenerate summary/action items)
   */
  reprocess: protectedProcedure
    .input(
      z.object({
        meetingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify host access
      const meeting = await ctx.db.meeting.findUnique({
        where: { id: input.meetingId },
      });

      if (!meeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      if (meeting.hostId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the host can reprocess the meeting",
        });
      }

      const result = await reprocessMeeting(input.meetingId);
      return result;
    }),
});
