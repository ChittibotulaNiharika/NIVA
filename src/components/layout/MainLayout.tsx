import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useFinance } from '../../context/FinanceContext';
import { IncomeModal } from '../modals/IncomeModal';
import { ExpenseModal } from '../modals/ExpenseModal';
import { SavingsModal } from '../modals/SavingsModal';
import { Income, Expense, Savings } from '../../types';

export const MainLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const {
    activeModal,
    modalEditingItem,
    closeModal,
    addIncome,
    updateIncome,
    addExpense,
    updateExpense,
    addSavings,
    updateSavings,
    monthlySurplus,
    monthlySavings,
  } = useFinance();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col antialiased selection:bg-purple-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Body */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Header
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Modals for Quick Actions & Editing */}
      <IncomeModal
        isOpen={activeModal === 'income'}
        onClose={closeModal}
        onSubmit={addIncome}
        onUpdate={updateIncome}
        initialData={modalEditingItem as Income | null}
      />

      <ExpenseModal
        isOpen={activeModal === 'expense'}
        onClose={closeModal}
        onSubmit={addExpense}
        onUpdate={updateExpense}
        initialData={modalEditingItem as Expense | null}
      />

      <SavingsModal
        isOpen={activeModal === 'savings'}
        onClose={closeModal}
        onSubmit={addSavings}
        onUpdate={updateSavings}
        initialData={modalEditingItem as Savings | null}
        monthlySurplus={monthlySurplus}
        currentMonthlySavings={monthlySavings}
      />
    </div>
  );
};
