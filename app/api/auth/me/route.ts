import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { getTokenFromRequest, verifyToken, unauthorizedResponse } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = getTokenFromRequest(request);
    if (!token) return unauthorizedResponse();

    const decoded = verifyToken(token);
    if (!decoded) return unauthorizedResponse();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ _id: user._id, email: user.email, name: user.name });
  } catch (error) {
    return handleApiError(error);
  }
}
