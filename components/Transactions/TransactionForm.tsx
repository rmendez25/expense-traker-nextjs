'use client';

import { useState, useEffect, type FormEvent } from 'react';
import api from '@/services/api';
import type { ITransaction } from '@/lib/types';

interface Category {
  _id: string;
  name: string;
  type: string;
}

interface Props {
  transaction?: ITransaction | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function TransactionForm({ transaction, onClose, onSaved }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const getCategoryId = (cat: ITransaction['category'] | undefined): string => {
    if (!cat) return '';
    return typeof cat === 'string' ? cat : cat._id;
  };
  const [form, setForm] = useState({
    amount: transaction?.amount?.toString() || '',
    date: transaction?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    type: transaction?.type || 'expense',
    category: getCategoryId(transaction?.category),
    description: transaction?.description || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => {
      setCategories(res.data);
      if (!form.category && res.data.length > 0) {
        const filtered = res.data.filter((c: Category) => c.type === form.type);
        if (filtered.length > 0) setForm((prev) => ({ ...prev, category: filtered[0]._id }));
      }
    });
  }, []);

  useEffect(() => {
    const filtered = categories.filter((c) => c.type === form.type);
    const stillValid = filtered.find((c) => c._id === form.category);
    if (!stillValid && filtered.length > 0) {
      setForm((prev) => ({ ...prev, category: filtered[0]._id }));
    }
  }, [form.type, categories]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        amount: parseFloat(form.amount),
        date: form.date,
        type: form.type,
        category: form.category,
        description: form.description,
      };

      if (transaction?._id) {
        await api.put(`/transactions/${transaction._id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === form.type);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {transaction ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-50 text-rose-700 text-sm p-3.5 rounded-xl border border-rose-100 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, type: 'expense' }))}
              className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                form.type === 'expense'
                  ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, type: 'income' }))}
              className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                form.type === 'income'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount}
                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                required
                className="w-full pl-7 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm bg-white"
            >
              <option value="">Select category</option>
              {filteredCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm placeholder:text-slate-400"
              placeholder="Optional description"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 shadow-sm"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : transaction ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
