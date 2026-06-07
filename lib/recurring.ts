import connectDB from '@/lib/db';
import Transaction from '@/lib/models/Transaction';
import Category from '@/lib/models/Category';

function addInterval(date: Date, interval: 'monthly' | 'yearly'): Date {
  const d = new Date(date);
  if (interval === 'monthly') {
    d.setMonth(d.getMonth() + 1);
  } else {
    d.setFullYear(d.getFullYear() + 1);
  }
  return d;
}

export async function processRecurringTransactions(userId: string): Promise<number> {
  await connectDB();

  const now = new Date();
  let created = 0;

  const templates = await Transaction.find({
    user: userId,
    isRecurring: true,
    nextDate: { $lte: now },
  });

  for (const template of templates) {
    const interval = template.recurringInterval || 'monthly';
    let currentDate = new Date(template.nextDate!);

    for (let i = 0; i < 24; i++) {
      if (currentDate > now) break;

      await Transaction.create({
        amount: template.amount,
        date: currentDate,
        type: template.type,
        category: template.category,
        description: template.description,
        isRecurring: false,
        user: userId,
      });
      created++;

      currentDate = addInterval(currentDate, interval);
    }

    template.nextDate = currentDate;
    await template.save();
  }

  return created;
}

export function computeNextDate(date: Date, interval: 'monthly' | 'yearly'): Date {
  return addInterval(date, interval);
}
