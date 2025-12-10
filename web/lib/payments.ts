import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentType {
  ADVANCE = 'ADVANCE',
  FINAL = 'FINAL',
  REFUND = 'REFUND',
}

export async function createPayment(
  fromUserId: number,
  toUserId: number,
  contractId: number,
  amount: number,
  type: PaymentType = PaymentType.ADVANCE
) {
  return await prisma.payment.create({
    data: {
      fromUserId,
      toUserId,
      contractId,
      amount,
      type,
      status: PaymentStatus.PENDING,
    },
  });
}

export function calculateAdvanceAmount(contractAmount: number, advancePercentage: number = 30): number {
  return Math.round((contractAmount * advancePercentage) / 100 * 100) / 100;
}

export function calculateFinalAmount(contractAmount: number, advancePercentage: number = 30): number {
  return Math.round((contractAmount * (100 - advancePercentage)) / 100 * 100) / 100;
}

export async function getContractPayments(contractId: number) {
  return await prisma.payment.findMany({
    where: { contractId },
    include: {
      fromUser: { select: { id: true, name: true, email: true } },
      toUser: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function completePayment(paymentId: number, transactionId?: string) {
  return await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: PaymentStatus.COMPLETED,
      transactionId: transactionId || undefined,
      completedAt: new Date(),
    },
  });
}

export async function failPayment(paymentId: number, reason?: string) {
  return await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: PaymentStatus.FAILED,
      failureReason: reason || undefined,
    },
  });
}

export async function refundPayment(paymentId: number, reason?: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  // Create refund record
  const refund = await prisma.payment.create({
    data: {
      fromUserId: payment.toUserId,
      toUserId: payment.fromUserId,
      contractId: payment.contractId,
      amount: payment.amount,
      type: PaymentType.REFUND,
      status: PaymentStatus.COMPLETED,
      originalPaymentId: paymentId,
    },
  });

  // Update original payment
  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: PaymentStatus.REFUNDED,
      refundReason: reason || undefined,
    },
  });

  return refund;
}

export async function getUserBalance(userId: number) {
  const payments = await prisma.payment.findMany({
    where: {
      toUserId: userId,
      status: PaymentStatus.COMPLETED,
    },
  });

  const totalEarned = payments.reduce((sum: number, p: any) => sum + p.amount, 0);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalEarnings: true },
  });

  return {
    totalEarned,
    lastUpdated: new Date(),
  };
}

export async function getPaymentStats(userId: number) {
  const payments = await prisma.payment.findMany({
    where: {
      OR: [
        { fromUserId: userId },
        { toUserId: userId },
      ],
    },
  });

  const outgoing = payments
    .filter((p: any) => p.fromUserId === userId)
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  const incoming = payments
    .filter((p: any) => p.toUserId === userId && p.status === PaymentStatus.COMPLETED)
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  const pending = payments
    .filter((p: any) => p.toUserId === userId && p.status === PaymentStatus.PENDING)
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  return {
    totalOutgoing: outgoing,
    totalIncoming: incoming,
    pendingPayments: pending,
    transactionCount: payments.length,
  };
}

export async function validatePayment(
  fromUserId: number,
  toUserId: number,
  amount: number
): Promise<{ valid: boolean; error?: string }> {
  if (!fromUserId || !toUserId) {
    return { valid: false, error: 'Invalid user IDs' };
  }

  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }

  if (amount > 1000000) {
    return { valid: false, error: 'Amount exceeds maximum limit' };
  }

  const fromUser = await prisma.user.findUnique({
    where: { id: Number(fromUserId) },
  });

  if (!fromUser) {
    return { valid: false, error: 'Payer not found' };
  }

  if (fromUser.status === 'SUSPENDED') {
    return { valid: false, error: 'Payer account is suspended' };
  }

  return { valid: true };
}

export interface PaymentSummary {
  totalProcessed: number;
  averagePayment: number;
  largestPayment: number;
  smallestPayment: number;
  transactionCount: number;
}

export async function getPaymentSummary(): Promise<PaymentSummary> {
  const payments = await prisma.payment.findMany({
    where: { status: PaymentStatus.COMPLETED },
  });

  if (payments.length === 0) {
    return {
      totalProcessed: 0,
      averagePayment: 0,
      largestPayment: 0,
      smallestPayment: 0,
      transactionCount: 0,
    };
  }

  const totalProcessed = payments.reduce((sum: number, p: any) => sum + p.amount, 0);
  const amounts = payments.map((p: any) => p.amount);

  return {
    totalProcessed,
    averagePayment: totalProcessed / payments.length,
    largestPayment: Math.max(...amounts),
    smallestPayment: Math.min(...amounts),
    transactionCount: payments.length,
  };
}
