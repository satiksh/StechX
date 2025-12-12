import prisma from '@/lib/prisma';

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
  contractId: string,
  amount: number,
  type: PaymentType = PaymentType.ADVANCE
) {
  return await prisma.payment.create({
    data: {
      contractId,
      amount,
      type: type.toLowerCase(),
      status: PaymentStatus.PENDING,
      paymentMethod: 'manual',
    },
  });
}

export function calculateAdvanceAmount(contractAmount: number, advancePercentage: number = 30): number {
  return Math.round((contractAmount * advancePercentage) / 100 * 100) / 100;
}

export function calculateFinalAmount(contractAmount: number, advancePercentage: number = 30): number {
  return Math.round((contractAmount * (100 - advancePercentage)) / 100 * 100) / 100;
}

export async function getContractPayments(contractId: string) {
  return await prisma.payment.findMany({
    where: { contractId },
  });
}

export async function completePayment(paymentId: string, transactionId?: string) {
  return await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: PaymentStatus.COMPLETED,
      transactionId: transactionId || undefined,
  paidAt: new Date(),
    },
  });
}

export async function failPayment(paymentId: string, reason?: string) {
  return await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: PaymentStatus.FAILED,
  description: reason || undefined,
    },
  });
}

export async function refundPayment(paymentId: string, reason?: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  // Create refund record
  const refund = await prisma.payment.create({
    data: {
      contractId: payment.contractId,
      amount: payment.amount,
      type: 'refund',
      status: PaymentStatus.COMPLETED,
      paymentMethod: payment.paymentMethod,
      description: reason || payment.description,
      paidAt: new Date(),
    },
  });

  // Update original payment
  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: PaymentStatus.REFUNDED,
  description: reason || payment.description,
    },
  });

  return refund;
}

export async function getUserBalance(_userId: string) {
  // Marketplace schema Payments aren't tied to users directly; balances are derived via Contracts.
  // Keep as a stub to avoid breaking imports.
  return {
    totalEarned: 0,
    pending: 0,
    available: 0,
  };
}

export async function getPaymentStats(_userId: string) {
  // Payments aren't directly linked to users in this schema. Keep as a stub for now.
  return {
    totalOutgoing: 0,
    totalIncoming: 0,
    pendingPayments: 0,
    transactionCount: 0,
  };
}

export async function validatePayment(
  fromUserId: string,
  toUserId: string,
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
  where: { id: fromUserId },
  });

  if (!fromUser) {
    return { valid: false, error: 'Payer not found' };
  }

  if (fromUser.isSuspended) {
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
