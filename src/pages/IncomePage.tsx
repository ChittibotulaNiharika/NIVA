import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowDownLeft,
  Edit2,
  Trash2,
  Calendar,
  CreditCard,
  FileText,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatINR, formatDate } from '../utils/formatters';
import { INCOME_CATEGORIES } from '../constants/categories';
import { Income, IncomeCategory } from '../types';

export const IncomePage: React.FC = () => {
  const {
    incomeList,
    selectedMonth,
    deleteIncome,
    openAddModal,
    openEditModal,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState<'selected' | 'all'>('selected');

  // Filter income list
  const filteredData = useMemo(() => {
    return incomeList.filter((item) => {
      // Month filter
      if (dateRangeFilter === 'selected' && !item.date.startsWith(selectedMonth)) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL' && item.source !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesSource = item.source?.toLowerCase().includes(query);
        const matchesNotes = item.notes?.toLowerCase().includes(query);
        const matchesMethod = item.paymentMethod?.toLowerCase().includes(query);
        if (!matchesDesc && !matchesSource && !matchesNotes && !matchesMethod) {
          return false;
        }
      }
      return true;
    });
  }, [incomeList, selectedMonth, dateRangeFilter, selectedCategory, searchQuery]);

  const totalFilteredIncome = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Income Management</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal">
              {filteredData.length} records
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Log and manage your salaries, freelancing invoices, stipends, and dividend receipts.
          </p>
        </div>

        <button
          onClick={() => openAddModal('income')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Income</span>
        </button>
      </div>

      {/* Summary Stat Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#111827] border border-emerald-500/20 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Total Filtered Inflow
          </span>
          <h3 className="text-3xl font-extrabold text-white mt-1">
            {formatINR(totalFilteredIncome)}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {dateRangeFilter === 'selected' ? `For month: ${selectedMonth}` : 'Across all time'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <ArrowDownLeft className="w-6 h-6" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-md flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search income by title, description, or notes..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent focus:outline-none text-xs cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Sources</option>
              {INCOME_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Time Scope Toggle */}
          <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setDateRangeFilter('selected')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                dateRangeFilter === 'selected'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateRangeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                dateRangeFilter === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {/* Income Records List / Table */}
      <div className="rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-lg overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">No income records found</p>
            <p className="text-xs text-slate-500">Try adjusting your filters or record your first income.</p>
            <button
              onClick={() => openAddModal('income')}
              className="mt-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold rounded-xl transition"
            >
              + Record Income
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0f172a] text-slate-400 text-[11px] uppercase font-semibold">
                  <th className="py-3 px-4">Source / Title</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredData.map((item: Income) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition group">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-slate-100 block text-sm">
                          {item.description}
                        </span>
                        <span className="text-[11px] text-emerald-400 font-medium">
                          {item.source}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
                        {item.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {item.notes || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-400 text-sm whitespace-nowrap">
                      +{formatINR(item.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal('income', item)}
                          title="Edit"
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete income "${item.description}"?`)) {
                              deleteIncome(item.id);
                            }
                          }}
                          title="Delete"
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
