import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { createToken } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const token = createToken(user._id.toString());

    return NextResponse.json({
      token,
      user: { _id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
