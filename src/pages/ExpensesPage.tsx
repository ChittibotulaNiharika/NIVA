import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  Edit2,
  Trash2,
  Calendar,
  Store,
  Tag,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatINR, formatDate } from '../utils/formatters';
import { EXPENSE_CATEGORIES_DATA, PAYMENT_METHODS } from '../constants/categories';
import { Expense, ExpenseCategory } from '../types';

export const ExpensesPage: React.FC = () => {
  const {
    expenseList,
    selectedMonth,
    deleteExpense,
    openAddModal,
    openEditModal,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('ALL');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState<'selected' | 'all'>('selected');

  const categories = Object.keys(EXPENSE_CATEGORIES_DATA) as ExpenseCategory[];

  // Subcategories available based on main category
  const availableSubcategories = useMemo(() => {
    if (selectedMainCategory === 'ALL') return [];
    return EXPENSE_CATEGORIES_DATA[selectedMainCategory as ExpenseCategory] || [];
  }, [selectedMainCategory]);

  // Filter logic
  const filteredData = useMemo(() => {
    return expenseList.filter((item) => {
      // Month filter
      if (dateRangeFilter === 'selected' && !item.date.startsWith(selectedMonth)) {
        return false;
      }
      // Main Category
      if (selectedMainCategory !== 'ALL' && item.category !== selectedMainCategory) {
        return false;
      }
      // Subcategory
      if (selectedSubcategory !== 'ALL' && item.subcategory !== selectedSubcategory) {
        return false;
      }
      // Payment Method
      if (selectedMethod !== 'ALL' && item.paymentMethod !== selectedMethod) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesVendor = item.vendor?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesSubcat = item.subcategory?.toLowerCase().includes(query);
        const matchesCat = item.category?.toLowerCase().includes(query);
        if (!matchesVendor && !matchesDesc && !matchesSubcat && !matchesCat) {
          return false;
        }
      }
      return true;
    });
  }, [
    expenseList,
    selectedMonth,
    dateRangeFilter,
    selectedMainCategory,
    selectedSubcategory,
    selectedMethod,
    searchQuery,
  ]);

  const totalFilteredExpense = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Expense Management</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-normal">
              {filteredData.length} records
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Categorize and monitor your daily, recurring, and discretionary spending.
          </p>
        </div>

        <button
          onClick={() => openAddModal('expense')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Summary Stat Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-[#111827] border border-rose-500/20 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
            Total Filtered Outflow
          </span>
          <h3 className="text-3xl font-extrabold text-white mt-1">
            {formatINR(totalFilteredExpense)}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {dateRangeFilter === 'selected' ? `For month: ${selectedMonth}` : 'Across all time'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <ArrowUpRight className="w-6 h-6" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-md space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses by vendor, description, or tag..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
          </div>

          <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-0.5 text-xs self-start md:self-auto">
            <button
              onClick={() => setDateRangeFilter('selected')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                dateRangeFilter === 'selected'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateRangeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                dateRangeFilter === 'all'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Granular Filters: Category, Subcategory, Payment Method */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Main Category */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedMainCategory}
              onChange={(e) => {
                setSelectedMainCategory(e.target.value);
                setSelectedSubcategory('ALL');
              }}
              className="bg-transparent focus:outline-none text-xs cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          {selectedMainCategory !== 'ALL' && (
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-200 animate-fadeIn">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="bg-transparent focus:outline-none text-xs cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">All Subcategories</option>
                {availableSubcategories.map((sub) => (
                  <option key={sub} value={sub} className="bg-slate-900">
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Payment Method */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-200">
            <span className="text-slate-400 font-medium">Method:</span>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="bg-transparent focus:outline-none text-xs cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Methods</option>
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm} className="bg-slate-900">
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Records Table */}
      <div className="rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-lg overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Store className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">No expenses recorded</p>
            <p className="text-xs text-slate-500">Try adjusting your filters or record an expense.</p>
            <button
              onClick={() => openAddModal('expense')}
              className="mt-2 px-4 py-2 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold rounded-xl transition"
            >
              + Record Expense
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0f172a] text-slate-400 text-[11px] uppercase font-semibold">
                  <th className="py-3 px-4">Category & Subcategory</th>
                  <th className="py-3 px-4">Vendor / Store</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredData.map((item: Expense) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition group">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-slate-200 block text-xs">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-purple-400 font-medium">
                          {item.subcategory}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {item.vendor ? (
                        <div className="flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-medium">{item.vendor}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
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
                      {item.description || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-rose-400 text-sm whitespace-nowrap">
                      -{formatINR(item.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal('expense', item)}
                          title="Edit"
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete expense of ${formatINR(item.amount)}?`)) {
                              deleteExpense(item.id);
                            }
                          }}
                          title="Delete"
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-800 rounded-lg transition"
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
