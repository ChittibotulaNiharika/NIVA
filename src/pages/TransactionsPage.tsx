import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatINR, formatDate } from '../utils/formatters';
import { PAYMENT_METHODS } from '../constants/categories';
import { Income, Expense, TransactionSummary } from '../types';

export const TransactionsPage: React.FC = () => {
  const {
    incomeList,
    expenseList,
    deleteIncome,
    deleteExpense,
    openEditModal,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Combined master transactions list
  const masterTransactions: TransactionSummary[] = useMemo(() => {
    const incs: TransactionSummary[] = incomeList.map((i) => ({
      id: i.id,
      type: 'income',
      amount: i.amount,
      category: i.source,
      title: i.description,
      date: i.date,
      paymentMethod: i.paymentMethod,
      raw: i,
    }));

    const exps: TransactionSummary[] = expenseList.map((e) => ({
      id: e.id,
      type: 'expense',
      amount: e.amount,
      category: `${e.category} / ${e.subcategory}`,
      title: e.description || e.vendor || e.subcategory,
      date: e.date,
      paymentMethod: e.paymentMethod,
      raw: e,
    }));

    return [...incs, ...exps];
  }, [incomeList, expenseList]);

  // Filtering & Sorting
  const filteredTransactions = useMemo(() => {
    return masterTransactions
      .filter((tx) => {
        // Type filter
        if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
        // Method filter
        if (methodFilter !== 'all' && tx.paymentMethod !== methodFilter) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = tx.title?.toLowerCase().includes(q);
          const matchCat = tx.category?.toLowerCase().includes(q);
          const matchMethod = tx.paymentMethod?.toLowerCase().includes(q);
          if (!matchTitle && !matchCat && !matchMethod) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [masterTransactions, typeFilter, methodFilter, searchQuery, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Transaction History</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-normal">
              {filteredTransactions.length} items
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A unified ledger of every incoming and outgoing financial activity.
          </p>
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
              placeholder="Search by title, description or category..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Type Toggle */}
          <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-0.5 text-xs self-start md:self-auto">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                typeFilter === 'all'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                typeFilter === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                typeFilter === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Expenses
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Payment Method filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Payment:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-slate-200 focus:outline-none text-xs"
            >
              <option value="all">All Methods</option>
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>

          {/* Date sort order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl transition"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Date: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-lg overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Layers className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">No matching transactions</p>
            <p className="text-xs text-slate-500">Try changing your search term or filter rules.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0f172a] text-slate-400 text-[11px] uppercase font-semibold">
                  <th className="py-3 px-4">Transaction</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-2 rounded-xl shrink-0 ${
                            tx.type === 'income'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {tx.type === 'income' ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-semibold text-slate-200">{tx.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <span>{tx.category}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          tx.type === 'income'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(tx.date)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td
                      className={`py-3.5 px-4 text-right font-bold text-sm whitespace-nowrap ${
                        tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'} {formatINR(tx.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() =>
                            openEditModal(
                              tx.type === 'income' ? 'income' : 'expense',
                              tx.raw
                            )
                          }
                          title="Edit"
                          className="p-1.5 text-slate-400 hover:text-purple-300 hover:bg-slate-800 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete transaction "${tx.title}"?`)) {
                              if (tx.type === 'income') deleteIncome(tx.id);
                              else deleteExpense(tx.id);
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
