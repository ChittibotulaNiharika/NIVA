import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  PieChart,
  BarChart3,
  Settings as SettingsIcon,
  Plus,
  TrendingUp,
  X,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed }) => {
  const { openAddModal } = useFinance();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/income', label: 'Income', icon: ArrowDownLeft, color: 'text-emerald-400' },
    { to: '/expenses', label: 'Expenses', icon: ArrowUpRight, color: 'text-rose-400' },
    { to: '/savings', label: 'Savings', icon: PiggyBank, color: 'text-purple-400' },
    { to: '/budgets', label: 'Budgets', icon: PieChart },
    { to: '/analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/transactions', label: 'Transactions', icon: ArrowDownLeft },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#0b0f19] border-r border-slate-800/80 transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-18 px-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-xl font-bold tracking-tight text-white font-mono">NIVA</span>
                <span className="block text-[10px] text-purple-400 font-semibold tracking-wider uppercase">
                  Personal Wealth
                </span>
              </div>
            )}
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Buttons */}
        <div className="p-3 border-b border-slate-800/60 space-y-2">
          {!isCollapsed ? (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                Quick Actions
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => openAddModal('income')}
                  title="Add Income"
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all text-[11px] font-medium active:scale-95"
                >
                  <Plus className="w-4 h-4 mb-0.5" />
                  <span>+ Income</span>
                </button>
                <button
                  onClick={() => openAddModal('expense')}
                  title="Add Expense"
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all text-[11px] font-medium active:scale-95"
                >
                  <Plus className="w-4 h-4 mb-0.5" />
                  <span>+ Expense</span>
                </button>
                <button
                  onClick={() => openAddModal('savings')}
                  title="Add Savings"
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition-all text-[11px] font-medium active:scale-95"
                >
                  <Plus className="w-4 h-4 mb-0.5" />
                  <span>+ Savings</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <button
                onClick={() => openAddModal('income')}
                title="Add Income"
                className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/25 border border-emerald-500/30 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => openAddModal('expense')}
                title="Add Expense"
                className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center hover:bg-rose-500/25 border border-rose-500/30 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => openAddModal('savings')}
                title="Add Savings"
                className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center hover:bg-purple-500/30 border border-purple-500/40 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
                title={item.label}
              >
                <Icon className={`w-5 h-5 shrink-0 ${item.color || ''}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card at Bottom */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0c1220]">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-2 py-1'}`}>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-300">
              AS
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">Aarav Sharma</p>
                <p className="text-[10px] text-slate-400 truncate">aarav.sharma@example.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
