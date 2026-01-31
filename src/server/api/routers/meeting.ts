/**
 * Meeting Router
 *
 * Handles all meeting-related API operations.
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "../trpc";
import { generateRoomId } from "@/lib/utils";

// Input schemas
const createMeetingSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  scheduledStart: z.string().datetime().optional(),
  scheduledEnd: z.string().datetime().optional(),
  settings: z
    .object({
      waitingRoom: z.boolean().optional(),
      recording: z.boolean().optional(),
      transcription: z.boolean().optional(),
      maxParticipants: z.number().int().min(2).max(200).optional(),
    })
    .optional(),
});

const updateMeetingSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  scheduledStart: z.string().datetime().optional(),
  scheduledEnd: z.string().datetime().optional(),
  settings: z
    .object({
      waitingRoom: z.boolean().optional(),
      recording: z.boolean().optional(),
      transcription: z.boolean().optional(),
      maxParticipants: z.number().int().min(2).max(200).optional(),
    })
    .optional(),
});

const listMeetingsSchema = z.object({
  status: z.enum(["SCHEDULED", "LIVE", "ENDED", "CANCELLED"]).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export const meetingRouter = createTRPCRouter({
  /**
   * Create a new meeting
   */
  create: protectedProcedure
    .input(createMeetingSchema)
    .mutation(async ({ ctx, input }) => {
      const roomId = generateRoomId();

      const meeting = await ctx.db.meeting.create({
        data: {
          roomId,
          title: input.title,
          description: input.description,
          hostId: ctx.user.id!,
          scheduledStart: input.scheduledStart
            ? new Date(input.scheduledStart)
            : null,
          scheduledEnd: input.scheduledEnd
            ? new Date(input.scheduledEnd)
            : null,
          settings: JSON.stringify(input.settings || {}),
          status: input.scheduledStart ? "SCHEDULED" : "LIVE",
        },
      });

      return {
        id: meeting.id,
        roomId: meeting.roomId,
        title: meeting.title,
        inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/meeting/${meeting.roomId}`,
        status: meeting.status,
        createdAt: meeting.createdAt,
      };
    }),

  /**
   * Get a meeting by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const meeting = await ctx.db.meeting.findUnique({
        where: { id: input.id },
        include: {
          host: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          _count: {
            select: {
              actionItems: true,
              transcripts: true,
            },
          },
        },
      });

      if (!meeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return {
        ...meeting,
        settings: JSON.parse(meeting.settings),
      };
    }),

  /**
   * Get a meeting by room ID (for joining)
   */
  getByRoomId: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const meeting = await ctx.db.meeting.findUnique({
        where: { roomId: input.roomId },
        include: {
          host: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
      });

      if (!meeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return {
        id: meeting.id,
        roomId: meeting.roomId,
        title: meeting.title,
        description: meeting.description,
        host: meeting.host,
        status: meeting.status,
        scheduledStart: meeting.scheduledStart,
        participantCount: meeting._count.participants,
        settings: JSON.parse(meeting.settings),
      };
    }),

  /**
   * List user's meetings
   */
  list: protectedProcedure
    .input(listMeetingsSchema)
    .query(async ({ ctx, input }) => {
      const meetings = await ctx.db.meeting.findMany({
        where: {
          OR: [
            { hostId: ctx.user.id },
            {
              participants: {
                some: { userId: ctx.user.id },
              },
            },
          ],
          status: input.status,
          deletedAt: null,
        },
        include: {
          host: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              participants: true,
              actionItems: true,
            },
          },
        },
        orderBy: [
          { status: "asc" }, // LIVE first
          { scheduledStart: "asc" },
          { createdAt: "desc" },
        ],
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: string | undefined;
      if (meetings.length > input.limit) {
        const nextItem = meetings.pop();
        nextCursor = nextItem?.id;
      }

      return {
        meetings: meetings.map((m) => ({
          ...m,
          settings: JSON.parse(m.settings),
        })),
        nextCursor,
        hasMore: !!nextCursor,
      };
    }),

  /**
   * Update a meeting
   */
  update: protectedProcedure
    .input(updateMeetingSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.meeting.findUnique({
        where: { id: input.id },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      if (existing.hostId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the host can update this meeting",
        });
      }

      const meeting = await ctx.db.meeting.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          scheduledStart: input.scheduledStart
            ? new Date(input.scheduledStart)
            : undefined,
          scheduledEnd: input.scheduledEnd
            ? new Date(input.scheduledEnd)
            : undefined,
          settings: input.settings
            ? JSON.stringify({
                ...JSON.parse(existing.settings),
                ...input.settings,
              })
            : undefined,
        },
      });

      return meeting;
    }),

  /**
   * Start a meeting
   */
  start: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const meeting = await ctx.db.meeting.findUnique({
        where: { id: input.id },
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
          message: "Only the host can start this meeting",
        });
      }

      const updated = await ctx.db.meeting.update({
        where: { id: input.id },
        data: {
          status: "LIVE",
          actualStart: new Date(),
        },
      });

      return updated;
    }),

  /**
   * End a meeting
   */
  end: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const meeting = await ctx.db.meeting.findUnique({
        where: { id: input.id },
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
          message: "Only the host can end this meeting",
        });
      }

      const updated = await ctx.db.meeting.update({
        where: { id: input.id },
        data: {
          status: "ENDED",
          actualEnd: new Date(),
        },
      });

      // TODO: Trigger post-meeting AI processing (summary, action items)

      return updated;
    }),

  /**
   * Delete (soft delete) a meeting
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const meeting = await ctx.db.meeting.findUnique({
        where: { id: input.id },
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
          message: "Only the host can delete this meeting",
        });
      }

      await ctx.db.meeting.update({
        where: { id: input.id },
        data: {
          deletedAt: new Date(),
          status: "CANCELLED",
        },
      });

      return { success: true };
    }),

  /**
   * Get meeting summary and transcript
   */
  getSummary: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const meeting = await ctx.db.meeting.findUnique({
        where: { id: input.id },
        include: {
          transcripts: {
            orderBy: { startTime: "asc" },
            select: {
              id: true,
              speakerName: true,
              content: true,
              startTime: true,
              endTime: true,
              confidence: true,
            },
          },
          actionItems: {
            include: {
              assignee: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          highlights: {
            orderBy: { timestamp: "asc" },
          },
        },
      });

      if (!meeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return {
        id: meeting.id,
        title: meeting.title,
        summary: meeting.aiSummary,
        summaryFormat: meeting.aiSummaryFormat,
        transcripts: meeting.transcripts,
        actionItems: meeting.actionItems,
        highlights: meeting.highlights,
        duration: meeting.actualEnd && meeting.actualStart
          ? meeting.actualEnd.getTime() - meeting.actualStart.getTime()
          : null,
      };
    }),
});
