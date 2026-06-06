import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { getTokenFromRequest, verifyToken, unauthorizedResponse } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const token = getTokenFromRequest(request);
    if (!token) return unauthorizedResponse();

    const decoded = verifyToken(token);
    if (!decoded) return unauthorizedResponse();

    const { name, currentPassword, newPassword } = await request.json();

    const user = await User.findById(decoded.userId).select('+password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (name) {
      user.name = name;
    }

    if (currentPassword && newPassword) {
      if (!(await user.comparePassword(currentPassword))) {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ message: 'New password must be at least 6 characters' }, { status: 400 });
      }
      user.password = newPassword;
    }

    await user.save();

    return NextResponse.json({ _id: user._id, email: user.email, name: user.name });
  } catch (error) {
    return handleApiError(error);
  }
}
