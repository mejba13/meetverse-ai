/**
 * Notification Service
 *
 * Handles in-app notifications and push notification management.
 */

import { db } from "@/server/db";

export interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  body: string;
  referenceType?: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create a notification for a user
 */
export async function createNotification(input: CreateNotificationInput) {
  return db.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      referenceType: input.referenceType || null,
      referenceId: input.referenceId || null,
      metadata: JSON.stringify(input.metadata || {}),
    },
  });
}

/**
 * Create notifications for multiple users
 */
export async function createBulkNotifications(
  userIds: string[],
  notification: Omit<CreateNotificationInput, "userId">
) {
  const data = userIds.map((userId) => ({
    userId,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    referenceType: notification.referenceType || null,
    referenceId: notification.referenceId || null,
    metadata: JSON.stringify(notification.metadata || {}),
  }));

  // SQLite doesn't support createMany well, so create one by one
  const results = [];
  for (const item of data) {
    const result = await db.notification.create({ data: item });
    results.push(result);
  }
  return results;
}

/**
 * Get notifications for a user
 */
export async function getNotifications(
  userId: string,
  options: { isRead?: boolean; skip?: number; take?: number } = {}
) {
  const where = {
    userId,
    ...(options.isRead !== undefined && { isRead: options.isRead }),
  };

  const [notifications, total] = await Promise.all([
    db.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: options.skip || 0,
      take: options.take || 20,
    }),
    db.notification.count({ where }),
  ]);

  return { notifications, total };
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return db.notification.count({
    where: { userId, isRead: false },
  });
}

/**
 * Mark notifications as read
 */
export async function markAsRead(
  userId: string,
  options: { ids?: string[]; all?: boolean }
) {
  if (options.all) {
    return db.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  if (options.ids && options.ids.length > 0) {
    return db.notification.updateMany({
      where: {
        id: { in: options.ids },
        userId,
      },
      data: { isRead: true, readAt: new Date() },
    });
  }

  return { count: 0 };
}

/**
 * Register a push device token
 */
export async function registerDevice(
  userId: string,
  input: {
    platform: string;
    token: string;
    deviceName?: string;
    deviceId?: string;
  }
) {
  // Upsert: if token already exists, update the user association
  return db.pushDevice.upsert({
    where: { token: input.token },
    create: {
      userId,
      platform: input.platform,
      token: input.token,
      deviceName: input.deviceName || null,
      deviceId: input.deviceId || null,
    },
    update: {
      userId,
      platform: input.platform,
      deviceName: input.deviceName || null,
      deviceId: input.deviceId || null,
      isActive: true,
    },
  });
}

/**
 * Unregister a push device token
 */
export async function unregisterDevice(userId: string, token: string) {
  return db.pushDevice.updateMany({
    where: { userId, token },
    data: { isActive: false },
  });
}
