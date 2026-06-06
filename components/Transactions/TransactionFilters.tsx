'use client';

interface Filters {
  type: string;
  category: string;
  startDate: string;
  endDate: string;
  search: string;
}

interface Props {
  filters: Filters;
  categories: { _id: string; name: string; type: string }[];
  onChange: (filters: Filters) => void;
}

export default function TransactionFilters({ filters, categories, onChange }: Props) {
  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onChange({ type: '', category: '', startDate: '', endDate: '', search: '' });
  };

  const hasFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        <select
          value={filters.type}
          onChange={(e) => update('type', e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={filters.category}
          onChange={(e) => update('category', e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => update('startDate', e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => update('endDate', e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
        />
      </div>
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="mt-2.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
