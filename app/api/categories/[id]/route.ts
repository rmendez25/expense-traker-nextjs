import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/lib/models/Category';
import { getTokenFromRequest, verifyToken, unauthorizedResponse } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const token = getTokenFromRequest(request);
    if (!token) return unauthorizedResponse();

    const decoded = verifyToken(token);
    if (!decoded) return unauthorizedResponse();

    const { id } = await params;

    const category = await Category.findOne({
      _id: id,
      user: decoded.userId,
      isDefault: false,
    });

    if (!category) {
      return NextResponse.json({ message: 'Category not found or cannot be deleted' }, { status: 404 });
    }

    await category.deleteOne();
    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
