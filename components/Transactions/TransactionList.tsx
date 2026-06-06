'use client';

import type { ITransaction } from '@/lib/types';

type SortField = 'date' | 'type' | 'category' | 'description' | 'amount';

interface Props {
  transactions: ITransaction[];
  onEdit: (t: ITransaction) => void;
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortField: SortField;
  sortOrder: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

const columns: { key: SortField; label: string; align?: string }[] = [
  { key: 'description', label: 'Description' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount', align: 'right' },
  { key: 'type', label: 'Type' },
  { key: 'date', label: 'Date' },
];

function SortIcon({ field, currentField, currentOrder }: { field: SortField; currentField: SortField; currentOrder: 'asc' | 'desc' }) {
  if (field !== currentField) {
    return (
      <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  return (
    <svg className={`w-3.5 h-3.5 text-blue-600 ${currentOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
  sortField,
  sortOrder,
  onSort,
}: Props) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
        <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-slate-500 text-sm">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  className={`px-5 py-3.5 font-semibold text-xs text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-700 transition-colors ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  <span className={`flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : ''}`}>
                    {col.label}
                    <SortIcon field={col.key} currentField={sortField} currentOrder={sortOrder} />
                  </span>
                </th>
              ))}
              <th className="px-5 py-3.5 font-semibold text-xs text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((t) => {
              const category = typeof t.category === 'object' ? t.category : null;
              return (
                <tr key={t._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-4 text-slate-500 max-w-[200px] truncate">
                    {t.description || <span className="text-slate-300 italic">No description</span>}
                  </td>
                  <td className="px-5 py-4">
                    {category && (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: category.color }} />
                        <span className="text-slate-600">{category.name}</span>
                      </span>
                    )}
                  </td>
                  <td className={`px-5 py-4 text-right font-semibold whitespace-nowrap tabular-nums ${
                    t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        t.type === 'income'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-700 whitespace-nowrap font-medium">
                    {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(t)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(t._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3.5 py-1.5 text-sm font-medium border border-slate-200 rounded-xl disabled:opacity-40 hover:bg-white transition-colors text-slate-600 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3.5 py-1.5 text-sm font-medium border border-slate-200 rounded-xl disabled:opacity-40 hover:bg-white transition-colors text-slate-600 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
