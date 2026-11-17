import React from 'react';
import { OverviewCards } from '../components/dashboard/OverviewCards';
import { DashboardCharts } from '../components/dashboard/DashboardCharts';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { Plus, PiggyBank, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { getMonthName } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const { selectedMonth, openAddModal } = useFinance();

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Financial Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Insights and financial flow for <span className="text-purple-300 font-semibold">{getMonthName(selectedMonth)}</span>
          </p>
        </div>

        {/* Prominent Quick Action Section */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openAddModal('income')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 active:scale-95 transition"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Add Income</span>
          </button>
          <button
            onClick={() => openAddModal('expense')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 active:scale-95 transition"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={() => openAddModal('savings')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25 active:scale-95 transition"
          >
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Add Savings</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <OverviewCards />

      {/* Analytics Charts */}
      <DashboardCharts />

      {/* Recent Transactions & Savings */}
      <RecentActivity />
    </div>
  );
};
