import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { createToken } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password, name } = await request.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
    }

    const user = await User.create({ email, password, name });
    const token = createToken(user._id.toString());

    return NextResponse.json(
      {
        token,
        user: { _id: user._id, email: user.email, name: user.name },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
