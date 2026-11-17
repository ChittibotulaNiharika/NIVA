import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getMonthName } from '../../utils/formatters';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarCollapsed,
  onToggleCollapse,
}) => {
  const { selectedMonth, setSelectedMonth, availableMonths, openAddModal } = useFinance();

  return (
    <header className="sticky top-0 z-30 h-18 bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleSidebar}
          aria-label="Open mobile menu"
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition"
        >
          <span className="text-xl">☰</span>
        </button>

        {/* Desktop sidebar collapse toggle */}
        <button
          onClick={onToggleCollapse}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>NIVA Financial Dashboard</span>
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Tracking income, expenses, and deliberate savings
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Month & Year Selector */}
        <div className="flex items-center bg-[#131b2e] border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-sm">
          <Calendar className="w-4 h-4 text-purple-400 mr-2 shrink-0" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            {availableMonths.map((m: string) => (
              <option key={m} value={m} className="bg-slate-900 text-slate-200">
                {getMonthName(m)}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Add Button on Header for mobile / quick access */}
        <div className="relative group sm:hidden">
          <button
            onClick={() => openAddModal('expense')}
            className="p-2 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/30 active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
