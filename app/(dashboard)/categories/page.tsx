'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  isRecurring: boolean;
  isDefault: boolean;
  color: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'expense' as 'income' | 'expense', isRecurring: false, color: '#3B82F6' });
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/categories', form);
      setShowForm(false);
      setForm({ name: '', type: 'expense', isRecurring: false, color: '#3B82F6' });
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const incomeCategories = categories.filter((c) => c.type === 'income');
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your transaction categories</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-emerald-700 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
            Income Categories
          </h2>
          <div className="space-y-1.5">
            {incomeCategories.map((cat) => (
              <div key={cat._id} className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                  <span className="font-medium text-slate-700 text-sm">{cat.name}</span>
                  {cat.isRecurring && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium">Recurring</span>}
                  {cat.isDefault && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">Default</span>}
                </div>
                {!cat.isDefault && (
                  <button onClick={() => handleDelete(cat._id)} className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {incomeCategories.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No income categories</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-base font-semibold text-rose-700 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
            </svg>
            Expense Categories
          </h2>
          <div className="space-y-1.5">
            {expenseCategories.map((cat) => (
              <div key={cat._id} className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                  <span className="font-medium text-slate-700 text-sm">{cat.name}</span>
                  {cat.isRecurring && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-medium">Recurring</span>}
                  {cat.isDefault && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">Default</span>}
                </div>
                {!cat.isDefault && (
                  <button onClick={() => handleDelete(cat._id)} className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {expenseCategories.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No expense categories</p>}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">New Category</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              {error && (
                <div className="bg-rose-50 text-rose-700 text-sm p-3.5 rounded-xl border border-rose-100 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                  placeholder="Category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as 'income' | 'expense' }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer"
                  />
                  <span className="text-sm text-slate-500">{form.color}</span>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.isRecurring}
                    onChange={(e) => setForm((p) => ({ ...p, isRecurring: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${form.isRecurring ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform mt-1 ${form.isRecurring ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                </div>
                <span className="text-sm text-slate-700">Recurring category</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
