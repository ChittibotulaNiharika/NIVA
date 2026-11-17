import React, { useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight, PiggyBank, Edit2, Trash2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR, formatDate } from '../../utils/formatters';

export const RecentActivity: React.FC = () => {
  const {
    recentTransactions,
    filteredSavings,
    filteredExpenses,
    openEditModal,
    deleteIncome,
    deleteExpense,
    deleteSavings,
  } = useFinance();

  // Top spending categories
  const topCategories = useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);
  }, [filteredExpenses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Recent Transactions (Income & Expenses) */}
      <div className="lg:col-span-2 p-5 rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-lg flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Latest financial activities this month</p>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-10 text-xs text-slate-500">
            No transactions found for this month.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 overflow-x-auto">
            {recentTransactions.slice(0, 6).map((tx) => (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-800/30 px-2 rounded-xl transition"
              >
                <div className="flex items-center gap-3 min-w-0">
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
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{tx.title}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {tx.category} • {formatDate(tx.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-semibold whitespace-nowrap ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'} {formatINR(tx.amount)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        openEditModal(
                          tx.type === 'income' ? 'income' : 'expense',
                          tx.raw
                        )
                      }
                      title="Edit"
                      className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this transaction?')) {
                          if (tx.type === 'income') deleteIncome(tx.id);
                          else deleteExpense(tx.id);
                        }
                      }}
                      title="Delete"
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Top Spending & Deliberate Savings side widget */}
      <div className="space-y-6">
        {/* Top Spending Categories */}
        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-100 mb-3">Top Spending Categories</h3>
          {topCategories.length === 0 ? (
            <p className="text-xs text-slate-500">No expenses recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {topCategories.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[150px]">{item.name}</span>
                    <span className="text-rose-400 font-semibold">{formatINR(item.total)}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (item.total / (topCategories[0].total || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Deliberate Savings Entries */}
        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-purple-500/20 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <PiggyBank className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-100">Recent Savings Entries</h3>
          </div>

          {filteredSavings.length === 0 ? (
            <p className="text-xs text-slate-500">No deliberate savings recorded this month.</p>
          ) : (
            <div className="space-y-3">
              {filteredSavings.slice(0, 3).map((sav) => (
                <div
                  key={sav.id}
                  className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-900/30 flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-purple-300 truncate">{sav.category}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{sav.reason}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{formatDate(sav.date)}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className="text-xs font-bold text-emerald-400">+{formatINR(sav.amount)}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal('savings', sav)}
                        title="Edit"
                        className="p-1 text-slate-500 hover:text-purple-300 rounded"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this savings record?')) {
                            deleteSavings(sav.id);
                          }
                        }}
                        title="Delete"
                        className="p-1 text-slate-500 hover:text-rose-400 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
