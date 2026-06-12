import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import connectDB from '../lib/db';
import User from '../lib/models/User';
import Category from '../lib/models/Category';
import Transaction from '../lib/models/Transaction';

const defaultCategories = [
  { name: 'Salary', type: 'income' as const, color: '#22C55E', icon: 'briefcase' },
  { name: 'Local Investments', type: 'income' as const, color: '#3B82F6', icon: 'trending-up' },
  { name: 'Freelance', type: 'income' as const, color: '#8B5CF6', icon: 'code' },
  { name: 'Utilities', type: 'expense' as const, color: '#F59E0B', icon: 'zap' },
  { name: 'Subscriptions', type: 'expense' as const, color: '#6366F1', icon: 'repeat' },
  { name: 'Family Expenses', type: 'expense' as const, color: '#EC4899', icon: 'users' },
  { name: 'Home Construction', type: 'expense' as const, color: '#F97316', icon: 'home' },
  { name: 'Rent', type: 'expense' as const, color: '#EF4444', icon: 'home' },
  { name: 'Insurance', type: 'expense' as const, color: '#14B8A6', icon: 'shield' },
  { name: 'Groceries', type: 'expense' as const, color: '#84CC16', icon: 'shopping-cart' },
  { name: 'Fuel', type: 'expense' as const, color: '#EAB308', icon: 'fuel' },
  { name: 'Dining Out', type: 'expense' as const, color: '#A855F7', icon: 'utensils' },
  { name: 'Healthcare', type: 'expense' as const, color: '#06B6D4', icon: 'heart' },
  { name: 'Entertainment', type: 'expense' as const, color: '#D946EF', icon: 'film' },
  { name: 'Education', type: 'expense' as const, color: '#2563EB', icon: 'book' },
  { name: 'Savings', type: 'expense' as const, color: '#10B981', icon: 'piggy-bank' },
  { name: 'Shopping', type: 'expense' as const, color: '#F43F5E', icon: 'shopping-bag' },
  { name: 'Transportation', type: 'expense' as const, color: '#7C3AED', icon: 'bus' },
  { name: 'Miscellaneous', type: 'expense' as const, color: '#78716C', icon: 'more-horizontal' },
];

function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const descriptionTemplates: Record<string, string[]> = {
  Groceries: ['Weekly grocery run', 'Supermarket', 'Farmers market', 'Costco trip', 'Local grocery store'],
  Fuel: ['Shell gas station', 'Exxon gas', 'Chevron fuel', 'BP station'],
  'Dining Out': ['Pizza place', 'Sushi bar', 'Italian restaurant', 'Burger joint', 'Cafe lunch', 'Coffee shop'],
  Rent: ['Monthly rent payment'],
  Utilities: ['Electric bill', 'Water bill', 'Internet bill', 'Gas bill'],
  Subscriptions: ['Netflix', 'Spotify', 'Cloud storage', 'Gym membership', 'News subscription'],
  Shopping: ['Clothing store', 'Electronics store', 'Home goods', 'Online order', 'Department store'],
  Entertainment: ['Movie tickets', 'Concert tickets', 'Bowling', 'Arcade', 'Mini golf'],
  Healthcare: ['Pharmacy', 'Doctor visit', 'Dental checkup', 'Eye exam', 'Vitamins'],
  Education: ['Online course', 'Books', 'Workshop fee', 'Certification exam'],
  Transportation: ['Bus pass', 'Uber ride', 'Train ticket', 'Parking fee', 'Toll road'],
  Salary: ['Monthly salary', 'Bi-weekly paycheck', 'Annual bonus'],
  'Local Investments': ['Dividend payment', 'Interest earned', 'Investment return'],
  Freelance: ['Web design project', 'Consulting fee', 'Writing gig', 'Photography session'],
  Insurance: ['Health insurance', 'Car insurance', 'Home insurance'],
  'Family Expenses': ['Kids activities', 'Family outing', 'Childcare'],
  'Home Construction': ['Hardware store', 'Contractor payment', 'Building materials'],
  Savings: ['Monthly savings transfer', 'Emergency fund', 'Investment deposit'],
  Miscellaneous: ['ATM fee', 'Bank charge', 'Gift', 'Donation'],
};

