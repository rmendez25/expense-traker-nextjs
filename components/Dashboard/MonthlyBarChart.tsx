'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyReport } from '@/lib/types';

interface Props {
  data: MonthlyReport[];
  loading: boolean;
}

export default function MonthlyBarChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="h-5 bg-slate-200 rounded w-52 mb-6 animate-pulse" />
        <div className="h-[300px] bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  const chartData = data.map((m) => ({
    month: new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
    Income: m.income,
    Expenses: m.expenses,
  }));

  const isEmpty = chartData.every((d) => d.Income === 0 && d.Expenses === 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-base font-semibold text-slate-900 mb-6">Monthly Income vs Expenses</h3>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <p className="text-sm">No data for this year yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
              contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            <Legend
              formatter={(value: string) => <span className="text-sm text-slate-600">{value}</span>}
            />
            <Bar dataKey="Income" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Expenses" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
