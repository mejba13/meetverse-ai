/**
 * Action Item Router
 *
 * Handles action item CRUD operations.
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
} from "../trpc";

const createActionItemSchema = z.object({
  meetingId: z.string(),
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

const updateActionItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(500).optional(),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

const listActionItemsSchema = z.object({
  meetingId: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  assigneeId: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50),
});

export const actionItemRouter = createTRPCRouter({
  /**
   * Create a new action item
   */
  create: protectedProcedure
    .input(createActionItemSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify meeting exists and user has access
      const meeting = await ctx.db.meeting.findUnique({
        where: { id: input.meetingId },
      });

      if (!meeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      const actionItem = await ctx.db.actionItem.create({
        data: {
          meetingId: input.meetingId,
          title: input.title,
          description: input.description,
          assigneeId: input.assigneeId,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          priority: input.priority || "MEDIUM",
          aiGenerated: false,
        },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return actionItem;
    }),

  /**
   * Get action item by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const actionItem = await ctx.db.actionItem.findUnique({
        where: { id: input.id },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          meeting: {
            select: {
              id: true,
              title: true,
              roomId: true,
            },
          },
          sourceTranscript: {
            select: {
              id: true,
              content: true,
              startTime: true,
              speakerName: true,
            },
          },
        },
      });

      if (!actionItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Action item not found",
        });
      }

      return actionItem;
    }),

  /**
   * List action items
   */
  list: protectedProcedure
    .input(listActionItemsSchema)
    .query(async ({ ctx, input }) => {
      const actionItems = await ctx.db.actionItem.findMany({
        where: {
          ...(input.meetingId && { meetingId: input.meetingId }),
          ...(input.status && { status: input.status }),
          ...(input.assigneeId && { assigneeId: input.assigneeId }),
          // Only show items user has access to
          OR: [
            { assigneeId: ctx.user.id },
            { meeting: { hostId: ctx.user.id } },
            {
              meeting: {
                participants: {
                  some: { userId: ctx.user.id },
                },
              },
            },
          ],
        },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          meeting: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: [
          { status: "asc" },
          { priority: "desc" },
          { dueDate: "asc" },
          { createdAt: "desc" },
        ],
        take: input.limit,
      });

      return actionItems;
    }),

  /**
   * List user's pending action items
   */
  myPending: protectedProcedure.query(async ({ ctx }) => {
    const actionItems = await ctx.db.actionItem.findMany({
      where: {
        assigneeId: ctx.user.id,
        status: { in: ["PENDING", "IN_PROGRESS"] },
      },
      include: {
        meeting: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: [
        { priority: "desc" },
        { dueDate: "asc" },
      ],
      take: 20,
    });

    return actionItems;
  }),

  /**
   * Update an action item
   */
  update: protectedProcedure
    .input(updateActionItemSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.actionItem.findUnique({
        where: { id: input.id },
        include: {
          meeting: true,
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Action item not found",
        });
      }

      // Check if user can update (assignee or meeting host)
      const canUpdate =
        existing.assigneeId === ctx.user.id ||
        existing.meeting.hostId === ctx.user.id;

      if (!canUpdate) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot update this action item",
        });
      }

      const actionItem = await ctx.db.actionItem.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          assigneeId: input.assigneeId,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          status: input.status,
          priority: input.priority,
        },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return actionItem;
    }),

  /**
   * Mark action item as complete
   */
  complete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.actionItem.findUnique({
        where: { id: input.id },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Action item not found",
        });
      }

      const actionItem = await ctx.db.actionItem.update({
        where: { id: input.id },
        data: {
          status: "COMPLETED",
        },
      });

      return actionItem;
    }),

  /**
   * Delete an action item
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.actionItem.findUnique({
        where: { id: input.id },
        include: {
          meeting: true,
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Action item not found",
        });
      }

      // Only meeting host can delete
      if (existing.meeting.hostId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the meeting host can delete action items",
        });
      }

      await ctx.db.actionItem.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
