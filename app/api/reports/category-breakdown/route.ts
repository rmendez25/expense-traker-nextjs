import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Transaction from '@/lib/models/Transaction';
import { getTokenFromRequest, verifyToken, unauthorizedResponse } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';

const toLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = getTokenFromRequest(request);
    if (!token) return unauthorizedResponse();

    const decoded = verifyToken(token);
    if (!decoded) return unauthorizedResponse();

    const userId = new mongoose.Types.ObjectId(decoded.userId);
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const match: Record<string, unknown> = {
      user: userId,
      type: 'expense',
    };

    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter.$gte = toLocalDate(startDate);
      if (endDate) dateFilter.$lte = toLocalDate(endDate);
      match.date = dateFilter;
    }

    const breakdown = await Transaction.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$category',
          categoryName: { $first: '$categoryInfo.name' },
          color: { $first: '$categoryInfo.color' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const grandTotal = breakdown.reduce((sum, b) => sum + b.total, 0);

    const result = breakdown.map((b) => ({
      category: b.categoryName,
      color: b.color,
      amount: b.total,
      percentage: grandTotal > 0 ? Math.round((b.total / grandTotal) * 100) : 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
