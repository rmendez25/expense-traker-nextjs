'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import DashboardCards from '@/components/Dashboard/DashboardCards';
import ExpensePieChart from '@/components/Dashboard/ExpensePieChart';
import RecentTransactions from '@/components/Dashboard/RecentTransactions';
import TransactionForm from '@/components/Transactions/TransactionForm';
import type { DashboardSummary, CategoryBreakdown, ITransaction } from '@/lib/types';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [summaryRes, breakdownRes, recentRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/reports/category-breakdown'),
        api.get('/transactions?limit=5&sortField=date&sortOrder=desc'),
      ]);
      setSummary(summaryRes.data);
      setCategoryBreakdown(breakdownRes.data);
      setRecentTransactions(recentRes.data.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaved = () => {
    setShowForm(false);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ExpensePieChart data={categoryBreakdown} loading={loading} />
          <RecentTransactions transactions={recentTransactions} loading={loading} />
        </div>
        <div className="space-y-5">
          <DashboardCards data={summary} loading={loading} />
        </div>
      </div>

      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
