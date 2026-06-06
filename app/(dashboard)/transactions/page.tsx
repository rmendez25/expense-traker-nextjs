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

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Add Transaction
        </button>
      </div>

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
