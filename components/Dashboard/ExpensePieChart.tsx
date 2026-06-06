'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { CategoryBreakdown } from '@/lib/types';

interface Props {
  data: CategoryBreakdown[];
  loading: boolean;
}

export default function ExpensePieChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="h-5 bg-slate-200 rounded w-44 mb-6 animate-pulse" />
        <div className="h-[300px] bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-base font-semibold text-slate-900 mb-6">Expenses by Category</h3>
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
          </svg>
          <p className="text-sm">No expense data yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={110}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']}
              contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            <Legend
              formatter={(value: string) => <span className="text-sm text-slate-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
