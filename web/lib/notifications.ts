import prisma from '@/lib/prisma';

export enum NotificationType {
  BID_PLACED = 'BID_PLACED',
  BID_ACCEPTED = 'BID_ACCEPTED',
  BID_REJECTED = 'BID_REJECTED',
  CONTRACT_CREATED = 'CONTRACT_CREATED',
  CONTRACT_APPROVED = 'CONTRACT_APPROVED',
  CONTRACT_SIGNED = 'CONTRACT_SIGNED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  USER_SUSPENDED = 'USER_SUSPENDED',
  BID_WON = 'BID_WON',
}

interface NotificationData {
  [key: string]: any;
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: NotificationData,
  _relatedId?: string
) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data || {},
        read: false,
      },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export async function notifyBidPlaced(
  clientId: string,
  freelancerId: string,
  jobId: string,
  projectTitle: string,
  bidAmount: number
) {
  // Notify client of new bid
  await createNotification(
    clientId,
    NotificationType.BID_PLACED,
    'New Bid Received',
    `A freelancer has bid $${bidAmount.toLocaleString()} on your project "${projectTitle}"`,
    { jobId, bidAmount },
    jobId
  );
}

export async function notifyBidWon(
  freelancerId: string,
  clientName: string,
  projectTitle: string,
  bidAmount: number
) {
  await createNotification(
    freelancerId,
    NotificationType.BID_WON,
    'Bid Won! 🎉',
    `${clientName} has accepted your bid for "${projectTitle}". You have 24 hours to accept this project.`,
    { bidAmount, projectTitle }
  );
}

export async function notifyBidAccepted(
  clientId: string,
  projectTitle: string,
  freelancerName: string,
  bidAmount: number
) {
  await createNotification(
    clientId,
    NotificationType.BID_ACCEPTED,
    'Bid Accepted',
    `You accepted ${freelancerName}'s bid of $${bidAmount.toLocaleString()} for "${projectTitle}"`,
    { bidAmount, freelancerName, projectTitle }
  );
}

export async function notifyBidRejected(
  freelancerId: string,
  projectTitle: string,
  reason?: string
) {
  await createNotification(
    freelancerId,
    NotificationType.BID_REJECTED,
    'Bid Rejected',
    `Your bid on "${projectTitle}" has been rejected. ${reason || 'The client chose another freelancer.'}`,
    { projectTitle, reason }
  );
}

export async function notifyContractCreated(
  adminId: string,
  clientName: string,
  freelancerName: string,
  projectTitle: string,
  contractAmount: number
) {
  await createNotification(
    adminId,
    NotificationType.CONTRACT_CREATED,
    'New Contract for Review',
    `Contract between ${clientName} and ${freelancerName} for "${projectTitle}" ($${contractAmount.toLocaleString()}) awaiting approval`,
    { contractAmount, projectTitle }
  );
}

export async function notifyContractApproved(
  clientId: string,
  freelancerId: string,
  projectTitle: string,
  contractAmount: number,
  googleMeetLink: string
) {
  // Notify client
  await createNotification(
    clientId,
    NotificationType.CONTRACT_APPROVED,
    'Contract Approved',
    `Your contract for "${projectTitle}" has been approved. Google Meet: ${googleMeetLink}`,
    { projectTitle, googleMeetLink, contractAmount }
  );

  // Notify freelancer
  await createNotification(
    freelancerId,
    NotificationType.CONTRACT_APPROVED,
    'Contract Approved',
    `Your contract for "${projectTitle}" has been approved. Google Meet: ${googleMeetLink}`,
    { projectTitle, googleMeetLink, contractAmount }
  );
}

export async function notifyUserSuspended(
  userId: string,
  reason: string
) {
  await createNotification(
    userId,
    NotificationType.USER_SUSPENDED,
    'Account Suspended',
    `Your account has been suspended. Reason: ${reason}`,
    { reason }
  );
}

export async function markNotificationAsRead(notificationId: string) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function markAllNotificationsAsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: { userId },
    data: { read: true },
  });
}

export async function getUnreadNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: {
      userId,
      read: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });
}

export async function getAllNotifications(userId: string, take: number = 20) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take,
  });
}
