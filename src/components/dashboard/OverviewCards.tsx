import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Wallet,
  Sparkles,
  PieChart as PieIcon,
  AlertTriangle,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/formatters';

export const OverviewCards: React.FC = () => {
  const {
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    monthlySurplus,
    unallocatedBalance,
    savingsPercentage,
    cumulativeSavings,
    isSavingsOverSurplus,
  } = useFinance();

  const cards = [
    {
      title: 'Total Income',
      amount: monthlyIncome,
      icon: TrendingUp,
      color: 'emerald',
      bgGlow: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/20',
      badgeColor: 'text-emerald-400 bg-emerald-500/10',
      description: 'Total inflow this month',
    },
    {
      title: 'Total Expenses',
      amount: monthlyExpenses,
      icon: TrendingDown,
      color: 'rose',
      bgGlow: 'from-rose-500/10 to-transparent',
      borderColor: 'border-rose-500/20',
      badgeColor: 'text-rose-400 bg-rose-500/10',
      description: 'Spendings and bills',
    },
    {
      title: 'Total Savings (Month)',
      amount: monthlySavings,
      icon: PiggyBank,
      color: 'purple',
      bgGlow: 'from-purple-500/10 to-transparent',
      borderColor: 'border-purple-500/20',
      badgeColor: 'text-purple-300 bg-purple-500/15',
      description: `Cumulative All-time: ${formatINR(cumulativeSavings)}`,
    },
    {
      title: 'Monthly Surplus',
      amount: monthlySurplus,
      icon: Wallet,
      color: monthlySurplus >= 0 ? 'indigo' : 'rose',
      bgGlow: 'from-indigo-500/10 to-transparent',
      borderColor: monthlySurplus >= 0 ? 'border-indigo-500/20' : 'border-rose-500/30',
      badgeColor: monthlySurplus >= 0 ? 'text-indigo-400 bg-indigo-500/10' : 'text-rose-400 bg-rose-500/10',
      description: 'Income minus Expenses',
    },
    {
      title: 'Unallocated Balance',
      amount: unallocatedBalance,
      icon: Sparkles,
      color: unallocatedBalance >= 0 ? 'teal' : 'amber',
      bgGlow: 'from-teal-500/10 to-transparent',
      borderColor: unallocatedBalance >= 0 ? 'border-teal-500/20' : 'border-amber-500/30',
      badgeColor: unallocatedBalance >= 0 ? 'text-teal-400 bg-teal-500/10' : 'text-amber-400 bg-amber-500/10',
      description: 'Surplus minus Recorded Savings',
    },
    {
      title: 'Savings Ratio',
      isPercentage: true,
      percentage: savingsPercentage,
      icon: PieIcon,
      color: 'purple',
      bgGlow: 'from-purple-500/10 to-transparent',
      borderColor: 'border-purple-500/20',
      badgeColor: 'text-purple-300 bg-purple-500/15',
      description: 'Share of income deliberately saved',
    },
  ];

  return (
    <div className="space-y-4">
      {isSavingsOverSurplus && (
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm animate-pulse">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <strong>Notice:</strong> Your recorded monthly savings ({formatINR(monthlySavings)}) currently exceed your surplus ({formatINR(monthlySurplus)}). Your unallocated balance is negative.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`relative overflow-hidden p-5 rounded-2xl bg-[#111827]/90 border ${card.borderColor} backdrop-blur-md shadow-lg transition-all hover:translate-y-[-2px] hover:shadow-xl`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.badgeColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  {card.isPercentage ? `${card.percentage}%` : formatINR(card.amount!)}
                </h3>
                <p className="text-xs text-slate-400 truncate">{card.description}</p>
              </div>

              {/* Background gentle gradient accent */}
              <div
                className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${card.bgGlow} rounded-full blur-xl pointer-events-none`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
