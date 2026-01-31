/**
 * User Router
 *
 * Handles user profile and preferences operations.
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
} from "../trpc";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  image: z.string().url().optional(),
});

const updatePreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  defaultVideoEnabled: z.boolean().optional(),
  defaultAudioEnabled: z.boolean().optional(),
});

export const userRouter = createTRPCRouter({
  /**
   * Get current user profile
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.user.id! },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      subscriptionTier: user.subscriptionTier,
      role: user.role,
      organization: user.organization,
      preferences: JSON.parse(user.preferences),
      createdAt: user.createdAt,
    };
  }),

  /**
   * Update user profile
   */
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.user.id! },
        data: {
          name: input.name,
          image: input.image,
        },
      });

      return {
        id: user.id,
        name: user.name,
        image: user.image,
      };
    }),

  /**
   * Update user preferences
   */
  updatePreferences: protectedProcedure
    .input(updatePreferencesSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.user.id! },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const currentPreferences = JSON.parse(user.preferences);
      const newPreferences = {
        ...currentPreferences,
        ...input,
      };

      await ctx.db.user.update({
        where: { id: ctx.user.id! },
        data: {
          preferences: JSON.stringify(newPreferences),
        },
      });

      return newPreferences;
    }),

  /**
   * Get user's meeting stats
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [meetingsThisMonth, totalMeetings, pendingActionItems] =
      await Promise.all([
        ctx.db.meeting.count({
          where: {
            hostId: ctx.user.id,
            createdAt: { gte: startOfMonth },
          },
        }),
        ctx.db.meeting.count({
          where: { hostId: ctx.user.id },
        }),
        ctx.db.actionItem.count({
          where: {
            assigneeId: ctx.user.id,
            status: "PENDING",
          },
        }),
      ]);

    // Calculate total meeting duration this month
    const meetings = await ctx.db.meeting.findMany({
      where: {
        hostId: ctx.user.id,
        status: "ENDED",
        actualStart: { gte: startOfMonth },
        actualEnd: { not: null },
      },
      select: {
        actualStart: true,
        actualEnd: true,
      },
    });

    const totalDurationMs = meetings.reduce((acc, m) => {
      if (m.actualStart && m.actualEnd) {
        return acc + (m.actualEnd.getTime() - m.actualStart.getTime());
      }
      return acc;
    }, 0);

    return {
      meetingsThisMonth,
      totalMeetings,
      pendingActionItems,
      meetingHoursThisMonth: Math.round(totalDurationMs / (1000 * 60 * 60) * 10) / 10,
    };
  }),
});
