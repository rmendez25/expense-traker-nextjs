'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface MonthData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

interface AnnualReport {
  year: number;
  months: MonthData[];
  totalIncome: number;
  totalExpenses: number;
  totalNet: number;
}

export default function ReportsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState<MonthData[]>([]);
  const [annualReports, setAnnualReports] = useState<AnnualReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (view === 'monthly') {
          const res = await api.get(`/reports/monthly?year=${year}`);
          setMonthlyData(res.data.months || []);
        } else {
          const res = await api.get('/reports/annual');
          setAnnualReports(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [view, year]);

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-sm text-slate-500 mt-1">View your financial summaries</p>
        </div>
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setView('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              view === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setView('annual')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              view === 'annual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Annual
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : view === 'monthly' ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-600">Year:</label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3.5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Month</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Income</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Expenses</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {monthlyData.map((m) => (
                  <tr key={m.month} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 text-slate-700 font-medium">
                      {new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-right font-medium tabular-nums text-emerald-600">{formatCurrency(m.income)}</td>
                    <td className="px-5 py-4 text-right font-medium tabular-nums text-rose-600">{formatCurrency(m.expenses)}</td>
                    <td className={`px-5 py-4 text-right font-semibold tabular-nums ${m.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {m.net >= 0 ? '+' : ''}{formatCurrency(m.net)}
                    </td>
                  </tr>
                ))}
                {monthlyData.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-slate-400 text-sm">No data for {year}</td></tr>
                )}
              </tbody>
              {monthlyData.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-slate-100 bg-slate-50/50">
                    <td className="px-5 py-4 font-semibold text-slate-900 text-sm">Total</td>
                    <td className="px-5 py-4 text-right font-semibold tabular-nums text-emerald-600">
                      {formatCurrency(monthlyData.reduce((s, m) => s + m.income, 0))}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold tabular-nums text-rose-600">
                      {formatCurrency(monthlyData.reduce((s, m) => s + m.expenses, 0))}
                    </td>
                    <td className={`px-5 py-4 text-right font-bold tabular-nums ${monthlyData.reduce((s, m) => s + m.net, 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatCurrency(monthlyData.reduce((s, m) => s + m.net, 0))}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {annualReports.map((report) => (
            <div key={report.year} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">{report.year}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-5 py-3.5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Month</th>
                      <th className="text-right px-5 py-3.5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Income</th>
                      <th className="text-right px-5 py-3.5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Expenses</th>
                      <th className="text-right px-5 py-3.5 font-semibold text-xs text-slate-500 uppercase tracking-wider">Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {report.months.map((m) => (
                      <tr key={m.month} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 text-slate-700">{new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'long' })}</td>
                        <td className="px-5 py-4 text-right font-medium tabular-nums text-emerald-600">{formatCurrency(m.income)}</td>
                        <td className="px-5 py-4 text-right font-medium tabular-nums text-rose-600">{formatCurrency(m.expenses)}</td>
                        <td className={`px-5 py-4 text-right font-medium tabular-nums ${m.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {m.net >= 0 ? '+' : ''}{formatCurrency(m.net)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-100 bg-slate-50/50">
                      <td className="px-5 py-4 font-semibold text-slate-900">Total</td>
                      <td className="px-5 py-4 text-right font-semibold tabular-nums text-emerald-600">{formatCurrency(report.totalIncome)}</td>
                      <td className="px-5 py-4 text-right font-semibold tabular-nums text-rose-600">{formatCurrency(report.totalExpenses)}</td>
                      <td className={`px-5 py-4 text-right font-bold tabular-nums ${report.totalNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {formatCurrency(report.totalNet)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ))}
          {annualReports.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
              <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z" />
              </svg>
              <p className="text-slate-500 text-sm">No annual data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
