'use client';

import type { DashboardSummary } from '@/lib/types';

interface Props {
  data: DashboardSummary | null;
  loading: boolean;
}

const icons = {
  balance: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  income: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  ),
  expenses: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
    </svg>
  ),
};

export default function DashboardCards({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-pulse">
            <div className="h-10 w-10 bg-slate-200 rounded-xl mb-4" />
            <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
            <div className="h-7 bg-slate-200 rounded w-32" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Balance',
      value: data?.totalBalance ?? 0,
      gradient: 'from-indigo-600 to-blue-500',
      icon: icons.balance,
      prefix: '',
    },
    {
      label: 'Monthly Income',
      value: data?.totalIncome ?? 0,
      gradient: 'from-emerald-600 to-teal-500',
      icon: icons.income,
      prefix: '+',
    },
    {
      label: 'Monthly Expenses',
      value: data?.totalExpenses ?? 0,
      gradient: 'from-rose-600 to-pink-500',
      icon: icons.expenses,
      prefix: '-',
    },
  ];

  return (
    <div className="space-y-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-[4rem] -mr-8 -mt-8 opacity-50" />
          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-sm mb-4`}>
            {card.icon}
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">{card.label}</p>
          <p className={`text-2xl font-bold ${card.value < 0 && card.label === 'Total Balance' ? 'text-rose-600' : 'text-slate-900'}`}>
            {card.prefix}${Math.abs(card.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      ))}
    </div>
  );
}
