import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Income,
  Expense,
  Savings,
  Budget,
  UserSettings,
  TransactionSummary,
  ExpenseCategory,
} from '../types';
import { storageService } from '../services/storageService';
import { getCurrentMonth } from '../utils/formatters';

interface FinanceContextType {
  selectedMonth: string; // YYYY-MM
  setSelectedMonth: (month: string) => void;
  availableMonths: string[];

  // Data lists
  incomeList: Income[];
  expenseList: Expense[];
  savingsList: Savings[];
  budgetList: Budget[];
  settings: UserSettings;

  // Actions - Income
  addIncome: (item: Omit<Income, 'id' | 'createdAt'>) => void;
  updateIncome: (id: string, item: Partial<Income>) => void;
  deleteIncome: (id: string) => void;

  // Actions - Expense
  addExpense: (item: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, item: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Actions - Savings
  addSavings: (item: Omit<Savings, 'id' | 'createdAt'>) => void;
  updateSavings: (id: string, item: Partial<Savings>) => void;
  deleteSavings: (id: string) => void;

  // Actions - Budgets & Settings
  updateBudget: (category: ExpenseCategory, limit: number) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetToDemoData: () => void;

  // Financial Calculations for Selected Month
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  monthlySurplus: number;
  unallocatedBalance: number;
  savingsPercentage: number;
  cumulativeSavings: number;
  isSavingsOverSurplus: boolean;

  // Filtered for selected month
  filteredIncome: Income[];
  filteredExpenses: Expense[];
  filteredSavings: Savings[];
  filteredBudgets: Budget[];
  recentTransactions: TransactionSummary[];

  // Modals trigger state
  activeModal: 'income' | 'expense' | 'savings' | null;
  modalEditingItem: Income | Expense | Savings | null;
  openAddModal: (type: 'income' | 'expense' | 'savings') => void;
  openEditModal: (type: 'income' | 'expense' | 'savings', item: Income | Expense | Savings) => void;
  closeModal: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [incomeList, setIncomeList] = useState<Income[]>(() => storageService.getIncome());
  const [expenseList, setExpenseList] = useState<Expense[]>(() => storageService.getExpenses());
  const [savingsList, setSavingsList] = useState<Savings[]>(() => storageService.getSavings());
  const [budgetList, setBudgetList] = useState<Budget[]>(() => storageService.getBudgets());
  const [settings, setSettings] = useState<UserSettings>(() => storageService.getSettings());

  // Modal control
  const [activeModal, setActiveModal] = useState<'income' | 'expense' | 'savings' | null>(null);
  const [modalEditingItem, setModalEditingItem] = useState<Income | Expense | Savings | null>(null);

  const openAddModal = (type: 'income' | 'expense' | 'savings') => {
    setModalEditingItem(null);
    setActiveModal(type);
  };

  const openEditModal = (type: 'income' | 'expense' | 'savings', item: Income | Expense | Savings) => {
    setModalEditingItem(item);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalEditingItem(null);
  };

  // Sync to local storage
  useEffect(() => {
    storageService.saveIncome(incomeList);
  }, [incomeList]);

  useEffect(() => {
    storageService.saveExpenses(expenseList);
  }, [expenseList]);

  useEffect(() => {
    storageService.saveSavings(savingsList);
  }, [savingsList]);

  useEffect(() => {
    storageService.saveBudgets(budgetList);
  }, [budgetList]);

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  // Income Operations
  const addIncome = (item: Omit<Income, 'id' | 'createdAt'>) => {
    const newItem: Income = {
      ...item,
      id: 'inc-' + Date.now() + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString(),
    };
    setIncomeList((prev) => [newItem, ...prev]);
  };

  const updateIncome = (id: string, updated: Partial<Income>) => {
    setIncomeList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteIncome = (id: string) => {
    setIncomeList((prev) => prev.filter((item) => item.id !== id));
  };

  // Expense Operations
  const addExpense = (item: Omit<Expense, 'id' | 'createdAt'>) => {
    const newItem: Expense = {
      ...item,
      id: 'exp-' + Date.now() + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString(),
    };
    setExpenseList((prev) => [newItem, ...prev]);
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenseList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenseList((prev) => prev.filter((item) => item.id !== id));
  };

  // Savings Operations
  const addSavings = (item: Omit<Savings, 'id' | 'createdAt'>) => {
    const newItem: Savings = {
      ...item,
      id: 'sav-' + Date.now() + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString(),
    };
    setSavingsList((prev) => [newItem, ...prev]);
  };

  const updateSavings = (id: string, updated: Partial<Savings>) => {
    setSavingsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteSavings = (id: string) => {
    setSavingsList((prev) => prev.filter((item) => item.id !== id));
  };

  // Budget Operations
  const updateBudget = (category: ExpenseCategory, limit: number) => {
    setBudgetList((prev) => {
      const existing = prev.find((b) => b.category === category && b.month === selectedMonth);
      if (existing) {
        return prev.map((b) =>
          b.id === existing.id ? { ...b, limit: Math.max(0, limit) } : b
        );
      } else {
        return [
          ...prev,
          {
            id: 'b-' + Date.now(),
            category,
            limit: Math.max(0, limit),
            month: selectedMonth,
          },
        ];
      }
    });
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetToDemoData = () => {
    storageService.resetAllData();
    setIncomeList(storageService.getIncome());
    setExpenseList(storageService.getExpenses());
    setSavingsList(storageService.getSavings());
    setBudgetList(storageService.getBudgets());
    setSettings(storageService.getSettings());
  };

  // Extract available months for selectors
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    set.add(getCurrentMonth());
    incomeList.forEach((i) => i.date && set.add(i.date.substring(0, 7)));
    expenseList.forEach((e) => e.date && set.add(e.date.substring(0, 7)));
    savingsList.forEach((s) => s.date && set.add(s.date.substring(0, 7)));
    return Array.from(set).sort().reverse();
  }, [incomeList, expenseList, savingsList]);

  // Filtered by selectedMonth
  const filteredIncome = useMemo(() => {
    return incomeList.filter((item) => item.date.startsWith(selectedMonth));
  }, [incomeList, selectedMonth]);

  const filteredExpenses = useMemo(() => {
    return expenseList.filter((item) => item.date.startsWith(selectedMonth));
  }, [expenseList, selectedMonth]);

  const filteredSavings = useMemo(() => {
    return savingsList.filter((item) => item.date.startsWith(selectedMonth));
  }, [savingsList, selectedMonth]);

  const filteredBudgets = useMemo(() => {
    return budgetList.filter((item) => item.month === selectedMonth);
  }, [budgetList, selectedMonth]);

  // Key Calculations according to prompt rules:
  // Monthly Surplus = Total Income - Total Expenses
  // Manually Recorded Savings = Sum of manually entered savings entries
  // Unallocated Balance = Monthly Surplus - Manually Recorded Savings
  // Cumulative Recorded Savings = Sum of all saved contributions across all months
  const monthlyIncome = useMemo(() => {
    return filteredIncome.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredIncome]);

  const monthlyExpenses = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredExpenses]);

