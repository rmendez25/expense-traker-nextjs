import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/lib/models/Transaction';
import { getTokenFromRequest, verifyToken, unauthorizedResponse } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';

const toLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export async function GET(
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

    const transaction = await Transaction.findOne({
      _id: id,
      user: decoded.userId,
    }).populate('category', 'name color type isRecurring');

    if (!transaction) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
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
    const updateData = await request.json();
    if (updateData.date) updateData.date = toLocalDate(updateData.date);

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, user: decoded.userId },
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name color type isRecurring');

    if (!transaction) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    return handleApiError(error);
  }
}

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

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: decoded.userId,
    });

    if (!transaction) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
