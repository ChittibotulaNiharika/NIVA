import React, { useState, useMemo } from 'react';
import {
  PiggyBank,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Target,
  Edit2,
  Trash2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatINR, formatDate, getMonthName } from '../utils/formatters';
import { SAVINGS_CATEGORIES } from '../constants/categories';
import { Savings, SavingsCategory } from '../types';

export const SavingsPage: React.FC = () => {
  const {
    savingsList,
    filteredSavings,
    selectedMonth,
    monthlyIncome,
    monthlyExpenses,
    monthlySurplus,
    monthlySavings,
    unallocatedBalance,
    cumulativeSavings,
    isSavingsOverSurplus,
    openAddModal,
    openEditModal,
    deleteSavings,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [timeFilter, setTimeFilter] = useState<'month' | 'all'>('month');

  // Filter savings records
  const displaySavings = useMemo(() => {
    return savingsList.filter((item) => {
      if (timeFilter === 'month' && !item.date.startsWith(selectedMonth)) {
        return false;
      }
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mReason = item.reason?.toLowerCase().includes(q);
        const mCat = item.category?.toLowerCase().includes(q);
        const mNotes = item.notes?.toLowerCase().includes(q);
        if (!mReason && !mCat && !mNotes) return false;
      }
      return true;
    });
  }, [savingsList, timeFilter, selectedMonth, selectedCategory, searchQuery]);

  // Category wise breakdown for savings
  const categoryWiseSavings = useMemo(() => {
    const map: Record<string, number> = {};
    const dataset = timeFilter === 'month' ? filteredSavings : savingsList;
    dataset.forEach((s) => {
      map[s.category] = (map[s.category] || 0) + s.amount;
    });
    return Object.entries(map).map(([category, amount]) => ({
      category,
      amount,
    }));
  }, [timeFilter, filteredSavings, savingsList]);

  return (
    <div className="space-y-6">
      {/* Header & Prominent Add Savings CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Savings Management
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
              Deliberate Tracking
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Record money saved by resisting impulse buys, finding discounts, or allocating to emergency funds.
          </p>
        </div>

        <button
          onClick={() => openAddModal('savings')}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 active:scale-95 transition"
        >
          <PiggyBank className="w-4.5 h-4.5" />
          <span>Add Savings</span>
        </button>
      </div>

      {/* Financial Logic Integrity Banner */}
      <div className="p-4 rounded-2xl bg-[#111827] border border-purple-500/30 relative overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Monthly Income</span>
            <span className="text-lg font-bold text-emerald-400">{formatINR(monthlyIncome)}</span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Monthly Expenses</span>
            <span className="text-lg font-bold text-rose-400">{formatINR(monthlyExpenses)}</span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Monthly Surplus (In - Out)</span>
            <span className={`text-lg font-bold ${monthlySurplus >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
              {formatINR(monthlySurplus)}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Unallocated Balance (Surplus - Saved)</span>
            <span className={`text-lg font-bold ${unallocatedBalance >= 0 ? 'text-purple-300' : 'text-amber-400'}`}>
              {formatINR(unallocatedBalance)}
            </span>
          </div>
        </div>

        {/* Financial Warning if savings exceed monthly surplus */}
        {isSavingsOverSurplus && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-amber-300 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Notice:</strong> Your recorded monthly savings ({formatINR(monthlySavings)}) exceed your monthly surplus ({formatINR(monthlySurplus)}). Remember that recorded savings are strictly funded by your surplus.
            </span>
          </div>
        )}
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">
              {getMonthName(selectedMonth)} Savings
            </span>
            <PiggyBank className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mt-1">{formatINR(monthlySavings)}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {displaySavings.filter((s) => s.date.startsWith(selectedMonth)).length} contributions this month
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">
              Cumulative All-Time Savings
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">{formatINR(cumulativeSavings)}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Across {savingsList.length} lifetime recorded goals
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">
              Savings Surplus Utilization
            </span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-indigo-300 mt-1">
            {monthlySurplus > 0 ? `${Math.min(100, Math.round((monthlySavings / monthlySurplus) * 100))}%` : 'N/A'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Portion of surplus deliberately earmarked
          </p>
        </div>
      </div>

      {/* Category-wise Savings Breakdown Card */}
      <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-md">
        <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Category-Wise Savings Breakdown</span>
        </h3>
        {categoryWiseSavings.length === 0 ? (
          <p className="text-xs text-slate-500">No savings categorized yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryWiseSavings.map((item) => (
              <div
                key={item.category}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-purple-500/20 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-300">{item.category}</span>
                  <span className="text-xs font-bold text-white">{formatINR(item.amount)}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (item.amount / (timeFilter === 'month' ? monthlySavings || 1 : cumulativeSavings || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-md flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search savings by reason or notes (e.g. avoided impulse shopping)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent focus:outline-none text-xs cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Goals</option>
              {SAVINGS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                timeFilter === 'month'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Selected Month
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                timeFilter === 'all'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cumulative (All)
            </button>
          </div>
        </div>
      </div>

      {/* Savings Entries Table */}
      <div className="rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-lg overflow-hidden">
        {displaySavings.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">No savings records found</p>
            <p className="text-xs text-slate-500">Record a saving when you avoid an expense or set money aside.</p>
            <button
              onClick={() => openAddModal('savings')}
              className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition"
            >
              + Record Savings
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0f172a] text-slate-400 text-[11px] uppercase font-semibold">
                  <th className="py-3 px-4">Goal / Category</th>
                  <th className="py-3 px-4">Reason for Saving</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Saved Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {displaySavings.map((item: Savings) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                        <span className="font-semibold text-slate-200">
                          {item.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <p className="font-medium text-slate-200">{item.reason}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {item.notes || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-purple-300 text-sm whitespace-nowrap">
                      +{formatINR(item.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal('savings', item)}
                          title="Edit"
                          className="p-1.5 text-slate-400 hover:text-purple-300 hover:bg-slate-800 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete savings of ${formatINR(item.amount)}?`)) {
                              deleteSavings(item.id);
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
