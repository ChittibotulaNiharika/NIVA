import React, { useState } from 'react';
import {
  PieChart,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Edit2,
  DollarSign,
  Plus,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatINR, getMonthName } from '../utils/formatters';
import { EXPENSE_CATEGORIES_DATA } from '../constants/categories';
import { ExpenseCategory } from '../types';

export const BudgetsPage: React.FC = () => {
  const {
    filteredBudgets,
    filteredExpenses,
    selectedMonth,
    updateBudget,
  } = useFinance();

  const allCategories = Object.keys(EXPENSE_CATEGORIES_DATA) as ExpenseCategory[];

  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [budgetLimitInput, setBudgetLimitInput] = useState<string>('');

  // Calculate spent per category in selected month
  const categorySpentMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses.forEach((exp) => {
      map[exp.category] = (map[exp.category] || 0) + exp.amount;
    });
    return map;
  }, [filteredExpenses]);

  // Combine budgets with actual expenditure
  const budgetRows = allCategories.map((category) => {
    const budgetObj = filteredBudgets.find((b) => b.category === category);
    const limit = budgetObj ? budgetObj.limit : 0;
    const spent = categorySpentMap[category] || 0;
    const remaining = limit - spent;
    const percentageUsed = limit > 0 ? Math.round((spent / limit) * 100) : 0;

    const isExceeded = spent > limit && limit > 0;
    const isWarning = percentageUsed >= 80 && !isExceeded && limit > 0;

    return {
      category,
      limit,
      spent,
      remaining,
      percentageUsed,
      isExceeded,
      isWarning,
    };
  });

  const totalBudget = budgetRows.reduce((acc, row) => acc + row.limit, 0);
  const totalSpentAcrossBudgets = budgetRows.reduce((acc, row) => acc + row.spent, 0);

  const handleStartEdit = (cat: ExpenseCategory, currentLimit: number) => {
    setEditingCategory(cat);
    setBudgetLimitInput(currentLimit.toString());
  };

  const handleSaveBudget = (cat: ExpenseCategory) => {
    const parsed = parseFloat(budgetLimitInput);
    if (!isNaN(parsed) && parsed >= 0) {
      updateBudget(cat, parsed);
    }
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Budget Management</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-normal">
              {getMonthName(selectedMonth)}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Set spending guardrails by category. Get alerted at 80% usage and overruns.
          </p>
        </div>
      </div>

      {/* Aggregate Budget Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Monthly Budget</span>
          <h3 className="text-2xl font-bold text-white mt-1">{formatINR(totalBudget)}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Sum of all category limits</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Spent So Far</span>
          <h3 className="text-2xl font-bold text-rose-400 mt-1">{formatINR(totalSpentAcrossBudgets)}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {totalBudget > 0 ? `${Math.round((totalSpentAcrossBudgets / totalBudget) * 100)}% of total allocated` : 'No limits set'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold uppercase text-slate-400">Remaining Budget Pool</span>
          <h3 className={`text-2xl font-bold mt-1 ${totalBudget - totalSpentAcrossBudgets >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatINR(totalBudget - totalSpentAcrossBudgets)}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Unspent budget allowance</p>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgetRows.map((row) => (
          <div
            key={row.category}
            className={`p-5 rounded-2xl bg-[#111827]/90 border transition-all shadow-md ${
              row.isExceeded
                ? 'border-rose-500/50 bg-rose-950/10'
                : row.isWarning
                ? 'border-amber-500/50 bg-amber-950/10'
                : 'border-slate-800/80 hover:border-slate-700'
            }`}
          >
            {/* Header: Title and Edit button */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-100">{row.category}</h4>
                <div className="flex items-center gap-2 mt-1">
                  {row.isExceeded && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <AlertCircle className="w-3.5 h-3.5" /> Budget Exceeded!
                    </span>
                  )}
                  {row.isWarning && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <AlertTriangle className="w-3.5 h-3.5" /> Over 80% Used
                    </span>
                  )}
                  {!row.isExceeded && !row.isWarning && row.limit > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> On Track
                    </span>
                  )}
                </div>
              </div>

              {/* Edit or set limit */}
              {editingCategory === row.category ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    value={budgetLimitInput}
                    onChange={(e) => setBudgetLimitInput(e.target.value)}
                    className="w-24 px-2 py-1 bg-slate-900 border border-purple-500 text-xs text-white rounded-lg focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveBudget(row.category)}
                    className="px-2 py-1 text-xs bg-purple-600 hover:bg-purple-500 text-white rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="px-2 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEdit(row.category, row.limit)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-purple-300 hover:bg-slate-800 px-2 py-1 rounded-lg transition"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{row.limit > 0 ? 'Edit Limit' : 'Set Budget'}</span>
                </button>
              )}
            </div>

            {/* Financial Numbers */}
            <div className="grid grid-cols-3 gap-2 py-2 text-xs">
              <div>
                <span className="text-slate-400 block">Spent</span>
                <span className="font-bold text-rose-400 text-sm">{formatINR(row.spent)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Limit</span>
                <span className="font-bold text-slate-200 text-sm">
                  {row.limit > 0 ? formatINR(row.limit) : 'None'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Remaining</span>
                <span
                  className={`font-bold text-sm ${
                    row.remaining < 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {row.limit > 0 ? formatINR(row.remaining) : '-'}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 mt-2">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Usage</span>
                <span
                  className={`font-semibold ${
                    row.isExceeded
                      ? 'text-rose-400'
                      : row.isWarning
                      ? 'text-amber-400'
                      : 'text-slate-300'
                  }`}
                >
                  {row.limit > 0 ? `${row.percentageUsed}%` : '0%'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    row.isExceeded
                      ? 'bg-rose-500'
                      : row.isWarning
                      ? 'bg-amber-400'
                      : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(100, row.percentageUsed)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
