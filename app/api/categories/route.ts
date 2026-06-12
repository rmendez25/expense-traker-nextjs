import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/lib/models/Category';
import { getTokenFromRequest, verifyToken, unauthorizedResponse } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = getTokenFromRequest(request);
    if (!token) return unauthorizedResponse();

    const decoded = verifyToken(token);
    if (!decoded) return unauthorizedResponse();

    const categories = await Category.find({
      $or: [{ user: decoded.userId }, { isDefault: true }],
    }).sort({ isDefault: -1, name: 1 });

    return NextResponse.json(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const token = getTokenFromRequest(request);
    if (!token) return unauthorizedResponse();

    const decoded = verifyToken(token);
    if (!decoded) return unauthorizedResponse();

    const { name, type, color, icon } = await request.json();

    const existing = await Category.findOne({ name, user: decoded.userId });
    if (existing) {
      return NextResponse.json({ message: 'Category already exists' }, { status: 400 });
    }

    const category = await Category.create({
      name,
      type,
      isDefault: false,
      color,
      icon,
      user: decoded.userId,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
