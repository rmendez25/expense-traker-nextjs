import connectDB from './db';
import Category from './models/Category';

const defaultCategories = [
  { name: 'Salary', type: 'income', isRecurring: true, color: '#22C55E', icon: 'briefcase' },
  { name: 'Local Investments', type: 'income', isRecurring: false, color: '#3B82F6', icon: 'trending-up' },
  { name: 'Freelance', type: 'income', isRecurring: false, color: '#8B5CF6', icon: 'code' },
  { name: 'Utilities', type: 'expense', isRecurring: true, color: '#F59E0B', icon: 'zap' },
  { name: 'Subscriptions', type: 'expense', isRecurring: true, color: '#6366F1', icon: 'repeat' },
  { name: 'Family Expenses', type: 'expense', isRecurring: true, color: '#EC4899', icon: 'users' },
  { name: 'Home Construction', type: 'expense', isRecurring: false, color: '#F97316', icon: 'home' },
  { name: 'Rent', type: 'expense', isRecurring: true, color: '#EF4444', icon: 'home' },
  { name: 'Insurance', type: 'expense', isRecurring: true, color: '#14B8A6', icon: 'shield' },
  { name: 'Groceries', type: 'expense', isRecurring: false, color: '#84CC16', icon: 'shopping-cart' },
  { name: 'Fuel', type: 'expense', isRecurring: false, color: '#EAB308', icon: 'fuel' },
  { name: 'Dining Out', type: 'expense', isRecurring: false, color: '#A855F7', icon: 'utensils' },
  { name: 'Healthcare', type: 'expense', isRecurring: false, color: '#06B6D4', icon: 'heart' },
  { name: 'Entertainment', type: 'expense', isRecurring: false, color: '#D946EF', icon: 'film' },
  { name: 'Education', type: 'expense', isRecurring: false, color: '#2563EB', icon: 'book' },
  { name: 'Savings', type: 'expense', isRecurring: true, color: '#10B981', icon: 'piggy-bank' },
  { name: 'Shopping', type: 'expense', isRecurring: false, color: '#F43F5E', icon: 'shopping-bag' },
  { name: 'Transportation', type: 'expense', isRecurring: false, color: '#7C3AED', icon: 'bus' },
  { name: 'Miscellaneous', type: 'expense', isRecurring: false, color: '#78716C', icon: 'more-horizontal' },
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
