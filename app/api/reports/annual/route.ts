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

    const report = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': 1 } },
    ]);

    const yearsMap = new Map<number, Map<number, { income: number; expenses: number }>>();

    for (const entry of report) {
      const { year, month, type } = entry._id;
      if (!yearsMap.has(year)) yearsMap.set(year, new Map());
      const monthsMap = yearsMap.get(year)!;
      if (!monthsMap.has(month)) monthsMap.set(month, { income: 0, expenses: 0 });
      const monthData = monthsMap.get(month)!;
      if (type === 'income') monthData.income += entry.total;
      else monthData.expenses += entry.total;
    }

    const years = Array.from(yearsMap.entries())
      .map(([year, monthsMap]) => {
        const months = Array.from(monthsMap.entries())
          .map(([monthNum, data]) => ({
            month: `${year}-${String(monthNum).padStart(2, '0')}`,
            ...data,
            net: data.income - data.expenses,
          }))
          .sort((a, b) => a.month.localeCompare(b.month));

        const totalIncome = months.reduce((s, m) => s + m.income, 0);
        const totalExpenses = months.reduce((s, m) => s + m.expenses, 0);

        return {
          year,
          months,
          totalIncome,
          totalExpenses,
          totalNet: totalIncome - totalExpenses,
        };
      })
      .sort((a, b) => b.year - a.year);

    return NextResponse.json(years);
  } catch (error) {
    return handleApiError(error);
  }
}
