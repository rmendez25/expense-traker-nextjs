'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import TransactionList from '@/components/Transactions/TransactionList';
import TransactionForm from '@/components/Transactions/TransactionForm';
import TransactionFilters from '@/components/Transactions/TransactionFilters';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { ITransaction } from '@/lib/types';

interface Filters {
  type: string;
  category: string;
  startDate: string;
  endDate: string;
  search: string;
}

interface Category {
  _id: string;
  name: string;
  type: string;
}

type SortField = 'date' | 'type' | 'category' | 'description' | 'amount';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ITransaction | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [recurringCreated, setRecurringCreated] = useState(0);
  const [processingRecurring, setProcessingRecurring] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<Filters>({
    type: '', category: '', startDate: '', endDate: '', search: '',
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '15');
      params.set('sortField', sortField);
      params.set('sortOrder', sortOrder);
      if (filters.type) params.set('type', filters.type);
      if (filters.category) params.set('category', filters.category);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
      if (filters.search) params.set('search', filters.search);

      const res = await api.get(`/transactions?${params}`);
      setTransactions(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to load transactions', err);
    } finally {
      setLoading(false);
    }
  }, [page, filters, sortField, sortOrder]);

  const processRecurring = useCallback(async () => {
    setProcessingRecurring(true);
    try {
      const res = await api.post('/transactions/recurring/process');
      const count = res.data.created;
      if (count > 0) {
        setRecurringCreated((prev) => prev + count);
        fetchTransactions();
      }
    } catch {
    } finally {
      setProcessingRecurring(false);
    }
  }, [fetchTransactions]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    processRecurring();
  }, [processRecurring]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleEdit = (t: ITransaction) => {
    setEditing(t);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    fetchTransactions();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={processRecurring}
            disabled={processingRecurring}
            className="border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg className={`w-4 h-4 ${processingRecurring ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Process Recurring
          </button>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + Add Transaction
          </button>
        </div>
      </div>

      {recurringCreated > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {recurringCreated} recurring transaction{recurringCreated > 1 ? 's' : ''} auto-generated
        </div>
      )}

      <TransactionFilters
        filters={filters}
        categories={categories}
        onChange={handleFilterChange}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      )}

      {showForm && (
        <TransactionForm
          transaction={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
