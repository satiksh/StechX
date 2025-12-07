import { Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';

// Send message
export async function sendMessage(req: Request, res: Response): Promise<void> {
  try {
    const senderId = (req as any).userId;
    const { conversationId, recipientId, content, jobId } = req.body;

    if (!content || !recipientId) {
      res.status(400).json({ error: 'Recipient and content required' });
      return;
    }

    // Create or get conversation
    let conversation = null;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: [senderId, recipientId],
          jobId: jobId || null,
        },
      });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        recipientId,
        content,
        status: 'SENT',
        jobId: jobId || null,
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    // Update conversation last message time
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    res.status(201).json({ data: message, message: 'Message sent' });
  } catch (error: any) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message || 'Failed to send message' });
  }
}

// Get conversations
export async function getConversations(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { limit = 20, skip = 0 } = req.query;

    const conversations = await prisma.conversation.findMany({
      where: {
        participantIds: {
          hasSome: [userId],
        },
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
      take: parseInt(limit as string) || 20,
      skip: parseInt(skip as string) || 0,
    });

    res.json({ data: conversations });
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch conversations' });
  }
}

// Get messages in conversation
export async function getMessages(req: Request, res: Response) {
  try {
    const { conversationId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string) || 50,
      skip: parseInt(skip as string) || 0,
    });

    // Mark as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        recipientId: (req as any).userId,
        status: { not: 'READ' },
      },
      data: { status: 'READ', readAt: new Date() },
    });

    res.json({ data: messages.reverse() });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch messages' });
  }
}

// Get notifications
export async function getNotifications(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { limit = 20, unreadOnly = false } = req.query;

    const where: any = { userId };
    if (unreadOnly === 'true') where.read = false;

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string) || 20,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, read: false },
    });

    res.json({ data: notifications, unreadCount });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch notifications' });
  }
}

// Mark notification as read
export async function markNotificationAsRead(req: Request, res: Response) {
  try {
    const { notificationId } = req.params;

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true, readAt: new Date() },
    });

    res.json({ data: updated });
  } catch (error: any) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: error.message || 'Failed to update notification' });
  }
}
