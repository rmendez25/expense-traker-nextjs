import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Transaction from '@/lib/models/Transaction';
import { getTokenFromRequest, verifyToken, unauthorizedResponse } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = getTokenFromRequest(request);
    if (!token) return unauthorizedResponse();

    const decoded = verifyToken(token);
    if (!decoded) return unauthorizedResponse();

    const userId = new mongoose.Types.ObjectId(decoded.userId);
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const category = searchParams.get('category');
    const targetYear = parseInt(year || '') || new Date().getFullYear();

    const match: Record<string, unknown> = {
      user: userId,
      date: {
        $gte: new Date(`${targetYear}-01-01T00:00:00`),
        $lte: new Date(`${targetYear}-12-31T23:59:59`),
      },
    };

    if (category) match.category = new mongoose.Types.ObjectId(category);

    const report = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    const months = Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const monthStr = `${targetYear}-${String(monthNum).padStart(2, '0')}`;
      const incomeEntry = report.find(
        (r) => r._id.month === monthNum && r._id.type === 'income'
      );
      const expenseEntry = report.find(
        (r) => r._id.month === monthNum && r._id.type === 'expense'
      );

      return {
        month: monthStr,
        income: incomeEntry?.total || 0,
        expenses: expenseEntry?.total || 0,
        net: (incomeEntry?.total || 0) - (expenseEntry?.total || 0),
      };
    });

    const totals = months.reduce(
      (acc, m) => ({
        totalIncome: acc.totalIncome + m.income,
        totalExpenses: acc.totalExpenses + m.expenses,
        totalNet: acc.totalNet + m.net,
      }),
      { totalIncome: 0, totalExpenses: 0, totalNet: 0 }
    );

    return NextResponse.json({ year: targetYear, months, ...totals });
  } catch (error) {
    return handleApiError(error);
  }
}
