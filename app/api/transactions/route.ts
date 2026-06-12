import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/lib/models/Transaction';
import Category from '@/lib/models/Category';
import { getTokenFromRequest, verifyToken, unauthorizedResponse } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';

const toLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const SORT_FIELDS = ['date', 'type', 'category', 'description', 'amount'] as const;

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = getTokenFromRequest(request);
    if (!token) return unauthorizedResponse();

    const decoded = verifyToken(token);
    if (!decoded) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const sortField = searchParams.get('sortField');
    const sortOrder = searchParams.get('sortOrder');

    const filter: Record<string, unknown> = { user: decoded.userId };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter.$gte = toLocalDate(startDate);
      if (endDate) dateFilter.$lte = toLocalDate(endDate);
      filter.date = dateFilter;
    }
    if (search) {
      filter.description = { $regex: search, $options: 'i' };
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const field = SORT_FIELDS.includes(sortField as typeof SORT_FIELDS[number])
      ? (sortField as string)
      : 'date';
    const order = sortOrder === 'asc' ? 1 : -1;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate('category', 'name color type')
        .sort({ [field]: order })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Transaction.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: transactions,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
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

    const { amount, date, type, category, description } = await request.json();

    const transactionDate = date ? toLocalDate(date) : new Date();

    const transaction = await Transaction.create({
      amount,
      date: transactionDate,
      type,
      category,
      description,
      user: decoded.userId,
    });

    const populated = await transaction.populate('category', 'name color type');
    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
