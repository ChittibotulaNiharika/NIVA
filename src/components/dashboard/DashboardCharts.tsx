import React, { useMemo } from 'react';
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
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatINR, getMonthName } from '../../utils/formatters';

const PIE_COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

export const DashboardCharts: React.FC = () => {
  const {
    filteredIncome,
    filteredExpenses,
    filteredSavings,
    incomeList,
    expenseList,
    savingsList,
    selectedMonth,
  } = useFinance();

  // 1. Income vs Expense Bar Chart data (Full Year Jan - Dec)
  const comparisonData = useMemo(() => {
    const selectedYear = selectedMonth ? selectedMonth.split('-')[0] : new Date().getFullYear().toString();
    const months = [
      '01', '02', '03', '04', '05', '06',
      '07', '08', '09', '10', '11', '12'
    ];

    return months.map((m) => {
      const yearMonth = `${selectedYear}-${m}`;
      const inc = incomeList
        .filter((i) => i.date.startsWith(yearMonth))
        .reduce((sum, i) => sum + i.amount, 0);
      const exp = expenseList
        .filter((e) => e.date.startsWith(yearMonth))
        .reduce((sum, e) => sum + e.amount, 0);
      const sav = savingsList
        .filter((s) => s.date.startsWith(yearMonth))
        .reduce((sum, s) => sum + s.amount, 0);

      const monthName = new Date(parseInt(selectedYear), parseInt(m) - 1, 1).toLocaleString('default', {
        month: 'short',
      });

      return {
        name: monthName,
        Income: inc,
        Expense: exp,
        Savings: sav,
      };
    });
  }, [incomeList, expenseList, savingsList, selectedMonth]);

  // 2. Expense Category breakdown (Donut / Pie)
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses.forEach((exp) => {
      map[exp.category] = (map[exp.category] || 0) + exp.amount;
    });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredExpenses]);

  // 3. Multi-month Savings & Surplus Trend (past 6 months)
  const trendData = useMemo(() => {
    // Collect all unique months
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
      const shortName = new Date(parseInt(yr), parseInt(mo) - 1, 1).toLocaleString('default', {
        month: 'short',
      });

      return {
        month: shortName,
        Savings: sav,
        Surplus: Math.max(0, inc - exp),
        Expenses: exp,
      };
    });
  }, [incomeList, expenseList, savingsList]);

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Inflow vs Outflow vs Savings */}
      <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Financial Balance</h3>
            <p className="text-xs text-slate-400">Full year (Jan - Dec) Income vs. Expenses vs. Savings</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                stroke="#64748b"
                tickFormatter={(val) => `₹${val / 1000}k`}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                iconType="circle"
              />
              <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="Savings" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Expense Category Donut */}
      <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-lg flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Expense Breakdown</h3>
            <p className="text-xs text-slate-400">Category allocation for {getMonthName(selectedMonth)}</p>
          </div>
        </div>

        {categoryData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
            No expenses recorded for this month.
          </div>
        ) : (
          <div className="h-64 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), 'Spent']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 3. Monthly Savings & Surplus Trend Line Chart */}
      <div className="p-5 rounded-2xl bg-[#111827]/90 border border-slate-800/80 shadow-lg lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Savings & Surplus Trend</h3>
            <p className="text-xs text-slate-400">Recorded deliberate savings versus available monthly surplus</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis
                stroke="#64748b"
                tickFormatter={(val) => `₹${val / 1000}k`}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="Savings"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ r: 4, fill: '#a855f7' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Surplus"
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#38bdf8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
