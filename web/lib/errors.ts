import { NextResponse } from 'next/server';
import { logger } from './logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function handleApiError(error: any) {
  logger.error('API Error', { error: error.message, stack: error.stack });

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  if (error.code === 'P2025') {
    // Prisma record not found
    return NextResponse.json(
      { error: 'Record not found' },
      { status: 404 }
    );
  }

  if (error.code === 'P2002') {
    // Prisma unique constraint violation
    const field = error.meta?.target?.[0] || 'field';
    return NextResponse.json(
      { error: `${field} already exists` },
      { status: 400 }
    );
  }

  // Default error response
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

export function handleClientError(error: any): { error: string } {
  logger.error('Client Error', { error: error.message });

  if (error instanceof AppError) {
    return { error: error.message };
  }

  if (error.response?.data?.error) {
    return { error: error.response.data.error };
  }

  return { error: 'An unexpected error occurred' };
}
