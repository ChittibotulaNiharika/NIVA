import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Award,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatINR, getMonthName } from '../utils/formatters';

const CHART_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

export const AnalyticsPage: React.FC = () => {
  const {
    incomeList,
    expenseList,
    savingsList,
    selectedMonth,
    filteredIncome,
    filteredExpenses,
    filteredSavings,
  } = useFinance();

  const [activeReportTab, setActiveReportTab] = useState<'month' | 'year'>('month');

  // 1. Month to month comparative data (Past 6-12 months)
  const monthlyTrends = useMemo(() => {
    const allMonths = new Set<string>();
    incomeList.forEach((i) => i.date && allMonths.add(i.date.substring(0, 7)));
    expenseList.forEach((e) => e.date && allMonths.add(e.date.substring(0, 7)));
    savingsList.forEach((s) => s.date && allMonths.add(s.date.substring(0, 7)));

    const sortedMonths = Array.from(allMonths).sort().slice(-6);

    return sortedMonths.map((m) => {
      const inc = incomeList
        .filter((i) => i.date.startsWith(m))
        .reduce((sum, i) => sum + i.amount, 0);
      const exp = expenseList
        .filter((e) => e.date.startsWith(m))
        .reduce((sum, e) => sum + e.amount, 0);
      const sav = savingsList
        .filter((s) => s.date.startsWith(m))
        .reduce((sum, s) => sum + s.amount, 0);

      const [yr, mo] = m.split('-');
      const label = new Date(parseInt(yr), parseInt(mo) - 1, 1).toLocaleString('default', {
        month: 'short',
      });

      return {
        month: label,
        Income: inc,
        Expense: exp,
        Savings: sav,
        Surplus: Math.max(0, inc - exp),
      };
    });
  }, [incomeList, expenseList, savingsList]);

  // 2. Highest Spending Category in current month
  const categoryExpenses = useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses.forEach((exp) => {
      map[exp.category] = (map[exp.category] || 0) + exp.amount;
    });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredExpenses]);

  const highestSpendingCategory = categoryExpenses[0] || null;

  // 3. Income Source Breakdown
  const incomeSources = useMemo(() => {
    const map: Record<string, number> = {};
    filteredIncome.forEach((inc) => {
      map[inc.source] = (map[inc.source] || 0) + inc.amount;
    });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredIncome]);

  // 4. Cumulative Savings Growth
  const cumulativeGrowthData = useMemo(() => {
    const sortedSavings = [...savingsList].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let cumulative = 0;
    return sortedSavings.map((s) => {
      cumulative += s.amount;
      return {
        date: s.date.substring(5), // MM-DD
        CumulativeSaved: cumulative,
        Saved: s.amount,
      };
    });
  }, [savingsList]);

  // 5. Average monthly calculations
  const totalMonthsRecorded = Math.max(1, monthlyTrends.length);
  const totalExpensesSum = monthlyTrends.reduce((acc, curr) => acc + curr.Expense, 0);
  const avgMonthlyExpenses = Math.round(totalExpensesSum / totalMonthsRecorded);

  // 6. CSV Export Functionality
  const exportAllToCSV = () => {
    // Generate combined CSV
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Type,Date,Category/Source,Amount,Payment Method,Details\n';

    incomeList.forEach((i) => {
      csvContent += `Income,${i.date},"${i.source}",${i.amount},"${i.paymentMethod}","${i.description || ''}"\n`;
    });

    expenseList.forEach((e) => {
      csvContent += `Expense,${e.date},"${e.category} - ${e.subcategory}",${e.amount},"${e.paymentMethod}","${e.vendor || ''} ${e.description || ''}"\n`;
    });

    savingsList.forEach((s) => {
      csvContent += `Savings,${s.date},"${s.category}",${s.amount},"Surplus Transfer","${s.reason}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NIVA_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e293b] border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-semibold text-slate-200">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {formatINR(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header and Export CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Reports & Analytics</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Long-term financial trajectories, category distributions, and CSV data export.
          </p>
        </div>

        <button
          onClick={exportAllToCSV}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 active:scale-95 transition"
        >
          <Download className="w-4 h-4" />
          <span>Export Records (CSV)</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold uppercase text-slate-400">
            Average Monthly Outflow
          </span>
          <h3 className="text-2xl font-bold text-slate-100 mt-1">{formatINR(avgMonthlyExpenses)}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Based on tracked months</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold uppercase text-slate-400">
            Top Outflow Category ({getMonthName(selectedMonth)})
          </span>
          <h3 className="text-lg font-bold text-rose-400 mt-1 truncate">
            {highestSpendingCategory ? highestSpendingCategory.name : 'None'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {highestSpendingCategory ? formatINR(highestSpendingCategory.value) : '₹0'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold uppercase text-slate-400">
            Month Inflow / Outflow
          </span>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">
            {formatINR(filteredIncome.reduce((a, b) => a + b.amount, 0))}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Spent: {formatINR(filteredExpenses.reduce((a, b) => a + b.amount, 0))}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800 shadow-md">
          <span className="text-xs font-semibold uppercase text-slate-400">
            Cumulative Savings Recorded
          </span>
          <h3 className="text-2xl font-bold text-purple-300 mt-1">
            {formatINR(savingsList.reduce((a, b) => a + b.amount, 0))}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Across all goals</p>
        </div>
      </div>

      {/* Month-to-Month Comparative Bar Chart */}
      <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Month-over-Month Comparison</h3>
            <p className="text-xs text-slate-400">Side-by-side view of Income vs. Expenses vs. Savings</p>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis
                stroke="#64748b"
                tickFormatter={(val) => `₹${val / 1000}k`}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} iconType="circle" />
              <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Bar dataKey="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Bar dataKey="Savings" fill="#a855f7" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Charts: Income Breakdown & Cumulative Savings Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Sources Pie */}
        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-lg flex flex-col">
          <h3 className="text-base font-semibold text-slate-100 mb-1">Income Sources</h3>
          <p className="text-xs text-slate-400 mb-4">Inflow breakdown for {getMonthName(selectedMonth)}</p>

          {incomeSources.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
              No income recorded for this period.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {incomeSources.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatINR(Number(val)), 'Amount']}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Cumulative Savings Growth Area Chart */}
        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-purple-500/20 shadow-lg flex flex-col">
          <h3 className="text-base font-semibold text-slate-100 mb-1">Savings Growth Trajectory</h3>
          <p className="text-xs text-slate-400 mb-4">Cumulative accumulation over time</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeGrowthData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tickFormatter={(val) => `₹${val / 1000}k`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="CumulativeSaved"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#savingsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