const incomeDescriptions = ['Monthly salary deposit', 'Freelance payment received', 'Investment dividend', 'Bonus payment', 'Consulting fee'];

const expenseAmounts: Record<string, [number, number]> = {
  Groceries: [45, 200], Fuel: [30, 80], 'Dining Out': [10, 60],
  Rent: [800, 1500], Utilities: [50, 200], Subscriptions: [5, 50],
  Shopping: [20, 300], Entertainment: [10, 100], Healthcare: [10, 150],
  Education: [10, 200], Transportation: [10, 50], Insurance: [50, 300],
  'Family Expenses': [20, 200], 'Home Construction': [100, 1000],
  Miscellaneous: [5, 50], Savings: [100, 500],
};

const incomeAmounts: Record<string, [number, number]> = {
  Salary: [3000, 6000], 'Local Investments': [50, 500], Freelance: [100, 2000],
};

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    let user = await User.findOne({ email: 'test@mail.com' });
    if (user) {
      console.log('Test user already exists');
    } else {
      user = await User.create({
        email: 'test@mail.com',
        password: 'password1',
        name: 'Test User',
      });
      console.log('Created test user: test@mail.com / password1');
    }

    const existingCategories = await Category.find({ user: user._id });
    let categories;
    if (existingCategories.length > 0) {
      categories = existingCategories;
      console.log(`Found ${categories.length} existing categories for user`);
    } else {
      const defaultCats = await Category.find({ isDefault: true });
      if (defaultCats.length > 0) {
        categories = defaultCats;
        console.log(`Using ${categories.length} default categories`);
      } else {
        await Category.deleteMany({});
        categories = await Category.insertMany(
          defaultCategories.map((cat) => ({ ...cat, isDefault: true }))
        );
        console.log(`Created ${categories.length} default categories`);
      }
    }

    await Transaction.deleteMany({ user: user._id });
    console.log('Cleared existing test transactions');

    const incomeCats = categories.filter((c) => c.type === 'income');
    const expenseCats = categories.filter((c) => c.type === 'expense');

    const transactions: Record<string, unknown>[] = [];
    const now = new Date();
    const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), 1);

    for (let i = 0; i < 48; i++) {
      const date = randomDate(twoYearsAgo, now);
      const cat = pick(incomeCats);
      const range = incomeAmounts[cat.name] || [100, 1000];
      transactions.push({
        amount: randomFloat(range[0], range[1]),
        date,
        type: 'income',
        category: cat._id,
        description: pick(incomeDescriptions),
        user: user._id,
      });
    }

    for (let i = 0; i < 170; i++) {
      const date = randomDate(twoYearsAgo, now);
      const cat = pick(expenseCats);
      const range = expenseAmounts[cat.name] || [10, 100];
      const descList = descriptionTemplates[cat.name] || descriptionTemplates.Miscellaneous;
      transactions.push({
        amount: randomFloat(range[0], range[1]),
        date,
        type: 'expense',
        category: cat._id,
        description: pick(descList),
        user: user._id,
      });
    }

    await Transaction.insertMany(transactions);
    console.log(`Seeded ${transactions.length} transactions for test user`);

    const incomeTot = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + (t.amount as number), 0);
    const expTot = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + (t.amount as number), 0);
    console.log(`Total income: $${incomeTot.toFixed(2)}`);
    console.log(`Total expenses: $${expTot.toFixed(2)}`);
    console.log(`Net: $${(incomeTot - expTot).toFixed(2)}`);

    console.log('\nDone! Login with: test@mail.com / password1');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    process.exit(0);
  }
}

seed();
