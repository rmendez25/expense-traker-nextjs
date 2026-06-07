export interface IUser {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  isRecurring: boolean;
  isDefault: boolean;
  color: string;
  icon?: string;
  user?: string;
}

export interface ITransaction {
  _id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: ICategory | string;
  description: string;
  isRecurring: boolean;
  recurringInterval?: 'monthly' | 'yearly';
  nextDate?: string;
  user: string;
}

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  incomeCount: number;
  expenseCount: number;
}

export interface CategoryBreakdown {
  category: string;
  color: string;
  amount: number;
  percentage: number;
}

export interface MonthlyReport {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface AnnualReport {
  year: number;
  months: MonthlyReport[];
  totalIncome: number;
  totalExpenses: number;
  totalNet: number;
}

export interface AuthResponse {
  token: string;
  user: IUser;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