  const monthlySavings = useMemo(() => {
    return filteredSavings.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredSavings]);

  const monthlySurplus = monthlyIncome - monthlyExpenses;
  const unallocatedBalance = monthlySurplus - monthlySavings;

  const savingsPercentage = useMemo(() => {
    if (monthlyIncome <= 0) return 0;
    return Math.min(100, Math.round((monthlySavings / monthlyIncome) * 100));
  }, [monthlySavings, monthlyIncome]);

  const cumulativeSavings = useMemo(() => {
    return savingsList.reduce((acc, curr) => acc + curr.amount, 0);
  }, [savingsList]);

  const isSavingsOverSurplus = monthlySavings > monthlySurplus && monthlySurplus > 0;

  // Recent combined transactions
  const recentTransactions = useMemo<TransactionSummary[]>(() => {
    const incs: TransactionSummary[] = filteredIncome.map((i) => ({
      id: i.id,
      type: 'income',
      amount: i.amount,
      category: i.source,
      title: i.description || i.source,
      date: i.date,
      paymentMethod: i.paymentMethod,
      raw: i,
    }));

    const exps: TransactionSummary[] = filteredExpenses.map((e) => ({
      id: e.id,
      type: 'expense',
      amount: e.amount,
      category: `${e.category} • ${e.subcategory}`,
      title: e.description || e.vendor || e.subcategory,
      date: e.date,
      paymentMethod: e.paymentMethod,
      raw: e,
    }));

    return [...incs, ...exps].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredIncome, filteredExpenses]);

  return (
    <FinanceContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        availableMonths,
        incomeList,
        expenseList,
        savingsList,
        budgetList,
        settings,
        addIncome,
        updateIncome,
        deleteIncome,
        addExpense,
        updateExpense,
        deleteExpense,
        addSavings,
        updateSavings,
        deleteSavings,
        updateBudget,
        updateSettings,
        resetToDemoData,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
        monthlySurplus,
        unallocatedBalance,
        savingsPercentage,
        cumulativeSavings,
        isSavingsOverSurplus,
        filteredIncome,
        filteredExpenses,
        filteredSavings,
        filteredBudgets,
        recentTransactions,
        activeModal,
        modalEditingItem,
        openAddModal,
        openEditModal,
        closeModal,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
