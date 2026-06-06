'use client';

import type { ITransaction } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface Props {
  transactions: ITransaction[];
  loading: boolean;
}

export default function RecentTransactions({ transactions, loading }: Props) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
        <div className="h-5 bg-slate-200 rounded w-36 animate-pulse" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-9 h-9 bg-slate-200 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-slate-200 rounded w-24" />
              <div className="h-3 bg-slate-200 rounded w-16" />
            </div>
            <div className="h-4 bg-slate-200 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Recent Transactions</h3>
        <button
          onClick={() => router.push('/transactions')}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View all
        </button>
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-6">No transactions yet</p>
      ) : (
        <div className="space-y-1">
          {transactions.map((t) => {
            const category = typeof t.category === 'object' ? t.category : null;
            return (
              <div
                key={t._id}
                className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => router.push('/transactions')}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                    t.type === 'income'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {t.type === 'income' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {t.description || category?.name || 'Transaction'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {category && <span> &middot; {category.name}</span>}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold tabular-nums whitespace-nowrap ${
                    t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
