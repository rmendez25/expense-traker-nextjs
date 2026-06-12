import connectDB from './db';
import Category from './models/Category';

const defaultCategories = [
  { name: 'Salary', type: 'income', color: '#22C55E', icon: 'briefcase' },
  { name: 'Local Investments', type: 'income', color: '#3B82F6', icon: 'trending-up' },
  { name: 'Freelance', type: 'income', color: '#8B5CF6', icon: 'code' },
  { name: 'Utilities', type: 'expense', color: '#F59E0B', icon: 'zap' },
  { name: 'Subscriptions', type: 'expense', color: '#6366F1', icon: 'repeat' },
  { name: 'Family Expenses', type: 'expense', color: '#EC4899', icon: 'users' },
  { name: 'Home Construction', type: 'expense', color: '#F97316', icon: 'home' },
  { name: 'Rent', type: 'expense', color: '#EF4444', icon: 'home' },
  { name: 'Insurance', type: 'expense', color: '#14B8A6', icon: 'shield' },
  { name: 'Groceries', type: 'expense', color: '#84CC16', icon: 'shopping-cart' },
  { name: 'Fuel', type: 'expense', color: '#EAB308', icon: 'fuel' },
  { name: 'Dining Out', type: 'expense', color: '#A855F7', icon: 'utensils' },
  { name: 'Healthcare', type: 'expense', color: '#06B6D4', icon: 'heart' },
  { name: 'Entertainment', type: 'expense', color: '#D946EF', icon: 'film' },
  { name: 'Education', type: 'expense', color: '#2563EB', icon: 'book' },
  { name: 'Savings', type: 'expense', color: '#10B981', icon: 'piggy-bank' },
  { name: 'Shopping', type: 'expense', color: '#F43F5E', icon: 'shopping-bag' },
  { name: 'Transportation', type: 'expense', color: '#7C3AED', icon: 'bus' },
  { name: 'Miscellaneous', type: 'expense', color: '#78716C', icon: 'more-horizontal' },
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    await Category.deleteMany({ isDefault: true });
    await Category.insertMany(
      defaultCategories.map((cat) => ({ ...cat, isDefault: true }))
    );
    console.log(`Seeded ${defaultCategories.length} default categories`);
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    process.exit(0);
  }
}

seed();
