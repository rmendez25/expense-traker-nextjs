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
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [incomeResult, expenseResult, yearlyIncome, yearlyExpenses] =
      await Promise.all([
        Transaction.aggregate([
          { $match: { user: userId, type: 'income', date: { $gte: startOfMonth } } },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]),
        Transaction.aggregate([
          { $match: { user: userId, type: 'expense', date: { $gte: startOfMonth } } },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]),
        Transaction.aggregate([
          { $match: { user: userId, type: 'income', date: { $gte: startOfYear } } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Transaction.aggregate([
          { $match: { user: userId, type: 'expense', date: { $gte: startOfYear } } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
      ]);

    const monthlyIncome = incomeResult[0]?.total || 0;
    const monthlyExpenses = expenseResult[0]?.total || 0;
    const yearlyIncomeTotal = yearlyIncome[0]?.total || 0;
    const yearlyExpensesTotal = yearlyExpenses[0]?.total || 0;

    return NextResponse.json({
      totalBalance: yearlyIncomeTotal - yearlyExpensesTotal,
      totalIncome: monthlyIncome,
      totalExpenses: monthlyExpenses,
      incomeCount: incomeResult[0]?.count || 0,
      expenseCount: expenseResult[0]?.count || 0,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
