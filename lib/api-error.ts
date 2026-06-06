import { NextResponse } from 'next/server';

export function handleApiError(error: unknown) {
  console.error('[API Error]:', error);

  if (error instanceof Error) {
    const err = error as Error & { code?: number; keyValue?: Record<string, unknown> };

    // Mongoose duplicate key
    if (err.code === 11000 && err.keyValue) {
      const field = Object.keys(err.keyValue)[0];
      return NextResponse.json(
        { message: `Duplicate value for ${field}` },
        { status: 400 }
      );
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      return NextResponse.json(
        { message: err.message },
        { status: 400 }
      );
    }

    // Mongoose cast error
    if (err.name === 'CastError') {
      return NextResponse.json(
        { message: 'Invalid ID format' },
        { status: 400 }
      );
    }
  }

  return NextResponse.json(
    { message: 'Internal Server Error' },
    { status: 500 }
  );
}
