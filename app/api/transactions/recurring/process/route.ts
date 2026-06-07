import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken, unauthorizedResponse } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';
import { processRecurringTransactions } from '@/lib/recurring';

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return unauthorizedResponse();

    const decoded = verifyToken(token);
    if (!decoded) return unauthorizedResponse();

    const count = await processRecurringTransactions(decoded.userId);

    return NextResponse.json({ created: count });
  } catch (error) {
    return handleApiError(error);
  }
}
